import * as album from "../../data/albumes.js";

export const remove = (req, res) => {
  // 404: el recurso a eliminar no existe
  const existing = album.getBySlug(req.params.slug);
  if (!existing)
    return res.status(404).json({ error: "Album no encontrado" });

  // 204: eliminado, sin cuerpo en la respuesta
  album.remove(req.params.slug);
  res.status(204).end();
};
