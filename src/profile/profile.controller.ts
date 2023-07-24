import { Body, Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { ProfileService } from "./profile.service";
import { resStatus, TStatusRes } from "../utils/status";
import { TProfileInfo } from "./types";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";

@UseGuards(JwtAuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @Get("get-profile")
  getProfile(@Req() req): Promise<TStatusRes<TProfileInfo>> {
    return this.profileService.getProfile(req.user.id);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./src/uploads",
      filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        // @ts-ignore
        callback(null, `${req.user.id+file.originalname}`);
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File,@Req() req) {
    return resStatus(`${path.resolve(__dirname,'../..',`src/uploads/${req.user.id+file.originalname}`)}`,1);
  }

  @Get("get-avatar/:id")
  getAvatar(@Res() res, @Req() req) {
    return res.sendFile(`${path.resolve(__dirname,'../..',`src/uploads/${req.params.id+req.user.id}`)}`)
  }
}