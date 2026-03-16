import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('files-upload')
export class FilesUploadController {
  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024, message: 'File too large' }),
          new FileTypeValidator({ fileType: /png|jpg|jpeg/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      limits: {
        fileSize: 1024 * 1024, // 1 MB
      },
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => file.originalname);
  }
}
