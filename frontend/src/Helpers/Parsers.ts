export function ServerEncodingToNumbers(data: string): number[] {
    return data.split(",").map(number => parseFloat(number))
}

export function Uint8ArrayToBase64(data: Uint8Array): string {
  const chunkSize = 0x8000; // 32 KB
  let binary = "";

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}