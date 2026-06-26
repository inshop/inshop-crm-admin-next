// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractItems(data: any, path?: string): any[] {
  if (!path || path === "flat") {
    return Array.isArray(data) ? (Array.isArray(data[0]) ? data[0] : data) : [];
  }

  const parts = path.split(".");
  let items = Array.isArray(data) ? (Array.isArray(data[0]) ? data[0] : data) : [];

  for (const part of parts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nested: any[] = [];
    for (const item of items) {
      if (Array.isArray(item[part])) {
        nested.push(...item[part]);
      }
    }
    items = nested;
  }

  return items;
}
