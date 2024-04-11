import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import {
  AttributeType,
  BillingMode,
  ITable,
  ProjectionType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { getSuffixFromStack } from '../Utils'
import {
  Bucket,
  BucketAccessControl,
  HttpMethods,
  IBucket,
  ObjectOwnership,
} from 'aws-cdk-lib/aws-s3'
import { ESHOP_NAME } from '../../../env'

export class DataStack extends Stack {
  public readonly productsTable: Table
  public readonly photosBucket: IBucket

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const suffix = getSuffixFromStack(this)

    this.photosBucket = new Bucket(this, `${ESHOP_NAME}ProductPhotos`, {
      bucketName: `${ESHOP_NAME}-product-photos-${suffix}`,
      cors: [
        {
          allowedMethods: [
            HttpMethods.HEAD,
            HttpMethods.GET,
            HttpMethods.PUT,
            HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'], //TODO
          allowedHeaders: ['*'], //TODO
        },
      ],
      // accessControl: BucketAccessControl.PUBLIC_READ, // currently not working,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: RemovalPolicy.DESTROY, // Set removal policy to destroy //TODO for prod
      autoDeleteObjects: true, //TODO for prod
    })

    new CfnOutput(this, `${ESHOP_NAME}ProductPhotosBucketName`, {
      value: this.photosBucket.bucketName,
    })

    this.productsTable = new Table(this, 'OnlineShop', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING,
      },
      tableName: `ProductTable-${suffix}`,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'GSI_IsFeatured',
      partitionKey: {
        name: 'isFeatured',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL, // Adjust projection type based on your needs
    })

    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'GSI_PublishedProduct',
      partitionKey: {
        name: 'entity',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'published',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL, // Adjust projection type based on your needs
    })
  }
}
