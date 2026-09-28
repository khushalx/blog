export function formatDate(date: string, long = false) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
