import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { CloudFrontWebDistribution, Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront'
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'
import { existsSync } from 'fs'
import { join } from 'path'
import { getSuffixFromStack } from '../Utils'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { ESHOP_NAME } from '../../../env'

// New deployment
// www.luminis.eu/blog/hosting-a-static-react-website-on-amazon-s3-with-cdk/

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const suffix = getSuffixFromStack(this)

    const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
      bucketName: `${ESHOP_NAME}-frontend-${suffix}`,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const uiDir = join(__dirname, '..', '..', '..', '..', 'frontend', 'dist')

    if (!existsSync(uiDir)) {
      console.warn('Ui directory not found: ' + uiDir)
      return
    }
    new BucketDeployment(this, `${ESHOP_NAME}-ui-deployment`, {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    })
    // Export the bucket website URL
    new CfnOutput(this, `${ESHOP_NAME}-ui-deploymentS3Url`, {
      value: deploymentBucket.bucketWebsiteUrl,
    })

    const originIdentity = new OriginAccessIdentity(
      this,
      'OriginAccessIdentity'
    )
    deploymentBucket.grantRead(originIdentity)
    const distribution = new Distribution(this, `${ESHOP_NAME}-Distribution`, {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    })
    new CfnOutput(this, `${ESHOP_NAME}-Url`, {
      value: distribution.distributionDomainName,
    })
  }
}
