export function StringFormat(str: string, ...args: string[]) {
  return str.replace(/{(\d+)}/g, (_match, index) => args[index] || "");
}
