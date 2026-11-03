package com.bairesguessr.repositories.postgres

import com.bairesguessr.models.entities.Ronda
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RondaRepository : JpaRepository<Ronda, Int> {
    fun findByPartidaIdOrderByNumeroRondaAsc(partidaId: Int): List<Ronda>
    fun countByPartidaId(partidaId: Int): Int
}