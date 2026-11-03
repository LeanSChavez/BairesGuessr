package com.bairesguessr.dtos.responses

data class LoginResponse(
    val idUsuario: Int,
    val username: String,
    val email: String,
    val token: String = "mock-jwt-token" // Por si tu front espera un campo token además del usuario
)