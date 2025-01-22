export function normalizeText(text: string): string {
  if (!text) return '';
  
  // Replace common special characters
  const specialChars: { [key: string]: string } = {
    'ã': 'a', 'â': 'a', 'á': 'a', 'à': 'a',
    'ẽ': 'e', 'ê': 'e', 'é': 'e', 'è': 'e',
    'ĩ': 'i', 'î': 'i', 'í': 'i', 'ì': 'i',
    'õ': 'o', 'ô': 'o', 'ó': 'o', 'ò': 'o',
    'ũ': 'u', 'û': 'u', 'ú': 'u', 'ù': 'u',
    'ç': 'c',
    'ñ': 'n',
    '�': '',  // Remove invalid characters
  };

  // Replace special characters and normalize spaces
  return text
    .split('')
    .map(char => specialChars[char.toLowerCase()] || char)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeTableData(data: Record<string, any>[]): Record<string, any>[] {
  return data.map(row => {
    const normalizedRow: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      if (key && value) {
        const normalizedKey = normalizeText(key);
        const normalizedValue = typeof value === 'string' ? normalizeText(value) : value;
        normalizedRow[normalizedKey] = normalizedValue;
      }
    }
    return normalizedRow;
  });
}