import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import {
  AccountRecovery,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  OAuthScope,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'
import { ESHOP_NAME } from '../../../env'
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from 'aws-cdk-lib/aws-iam'
import { IBucket } from 'aws-cdk-lib/aws-s3'

export class AuthStack extends Stack {
  public userPool: UserPool
  private userPoolClient: UserPoolClient
  private identityPool: CfnIdentityPool
  private authenticatedRole: Role
  private unAuthenticatedRole: Role
  private adminRole: Role

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.createUserPool()
    this.createUserPoolClient()
    this.createIdentityPool()
    this.createRoles()
    this.attachRoles()
    this.createAmdinsGroup()
  }

  private createUserPool() {
    this.userPool = new UserPool(this, `${ESHOP_NAME}-UserPool`, {
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

    new CfnOutput(this, `${ESHOP_NAME}-UserPoolId`, {
      value: this.userPool.userPoolId,
    })
  }
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient(
      `${ESHOP_NAME}-UserPoolClient`,
      {
        enableTokenRevocation: true,
        accessTokenValidity: Duration.minutes(60),
        refreshTokenValidity: Duration.days(1),
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
          logoutUrls: ['http://localhost:5173/'], // TODO Add your logout URL here
          scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
          callbackUrls: ['http://localhost:5173'],
        },
      }
    )
    new CfnOutput(this, `${ESHOP_NAME}-UserPoolClientId`, {
      value: this.userPoolClient.userPoolClientId,
    })
  }

  private createAmdinsGroup() {
    const adminGroup = new CfnUserPoolGroup(this, 'admins', {
      userPoolId: this.userPool.userPoolId,
      groupName: `admins`,
      description: 'Group of Admins',
      roleArn: this.adminRole.roleArn,
    })
    // Export the groupName
    new CfnOutput(this, 'AdminGroupName', {
      value: adminGroup.ref,
      exportName: 'AdminGroupName',
    })
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(
      this,
      `${ESHOP_NAME}IdentityPool`,
      {
        allowUnauthenticatedIdentities: true,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
      }
    )
    new CfnOutput(this, `${ESHOP_NAME}-IdentityPoolId`, {
      value: this.identityPool.ref,
    })
  }

  private createRoles() {
    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    })
    this.unAuthenticatedRole = new Role(
      this,
      'CognitoDefaultUnauthenticatedRole',
      {
        assumedBy: new FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity'
        ),
      }
    )
    this.adminRole = new Role(this, 'CognitoAdminRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    })
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:ListAllMyBuckets'],
        resources: ['*'],
      })
    )
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    })
  }
}
