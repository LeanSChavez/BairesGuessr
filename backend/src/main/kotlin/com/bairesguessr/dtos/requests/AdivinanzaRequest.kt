package com.bairesguessr.dtos.requests

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class AdivinanzaRequest(
    @field:NotNull
    @field:Min(-90) @field:Max(90)
    val latitudAdivinada: Double,

    @field:NotNull
    @field:Min(-180) @field:Max(180)
    val longitudAdivinada: Double
)

data class IniciarPartidaRequest(
    @field:NotNull
    val idUsuario: Int
)