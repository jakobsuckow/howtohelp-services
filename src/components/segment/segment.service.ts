import axios, { AxiosResponse, AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class SegmentService {
  public api: AxiosInstance;
  private context: { library: { name: string; version: string } } = {
    library: { name: "howtohelp <> Segment Intergration", version: "1.0.0" },
  };
  private writeKey: string;

  constructor() {
    this.writeKey = process.env.SEGMENT_BACKEND_WRITEKEY;
    const options = {
      baseURL: "https://api.segment.io/v1",
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: this.writeKey,
        password: undefined,
      },
    };

    this.api = axios.create({ ...options });
  }

  public identify(id: string, data = {}): Promise<any> {
    try {
      return this.api.post(`/identify`, {
        userId: id,
        traits: data,
        context: this.context,
      });
    } catch (error) {
      console.log(error);
    }
  }

  public track(event: string, data = {}): Promise<AxiosResponse> {
    try {
      return this.api.post(`/track`, {
        event,
        userId: uuidv4(),
        properties: data,
        context: this.context,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
