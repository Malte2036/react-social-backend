import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';

@ApiTags('files')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const file = await this.filesService.findOne(+id);
    if (file == null) {
      throw new NotFoundException('File not found!');
    }
    return file;
  }
}
