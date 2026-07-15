import { IsOptional, IsBoolean, IsInt, IsEnum, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ImageLabel } from '@prisma/client';

export class UpdateImageDto {
  @ApiPropertyOptional({ enum: ImageLabel })
  @IsOptional()
  @IsEnum(ImageLabel)
  label?: ImageLabel;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
