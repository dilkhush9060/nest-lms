import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { Constants } from './constants';

@Injectable()
export class MediaService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: Constants.AWS_S3_REGION,
      endpoint: Constants.AWS_S3_ENDPOINT,
      credentials: {
        accessKeyId: Constants.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: Constants.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }

  // get presigned url for upload
  async getPresignedUrl(data: { folder: string; Key: string }) {
    const params = {
      Bucket: Constants.S3_BUCKET_NAME,
      Key: `${data.folder}/${data.Key}`,
    };

    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5,
    });
    if (!url) {
      throw new BadGatewayException('Failed to generate presigned URL');
    }

    return {
      url,
      key: params.Key,
    };
  }

  // delete object from s3 bucket
  async deleteObject(key: string) {
    const params = {
      Bucket: Constants.S3_BUCKET_NAME,
      Key: key,
    };

    const res = await this.s3Client.send(new DeleteObjectCommand(params));
    if (res.$metadata.httpStatusCode === 204) {
      return true;
    } else {
      throw new BadGatewayException('Failed to delete object from S3 bucket');
    }
  }
}
