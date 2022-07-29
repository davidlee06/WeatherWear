/*
This file defines the shape of the .env file.
 */

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APIKEY: string;
            PORT: number;
            DEBUG: boolean;
            ISSUER_BASE_URL: string;
            CLIENT_ID: string;
            BASE_URL: string;
            SECRET: string;
            PGHOST: string;
            PGUSER: string;
            PGDATABASE: string;
            PGPASSWORD: string;
            PGPORT: number;
        }
    }
}

// APIKEY=294e262744e0da66d38e517c095e60eb
// PORT=80
// DEBUG=true
// ISSUER_BASE_URL=https://YOUR_DOMAIN
// CLIENT_ID=YOUR_CLIENT_ID
// BASE_URL=https://YOUR_APPLICATION_ROOT_URL
// SECRET=24d8fd2a4b23f94849a786a4a6551c24483b129919e77c89f8a66c436a65254c
