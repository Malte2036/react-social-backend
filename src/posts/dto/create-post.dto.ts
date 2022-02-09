import { ApiProperty } from '@nestjs/swagger';
import { CreateFileDto } from 'src/files/dto/create-file.dto';

export class CreatePostDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  image?: CreateFileDto;
}
