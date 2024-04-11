import { Stack, StackProps } from 'aws-cdk-lib'
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
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

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    }

     const optionsWithCors: ResourceOptions = {
       defaultCorsPreflightOptions: {
         allowOrigins: Cors.ALL_ORIGINS,
         allowMethods: Cors.ALL_METHODS,
       },
     }

    // Attach the authorizer to your API Gateway
    authorizer._attachToApi(api)

    const productsResource = api.root.addResource('products', optionsWithCors)
    productsResource.addMethod('GET', props.productsLambdaIntegration)
    productsResource.addMethod(
      'POST',
      props.productsLambdaIntegration,
      // optionsWithAuth,
      
    )
    productsResource.addMethod(
      'PUT',
      props.productsLambdaIntegration,
      // optionsWithAuth
    )

    productsResource.addMethod(
      'DELETE',
      props.productsLambdaIntegration,
      // optionsWithAuth
    )
  }
}
