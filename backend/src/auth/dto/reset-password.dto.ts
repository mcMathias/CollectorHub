import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'NewP@ssw0rd123' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
