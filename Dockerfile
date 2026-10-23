FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS base
LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available
ARG GIT_BRANCH=not-available
ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_BRANCH=${GIT_BRANCH}

FROM base AS build
COPY package*.json .npmrc .allowed-scripts.mjs ./
COPY patches ./patches
RUN CYPRESS_INSTALL_BINARY=0 NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false npm run setup

COPY . .
RUN npm run build
RUN npm run record-build-info

FROM base AS development
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/build-info.json ./build-info.json
COPY --from=build --chown=appuser:appgroup /app/docker ./docker
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
ENV NODE_ENV='development'

FROM build AS prune
RUN npm prune --no-audit --no-fund --omit=dev

FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine-runtime AS production
WORKDIR /app

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available
ARG GIT_BRANCH=not-available
ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_BRANCH=${GIT_BRANCH}

COPY --from=prune --chown=appuser:appgroup /app/package.json /app/package-lock.json ./
COPY --from=prune --chown=appuser:appgroup /app/build-info.json ./build-info.json
COPY --from=prune --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=prune --chown=appuser:appgroup /app/docker ./docker
COPY --from=prune --chown=appuser:appgroup /app/dist ./dist

EXPOSE 3000 3001
ENV NODE_ENV='production'
USER 2000

CMD ["node", "dist/server.js"]
