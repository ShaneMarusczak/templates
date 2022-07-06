export function StringFormat(str: string, ...args: string[]) {
  return str.replace(/{(\d+)}/g, (_match, index) => args[index] || "");
}

export function getArgCount(s: string): number {
  return (s.match(/{(\d+)}/g) || []).length;
}
