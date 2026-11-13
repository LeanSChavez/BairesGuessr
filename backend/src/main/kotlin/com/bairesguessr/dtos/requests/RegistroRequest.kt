package com.bairesguessr.dtos.requests

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class RegistroRequest(
    @field:NotBlank(message = "El username es obligatorio")
    val username: String,

    @field:Email(message = "Formato de email inválido")
    @field:NotBlank(message = "El email es obligatorio")
    val email: String,

    @field:NotBlank(message = "La contraseña es obligatoria")
    val password: String
)