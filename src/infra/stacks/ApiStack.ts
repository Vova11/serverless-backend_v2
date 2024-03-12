import { Stack, StackProps } from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'


interface ApiStackProps extends StackProps {
  helloLambdaIntegration: LambdaIntegration
  productsLambdaIntegration: LambdaIntegration
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const api = new RestApi(this, 'ProductsApi')
    const productsResource = api.root.addResource('products')
    productsResource.addMethod('GET', props.productsLambdaIntegration)
    productsResource.addMethod('POST', props.productsLambdaIntegration)
  }
}
