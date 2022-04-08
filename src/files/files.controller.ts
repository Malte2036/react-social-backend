import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { of } from 'rxjs';
import { FilesService } from './files.service';
import * as multer from 'multer';
import { extname } from 'path';

@ApiTags('files')
//@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findOne(id);
    if (file == null) {
      throw new NotFoundException('File not found!');
    }
    return of(res.send(file.data));
    return file;
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file) {
    console.log(file);
    if (!file) {
      throw new BadRequestException();
    }
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get('/test/:id')
  seeUploadedFile(@Param('id') image, @Res() res): any {
    return res.sendFile(`${image}.png`, { root: './files' });
  }
}

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
