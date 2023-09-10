import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { ProfileService } from "./profile.service";
import { TStatusRes } from "../../utils/status";
import { TNewStatus, TProfileInfo } from "./types";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Token } from "../../decorators/token.decorator";
import { SetStatusDTO } from "./profile.dto";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-profile")
  getProfile(@Token("id") token: string): Promise<TStatusRes<TProfileInfo>> {
    return this.profileService.getProfile(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads",
      filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        callback(null, `${file.originalname}`);
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Token("id") token: string): Promise<TStatusRes<string>> {
    return this.profileService.setAvatar(token, `${file.originalname}`);
  }

  @Get("get-avatar/:id")
  async getAvatar(@Req() req, @Res() res): Promise<string> {
    return res.sendFile(await this.profileService.getAvatar(req.params.id, res));
  }

  @UseGuards(JwtAuthGuard)
  @Post("set-status")
  setAvatar(@Token("id") id: string, @Body() data: SetStatusDTO): Promise<TStatusRes<number>> {
    return this.profileService.setStatus(id, data);
  }
}
