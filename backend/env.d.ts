declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string,
        HOST: string;
        DATABASE_CONNECTION_URI: string;
        SECRET_KEY: string;
    }
}