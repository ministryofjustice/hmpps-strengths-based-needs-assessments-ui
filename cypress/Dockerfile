FROM cypress/browsers:node-20.11.1-chrome-123.0.6312.58-1-ff-124.0-edge-122.0.2365.92-1
RUN mkdir /e2e
WORKDIR /e2e
COPY . .
SHELL ["/bin/sh", "-c"]
RUN npm i --no-audit
RUN npx cypress install
ENTRYPOINT ["npx", "cypress", "run", "--browser", "chrome", "--headless"]
