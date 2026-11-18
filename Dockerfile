# Container image for the Grundtone documentation site (VitePress, @grundtone/docs).
# Build context is the repository root. Used by the local Tilt stack
# (docker-compose.tilt.yml); it serves the static build on port 6006.

FROM node:24-alpine AS build
WORKDIR /src
RUN corepack enable
COPY . .
# --ignore-scripts: skips the husky `prepare` hook (no .git in the image).
RUN pnpm install --frozen-lockfile --ignore-scripts --filter "@grundtone/docs..."
RUN pnpm exec turbo run build --filter=@grundtone/docs

FROM nginxinc/nginx-unprivileged:alpine
COPY docker/docs.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/apps/docs/.vitepress/dist /usr/share/nginx/html
EXPOSE 6006
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:6006/"]
