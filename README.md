# TwitterApp

Monolith boilerplate for Twitter type social network app

## Architecture

| Services    | Container | Stack                     | Ports  |
| ----------- | --------- | ------------------------- | ------ |
| Hot DB      | redis     | Redis stack               | 6379   |
| Cold DB     | mongo     | MongoDB                   | 27017  |
| Queue       | rabbitmq  | RabbitMQ                  | 5672   |
| API         | api       | TS, NestJs, REST, Swagger | 8080   |
| Dev Web     | web       | TS, NextJs, Tailwind      | 3000   |
| Proxy       | nginx     | Nginx, FE                 | 80/443 |

- this app is designed to be optimized for reading performance
- while microservices may be more convenient for such an application, a monolith is an intentional simplification

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/desktop/mac/install/) (if necessary)

### Build and Run the App

1. Set the Environment variables in .env.dev

1. Fire up the Containers

   ```sh
   make network
   make dev-check
   make dev
   ```

### Production

1. Set the Environment variables in .env

1. Run the containers:

   ```sh
   make network
   make prod-build
   make prod
   ```
