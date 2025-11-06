import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function maskSecret(value: string, showLast: number = 4): string {
  if (value.length <= showLast) {
    return "*".repeat(value.length);
  }
  const masked = "*".repeat(value.length - showLast);
  const visible = value.slice(-showLast);
  return `${masked}${visible}`;
}

export async function encrypt(value: string, keyBase64: string): Promise<Buffer> {
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (256 bits)");
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]);
}

export async function decrypt(encryptedBuffer: Buffer, keyBase64: string): Promise<string> {
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== 32) {
    throw new Error("Decryption key must be 32 bytes (256 bits)");
  }

  const iv = encryptedBuffer.subarray(0, 12);
  const authTag = encryptedBuffer.subarray(12, 28);
  const ciphertext = encryptedBuffer.subarray(28);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function generateMasterKey(): string {
  return randomBytes(32).toString("base64");
}

export function validateKeyFormat(provider: string, value: string): { valid: boolean; error?: string } {
  const patterns: Record<string, RegExp> = {
    stripe_secret: /^sk_(test|live)_[a-zA-Z0-9]{24,}$/,
    stripe_webhook: /^whsec_[a-zA-Z0-9]{32,}$/,
    openai: /^sk-[a-zA-Z0-9]{48,}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9-]{95,}$/,
    google_gemini: /^AIza[a-zA-Z0-9_-]{35}$/,
    resend: /^re_[a-zA-Z0-9]{32,}$/,
    sendgrid: /^SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}$/,
  };

  const pattern = patterns[provider];
  if (!pattern) {
    return { valid: true };
  }

  if (!pattern.test(value)) {
    return {
      valid: false,
      error: `Invalid ${provider} key format`,
    };
  }

  return { valid: true };
}

export interface KeyVaultEntry {
  id: string;
  provider: string;
  keyType: "secret" | "public" | "webhook";
  alias: string;
  keyHash: string;
  cipherText: Buffer;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  updatedById?: string;
  lastCheckOk: boolean;
  lastCheckAt?: Date;
}

export interface KeyVaultListItem {
  id: string;
  provider: string;
  keyType: string;
  alias: string;
  version: number;
  updatedAt: Date;
  lastCheckOk: boolean;
  lastCheckAt?: Date;
  maskedValue: string;
}

export function formatKeyVaultEntry(entry: KeyVaultEntry, value: string): KeyVaultListItem {
  return {
    id: entry.id,
    provider: entry.provider,
    keyType: entry.keyType,
    alias: entry.alias,
    version: entry.version,
    updatedAt: entry.updatedAt,
    lastCheckOk: entry.lastCheckOk,
    lastCheckAt: entry.lastCheckAt,
    maskedValue: maskSecret(value),
  };
}
