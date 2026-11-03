package com.bairesguessr.dtos.requests

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank(message = "El usuario o email es obligatorio")
    val emailOrUsername: String,

    @field:NotBlank(message = "La contraseña es obligatoria")
    val passwordHash: String
)