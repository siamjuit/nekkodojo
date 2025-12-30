import slugify from "slugify";

export function generateSlug(title: string) {
  return slugify(title, { lower: true, strict: true });
}
