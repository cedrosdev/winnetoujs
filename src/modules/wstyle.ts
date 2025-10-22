export const wstyle = (object: Record<string, string | number>): string => {
  return Object.entries(object)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
};
