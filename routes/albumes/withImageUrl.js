export const withImageUrl = (req, album) => ({
  ...album,
  imagen: `${req.protocol}://${req.get("host")}/imagenes/${album.imagen}`
});
