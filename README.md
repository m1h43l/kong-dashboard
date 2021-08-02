# Kong Dashboard

Kong Dashboard is a frontend for the [Kong API Gateway](https://konghq.com/kong).

## Requirements

Kong Dashboard is a admin dashboard for the Kong API Gateway version >= 2.0.0. It has been tested with Kong API Gateway version 2.0.4.

## Features

The project is work in progress. It currently supports the management of routes, services and consumers. It also supports configuring multiple kong instances.

## Configuration

Kong Dashboard expects a configuration file at `assets/config.json` which looks like this:

```
{
    "kong" : [
        {
            "name" : "Kong Node 1",
            "url" : "http://kong-node1/kong/api"
        },
        {
            "name" : "Kong Node 2",
            "url": "http://kong-node2/kong/api",
            "default": true
        }
    ],
    "auth" : {
        "enabled" : false,
        "protocol" : "oauth2",
        "grant_type" : "client_credentials",
        "url" : "http://oauthprovider/api/oauth"
    },
    "help": "https://github.com/m1h43l"
}
```

## Authentication

The Kong Dashboard uses the Kong Admin API directly. Thus it doesn't need any web service installation by itself. But Kong API Gateway doesn't provide any authentication for the admin API. The admin API listens only on localhost by default but we need to make it available to the outside of the installed host. To make it secure you can provide the Kong Admin API by the Kong instance itself and use an OAuth 2.0 Provider (with grant type `client_credentials`) for authentication.

1. Create service for the Kong Admin API
2. Create a route for the Kong Admin API (f. e. path /kong/api)
3. Enable the CORS plugin for the Kong Admin API route
4. Create a consumer
5. Configure the JWT plugin for this consumer
6. Enable the JWT plugin for the Kong Admin API route

In `config.json` you need to enable authentication and provide the url of the OAuth 2.0 provider.

## Build

Run `npm install` and `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

Contact me at mihael@rpgnextgen.com for further information or help.
