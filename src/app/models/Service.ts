export interface Service {
    id?: string;
    name: string;
    retries?: number;
    protocol: string;
    host: string;
    port: number;
    path?: string;
    connect_timeout?: number;
    write_timeout?: number;
    read_timeout?: number;
    tags?: Array<string>;
    client_certificate?: CertificateId;
    tls_verify?: boolean;
    tls_verify_depth?: number;
    ca_certificates?: Array<string>;
    url?: string;
}

export interface CertificateId {
    id: string;
}
