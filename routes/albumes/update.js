import * as album from "../../data/albumes.js";
import schema from "./album.schema.js";
import { withImageUrl } from "./withImageUrl.js";

export const update = (req, res) => {
  // 400: validacion del cuerpo con Zod
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const error = parsed.error.issues[0].message ?? "Datos invalidos";
    return res.status(400).json({ error });
  }

  // 404: el recurso a actualizar no existe
  const existing = album.getBySlug(req.params.slug);
  if (!existing)
    return res.status(404).json({ error: "Album no encontrado" });

  // 200: actualizacion exitosa
  album.update(req.params.slug, parsed.data);
  res.json(withImageUrl(req, album.getBySlug(req.params.slug)));
};
