package com.bairesguessr.models.entities

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "partida")
class Partida(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida")
    val id: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    val usuario: Usuario,

    @Column(name = "puntaje_total", nullable = false)
    var puntajeTotal: Int = 0,

    @Column(name = "fecha_inicio", nullable = false)
    val fechaInicio: LocalDateTime = LocalDateTime.now(),

    @Column(name = "estado", nullable = false, length = 20)
    var estado: String = "EN_PROGRESO" // 'EN_PROGRESO' o 'FINALIZADA'
)