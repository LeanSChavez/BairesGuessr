package com.bairesguessr.dtos.responses

import java.time.LocalDateTime

data class RondaResultadoResponse(
    val idRonda: Int,
    val numeroRonda: Int,
    val distanciaMetros: Double,
    val puntajeObtenido: Int,
    val latitudReal: Double,
    val longitudReal: Double,
    val latitudAdivinada: Double,
    val longitudAdivinada: Double,
    val nombreEstablecimiento: String,
    val barrio: String,
    val partidaFinalizada: Boolean,
    val puntajeTotalAcumulado: Int
)

data class LeaderboardEntryResponse(
    val idPartida: Int,
    val username: String,
    val puntajeTotal: Int,
    val fecha: LocalDateTime
)