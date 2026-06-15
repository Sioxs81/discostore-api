import * as album from "../../data/albumes.js";

export const getByGenero = (req, res) => {
  const albumes = album.getByGenero(req.params.genero);
  res.json(albumes);
};
