import {
  BadGatewayException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,

} from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities';
import { UserEntity } from 'src/users/entities';
import { getTime } from '@app/utils';
import * as hasha from 'hasha';
import { allowedFileTypesType } from '@app/core/enums';


@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  
  readonly bucket = this.configService.get<string>('S3_STORAGE_BUCKET');
  readonly host = 'https://' + this.configService.get('S3_HOST');
  readonly bucketPath = this.host + '/' + this.bucket;
  
  private readonly logger = new Logger(StorageService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>) {
    this.s3 = new S3Client({
      endpoint: this.host,
      credentials: {
        accessKeyId: this.configService.get('S3_ROOT_USER'),
        secretAccessKey: this.configService.get('S3_ROOT_PASSWORD'),
      },
      region: this.configService.get('S3_REGION')
    });
  }

  async getFolder(path: string): Promise<ListObjectsCommandOutput> {
    let input = {
      Bucket: this.bucket,
      Prefix: path,
    }
    const icons = await this.s3.send(new ListObjectsCommand(input))
    return icons;
  }

  async upload(user: UserEntity, path: string, buffer: Buffer, mimeType: allowedFileTypesType): Promise<FileEntity> {
    try {
      let inputData = {
        Bucket: this.bucket, 
        Key: path, 
        Body: buffer,
        ContentType: mimeType,
      }
      let count = await this.filesRepository.createQueryBuilder('files')
      .select('COUNT(*)', 'count')
      .where('files.owner = :user', { user: user.id })
      .getRawOne()
      if(count > +this.configService.get('S3_FILE_LIMIT_PER_USER')) {
        const oldNotSavedFile = await this.filesRepository.findOne({ 
          where: {
            saved: false, 
            owner: {
              id: user.id
            }
          },
          order: {
            created_at: "ASC",
          }
        })
        if(!oldNotSavedFile) throw new ForbiddenException('Лимит загрузки файлов исчерпан')
        await this.filesRepository.remove(oldNotSavedFile)
      }

      await this.s3.send(new PutObjectCommand(inputData))
      this.logger.log(`saved ${path}`);
      return await this.filesRepository.save({ 
        owner: user, 
        path, 
        created_at: getTime(), 
        hash: await hasha.async(buffer, { algorithm: 'md5' }),
        mimeType,
      })
    } catch (error) {
      let err = `failed to save ${path}`
      this.logger.error(err);
      this.logger.error(error);
      throw new BadGatewayException(err)
    }
  }

  async save(user: UserEntity, hash: string): Promise<FileEntity> {
    let fileInfo = await this.filesRepository.findOneBy({ saved: false, hash });
    if (!fileInfo) throw new NotFoundException('Файл не найден');
    fileInfo.owner = user;
    fileInfo.saved = true;
    return this.filesRepository.save(fileInfo);
  }


  async has(path: string): Promise<boolean> {
    try {
      await this.s3.send(new GetObjectCommand({Bucket: this.bucket, Key: path}))
      return true;
    } catch {
      return false;
    }
  }

  async get(filename: string): Promise<GetObjectCommandOutput> {
    try {
      const data = await this.s3.send(new GetObjectCommand({Bucket: this.bucket, Key: filename}))

      return data;
    } catch {
      throw new HttpException('не удалось получить файл', HttpStatus.NOT_FOUND);
    }
  }

  async getBufferObject(filename: string): Promise<Buffer> {
    const fileInfo = await this.get(filename);
    return Buffer.from(fileInfo.Body.toString())
  }

  async delete(fileId: number): Promise<boolean> {
    try {
      
      const fileInfo = await this.filesRepository.findOneBy({ id: fileId })
      
      await this.s3.send(new DeleteObjectCommand({Bucket: this.bucket, Key: fileInfo.path}))
      await this.filesRepository.remove(fileInfo)

      this.logger.log(`deleted ${fileId}`);

      return true;
    } catch (error) {
      let err = `failed to delete ${fileId}`
      this.logger.error(err);
      this.logger.error(error);
      throw new BadGatewayException(err)
    }
  }
}
