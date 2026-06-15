# DiscoStore API

API REST del catalogo de albumes de DiscoStore, construida con
**Node.js + Express**, persistencia en **SQLite** (modulo nativo `node:sqlite`)
y validacion con **Zod**. Soporta lectura y escritura (CRUD).

## Requisitos

- Node.js **22+** (necesario para `node:sqlite`).
- `npm` (o `pnpm`).

## Instalacion

```bash
npm install
```

Crea el archivo `.env` a partir de `.env.example`:

```bash
copy .env.example .env   # PowerShell / Windows
# cp .env.example .env    # Linux / macOS
```

Contenido de `.env`:

```
HOST=localhost
PORT=4321
```

## Poblar la base de datos

Genera `data/albumes.db` a partir de `data/data.json` y `data/CREATE.SQL`.
El script recrea la tabla desde cero cada vez (es reproducible):

```bash
npm run db
```

> Si aparece un error de `node:sqlite`, tu version de Node es anterior a la 22.
> Actualiza Node, o ejecuta con: `node --experimental-sqlite data/createdb.js`.

## Ejecutar

```bash
npm run dev     # con recarga automatica (nodemon)
npm start       # sin recarga
```

Servidor en `http://localhost:4321/`.

## Rutas

| Metodo | Ruta              | Descripcion                                            |
| ------ | ----------------- | ------------------------------------------------------ |
| GET    | `/`               | Informacion de la API                                  |
| GET    | `/albumes`        | Lista de slugs (`?include=full` para datos completos)  |
| GET    | `/album/:slug`    | Album concreto por slug                                |
| GET    | `/genero/:genero` | Slugs de los albumes de ese genero                     |
| GET    | `/search/:text`   | Busqueda por texto (minimo 3 caracteres)               |
| POST   | `/albumes`        | Crea un album (slug generado del titulo)               |
| PUT    | `/album/:slug`    | Actualiza un album existente                           |
| DELETE | `/album/:slug`    | Elimina un album                                       |
| GET    | `/imagenes/*`     | Imagenes estaticas de los albumes                      |

## Codigos HTTP

- `200` OK — lectura exitosa o `PUT` exitoso.
- `201` Created — `POST` creo un recurso (incluye cabecera `Location`).
- `204` No Content — `DELETE` exitoso, sin cuerpo.
- `400` Bad Request — la validacion del cuerpo (Zod) fallo.
- `404` Not Found — el recurso no existe o la ruta no esta definida.
- `409` Conflict — `POST` intenta crear un album cuyo slug ya existe.

## Imagenes

El campo `imagen` se devuelve como URL completa y visible en el navegador,
por ejemplo `http://localhost:4321/imagenes/thriller.avif`.

## Estructura del proyecto

```
discostore-api/
├── index.js                 # App Express: rutas + estaticos + 404
├── .env / .env.example
├── data/
│   ├── data.json            # Datos semilla (8 albumes)
│   ├── CREATE.SQL           # Script de creacion de tabla
│   ├── createdb.js          # Crea y puebla la BD
│   └── albumes.js           # Repositorio (lectura + escritura)
├── routes/albumes/          # Controladores
│   ├── getAll.js
│   ├── getBySlug.js
│   ├── getByGenero.js
│   ├── search.js
│   ├── create.js
│   ├── update.js
│   ├── remove.js
│   ├── album.schema.js      # Esquema Zod del cuerpo
│   ├── search.schema.js     # Esquema Zod de la busqueda
│   ├── slugify.js           # Genera el slug desde el titulo
│   └── withImageUrl.js      # Arma la URL completa de la imagen
└── public/imagenes/         # Imagenes (.avif)
```

## Pruebas con httpie

> En httpie, `=` envia texto y `:=` envia numeros/JSON crudo.

```bash
http GET :4321/albumes
http GET :4321/albumes include==full
http GET :4321/album/thriller
http GET :4321/album/inexistente        # 404

http GET :4321/genero/Rock
http GET :4321/search/floyd
http GET :4321/search/ab                # 400 (minimo 3)

# Crear (201 + Location)
http POST :4321/albumes titulo="OK Computer" artista="Radiohead" \
  genero="Rock" anio:=1997 sello="Parlophone" pistas:=12 \
  imagen="ok-computer.avif" resumen="Disco clave de los 90." \
  descripcion="Album de Radiohead que marco el rock alternativo."

# Crear el mismo de nuevo (409 Conflict)
http POST :4321/albumes titulo="OK Computer" artista="Radiohead" \
  genero="Rock" anio:=1997 sello="Parlophone" pistas:=12 \
  imagen="ok-computer.avif" resumen="x" descripcion="y"

# Crear con cuerpo invalido (400)
http POST :4321/albumes titulo="X" genero="Pop" anio:=2000

# Actualizar (200)
http PUT :4321/album/ok-computer titulo="OK Computer" artista="Radiohead" \
  genero="Art Rock" anio:=1997 sello="Parlophone" pistas:=12 \
  imagen="ok-computer.avif" resumen="Editado." descripcion="Genero actualizado."

# Actualizar inexistente (404)
http PUT :4321/album/inexistente titulo="X" artista="Y" genero="Z" \
  anio:=2000 sello="W" pistas:=5 imagen="x.avif" resumen="r" descripcion="d"

# Eliminar (204)
http DELETE :4321/album/ok-computer

# Eliminar inexistente (404)
http DELETE :4321/album/ok-computer
```
