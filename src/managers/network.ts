export type cxn = {
    ttl?: number;
    ip: string;
    app: string;
}

export class NetworkManager {
    private cxnSet: Set<cxn>;
    constructor () {
        this.cxnSet = new Set<cxn>;
    }

    getActive() {
        const active = Array.from(this.cxnSet.values())
            .filter((cxn) => !cxn.ttl || cxn.ttl > Date.now());
        this.cxnSet = new Set(active);
        return active;
    }
}
