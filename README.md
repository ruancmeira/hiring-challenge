<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Installation

To run in containers follow this steps:

```bash
$ docker compose up --build -d
```

Database is MySQL, used Prisma for ORM. Database run in port 9696.

Application is a NestJS and run in port 3000 - API Rest with documentation swagger in http://localhost:3000/docs.

To run in terminal follow this steps:

```bash
$ npm install

$ npx prisma generate

$ npx prisma migrate deploy
```

## Running the app

```bash
# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
