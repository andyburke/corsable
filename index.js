'use strict';

module.exports = ( _options, response ) => {
    if ( typeof response === 'undefined' ) {
        response = _options;
        _options = {};
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
            'Accept'
        ],
        expose_headers: [],
        credentials: true
    }, _options );

    response.setHeader( 'Access-Control-Max-Age', `${ options.max_age }` );
    response.setHeader( 'Access-Control-Allow-Origin', options.origin );
    response.setHeader( 'Access-Control-Allow-Methods', options.allow_methods.join( ',' ) );
    response.setHeader( 'Access-Control-Allow-Headers', options.allow_headers.join( ',' ) );
    response.setHeader( 'Access-Control-Expose-Headers', options.expose_headers.join( ',' ) );
    response.setHeader( 'Access-Control-Allow-Credentials', `${ options.credentials }` );
};