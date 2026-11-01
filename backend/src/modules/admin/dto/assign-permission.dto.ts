import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class AssignPermissionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ma_quyen: number[];
}