import csv
from pymongo import MongoClient

def importar_datos():
    print("Conectando a MongoDB local...")
    # 1. Conexión a Mongo (puerto por defecto)
    client = MongoClient("mongodb://localhost:27017/")
    
    # 2. Crea la base de datos y la colección automáticamente si no existen
    db = client["bairesguessr"]
    collection = db["espacios_culturales"]

    # Limpiamos la colección por si corrés el script más de una vez
    collection.delete_many({})
    print("Colección limpia. Iniciando importación...")

    contador = 0
    # 3. Leer el CSV e insertar
    with open('espacios-culturales-limpio.csv', mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            documento = {
                "fid": int(row["fid"]),
                "establecimiento": row["ESTABLECIMIENTO"],
                "funcion_principal": row["FUNCION_PRINCIPAL"],
                "barrio": row["BARRIO"],
                "ubicacion": {
                    "type": "Point",
                    # CRÍTICO: GeoJSON exige [Longitud, Latitud] en ese orden
                    "coordinates": [float(row["LONGITUD"]), float(row["LATITUD"])]
                },
                # Mock de Mapillary para poder jugar hasta que tengan los reales
                "mapillary_id": "12345abcde_mock" 
            }
            collection.insert_one(documento)
            contador += 1

    print(f"¡Éxito! Se importaron {contador} espacios culturales a la base de datos.")

if __name__ == "__main__":
    importar_datos()