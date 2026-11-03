package com.bairesguessr.security

import org.springframework.stereotype.Component
import java.util.UUID

@Component
class JwtProvider {
    fun generarToken(username: String): String {
        // Token simple para cumplir contrato con el frontend sin requerir librerías externas pesadas
        return "bg-token-${username}-${UUID.randomUUID()}"
    }
}