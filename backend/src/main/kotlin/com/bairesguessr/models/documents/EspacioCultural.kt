package com.bairesguessr.models.documents

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "espacios_culturales")
data class EspacioCultural(
    @Id
    val id: String? = null,

    val fid: Int = 0,

    val establecimiento: String = "",

    @Field("funcion_principal")
    val funcionPrincipal: String = "",

    val barrio: String = "",

    val ubicacion: UbicacionGeoJson,

    @Field("mapillary_id")
    val mapillaryId: String? = null
)

data class UbicacionGeoJson(
    val type: String = "Point",
    val coordinates: List<Double> = emptyList() // [0] = longitud (-58.3924), [1] = latitud (-34.5960)
) {
    val longitud: Double
        get() = coordinates.getOrElse(0) { 0.0 }

    val latitud: Double
        get() = coordinates.getOrElse(1) { 0.0 }
}