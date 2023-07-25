import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { ProfileService } from "./profile.service";
import { resStatus, TStatusRes } from "../utils/status";
import { TProfileInfo } from "./types";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";


const test =() =>{
  return 'names'
}

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-profile")
  getProfile(@Req() req): Promise<TStatusRes<TProfileInfo>> {
    return this.profileService.getProfile(req.user.id);
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
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.profileService.setAvatar(req.user.id, `${file.originalname}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-avatar/:id")
  getAvatar(@Res() res, @Req() req) {
    return res.sendFile(`${path.resolve(__dirname, "../..", `src/uploads/${req.params.id}`)}`);
  }
}