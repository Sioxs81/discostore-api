import * as album from "../../data/albumes.js";
import schema from "./album.schema.js";
import { slugify } from "./slugify.js";
import { withImageUrl } from "./withImageUrl.js";

export const create = (req, res) => {
  // 400: validacion del cuerpo con Zod
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const error = parsed.error.issues[0].message ?? "Datos invalidos";
    return res.status(400).json({ error });
  }

  const data = parsed.data;
  const slug = slugify(data.titulo);

  // 409: ya existe un album con ese slug
  if (album.getBySlug(slug))
    return res.status(409).json({ error: "Ya existe un album con ese slug" });

  // 201: creado, con cabecera Location
  album.create({ ...data, slug });

  res.status(201)
    .location(`/album/${slug}`)
    .json(withImageUrl(req, album.getBySlug(slug)));
};
