# Connect AWS S3 in App Xchange

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/app-connectors/aws-s3-connector/connect-aws-s3-in-app-xchange
> Captured directly from rendered HTML: 2026-08-14

Before you can use AWS S3 with App Xchange, the AWS S3 object owner must generate a
        pre-signed URL.

        The AWS S3 connector
            only requires a pre-signed URL to upload files to an AWS S3 bucket. For each file,
            include this pre-signed URL in the input of a connector action flow step. Do not include
            any authorization.

For instructions, see [Sharing objects with
                    presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html) in the AWS Documentation.
