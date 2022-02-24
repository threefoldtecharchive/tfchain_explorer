export default function customSort<T>(
  items: T[],
  key: keyof T,
  desc: boolean
): T[] {
  items = [...items];
  items.sort((a: any, b: any) => {
    const _a = a[key];
    const _b = b[key];
    const _type = typeof _a;

    if (_type === "number") {
      return desc ? _b - _a : _a - _b;
    }

    return desc ? _b.localeCompare(_a) : _a.localeCompare(_b);
  });

  return items;
}
