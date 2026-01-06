import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  // returns health check status
  getHealth() {
    return {
      status: "ok",
      timestamp: new Date(),
      version: "1.0.0",
    };
  }
}
