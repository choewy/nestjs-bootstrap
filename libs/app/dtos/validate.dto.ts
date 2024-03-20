import { IsInt, IsNotEmpty } from 'class-validator';

export class ValidateDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
