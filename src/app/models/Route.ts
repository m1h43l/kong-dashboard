import {ServiceId} from "./ServiceId";

export interface Route {
    id?: string;
    name?: string;
    protocols: Array<string>;
    methods?: Array<string>;
    hosts?: Array<string>;
    paths?: Array<string>;
    headers?: any;
    https_redirect_status_code: number;
    regex_priority?: number;
    strip_path: boolean;
    path_handling?: string;
    preserve_host: boolean;
    request_buffering: boolean;
    response_buffering: boolean;
    tags?: Array<string>;
    service?: ServiceId;
    snis?: Array<string>;
    sources?: Array<any>;
    destinations?: Array<any>;
}
