package com.bairesguessr.services

import com.bairesguessr.dtos.requests.LoginRequest
import com.bairesguessr.dtos.requests.RegistroRequest
import com.bairesguessr.dtos.responses.LoginResponse
import com.bairesguessr.models.entities.Usuario
import com.bairesguessr.repositories.postgres.UsuarioRepository
import com.bairesguessr.security.JwtProvider
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class AuthService(
    private val usuarioRepository: UsuarioRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtProvider: JwtProvider
) {

    @Transactional
    fun registrar(request: RegistroRequest): LoginResponse {
        if (usuarioRepository.existsByUsername(request.username)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de usuario ya está en uso")
        }
        if (usuarioRepository.existsByEmail(request.email)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "El email ya está registrado")
        }

        val nuevoUsuario = Usuario(
            username = request.username,
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password)!!
        )

        val guardado = usuarioRepository.save(nuevoUsuario)
        val token = jwtProvider.generarToken(guardado.username)

        return LoginResponse(
            idUsuario = guardado.id,
            username = guardado.username,
            email = guardado.email,
            token = token
        )
    }

    @Transactional(readOnly = true)
    fun login(request: LoginRequest): LoginResponse {
        val usuario = usuarioRepository.findByUsernameOrEmail(
            request.emailOrUsername,
            request.emailOrUsername
        ).orElseThrow {
            ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas")
        }

        // Soportamos tanto contraseña hasheada con BCrypt como texto plano (por si insertaste usuarios a mano por SQL)
        val passwordValida = passwordEncoder.matches(request.passwordHash, usuario.passwordHash) ||
                request.passwordHash == usuario.passwordHash

        if (!passwordValida) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas")
        }

        val token = jwtProvider.generarToken(usuario.username)

        return LoginResponse(
            idUsuario = usuario.id,
            username = usuario.username,
            email = usuario.email,
            token = token
        )
    }
}