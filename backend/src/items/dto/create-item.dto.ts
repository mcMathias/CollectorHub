import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemCondition, OwnershipStatus } from '@prisma/client';

export class CustomAttributeDto {
  @ApiProperty({ description: 'Field definition ID' })
  @IsString()
  fieldDefinitionId: string;

  @ApiProperty({ description: 'Value for the custom field' })
  @IsString()
  value: string;
}

export class CreateItemDto {
  @ApiProperty({ example: 'Millennium Falcon' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Collection ID this item belongs to' })
  @IsString()
  collectionId: string;

  @ApiPropertyOptional({ example: 'Ultimate Collector Series' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subtitle?: string;

  @ApiPropertyOptional({ example: 'LEGO' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 849.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional({ example: 'DKK', description: 'ISO 4217 currency code' })
  @IsOptional()
  @IsString()
  purchaseCurrencyCode?: string;

  @ApiPropertyOptional({ example: 1200.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValue?: number;

  @ApiPropertyOptional({ example: 'DKK' })
  @IsOptional()
  @IsString()
  estimatedCurrencyCode?: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({ enum: ItemCondition })
  @IsOptional()
  @IsEnum(ItemCondition)
  condition?: ItemCondition;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ enum: OwnershipStatus, default: 'OWNED' })
  @IsOptional()
  @IsEnum(OwnershipStatus)
  ownership?: OwnershipStatus;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: ['star-wars', 'ucs'], description: 'Tag names (created if not exist)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional({ type: [CustomAttributeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomAttributeDto)
  customAttributes?: CustomAttributeDto[];
}
