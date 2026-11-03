package com.bairesguessr.controllers

import com.bairesguessr.dtos.requests.LoginRequest
import com.bairesguessr.dtos.requests.RegistroRequest
import com.bairesguessr.dtos.responses.LoginResponse
import com.bairesguessr.services.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["*"])
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register")
    fun registrar(@Valid @RequestBody request: RegistroRequest): ResponseEntity<LoginResponse> {
        val response = authService.registrar(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }
}