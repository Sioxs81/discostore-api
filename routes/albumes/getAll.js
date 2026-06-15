import * as album from "../../data/albumes.js";
import { withImageUrl } from "./withImageUrl.js";

export const getAll = (req, res) => {
  const isFull = req.query.include === "full";
  const contents = isFull
    ? album.getFull().map(a => withImageUrl(req, a))
    : album.getAll();
  res.json(contents);
};
