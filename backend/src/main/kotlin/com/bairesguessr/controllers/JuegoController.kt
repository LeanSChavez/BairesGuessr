package com.bairesguessr.controllers

import com.bairesguessr.dtos.requests.AdivinanzaRequest
import com.bairesguessr.dtos.requests.IniciarPartidaRequest
import com.bairesguessr.dtos.responses.PartidaResponse
import com.bairesguessr.dtos.responses.RondaNuevaResponse
import com.bairesguessr.dtos.responses.RondaResultadoResponse
import com.bairesguessr.services.JuegoService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/partidas")
class JuegoController(
    private val juegoService: JuegoService
) {

    @PostMapping
    fun iniciarPartida(@Valid @RequestBody request: IniciarPartidaRequest): ResponseEntity<PartidaResponse> {
        val partida = juegoService.iniciarPartida(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(partida)
    }

    @GetMapping("/{idPartida}")
    fun obtenerPartida(@PathVariable idPartida: Int): ResponseEntity<PartidaResponse> {
        return ResponseEntity.ok(juegoService.obtenerEstadoPartida(idPartida))
    }

    @PostMapping("/{idPartida}/rondas/nueva")
    fun generarNuevaRonda(@PathVariable idPartida: Int): ResponseEntity<RondaNuevaResponse> {
        val nuevaRonda = juegoService.generarNuevaRonda(idPartida)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRonda)
    }

    @PostMapping("/{idPartida}/rondas/{idRonda}/adivinar")
    fun enviarAdivinanza(
        @PathVariable idPartida: Int,
        @PathVariable idRonda: Int,
        @Valid @RequestBody request: AdivinanzaRequest
    ): ResponseEntity<RondaResultadoResponse> {
        val resultado = juegoService.procesarAdivinanza(idPartida, idRonda, request)
        return ResponseEntity.ok(resultado)
    }
}