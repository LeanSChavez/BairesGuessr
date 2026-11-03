package com.bairesguessr.repositories.postgres

import com.bairesguessr.models.entities.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UsuarioRepository : JpaRepository<Usuario, Int> {
    fun findByUsernameOrEmail(username: String, email: String): Optional<Usuario>
    fun existsByUsername(username: String): Boolean
    fun existsByEmail(email: String): Boolean
}