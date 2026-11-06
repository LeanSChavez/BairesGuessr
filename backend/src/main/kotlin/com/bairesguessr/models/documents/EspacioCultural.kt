package com.bairesguessr.models.documents

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "espacios_culturales")
data class EspacioCultural(
    @Id
    val id: String? = null,
    val fid: Int? = null,
    val establecimiento: String? = null,
    @Field("funcion_principal")
    val funcionPrincipal: String? = null,
    val barrio: String? = null,
    val ubicacion: UbicacionGeoJson? = null,
    @Field("mapillary_id")
    val mapillaryId: String? = null
)

data class UbicacionGeoJson(
    val type: String = "Point",
    val coordinates: List<Double> = emptyList()
) {
    val longitud: Double get() = coordinates.getOrElse(0) { 0.0 }
    val latitud: Double get() = coordinates.getOrElse(1) { 0.0 }
}