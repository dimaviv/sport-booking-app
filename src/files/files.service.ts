import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import { avatarExtensions, avatarVersionsUpload, MAX_ALLOWED_AVATAR_SIZE_KB } from "../../config/config";
import {createWriteStream} from "fs";

@Injectable()
export class FilesService {

    async saveAvatar(file): Promise<string>{
        try {
            await this.checkFileSize(file)

            const {createReadStream} = await file
            const readStream = createReadStream()

            const buffer = await this.streamToBuffer(readStream);

            if (buffer.length/1024 > MAX_ALLOWED_AVATAR_SIZE_KB) {
                throw new HttpException('File size exceeds the limit', HttpStatus.BAD_REQUEST);
            }

            const fileNames: string[] = [];

            const extension = file.filename.slice(
                ((file.filename.lastIndexOf('.') - 1) >>> 0) + 2
            );

            if (!avatarExtensions.includes(extension)){
                throw new HttpException('File format is not allowed', HttpStatus.BAD_REQUEST)
            }

            for (const version of avatarVersionsUpload) {
                const fileName = `${uuid.v4()}_${version.suffix}.${extension}`;

                const filePath = path.resolve(__dirname, '..', 'static');

                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true });
                }

                const processedImageBuffer  = await sharp(buffer)
                    .resize(version.width, version.height)
                    .toBuffer();

                const resizedWriteStream = createWriteStream(path.join(filePath, fileName));
                resizedWriteStream.write(processedImageBuffer);
                resizedWriteStream.end();

                fileNames.push(fileName);
            }

            return fileNames[0];
        }catch (e) {
            throw new HttpException(e.message, e.status)
        }
    }

    async uploadFile(fileArg): Promise<string>{
        try {
            const file = await fileArg
            await this.checkFileSize(file);

            const { createReadStream } = await file;
            const readStream = createReadStream();

            const buffer = await this.streamToBuffer(readStream);

            const fileName = `${uuid.v4()}.${file.filename.split('.').pop()}`;
            const filePath = path.resolve(__dirname, '..', 'static');

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            const writeStream = createWriteStream(path.join(filePath, fileName));
            writeStream.write(buffer);
            writeStream.end();

            return fileName;
        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async uploadMultipleFiles(files): Promise<string[]>{
        try {
            const fileNames: string[] = [];

            for (const file of files) {
                const fileName = await this.uploadFile(file);
                fileNames.push(fileName);
            }

            return fileNames;
        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    async deleteFile(fileName: string): Promise<void> {
        const filePath = path.resolve(__dirname, '..', 'static', fileName);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }


    async streamToBuffer(readStream: NodeJS.ReadableStream): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            readStream.on('data', (chunk) => chunks.push(chunk));
            readStream.on('end', () => resolve(Buffer.concat(chunks)));
            readStream.on('error', (error) => reject(error));
        });
    }

    async checkFileSize(file, maxSizeKB = MAX_ALLOWED_AVATAR_SIZE_KB){
        const fileSizeInKB = file.size / 1024;
        if (fileSizeInKB > maxSizeKB) {
            throw new HttpException('File size is too big', HttpStatus.BAD_REQUEST)
        }
    };

}
