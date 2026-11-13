package com.bairesguessr.services

import com.bairesguessr.domain.GeoCalculator
import com.bairesguessr.dtos.requests.AdivinanzaRequest
import com.bairesguessr.dtos.requests.IniciarPartidaRequest
import com.bairesguessr.dtos.responses.LeaderboardEntryResponse
import com.bairesguessr.dtos.responses.PartidaResponse
import com.bairesguessr.dtos.responses.RondaNuevaResponse
import com.bairesguessr.dtos.responses.RondaResultadoResponse
import com.bairesguessr.models.entities.Partida
import com.bairesguessr.models.entities.Ronda
import com.bairesguessr.repositories.mongo.EspacioCulturalRepository
import com.bairesguessr.repositories.postgres.PartidaRepository
import com.bairesguessr.repositories.postgres.RondaRepository
import com.bairesguessr.repositories.postgres.UsuarioRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class JuegoService(
    private val usuarioRepository: UsuarioRepository,
    private val partidaRepository: PartidaRepository,
    private val rondaRepository: RondaRepository,
    private val espacioCulturalRepository: EspacioCulturalRepository
) {
    companion object {
        const val MAX_RONDAS_POR_PARTIDA = 5
    }

    @Transactional
    fun iniciarPartida(request: IniciarPartidaRequest): PartidaResponse {
        val usuario = usuarioRepository.findById(request.idUsuario).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con ID: ${request.idUsuario}")
        }

        val nuevaPartida = Partida(
            usuario = usuario,
            puntajeTotal = 0,
            estado = "EN_PROGRESO"
        )

        val guardada = partidaRepository.save(nuevaPartida)

        return PartidaResponse(
            idPartida = guardada.id,
            idUsuario = usuario.id,
            estado = guardada.estado,
            puntajeTotal = guardada.puntajeTotal,
            fechaInicio = guardada.fechaInicio,
            rondasTotalesPermitidas = MAX_RONDAS_POR_PARTIDA
        )
    }

    @Transactional
    fun generarNuevaRonda(idPartida: Int): RondaNuevaResponse {
        val partida = partidaRepository.findById(idPartida).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "Partida no encontrada")
        }

        if (partida.estado == "FINALIZADA") {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "La partida ya está finalizada")
        }

        val rondasExistentes = rondaRepository.findByPartidaIdOrderByNumeroRondaAsc(idPartida)
        if (rondasExistentes.size >= MAX_RONDAS_POR_PARTIDA) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Límite de rondas alcanzado")
        }

        val idsYaUsados = rondasExistentes.map { it.idLugar }.toSet()

        // Obtenemos todos los documentos y seleccionamos uno al azar que no haya salido
        val todosLosLugares = espacioCulturalRepository.findAll()
        if (todosLosLugares.isEmpty()) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No hay espacios en MongoDB")
        }

        val disponibles = todosLosLugares.filter { it.id !in idsYaUsados }
        val seleccionado = (if (disponibles.isNotEmpty()) disponibles else todosLosLugares).random()

        val idMongo = seleccionado.id ?: throw ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR, "El documento seleccionado no tiene _id"
        )

        val numeroNuevaRonda = rondasExistentes.size + 1

        val nuevaRonda = Ronda(
            partida = partida,
            numeroRonda = numeroNuevaRonda,
            idLugar = idMongo
        )

        val guardada = rondaRepository.save(nuevaRonda)

        return RondaNuevaResponse(
            idRonda = guardada.id,
            idPartida = partida.id,
            numeroRonda = guardada.numeroRonda,
            idLugar = guardada.idLugar,
            mapillaryId = seleccionado.mapillaryId ?: "12345abcde_mock",
            pistaFuncionPrincipal = seleccionado.funcionPrincipal ?: "CULTURA"
        )
    }

    @Transactional
    fun procesarAdivinanza(idPartida: Int, idRonda: Int, request: AdivinanzaRequest): RondaResultadoResponse {
        val ronda = rondaRepository.findById(idRonda).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "Ronda no encontrada")
        }

        if (ronda.partida.id != idPartida) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "La ronda no pertenece a la partida indicada")
        }

        val partida = ronda.partida
        if (partida.estado == "FINALIZADA") {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Esta partida ya finalizó")
        }

        // Buscamos las coordenadas reales en MongoDB
        val espacio = espacioCulturalRepository.findById(ronda.idLugar).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "El espacio cultural (${ronda.idLugar}) no existe en MongoDB")
        }

        val ubicacion = espacio.ubicacion ?: throw ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "El espacio cultural (${ronda.idLugar}) no posee coordenadas en MongoDB"
        )
        val latReal = ubicacion.latitud
        val lonReal = ubicacion.longitud

        // Calculamos distancia y puntaje con Haversine
        val distanciaMetrosBd = GeoCalculator.calcularDistanciaMetros(
            lat1 = request.latitudAdivinada,
            lon1 = request.longitudAdivinada,
            lat2 = latReal,
            lon2 = lonReal
        )
        val puntaje = GeoCalculator.calcularPuntaje(distanciaMetrosBd.toDouble())

        // Actualizamos la ronda en PostgreSQL
        ronda.latitudAdivinada = BigDecimal(request.latitudAdivinada).setScale(8, RoundingMode.HALF_UP)
        ronda.longitudAdivinada = BigDecimal(request.longitudAdivinada).setScale(8, RoundingMode.HALF_UP)
        ronda.distanciaMetros = distanciaMetrosBd
        ronda.puntajeObtenido = puntaje
        rondaRepository.save(ronda)

        // Actualizamos el puntaje acumulado de la partida
        val todasLasRondas = rondaRepository.findByPartidaIdOrderByNumeroRondaAsc(partida.id)
        partida.puntajeTotal = todasLasRondas.sumOf { it.puntajeObtenido }

        // Si era la última ronda (ej. ronda 5), cerramos la partida automáticamente
        val finalizada = todasLasRondas.size >= MAX_RONDAS_POR_PARTIDA
        if (finalizada) {
            partida.estado = "FINALIZADA"
        }
        partidaRepository.save(partida)

        return RondaResultadoResponse(
            idRonda = ronda.id,
            numeroRonda = ronda.numeroRonda,
            distanciaMetros = distanciaMetrosBd.toDouble(),
            puntajeObtenido = puntaje,
            latitudReal = latReal,
            longitudReal = lonReal,
            latitudAdivinada = request.latitudAdivinada,
            longitudAdivinada = request.longitudAdivinada,
            nombreEstablecimiento = espacio.establecimiento ?: "Lugar Cultural",
            barrio = espacio.barrio ?: "CABA",
            partidaFinalizada = finalizada,
            puntajeTotalAcumulado = partida.puntajeTotal
        )
    }
    @Transactional(readOnly = true)
    fun obtenerPartidasPorUsuario(idUsuario: Int): List<PartidaResponse> {
        return partidaRepository.findByUsuarioIdOrderByFechaInicioDesc(idUsuario).map { partida ->
            PartidaResponse(
                idPartida = partida.id,
                idUsuario = partida.usuario.id,
                estado = partida.estado,
                puntajeTotal = partida.puntajeTotal,
                fechaInicio = partida.fechaInicio,
                rondasTotalesPermitidas = MAX_RONDAS_POR_PARTIDA
            )
        }
    }
    @Transactional(readOnly = true)
    fun obtenerEstadoPartida(idPartida: Int): PartidaResponse {
        val partida = partidaRepository.findById(idPartida).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "Partida no encontrada")
        }
        return PartidaResponse(
            idPartida = partida.id,
            idUsuario = partida.usuario.id,
            estado = partida.estado,
            puntajeTotal = partida.puntajeTotal,
            fechaInicio = partida.fechaInicio,
            rondasTotalesPermitidas = MAX_RONDAS_POR_PARTIDA
        )
    }

    @Transactional(readOnly = true)
    fun obtenerLeaderboard(): List<LeaderboardEntryResponse> {
        return partidaRepository.findTop10Finalizadas().map { partida ->
            LeaderboardEntryResponse(
                idPartida = partida.id,
                username = partida.usuario.username,
                puntajeTotal = partida.puntajeTotal,
                fecha = partida.fechaInicio
            )
        }
    }
}