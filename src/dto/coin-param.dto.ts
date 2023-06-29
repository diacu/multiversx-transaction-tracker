import { IsNotEmpty, IsIn } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class CoinParamDto {
  // @ApiProperty({ enum: ['EGLD', 'ESDT'] })
  @IsNotEmpty()
  @IsIn(['EGLD', 'ESDT'])
  coin: string;
}
