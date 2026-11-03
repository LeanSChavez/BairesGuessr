package com.bairesguessr.repositories.mongo

import com.bairesguessr.models.documents.EspacioCultural
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface EspacioCulturalRepository : MongoRepository<EspacioCultural, String> {

    // Trae 1 documento al azar de la colección espacios_culturales
    @Aggregation(pipeline = ["{ '\$sample': { 'size': 1 } }"])
    fun obtenerAleatorio(): EspacioCultural?

    // Trae un documento al azar excluyendo los IDs que ya salieron en esta partida
    @Aggregation(pipeline = [
        "{ '\$match': { '_id': { '\$nin': ?0 } } }",
        "{ '\$sample': { 'size': 1 } }"
    ])
    fun obtenerAleatorioExcluyendo(idsExcluidos: List<String>): EspacioCultural?
}