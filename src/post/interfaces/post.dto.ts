import { ApiProperty } from '@nestjs/swagger';

export default class PostDto {
  @ApiProperty()
  readonly message: string;
}
