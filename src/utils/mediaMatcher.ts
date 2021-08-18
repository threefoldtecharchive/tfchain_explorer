export default function mediaMatcher(query: string) {
  const media = window.matchMedia(query);

  const ref = {
    matches: media.matches,
    destry: () => {
      media.onchange = null;
    },
  };

  media.onchange = (e) => {
    ref.matches = e.matches;
  };

  return ref;
}
