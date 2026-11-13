package com.bairesguessr.dtos.responses

import java.time.LocalDateTime

data class RondaNuevaResponse(
    val idRonda: Int,
    val idPartida: Int,
    val numeroRonda: Int,
    val idLugar: String,
    val mapillaryId: String?,
    val pistaFuncionPrincipal: String
)

data class PartidaResponse(
    val idPartida: Int,
    val idUsuario: Int,
    val estado: String,
    val puntajeTotal: Int,
    val fechaInicio: LocalDateTime,
    val rondasTotalesPermitidas: Int = 5
)