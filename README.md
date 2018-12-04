# simple CORS

## Summary

Simple [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) method to control response headers.

## Install

```
npm install -P corsable
```

## Usage

```js
const corsable = require( 'corsable' );
const micro = require( 'micro' ); // or your chosen framework

const simple_handler = ( request, response ) => {
    corsable( response );

    micro.send( response, 200, 'this is a CORS-enabled response' );
};

const configured_handler = ( request, response ) => {
    corsable( {
        max_age: 3600,
        origin: 'somedomain.com',
        allow_methods: [ 'POST', 'PUT', 'GET', 'DELETE' ],
        allow_headers: [ 'Access-Control-Allow-Origin', 'Content-Type', 'Authorization','Accept' ],
        expose_headers: [ 'Authorization' ]
    }, response );

    micro.send( response, 200, 'this is a CORS-enabled and configured response' );
};

const origin_list_handler = ( request, response ) => {
    corsable( {
        origin: [ 'domain.com', 'otherdomain.com' ]
    }, request, response );

    micro.send( response, 200, 'this is a CORS-enabled response that respects a list of origins' );
};

const origin_regex_handler = ( request, response ) => {
    corsable( {
        origin: new RegExp( 'https\:\/\/(?:.*\.)?somedomain\.com', 'i' )
    }, request, response );

    micro.send( response, 200, 'this is a CORS-enabled response that requires an https origin that matches (*.)somedomain.com' );
};
```

Or, you can create some middleware (micro-compatible example, but should work for others as well):

```js
const corsable = require( 'corsable' );
const middleware = options => handler => ( request, response ) => {
    corsable( options, response );
    return handler( request, response );
};

const cors = middleware( {
    max_age: 3600
} );

module.exports = cors( ( request, response ) => {
    // do your CORS-compatible thing
} );
```

## Options

### `max_age` (Access-Control-Max-Age) [integer]

default: `86400`

### `origin` (Access-Control-Allow-Origin) [string, array, regexp]

default: `*`

### `allow_methods` (Access-Control-Allow-Methods) [array]

default: `[
    'POST',
    'GET',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
]`

### `allow_headers` (Access-Control-Allow-Headers) [array]

default: `[
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Authorization',
    'Accept'
]`

### `expose_headers` (Access-Control-Expose-Headers) [array]

default: `[]`
