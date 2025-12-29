export const technicalSlugs = [
  "dynamic-programming",
  "graphs-and-trees",
  "arrays-and-strings",
  "recursion",
  "bit-manipulation",
  "system-design",
  "math-and-geometry",
];

export const languageSlugs = [
  "typescript-javascript",
  "python",
  "cpp-and-c",
  "java",
  "rust",
  "sql",
  "nosql",
  "frontend",
  "backend",
];

export const careerSlugs = ["job-opportunities", "campus-placement", "gate-exam"];

export const isDojoTheme = (slug: string) => {
  return (
    !technicalSlugs.includes(slug) &&
    !languageSlugs.includes(slug) &&
    !careerSlugs.includes(slug)
  );
};
