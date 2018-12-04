'use strict';

const corsable = require( './index.js' );
const fetch = require( 'node-fetch' );
const listen = require( 'test-listen' );
const micro = require( 'micro' );
const test = require( 'tape-async' );

const METHODS = [
    'POST',
    'PUT',
    'PATCH',
    'GET',
    'DELETE',
    'OPTIONS'
];

test( 'defaults', async t => {
    for ( let method of METHODS ) {
        const router = micro( ( request, response ) => {
            corsable( response );
            return {};
        } );
        const url = await listen( router );

        const response = await fetch( url, {
            method: method
        } );

        t.equal( response && response.headers && response.headers.get( 'access-control-max-age' ), '86400', `${ method } / access-control-max-age` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-origin' ), '*', `${ method } / access-control-allow-origin` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-methods' ), 'POST,GET,PUT,PATCH,DELETE,OPTIONS', `${ method } / access-control-allow-methods` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-headers' ), 'X-Requested-With,Access-Control-Allow-Origin,X-HTTP-Method-Override,Content-Type,Authorization,Accept', `${ method } / access-control-allow-headers` );
        t.equal( response && response.headers && response.headers.get( 'access-control-expose-headers' ), '', `${ method } / access-control-expose-headers` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-credentials' ), 'true', `${ method } / access-control-allow-credentials` );

        await router.close();
    }

    t.end();
} );

test( 'configured', async t => {
    for ( let method of METHODS ) {
        const router = micro( ( request, response ) => {
            corsable( {
                max_age: 3600,
                origin: 'foo.com',
                allow_methods: [ 'POST', 'PUT', 'GET', 'DELETE' ],
                allow_headers: [ 'foo' ],
                expose_headers: [ 'foo' ],
                credentials: false
            }, response );
            return {};
        } );
        const url = await listen( router );

        const response = await fetch( url, {
            method: method
        } );

        t.equal( response && response.headers && response.headers.get( 'access-control-max-age' ), '3600', `${ method } / access-control-max-age` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-origin' ), 'foo.com', `${ method } / access-control-allow-origin` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-methods' ), 'POST,PUT,GET,DELETE', `${ method } / access-control-allow-methods` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-headers' ), 'foo', `${ method } / access-control-allow-headers` );
        t.equal( response && response.headers && response.headers.get( 'access-control-expose-headers' ), 'foo', `${ method } / access-control-expose-headers` );
        t.equal( response && response.headers && response.headers.get( 'access-control-allow-credentials' ), null, `${ method } / access-control-allow-credentials` );

        await router.close();
    }

    t.end();
} );
