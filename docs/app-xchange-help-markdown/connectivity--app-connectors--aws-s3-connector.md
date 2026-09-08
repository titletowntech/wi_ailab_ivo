# AWS S3 Connector

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/connectivity/app-connectors/aws-s3-connector
> Captured directly from rendered HTML: 2026-08-14

The Amazon Web Services Simple Storage Service (AWS S3)
        connector enables App Xchange users to securely
        upload files to an AWS S3 bucket.

Note: At this time this connector only enables upload via
                        presigned URL. Please use your customer portal or contact sales if you are
                        interested in expanded functionality

The [AWS S3](https://aws.amazon.com/s3/) connector uses a pre-signed URL
                        to upload files to an AWS S3 bucket. For more information, see [Sharing objects with presigned
                                URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html) in the AWS Documentation.

For each file, include this pre-signed URL in the input of a connector action
                        flow step. Do not include any authorization.

This connector currently handles only one data object: an Id property, which is a universally
                        unique identifier (UUID) string.

To provide the file information for upload:

Source: Choose appNetwork for
                        legacy file handling or public for File Pointers.

url: Enter the URL to download the file that we send to
                        AWS. If using public, use the File Pointer Location.
                        If using AppNetwork as Source, this value can be the URL or the FileID

## User Access

This product does not yet provide a development
                                environment. You must setup your own test environment.

To create a new AWS S3 environment, you can
                                either follow the steps in Amazon’s [Getting
                                        Started Guide](https://aws.amazon.com/s3/getting-started/) or emulate an AWS S3 environment
                                locally using a tool like LocalStack.

## Engagement and Training

                        If you would
                                        like to request enhancements to this connector, select
                                                Request Connector Enhancement at the
                                                [App Xchange Connector Directory](https://appxchange.trimble.com/connectors). If you
                                        would like additional training, please visit your customer
                                        portal. If you would like assistance with the connected
                                        product, see the following:
- [AWS
                                                    Skillbuilder](https://skillbuilder.aws/)
- [AWS
                                                    re:Post](https://repost.aws/)

## Technical Documentation

For details about this product, see [Amazon
                                        Simple Storage Service User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html).

Connector
                                Endpoints

                        The documentation below contains an OpenAPI
                                description (OAD) of each module in this connector.Note:  OADs are
                                provided to offer a basic overview of coverage and capabilities. The
                                API and endpoints documented are used internally by the platform and
                                        *not* directly by end
                                users.

- [App v1](https://api.xchange.trimble.com/connect/v1/direct/aws-s3/app/1/swagger/index.html?p=59c5d2f6-4fc7-49b8-9a52-332e209e4fb9)

## User Support

If you
                                encounter a problem or need support for this connector, [create an App Xchange
                                        product case](https://help.trimble.com/doc/app-xchange/app-xchange/app-xchange-support) through the Trimble Support
                        Center.
