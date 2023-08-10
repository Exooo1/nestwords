import { IsEmail, IsNotEmpty, MinLength, IsString } from "class-validator";
import { PickType } from "@nestjs/mapped-types";

export class SignUpDTO {
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly lastName?: string;
}

export class EmailDTO extends PickType(SignUpDTO, ["email"]) {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  readonly verify: string;
}

export class LoginDTO extends PickType(SignUpDTO, ["email", "password"]) {
}
