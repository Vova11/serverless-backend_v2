import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

interface LambdaStackProps extends StackProps {
  productsTable: ITable
}

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration
  public readonly productsLambdaIntegration: LambdaIntegration

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props)

    const productsLambda = new NodejsFunction(this, 'ProductsLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '..',
        '..',
        'services',
        'products',
        'handler.ts'
      ),
      environment: {
        TABLE_NAME: props.productsTable.tableName,
      },
    })

     productsLambda.addToRolePolicy(
       new PolicyStatement({
         effect: Effect.ALLOW,
         resources: [
           props.productsTable.tableArn,
           `${props.productsTable.tableArn}/index/*`, // GSI ARN
         ],
         actions: [
           'dynamodb:PutItem',
           'dynamodb:Scan',
           'dynamodb:GetItem',
           'dynamodb:UpdateItem',
           'dynamodb:DeleteItem',
           'dynamodb:Query', // Add this line for the Query action
         ],
       })
     )

    //TEST LAMBDA
    const helloLambda = new NodejsFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(
        __dirname,
        '..',
        '..',
        'services',
        'basicLambda',
        'hello.ts'
      ),
      environment: {
        TABLE_NAME: props.productsTable.tableArn,
      },
    })

    helloLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:ListAllMyBuckets', 's3:ListBucket'],
        resources: ['*'], //TODO  bad practice
      })
    )

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda)
    this.productsLambdaIntegration = new LambdaIntegration(productsLambda)
  }
}
