FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install Chromium and required dependencies
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Set environment variables for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_CACHE_DIR=/home/web/.cache

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=s/2274a069-dbb0-401a-915c-6856a11dd41c-/root/local/share/pnpm/store/v3,target=/root/.local/share/pnpm/store/v3 pnpm i --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=server --prod /prod/server
RUN pnpm deploy --filter=client --prod /prod/client

FROM base AS server
COPY --from=build /prod/server /prod/server
COPY --from=build /prod/client /prod/client
WORKDIR /prod/server
# EXPOSE 8000
CMD [ "pnpm", "start" ]
