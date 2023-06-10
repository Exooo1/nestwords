import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { resStatus } from "../utils/status";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      console.log(token)
      if (!token) throw new HttpException("not found token", HttpStatus.FORBIDDEN);
      // const id = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
      next();
    } catch (err) {
      console.log(err)
       return res.status(404).json(resStatus<null>(null,0,'notFound token'))
    }
  }
}
