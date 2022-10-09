import { ApiProperty } from '@nestjs/swagger';

export class GoogleDto {
  @ApiProperty()
  readonly token: string;
}
