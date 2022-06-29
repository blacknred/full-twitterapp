export function arrayToObject(arr: unknown[]) {
  const entries: unknown[][] = [];

  for (let i = 0; i < arr.length; i += 2) {
    entries.push([arr[i], arr[i + 1]]);
  }

  return Object.fromEntries(entries);
}

export function bufferToNumberArray(buf: Buffer) {
  return buf.toString().split(',').map(Number);
}
