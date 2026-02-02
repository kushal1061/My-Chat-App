const {
  getSignedUrl,
  S3RequestPresigner,
} =require( "@aws-sdk/s3-request-presigner");
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY,
  },
});
module.exports =async ({ region, bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};
