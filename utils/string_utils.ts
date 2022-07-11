export function stringFormat(str: string, ...args: string[]) {
  return str.replace(/{(\d+)}/g, (_match, index) => args[index] || "");
}

export function getArgCount(s: string): number {
  const matches = Array.from(s.match(/{(\d+)}/g) || []);
  let max = -1;
  for (const m of matches) {
    const num = Number(m.charAt(1));
    if (max < num) {
      max = num;
    }
  }
  return max + 1;
}
