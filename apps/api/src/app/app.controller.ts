import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  // serves health check endpoint
  constructor(private appService: AppService) {}

  @Get("health")
  getHealth() {
    return this.appService.getHealth();
  }
}
