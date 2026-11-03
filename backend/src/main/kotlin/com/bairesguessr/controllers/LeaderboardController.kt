package com.bairesguessr.controllers

import com.bairesguessr.dtos.responses.LeaderboardEntryResponse
import com.bairesguessr.services.JuegoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/leaderboard")
class LeaderboardController(
    private val juegoService: JuegoService
) {

    @GetMapping
    fun obtenerTop10(): ResponseEntity<List<LeaderboardEntryResponse>> {
        return ResponseEntity.ok(juegoService.obtenerLeaderboard())
    }
}