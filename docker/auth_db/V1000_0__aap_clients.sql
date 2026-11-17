-- AAP-UI auth_code client for the new authorization server
INSERT INTO oauth2_registered_client (id, client_id, client_id_issued_at, client_secret, client_secret_expires_at, client_name, client_authentication_methods, authorization_grant_types, redirect_uris, scopes, client_settings, token_settings, post_logout_redirect_uris)
VALUES ('aap-ui-auth-code', 'hmpps-arns-assessment-platform-ui', current_timestamp,
  '{bcrypt}$2a$10$lBwbziQlLfiCnn8Kj1PfMujEcLdsJYlYSNJvBRO638gCYTS9yN0xm', null,
  'hmpps-arns-assessment-platform-ui',
  'client_secret_basic', 'authorization_code,refresh_token',
  'http://localhost:3000,http://localhost:3000/sign-in/callback,http://localhost:3000/sign-in/hmpps-auth/callback,http://localhost:7072,http://localhost:7072/sign-in/callback,http://localhost:7072/sign-in/hmpps-auth/callback',
  'read,write',
  '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":false}',
  '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":true,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"],"settings.token.access-token-time-to-live":["java.time.Duration",3600.000000000],"settings.token.access-token-format":{"@class":"org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat","value":"self-contained"},"settings.token.refresh-token-time-to-live":["java.time.Duration",43200.000000000]}',
  null);

-- AAP-UI system client (client_credentials) for the new authorization server
INSERT INTO oauth2_registered_client (id, client_id, client_id_issued_at, client_secret, client_secret_expires_at, client_name, client_authentication_methods, authorization_grant_types, redirect_uris, scopes, client_settings, token_settings, post_logout_redirect_uris)
VALUES ('aap-ui-system', 'hmpps-arns-assessment-platform-ui-system', current_timestamp,
  '{bcrypt}$2a$10$lBwbziQlLfiCnn8Kj1PfMujEcLdsJYlYSNJvBRO638gCYTS9yN0xm', null,
  'hmpps-arns-assessment-platform-ui-system',
  'client_secret_basic', 'client_credentials',
  null, 'read,write',
  '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":false}',
  '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":true,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"],"settings.token.access-token-time-to-live":["java.time.Duration",1200.000000000],"settings.token.access-token-format":{"@class":"org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat","value":"self-contained"},"settings.token.refresh-token-time-to-live":["java.time.Duration",600.000000000]}',
  null);

-- Authorities/roles for the system client (replaces old 'authorities' column)
INSERT INTO oauth2_authorization_consent (registered_client_id, principal_name, authorities)
VALUES ('aap-ui-system', 'hmpps-arns-assessment-platform-ui-system', 'ROLE_AAP__FRONTEND_RW,ROLE_STRENGTHS_AND_NEEDS_OASYS');

-- Authorities/roles for the coordinator API client (equivalent of the UPDATE above)
UPDATE oauth2_authorization_consent
SET authorities = 'ROLE_STRENGTHS_AND_NEEDS_OASYS,ROLE_STRENGTHS_AND_NEEDS_READ,ROLE_STRENGTHS_AND_NEEDS_WRITE,ROLE_AAP__COORDINATOR_RW'
WHERE principal_name = 'hmpps-assess-risks-and-needs-oastub-ui';
