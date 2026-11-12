const fs = require("fs");

const contenido = fs
  .readFileSync("/docker-entrypoint-initdb.d/espacios_culturales.json", "utf8")
  .trim();

const raw = contenido.startsWith("[")
  ? JSON.parse(contenido)
  : contenido
      .split("\n")
      .filter((linea) => linea.trim().length > 0)
      .map((linea) => JSON.parse(linea));

const documentos = raw.map(({ _id, ...resto }) => ({
  _id: _id && _id.$oid ? new ObjectId(_id.$oid) : new ObjectId(),
  ...resto,
}));

db = db.getSiblingDB("bairesguessr");
db.espacios_culturales.insertMany(documentos);
db.espacios_culturales.createIndex({ ubicacion: "2dsphere" });
print(`Importados ${documentos.length} espacios culturales.`);