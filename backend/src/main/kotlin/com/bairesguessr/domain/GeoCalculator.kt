package com.bairesguessr.domain

import java.math.BigDecimal
import java.math.RoundingMode
import kotlin.math.*

object GeoCalculator {
    private const val RADIO_TIERRA_METROS = 6371000.0

    /**
     * Fórmula de Haversine. Devuelve la distancia en metros redondeada a 2 decimales.
     */
    fun calcularDistanciaMetros(lat1: Double, lon1: Double, lat2: Double, lon2: Double): BigDecimal {
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)

        val radLat1 = Math.toRadians(lat1)
        val radLat2 = Math.toRadians(lat2)

        val a = sin(dLat / 2).pow(2) + sin(dLon / 2).pow(2) * cos(radLat1) * cos(radLat2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        val distancia = RADIO_TIERRA_METROS * c
        return BigDecimal(distancia).setScale(2, RoundingMode.HALF_UP)
    }

    /**
     * Calcula el puntaje entre 0 y 5000.
     * Calibrado para la escala de CABA (~15-20km de diámetro).
     * - Menos de 25 metros: 5000 puntos (Perfecto).
     * - A 1 km: ~3000 puntos.
     * - A 5 km: ~400 puntos.
     */
    fun calcularPuntaje(distanciaMetros: Double): Int {
        val maxPuntaje = 5000.0
        val margenPerfecto = 25.0 // 25 metros de tolerancia

        if (distanciaMetros <= margenPerfecto) {
            return maxPuntaje.toInt()
        }

        val factorDecaimiento = 2000.0
        val puntaje = maxPuntaje * exp(-(distanciaMetros - margenPerfecto) / factorDecaimiento)

        return puntaje.roundToInt().coerceIn(0, 5000)
    }
}