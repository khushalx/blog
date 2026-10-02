// Frontmatter dates follow the author's publication day in India, independently
// of the build server's local timezone.
export function publicationDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
