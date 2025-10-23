const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toHex(buffer: ArrayBuffer): string {
  const data = new Uint8Array(buffer);
  return Array.from(data)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string length');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function deriveKey(address: string): Promise<CryptoKey> {
  const normalized = address.toLowerCase();
  const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(normalized));
  return crypto.subtle.importKey('raw', keyMaterial, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptWithCompanyPassword(passwordAddress: string, plaintext: string): Promise<string> {
  const key = await deriveKey(passwordAddress);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plaintext));
  return `${toHex(iv)}:${toHex(ciphertext)}`;
}

export async function decryptWithCompanyPassword(passwordAddress: string, payload: string): Promise<string> {
  const [ivHex, cipherHex] = payload.split(':');
  if (!ivHex || !cipherHex) {
    throw new Error('Invalid encrypted payload');
  }

  const key = await deriveKey(passwordAddress);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromHex(ivHex) },
    key,
    fromHex(cipherHex)
  );

  return decoder.decode(decrypted);
}

export function generatePasswordAddress(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(20));
  return `0x${Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')}`;
}
