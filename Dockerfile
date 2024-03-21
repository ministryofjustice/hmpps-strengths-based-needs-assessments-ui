FROM cypress/included:latest
RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000
COPY . /e2e
WORKDIR /e2e
RUN npm ci
USER 2000
ENTRYPOINT ["/bin/bash"]
