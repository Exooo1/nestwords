import { IsBoolean, IsIn, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AddWordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  word: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  translate: string;

  @IsString()
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
  letter: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  id: string;
}

export class ChangeWordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  word: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  translate: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  added: string;
}

export class SortWordsDTO {
  @IsNotEmpty()
  @IsBoolean()
  isSort: boolean;

  @IsNotEmpty()
  @IsString()
  @IsIn(['ADDED', 'DESCRIPTION'])
  sortType: 'ADDED' | 'DESCRIPTION';
}