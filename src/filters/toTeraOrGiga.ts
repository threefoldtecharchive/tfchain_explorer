export default function toTeraOrGiga(value?: string) {
  if (!value) return "Unknown";

  const val = +value;
  if (val === 0 || isNaN(val)) return "None";

  let gb = Math.round(val / 1e7) / 1e2;

  if (gb < 1000) return `${gb} GB`;

  gb /= 10;
  gb = Math.round(gb) / 1e2;
  return `${gb} TB`;
}
