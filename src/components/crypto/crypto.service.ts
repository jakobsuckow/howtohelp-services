import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { Hash } from "./crypto.interface";

@Injectable()
export class CryptoService {
  key: string;
  iv: Buffer;
  ivLength: number;
  algorithm: string;
  constructor() {
    this.key = process.env.CRYPTO_KEY as string;
    this.iv = crypto.randomBytes(16);
    this.algorithm = "aes-256-ctr";
  }

  public async encrypt(string: string): Promise<Hash> {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);

    const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

    return {
      iv: this.iv.toString("hex"),
      content: encrypted.toString("hex"),
    } as Hash;
  }

  public async decrypt(hash: Hash): Promise<string> {
    console.log(hash);
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(hash.iv, "hex"));

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, "hex")),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }
}
