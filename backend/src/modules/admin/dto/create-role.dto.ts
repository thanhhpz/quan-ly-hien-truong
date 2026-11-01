import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  ten_vai_tro: string;

  @IsOptional()
  @IsString()
  mo_ta?: string;
}