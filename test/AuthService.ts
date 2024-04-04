import { Amplify } from 'aws-amplify'

import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  type SignInInput,
} from 'aws-amplify/auth'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_GjNMoVQgj',
      userPoolClientId: '3jmo15li012k3regn5ocbmctec',
      identityPoolId: 'eu-central-1:300f53a5-4d41-41d7-b832-f4ddb251b6c7',
    },
  },
})

const awsRegion = 'eu-central-1'

export class AuthService {
  public userName: string
  public token

  public async login({ username, password }: SignInInput) {
    try {
      const result = await signIn({
        username: username,
        password: password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      })
      return result
    } catch (error) {
      console.log('Error je')
      return undefined
    }
  }

  public async getCurrentUserInfo() {
    const { username, userId, signInDetails } = await getCurrentUser()
    console.log(signInDetails)

    return { username, userId, signInDetails }
  }

  public async getTokens() {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {}
    console.log('Access Token')
    return { accessToken, idToken } // Return the token from the method
  }

  public async generateTemporaryCredentials(user) {
    if (user.isSignedIn !== true) {
      return new Error('User is not signed in')
    }

    const { idToken } = await this.getTokens()

    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/eu-central-1_QEu3Nvq6D`
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'eu-central-1:d4b141a7-ed5e-4929-99b5-bf0cfd60bf8d',
        logins: {
          [cognitoIdentityPool]: idToken.toString(),
        },
      }),
    })
    const credentials = await cognitoIdentity.config.credentials()
    return credentials
  }
}
