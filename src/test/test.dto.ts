import { MinLength } from "class-validator";

export class TestDto {
  @MinLength(5)
  name: string;
}
