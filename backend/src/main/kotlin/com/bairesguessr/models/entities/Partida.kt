package com.bairesguessr.models.entities

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "ronda")
class Ronda(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ronda")
    val id: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_partida", nullable = false)
    val partida: Partida,

    @Column(name = "numero_ronda", nullable = false)
    val numeroRonda: Int,

    @Column(name = "id_lugar", nullable = false, length = 50)
    val idLugar: String,

    @Column(name = "latitud_adivinada", nullable = false, precision = 10, scale = 8)
    var latitudAdivinada: BigDecimal = BigDecimal.ZERO,

    @Column(name = "longitud_adivinada", nullable = false, precision = 11, scale = 8)
    var longitudAdivinada: BigDecimal = BigDecimal.ZERO,

    @Column(name = "distancia_metros", nullable = false, precision = 10, scale = 2)
    var distanciaMetros: BigDecimal = BigDecimal.ZERO,

    @Column(name = "puntaje_obtenido", nullable = false)
    var puntajeObtenido: Int = 0
)