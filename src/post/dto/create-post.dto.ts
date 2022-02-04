import { ApiProperty } from '@nestjs/swagger';

export default class CreatePostDto {
  @ApiProperty()
  readonly message: string;
}
