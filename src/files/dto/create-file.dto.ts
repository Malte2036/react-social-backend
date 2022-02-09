import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly data: any;
  @ApiProperty()
  readonly mimeType: string;
}
