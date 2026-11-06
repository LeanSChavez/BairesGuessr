package com.bairesguessr

import com.bairesguessr.repositories.mongo.EspacioCulturalRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@SpringBootApplication(
	exclude = [
		SecurityAutoConfiguration::class,
		UserDetailsServiceAutoConfiguration::class
	]
)
@EnableJpaRepositories(basePackages = ["com.bairesguessr.repositories.postgres"])
@EnableMongoRepositories(basePackages = ["com.bairesguessr.repositories.mongo"])
open class BairesguessrApplication {

	@Bean
	fun verificarConexionMongo(repo: EspacioCulturalRepository, mongoTemplate: MongoTemplate) = CommandLineRunner {
		println("==================================================")
		println("BASE CONECTADA: ${mongoTemplate.db.name}")
		println("COLECCIONES: ${mongoTemplate.db.listCollectionNames().toList()}")
		println("DOCUMENTOS EN espacios_culturales: ${mongoTemplate.getCollection("espacios_culturales").countDocuments()}")
		println("DOCUMENTOS MAPEADOS VIA REPOSITORY: ${repo.findAll().size}")
		println("==================================================")
	}
}

fun main(args: Array<String>) {
	runApplication<BairesguessrApplication>(*args)
}