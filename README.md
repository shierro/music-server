# NodeJS Music Server

[![Code Standard](https://camo.githubusercontent.com/1c5c800fbdabc79cfaca8c90dd47022a5b5c7486/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d616972626e622d627269676874677265656e2e7376673f7374796c653d666c61742d737175617265)](https://github.com/airbnb/javascript)
[![Greenkeeper badge](https://badges.greenkeeper.io/shierro/music-server.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/shierro/music-server.svg?branch=master)](https://travis-ci.org/shierro/music-server)
[![Maintainability](https://api.codeclimate.com/v1/badges/a6fbd06ef529c7af570f/maintainability)](https://codeclimate.com/github/shierro/music-server/maintainability)
[![codecov](https://codecov.io/gh/shierro/music-server/branch/master/graph/badge.svg)](https://codecov.io/gh/shierro/music-server)
[![dependency status](https://david-dm.org/shierro/music-server/status.svg)](https://david-dm.org/shierro/music-server/status.svg)
[![devDependency status](https://david-dm.org/shierro/music-server/dev-status.svg)](https://david-dm.org/shierro/music-server/dev-status.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/shierro/music-server/badge.svg)](https://snyk.io/test/github/shierro/music-server)

- A stateless NodeJS app that leverages AWS S3 & serves music through a REST API

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
- Change .env vars with actual values
- Set `CREATE_BUCKET_IF_NOT_EXIST=true` to let the app create bucket on start-up. If not, make sure that value of S3_BUCKET_NAME is a bucket that exists

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
- [ ] Comment on all functions using jsdoc standards
- [ ] Integrate swagger for better API documentation
- [ ] Integrate jsdoc to auto-generate code documentation
- [ ] More unit tests. Make average 80% -> 95%+
- [ ] Secure APIs. JWT or oAuth2

