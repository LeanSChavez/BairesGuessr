-- Eliminamos tablas en orden inverso a sus dependencias
DROP TABLE IF EXISTS RONDA;
DROP TABLE IF EXISTS PARTIDA;
DROP TABLE IF EXISTS USUARIO;

-- 1. Creamos la tabla independiente: USUARIO
CREATE TABLE USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. Creamos la tabla dependiente de USUARIO: PARTIDA
CREATE TABLE PARTIDA (
    id_partida SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    puntaje_total INT NOT NULL DEFAULT 0,
    fecha_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    
    -- Restricción de Clave Foránea
    CONSTRAINT fk_partida_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES USUARIO (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
        
    -- Restricción de Dominio
    CONSTRAINT chk_puntaje_total_positivo 
        CHECK (puntaje_total >= 0)
);

-- 3. Creamos la tabla dependiente de PARTIDA: RONDA
CREATE TABLE RONDA (
    id_ronda SERIAL PRIMARY KEY,
    id_partida INT NOT NULL,
    numero_ronda INT NOT NULL,
    id_lugar VARCHAR(50) NOT NULL, -- Referencia al ObjectId / identificador en MongoDB
    latitud_adivinada DECIMAL(10, 8) NOT NULL,
    longitud_adivinada DECIMAL(11, 8) NOT NULL,
    distancia_metros DECIMAL(10, 2) NOT NULL,
    puntaje_obtenido INT NOT NULL,
    
    -- Restricción de Clave Foránea
    CONSTRAINT fk_ronda_partida
        FOREIGN KEY (id_partida)
        REFERENCES PARTIDA (id_partida)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
        
    -- Restricciones de Dominio: Coordenadas geográficas válidas
    CONSTRAINT chk_latitud_adivinada_rango 
        CHECK (latitud_adivinada BETWEEN -90.0 AND 90.0),
        
    CONSTRAINT chk_longitud_adivinada_rango 
        CHECK (longitud_adivinada BETWEEN -180.0 AND 180.0),

    -- Restricciones de Dominio: Valores no negativos y rondas válidas
    CONSTRAINT chk_numero_ronda_valido 
        CHECK (numero_ronda > 0),
        
    CONSTRAINT chk_distancia_positiva 
        CHECK (distancia_metros >= 0.0),
        
    CONSTRAINT chk_puntaje_obtenido_positivo 
        CHECK (puntaje_obtenido >= 0)
);