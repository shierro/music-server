# NodeJS Music Server

[![Greenkeeper badge](https://badges.greenkeeper.io/shierro/music-server.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/shierro/music-server.svg?branch=master)](https://travis-ci.org/shierro/music-server)
[![Maintainability](https://api.codeclimate.com/v1/badges/a6fbd06ef529c7af570f/maintainability)](https://codeclimate.com/github/shierro/music-server/maintainability)
[![codecov](https://codecov.io/gh/shierro/music-server/branch/master/graph/badge.svg)](https://codecov.io/gh/shierro/music-server)
[![dependency status](https://david-dm.org/shierro/music-server/status.svg)](https://david-dm.org/shierro/music-server/status.svg)
[![devDependency status](https://david-dm.org/shierro/music-server/dev-status.svg)](https://david-dm.org/shierro/music-server/dev-status.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/shierro/music-server/badge.svg)](https://snyk.io/test/github/shierro/music-server)

- Stateless NodeJS app to manage & serve music data(from AWS S3) using REST APIs

## Available endpoints
*name* | `description` |  Method |   
--- | --- | --- | 
`<BASE>/api/songs` | Get all songs available | **GET**
`<BASE>/api/songs/:key` | Get a song using it's key | **GET**
`<BASE>/api/songs/:key/metadata` | Get a song's metadata using it's key | **GET**
`<BASE>/api/songs` | Upload song(s) | **POST**

## Requirements
 - NodeJS v7.6+
 - Yarn
 - AWS Account (to leverage S3)

## Install
```
$ git clone https://github.com/shierro/music-server
$ cd music-server && yarn install
```

## Set your Environment vars (important)
```
$ cp .env.example .env
```
- Change .env vars with your env
- Set `CREATE_BUCKET_IF_NOT_EXIST=true` to let the app create bucket on start-up (optional) if not, make sure that value of S3_BUCKET_NAME exists

## Dev mode
```
$ yarn dev
```

## Unit test & generate coverage
```
$ yarn run cover
```

## Prod mode w/ docker-compose
```
$ docker-compose up -d
```

## Things to improve
- [ ] Integrate swagger for better API documentation
- [ ] Integrate JSDOC for code-level documentation
- [ ] More unit tests. Make average 80% -> 95%+
- [ ] Secure APIs. JWT or oAuth2

