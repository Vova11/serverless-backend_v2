import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import { HttpMethods } from 'aws-cdk-lib/aws-s3'
import { existsSync } from 'fs'
import { join } from 'path'
import { getSuffixFromStack } from '../Utils'


export class StaticSiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const suffix = getSuffixFromStack(this)
    
    const websiteBucket = new s3.Bucket(this, `WebsiteBucket-1249jsbdjdsbdj`, {
      bucketName: `my-website-bucket-${suffix}`,
      publicReadAccess: false, // no public access, user must access via cloudfront
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ['*'],
          exposedHeaders: [],
        },
      ],
    })

    const identity = new cloudfront.OriginAccessIdentity(
      this,
      'OriginAccessIdentityId'
    )

    websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [websiteBucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            identity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    )

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'cloudfront',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: identity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],

        defaultRootObject: 'index.html',
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
      }
    )

    const uiDir = join(__dirname, '..', '..', '..', '..', 'frontend', 'dist')

    if (!existsSync(uiDir)) {
      console.warn('Ui directory not found: ' + uiDir)
      return
    }

    new s3deploy.BucketDeployment(this, `DeployWebsite-1249jsbdjdsbdj`, {
      sources: [s3deploy.Source.asset(uiDir)],
      destinationBucket: websiteBucket,
      distribution,
    })

    // Export the bucket website URL
    new CfnOutput(this, 'DeployWebsiteS3Url', {
      value: websiteBucket.bucketWebsiteUrl,
    })

    new CfnOutput(this, 'website-Url', {
      value: distribution.distributionDomainName,
    })
  }
}
