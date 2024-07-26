FROM node:21-alpine AS builder

ARG GOOGLE_TAG
ARG ALGOLIA_ID
ARG ALGOLIA_KEY

ENV GOOGLE_TAG=$GOOGLE_TAG
ENV ALGOLIA_ID=$ALGOLIA_ID
ENV ALGOLIA_KEY=$ALGOLIA_KEY

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine AS runner

COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
