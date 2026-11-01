import { IsInt } from 'class-validator';

export class UpdateRoleDto {
  @IsInt()
  ma_vai_tro: number;
}