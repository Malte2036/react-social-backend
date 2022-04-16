import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
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
  async seeUploadedFileById(
    @Param('id') imageId: string,
    @Res() res,
  ): Promise<any> {
    const imageData = await this.filesService.findOne(imageId);
    if (!imageData) {
      return new NotFoundException('Image id not found!');
    }
    return res.sendFile(`${imageData.name}`, { root: './files' });
  }
}
