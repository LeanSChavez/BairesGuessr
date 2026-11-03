package com.bairesguessr.models.entities

import jakarta.persistence.*

@Entity
@Table(name = "usuario")
class Usuario(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    val id: Int = 0,

    @Column(name = "username", nullable = false, unique = true, length = 50)
    var username: String,

    @Column(name = "email", nullable = false, unique = true, length = 100)
    var email: String,

    @Column(name = "password", nullable = false, length = 255)
    var passwordHash: String
)