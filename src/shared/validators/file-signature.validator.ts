// file-signature.validator.ts
import { FileValidator } from "@nestjs/common";
import magicBytes from 'magic-bytes.js'

export class  FileSignatureValidator extends FileValidator {
    constructor (){
        super({});
    }

    isValid(file: Express.Multer.File): boolean {
        const filesSignatures = magicBytes(file.buffer).map(file=> file.mime);
        console.log(filesSignatures);
        console.log(file.mimetype);
        
        if(!filesSignatures.length) return false;

        if(!filesSignatures.includes(file.mimetype)) 
            return false;

        return true;
    };

    buildErrorMessage(file: Express.Multer.File): string {
        return 'Invalid file signature.';
    };
}