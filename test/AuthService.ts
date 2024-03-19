
import { Amplify } from 'aws-amplify'
import { fetchAuthSession, getCurrentUser, signIn, type SignInInput } from 'aws-amplify/auth'


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_8PlanC4RS',
      userPoolClientId: 'iop3oa2enuo9h0n9k4ehnid9t',
    },
  },
})


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
      console.log(result)

      return result
    } catch (error) {
      console.log('Error je')

      console.log(error instanceof Error)
      console.log(error.message)

      console.log('error signing in', error)
      return undefined
    }
  }

  public async getCurrentUserInfo() {
    const { username, userId, signInDetails } = await getCurrentUser()

    return { username, userId, signInDetails }
  }

  public async getTokens() {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {}
    return idToken?.toString() // Return the token from the method
  }
}
