import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AddWordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  word: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  translate: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  added: string;
}

export class DeleteWordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  letter:string

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  id:string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  user:string
}