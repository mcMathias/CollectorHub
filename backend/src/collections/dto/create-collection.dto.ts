import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';

export class CreateCollectionDto {
  @ApiProperty({ example: 'My LEGO Star Wars' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'clxxxxxxxxxxxxxxxxx', description: 'Collection type ID' })
  @IsString()
  collectionTypeId: string;

  @ApiPropertyOptional({ example: 'All my Star Wars LEGO sets' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: '🧱' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: Visibility, default: Visibility.PRIVATE })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
