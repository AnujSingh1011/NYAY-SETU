.PHONY: dev stop build logs clean

dev:
docker compose up --build

stop:
docker compose down

build:
docker compose build --no-cache

logs:
docker compose logs -f frontend

clean:
docker compose down -v --remove-orphans
docker image rm nyay-setu-frontend 2>/dev/null || true
