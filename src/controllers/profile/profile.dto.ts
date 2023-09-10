import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SetStatusDTO {
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly emoji: string;
}
