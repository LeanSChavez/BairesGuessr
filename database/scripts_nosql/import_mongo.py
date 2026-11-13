import csv
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import requests
from pymongo import MongoClient


def obtener_token() -> str:
    token = os.getenv("VITE_MAPILLARY_TOKEN")
    if token:
        return token

    env_path = Path(__file__).resolve().parents[2] / "frontend" / ".env"
    if env_path.exists():
        for linea in env_path.read_text(encoding="utf-8").splitlines():
            linea = linea.strip()
            if linea.startswith("VITE_MAPILLARY_TOKEN="):
                return linea.split("=", 1)[1].strip().strip('"').strip("'")

    raise RuntimeError(f"No se encontró VITE_MAPILLARY_TOKEN en {env_path}")


MAPILLARY_TOKEN = obtener_token()


def buscar_mapillary_id(session: requests.Session, lat: float, lng: float) -> str | None:
    for delta in (0.0005, 0.0012):
        bbox = f"{lng - delta},{lat - delta},{lng + delta},{lat + delta}"
        url = "https://graph.mapillary.com/images"
        params = {
            "access_token": MAPILLARY_TOKEN,
            "fields": "id",
            "bbox": bbox,
            "limit": 1,
        }
        try:
            resp = session.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                data = resp.json().get("data", [])
                if data:
                    return str(data[0]["id"])
        except requests.RequestException as e:
            print(f"Error consultando Mapillary para ({lat}, {lng}): {e}")
            break
    return None


def procesar_fila(row: dict) -> dict | None:
    lat = float(row["LATITUD"])
    lng = float(row["LONGITUD"])
    with requests.Session() as session:
        mapillary_id = buscar_mapillary_id(session, lat, lng)

    if not mapillary_id:
        return None

    return {
        "fid": int(row["fid"]),
        "establecimiento": row["ESTABLECIMIENTO"],
        "funcion_principal": row["FUNCION_PRINCIPAL"],
        "barrio": row["BARRIO"],
        "ubicacion": {
            "type": "Point",
            "coordinates": [lng, lat],  # GeoJSON: [Longitud, Latitud]
        },
        "mapillary_id": mapillary_id,
    }


def importar_datos():
    print("Conectando a MongoDB local...", flush=True)
    client = MongoClient("mongodb://localhost:27017/")
    db = client["bairesguessr"]
    collection = db["espacios_culturales"]

    collection.delete_many({})
    print("Colección limpia. Leyendo CSV...", flush=True)

    csv_path = Path(__file__).resolve().parent / "espacios-culturales-limpio.csv"
    with open(csv_path, mode="r", encoding="utf-8") as file:
        filas = list(csv.DictReader(file))

    print(f"Procesando {len(filas)} espacios culturales en paralelo...", flush=True)

    documentos = []
    sin_foto = 0

    with ThreadPoolExecutor(max_workers=10) as executor:
        for i, doc in enumerate(executor.map(procesar_fila, filas), start=1):
            if doc:
                documentos.append(doc)
            else:
                sin_foto += 1

            if i % 25 == 0 or i == len(filas):
                print(f"Progreso: {i}/{len(filas)} ({len(documentos)} con foto)", flush=True)

    if documentos:
        collection.insert_many(documentos)
        collection.create_index([("ubicacion", "2dsphere")])

    print(
        f"¡Éxito! Se importaron {len(documentos)} espacios con foto real "
        f"(descartados sin cobertura: {sin_foto}).",
        flush=True,
    )


if __name__ == "__main__":
    importar_datos()