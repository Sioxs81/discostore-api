import { z } from "zod";

const schema = z.object({
  titulo: z.string().trim().nonempty("El titulo es obligatorio").max(120),
  artista: z.string().trim().nonempty("El artista es obligatorio").max(120),
  genero: z.string().trim().nonempty("El genero es obligatorio").max(60),
  anio: z.coerce.number().int("El anio debe ser entero")
    .gte(1900, "Anio invalido").lte(2100, "Anio invalido"),
  sello: z.string().trim().nonempty("El sello es obligatorio").max(80),
  pistas: z.coerce.number().int("Las pistas deben ser un entero")
    .positive("Las pistas deben ser un numero positivo"),
  imagen: z.string().trim().nonempty("La imagen es obligatoria"),
  resumen: z.string().trim().nonempty("El resumen es obligatorio").max(200),
  descripcion: z.string().trim().nonempty("La descripcion es obligatoria")
});

export default schema;
