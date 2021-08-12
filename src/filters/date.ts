export default function dateFiler(value: string): string {
  const formater = Intl.DateTimeFormat("en", {
    timeStyle: "short",
    dateStyle: "short",
    // eslint-disable-next-line
  } as any);

  // eslint-disable-next-line
  return formater.format(new Date(value));
}
