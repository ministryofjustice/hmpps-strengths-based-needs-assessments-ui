const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    response: number
    deadline: number
  }
  agent: AgentConfig
}

export default {
  production,
  https: get('HTTPS', `${production}`) === 'true',
  staticResourceCacheDuration: 20,
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    sbnaApi: {
      url: get('SBNA_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('SBNA_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('SBNA_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('SBNA_API_TIMEOUT_RESPONSE', 10000))),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    arnsHandover: {
      url: get('HMPPS_ARNS_HANDOVER_URL', 'http://localhost:8080/oauth2/authorize', requiredInProduction),
      externalUrl: get(
        'HMPPS_ARNS_HANDOVER_EXTERNAL_URL',
        get('HMPPS_ARNS_HANDOVER_URL', 'http://localhost:9090/auth'),
      ),
      timeout: {
        response: Number(get('HMPPS_ARNS_HANDOVER_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_ARNS_HANDOVER_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_ARNS_HANDOVER_TIMEOUT_RESPONSE', 10000))),
      clientId: get('HANDOVER_CLIENT_ID', 'clientid', requiredInProduction),
      clientSecret: get('HANDOVER_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    appInsights: {
      connectionString: get('APPLICATIONINSIGHTS_CONNECTION_STRING', null, requiredInProduction),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  oasysUrl: get('OASYS_URL', 'http://localhost:7072', requiredInProduction),
  deploymentName: get('DEPLOYMENT_NAME', ''),
  maintenance: {
    start: Number(get('MAINTENANCE_START_TIMESTAMP_SECONDS', 0)),
    end: Number(get('MAINTENANCE_END_TIMESTAMP_SECONDS', 0)),
    unplanned: get('MAINTENANCE_UNPLANNED', 'false') === 'true',
  },
  feedbackUrl: get('FEEDBACK_URL', null),
}
