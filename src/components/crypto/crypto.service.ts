import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class CryptoService {
  key: string;
  iv: Buffer;
  ivLength: number;
  algorithm: string;
  constructor() {
    this.key = process.env.CRYPTO_KEY;
    this.algorithm = "aes-256-ctr";
    this.ivLength = 16;
  }

  public async encrypt(string: string): Promise<string> {
    let iv = crypto.randomBytes(this.ivLength);
    let cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
    let encrypted = cipher.update(string);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  public async decrypt(string: string): Promise<string> {
    let textParts = string.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  public async hash(string: string): Promise<string> {
    return crypto.createHmac("sha1", this.key).update(string).digest("hex");
  }
}
