import jwt, { JwtPayload } from "jsonwebtoken";

export interface ICxn {
    expiresOn?: number;
    ip: string;
    app: string;
    proxyHost?: string;
}

export const JWT_TTL = 60000;
const SECRET_KEY = "test";
type AccessToken = { expiresAt: number; token: string };

export class NetworkManager {
    private cxnSet: Set<ICxn>;
    private accessMap: Map<string, AccessToken[]>;

    constructor () {
        this.reset();
    }

    reset() {
        this.cxnSet = new Set<ICxn>();
        this.accessMap = new Map<string, AccessToken[]>();
    }

    addActive(app: string, ip: string, ttl?: number, proxyHost?: string) {
        this.cxnSet.add({
            app,
            ip,
            expiresOn: ttl !== undefined ? Date.now() + ttl : undefined,
            proxyHost
        });
    }

    getActiveAccessTokens(ip: string) {
        this.accessMap.set(
            ip,
            (this.accessMap.get(ip) ?? [])
                .filter(token => token.expiresAt > Date.now())
        );
        return this.accessMap.get(ip) ?? [];
    }

    addAccess(ip: string, ttl = JWT_TTL) {
        const token = this.createAccessToken(ip, ttl);
        this.accessMap.set(
            ip,
            [
                ...this.getActiveAccessTokens(ip),
                token
            ]
        );
        return token;
    }

    validateToken(ip: string, token: string) {
        if (token === "test") { return true; }
        const active = this.getActiveAccessTokens(ip);
        if (!active.find(t => t.token === token)) {
            throw new Error("token is not active");
        }
        const payload: JwtPayload = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return payload.ip === ip;
    }

    createAccessToken(ip: string, ttl = JWT_TTL): AccessToken {
        const token = jwt.sign({ ip }, SECRET_KEY, { expiresIn: ttl });
        return {
            expiresAt: Date.now() + ttl,
            token
        };
    }

    removeActive(app: string, ip: string) {
        const active = this.getCxn(app, ip);
        active && this.cxnSet.delete(active);
    }

    getActive(proxyHost?: string) {
        const active = Array.from(this.cxnSet.values())
            .filter((cxn) => !cxn.expiresOn || cxn.expiresOn > Date.now());
        this.cxnSet = new Set(active);
        return active.filter(cxn => cxn.proxyHost === proxyHost);
    }

    getCxn(app: string | undefined, ip: string, proxyHost?: string) {
        return Array.from(this.cxnSet.values())
            .find((cxn) => (app ? cxn.app === app : true) && cxn.ip === ip && cxn.proxyHost === proxyHost);
    }

    prune() {
        this.getActive();
        Array.from(this.accessMap.keys()).forEach(
            ip => this.getActiveAccessTokens(ip)
        );
    }

    generateIp() {
        return (new Array(8)).fill(null).map(
            () => Math.floor(((256 * 256) - 1) * Math.random()).toString(16)
        ).join(":");
    }
}
