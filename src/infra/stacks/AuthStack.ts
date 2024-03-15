import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AccountRecovery, CfnUserPoolGroup, OAuthScope, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { ESHOP_NAME } from '../../../env'

export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const cognito = new UserPool(this, `${ESHOP_NAME}-UserPool`, {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: false,
      },
      standardAttributes: {
        email: {
          required: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const userPoolClient = new UserPoolClient(this, `${process.env.ESHOP_NAME}Client`, {
      userPool: cognito,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:5173'],
      },
    })

    const adminGroup = new CfnUserPoolGroup(this, 'admins', {
      userPoolId: cognito.userPoolId,
      groupName: `admins`,
      description: 'Group for users who were registered through Foo',
    })

     
    new CfnOutput(this, 'AdminGroupsId', {
      value: adminGroup.ref,
    })
    
    new CfnOutput(this, 'UserPoolId', {
       value: cognito.userPoolId || '',
     })

     new CfnOutput(this, 'UserPoolClientId', {
       value: userPoolClient.userPoolClientId || '',
     })

  }
}