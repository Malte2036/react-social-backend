import { ApiProperty } from '@nestjs/swagger';

export default class UserDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly password: string;
}
