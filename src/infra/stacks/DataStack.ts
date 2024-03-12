import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, BillingMode, ITable, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { getSuffixFromStack } from '../Utils'

export class DataStack extends Stack {
  public readonly productsTable: Table

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const suffix = getSuffixFromStack(this)

    this.productsTable = new Table(this, 'ProductsTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: `ProductTable-${suffix}`,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    
    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'FeaturedIndex',
      partitionKey: {
        name: 'featured',
        type: AttributeType.NUMBER,
      },
      projectionType: ProjectionType.ALL, // Adjust projection type based on your needs
    })
  }
}
