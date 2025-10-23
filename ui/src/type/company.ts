export interface CompanyRecord {
  id: number;
  name: string;
  owner: string;
  passwordCipher: `0x${string}`;
  createdAt: number;
  memberCount: number;
  documentCount: number;
}

export interface DocumentRecord {
  id: number;
  encryptedTitle: string;
  encryptedBody: string;
  author: string;
  createdAt: number;
}

export interface DecryptedDocument extends DocumentRecord {
  title: string;
  body: string;
}
