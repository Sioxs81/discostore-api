import { DatabaseSync } from "node:sqlite";
import { cwd } from "node:process";

const db = new DatabaseSync(`${cwd()}/data/albumes.db`);

export const getAll = () => {
  const query = db.prepare("SELECT slug FROM albumes");
  return query.all();
};

export const getFull = () => {
  const query = db.prepare("SELECT * FROM albumes");
  return query.all();
};

export const getBySlug = slug => {
  const query = db.prepare("SELECT * FROM albumes WHERE slug = ?");
  return query.get(slug);
};

export const getByGenero = genero => {
  const query = db.prepare("SELECT slug FROM albumes WHERE genero = ?");
  return query.all(genero);
};

export const search = text => {
  const query = db.prepare(
    "SELECT slug FROM albumes WHERE titulo LIKE ? OR descripcion LIKE ?"
  );
  return query.all(`%${text}%`, `%${text}%`);
};

export const create = album => {
  const query = db.prepare(/* SQL */`INSERT INTO albumes (titulo, artista,
    genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
    VALUES (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen,
    :slug, :resumen, :descripcion)`);
  query.run(album);
};

export const update = (slug, album) => {
  const query = db.prepare(/* SQL */`UPDATE albumes SET titulo = :titulo,
    artista = :artista, genero = :genero, anio = :anio, sello = :sello,
    pistas = :pistas, imagen = :imagen, resumen = :resumen,
    descripcion = :descripcion WHERE slug = :slug`);
  query.run({ ...album, slug });
};

export const remove = slug => {
  const query = db.prepare("DELETE FROM albumes WHERE slug = ?");
  query.run(slug);
};
