# feathers-server

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/feathers-server
    npm install
    ```

3. Start your app

    ```
    npm run migrate # Run migrations to set up the database
    npm start
    ```

## MySQL com Docker

1. Suba o banco MySQL em container (na pasta `src/feathers-server`):

    ```
    npm run docker:mysql:up
    ```

2. As variáveis de conexão ficam no arquivo `.env`.

3. Rode as migrations e inicie a API:

    ```
    npm run migrate
    npm run dev
    ```

4. Para derrubar os containers:

    ```
    npm run docker:mysql:down
    ```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
