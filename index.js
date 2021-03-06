'use strict';

const http = require( 'http' );

module.exports = ( _options, request, response ) => {
    if ( _options instanceof http.ServerResponse ) {
        response = _options;
        request = {};
        _options = null;
    }
    else if ( _options instanceof http.ClientRequest ) {
        response = request;
        request = _options;
        _options = null;
    }
    else if ( request instanceof http.ServerResponse ) {
        response = request;
        request = {};
    }

    const options = Object.assign( {
        max_age: 60 * 60 * 24, // 24 hours
        origin: '*',
        allow_methods: [
            'POST',
            'GET',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS'
        ],
        allow_headers: [
            'X-Requested-With',
            'Access-Control-Allow-Origin',
            'X-HTTP-Method-Override',
            'Content-Type',
            'Authorization',
            'Accept',
            'Cookie'
        ],
        expose_headers: [
            'Authorization',
            'Set-Cookie'
        ],
        credentials: true
    }, _options );

    const origin_header_value = request.headers && request.headers.origin;
    const has_origin_header = typeof origin_header_value === 'string';

    let origin = null;

    if ( typeof options.origin === 'string' ) {
        origin = options.origin;
    }
    else if ( has_origin_header ) {
        if ( options.origin instanceof RegExp ) {
            origin = options.origin.test( origin_header_value ) ? origin_header_value : null;
        }
        else if ( Array.isArray( options.origin ) ) {
            origin = options.origin.includes( origin_header_value ) ? origin_header_value : null;
        }
    }

    if ( origin !== null ) {
        response.setHeader( 'Access-Control-Allow-Origin', origin );
    }

    if ( options.credentials ) {
        response.setHeader( 'Access-Control-Allow-Credentials', 'true' );
    }

    response.setHeader( 'Access-Control-Max-Age', `${ options.max_age }` );
    response.setHeader( 'Access-Control-Allow-Methods', options.allow_methods.join( ',' ) );
    response.setHeader( 'Access-Control-Allow-Headers', options.allow_headers.join( ',' ) );
    response.setHeader( 'Access-Control-Expose-Headers', options.expose_headers.join( ',' ) );
};