# TwitterApp

Monolith boilerplate for Twitter type social network app

## Architecture

| Services    | Container | Stack                  | Ports |
| ----------- | --------- | ---------------------- | ----- |
| DB          | redis     | Redis stack            | 6379  |
| Archive     | postgres  | Postgres               | 5432  |
| Queue       | rabbitmq  | RabbitMQ               | 5672  |
| API service | api       | TS, NestJS, Http, REST | 8080  |
| Web client  | web       | TS, React, Tailwind    | 3000  |

- while microservices may be more convenient for such an application, a monolith is an intentional simplification
- for a real world scenario you definitely need an easily sharded nosql db instead of rdbms
- this app is designed to be optimized for reading performance

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
