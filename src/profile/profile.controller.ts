import { Controller, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { ProfileService } from "./profile.service";


@Controller()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }
}