import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly password: string;
}
