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
        }
    }
}
