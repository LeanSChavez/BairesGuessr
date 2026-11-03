package com.bairesguessr.repositories.postgres

import com.bairesguessr.models.entities.Partida
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PartidaRepository : JpaRepository<Partida, Int> {

    // Top 10 mejores partidas finalizadas para el Leaderboard
    @Query("""
        SELECT p FROM Partida p 
        JOIN FETCH p.usuario 
        WHERE p.estado = 'FINALIZADA' 
        ORDER BY p.puntajeTotal DESC 
        LIMIT 10
    """)
    fun findTop10Finalizadas(): List<Partida>
}