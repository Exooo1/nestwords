import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { ProfileService } from "./profile.service";
import { TStatusRes } from "../utils/status";
import { TProfileInfo } from "./types";


@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @Get('get-profile')
  getProfile(@Req() req):Promise<TStatusRes<TProfileInfo>> {
    return this.profileService.getProfile(req.user.id);
  }
}