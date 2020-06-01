FROM hayd/alpine-deno:1.0.0

EXPOSE 8000

WORKDIR /app

USER deno

COPY . . 
RUN deno cache main.ts

CMD ["run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "--allow-plugin", "--unstable", "main.ts"]