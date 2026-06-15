import * as album from "../../data/albumes.js";
import { withImageUrl } from "./withImageUrl.js";

const notFound = (res, message) => {
  return res.status(404).json({ error: message });
};

export const getBySlug = (req, res) => {
  const selected = album.getBySlug(req.params.slug);

  if (!selected)
    return notFound(res, "Album no encontrado");

  res.json(withImageUrl(req, selected));
};
