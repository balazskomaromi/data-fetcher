import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

import {fetchRequests} from './store.js';

export const uploadToS3 = async (fetchRequestId, data) => {
  console.log(`Uploading to S3: ${fetchRequestId}, ${data}`)
  // const {config} = fetchRequests.get(fetchRequestId);
  // const {destination} = config;

  // const client = new S3Client({ region: destination.region });

  // client.send(new PutObjectCommand({bucketName: destination.bucket, Key: destination.key, Body: data}));
  console.log(`Uploaded fetched data to S3: ${fetchRequestId}, ${data}`)

}
