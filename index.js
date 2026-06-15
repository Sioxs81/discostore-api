import express from "express";

import { getAll } from "./routes/albumes/getAll.js";
import { getBySlug } from "./routes/albumes/getBySlug.js";
import { getByGenero } from "./routes/albumes/getByGenero.js";
import { search } from "./routes/albumes/search.js";
import { create } from "./routes/albumes/create.js";
import { update } from "./routes/albumes/update.js";
import { remove } from "./routes/albumes/remove.js";

// Cargamos HOST y PORT desde el .env (soporte nativo de Node)
try {
  process.loadEnvFile();
} catch {
  // Si no existe .env usamos los valores por defecto
}

const app = express();
app.enable("strict routing");
app.use(express.json()); // Necesario para leer el body en POST y PUT

const HOST = process.env.HOST ?? "localhost";
const PORT = process.env.PORT ?? 4321;

// Informacion de la API
app.get("/", (req, res) => res.json({
  nombre: "DiscoStore API",
  version: "1.0",
  rutas: {
    GET: ["/albumes", "/album/:slug", "/genero/:genero", "/search/:text", "/imagenes/*"],
    POST: ["/albumes"],
    PUT: ["/album/:slug"],
    DELETE: ["/album/:slug"]
  }
}));

// Lectura
app.get("/albumes", getAll);
app.get("/album/:slug", getBySlug);
app.get("/genero/:genero", getByGenero);
app.get("/search/:text", search);

// Escritura
app.post("/albumes", create);
app.put("/album/:slug", update);
app.delete("/album/:slug", remove);

// Imagenes estaticas -> /imagenes/thriller.avif
app.use(express.static("public"));

// Catch-all: cualquier otra ruta devuelve 404 en JSON
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, HOST, () => {
  console.log(`Server at http://${HOST}:${PORT}/`);
});
