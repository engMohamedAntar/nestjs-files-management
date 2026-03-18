import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileSignatureValidator } from '../shared/validators/file-signature.validator';

@Controller('files-upload')
export class FilesUploadController {
  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          //1) validate file size
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
            message: 'File too large',
          }),

          //2) validate file type (extension)
          new FileTypeValidator({ fileType: /png|jpg|jpeg|pdf/ }),

          //3) custom validation (validate file signature)
          new FileSignatureValidator()
        ],

      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
            message: 'File too large',
          }),
          new FileTypeValidator({ fileType: /png|jpg|jpeg/ }),
        ],
        errorHttpStatusCode: 400,
      }),
    )
    files: Express.Multer.File[],
  ) {
    return files.map((file) => file.originalname);
  }
}
