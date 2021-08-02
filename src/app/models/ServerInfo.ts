export interface ServerInfo {
    version: string;
    hostname: string;
    tagline: string;
    location: string;
    dns: Array<string>;
    hostsFile: string;
    plugins: Array<string>;
    nginxConfigFile: string;
    nginxErrorLog: string;
    configFile: string;
    database: KongDatabase;
}

export interface KongDatabase {
    dbms: string;
    host: string;
    port: number;
    name: string;
}
