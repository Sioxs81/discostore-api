export const slugify = text =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")     // todo lo no alfanumerico -> guion
    .replace(/^-+|-+$/g, "");        // quita guiones de los extremos
