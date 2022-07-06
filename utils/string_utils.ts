export function StringFormat(str: string, ...args: string[]) {
  return str.replace(/{(\d+)}/g, (_match, index) => args[index] || "");
}

export function getArgCount(s: string): number {
  const matches = s.match(/{(\d+)}/g) || [];
  let max = -Infinity;
  for (const m in matches) {
    const num = Number(m);
    if (max < num) {
      max = num;
    }
  }

  return max + 1;
}
