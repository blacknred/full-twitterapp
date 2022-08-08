FROM redis/redis-stack-server:latest

ENV REDIS_ARGS "--requirepass test --save 60 1 --loglevel warning"

# CMD ["sh", "-c", "exec redis-server --requirepass \"$REDIS_PASSWORD\""]
