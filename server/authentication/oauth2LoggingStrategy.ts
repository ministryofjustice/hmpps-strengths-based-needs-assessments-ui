import OAuth2Strategy, { InternalOAuthError, TokenError } from 'passport-oauth2'
import util from 'util'

declare class OAuth2LoggingStrategy extends OAuth2Strategy {
  constructor(options: OAuth2Strategy.StrategyOptions, verify: OAuth2Strategy.VerifyFunction)

  constructor(options: OAuth2Strategy.StrategyOptionsWithRequest, verify: OAuth2Strategy.VerifyFunctionWithRequest)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, no-underscore-dangle
  _createOAuthError(message: string, err: any): any
}

function OAuth2LoggingStrategy(
  this: OAuth2Strategy,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  options: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  verify: any,
): void {
  OAuth2Strategy.call(this, options, verify)
}

util.inherits(OAuth2LoggingStrategy, OAuth2Strategy)

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-underscore-dangle
OAuth2LoggingStrategy.prototype._createOAuthError = function _createOAuthError(message: string, err: any) {
  let e = null
  if (err) {
    // eslint-disable-next-line no-console
    console.warn(`Create OAuthError [${message}] for err: ${JSON.stringify(err)}`)

    if (err.statusCode && err.data) {
      try {
        const json = JSON.parse(err.data)
        if (json.error) {
          e = new TokenError(json.error_description, json.error, json.error_uri)
        }
      } catch (e2) {
        // eslint-disable-next-line no-console
        console.error(`Unable to parse Error response: ${JSON.stringify(e2)}`)
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Create OAuthError [${message}] for err: undefined`)
  }

  if (!e) {
    e = new InternalOAuthError(message, err)
  }

  return e
}

export default OAuth2LoggingStrategy
