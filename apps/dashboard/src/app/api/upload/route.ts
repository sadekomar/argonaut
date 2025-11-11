import { S3Client } from "@aws-sdk/client-s3";
import {
  createUploadRouteHandler,
  route,
  type Router,
} from "better-upload/server";

const s3 = new S3Client();

const router: Router = {
  client: s3,
  bucketName: "argonaut-bucket-200-crm",
  routes: {
    images: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFiles: 4,
    }),
    form: route({
      multipleFiles: true,
      maxFiles: 5,
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);
