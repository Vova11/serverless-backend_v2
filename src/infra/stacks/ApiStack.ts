import { Stack, StackProps } from 'aws-cdk-lib'
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import { IUserPool } from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

interface ApiStackProps extends StackProps {
  helloLambdaIntegration: LambdaIntegration
  productsLambdaIntegration: LambdaIntegration
  userPool: IUserPool
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const api = new RestApi(this, 'ProductsApi')

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      'ProductsApiAuthorizer',
      {
        cognitoUserPools: [props.userPool],
        identitySource: 'method.request.header.Authorization',
      }
    )
    authorizer._attachToApi(api)

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    }

    const productsResource = api.root.addResource('products')
    productsResource.addMethod('GET', props.productsLambdaIntegration)
    productsResource.addMethod(
      'POST',
      props.productsLambdaIntegration,
      optionsWithAuth
    )
    productsResource.addMethod(
      'PUT',
      props.productsLambdaIntegration,
      optionsWithAuth
    )

    productsResource.addMethod(
      'DELETE',
      props.productsLambdaIntegration,
      optionsWithAuth
    )
  }
}
