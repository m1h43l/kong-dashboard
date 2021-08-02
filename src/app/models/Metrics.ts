export interface Metrics {
    connections: Connections;
    errors: number;
}

export interface Connections {
    accepted: number;
    active: number;
    handled: number;
    reading: number;
    total: number;
    waiting: number;
    writing: number;
}
