import { networkManager } from "../core";

export interface IBusiness {
    remoteHost: string;
    name: string;
    keyLength: number;
    customersPerSecond: number;
    customerLifeMs: number;
    customerAvgDifficulty: number;
    customerDeviation: number;
    customerValueMultiplier: number;
    customerCreationInterval: number;

    _firstCxnTime?: Date;
    _lastScanTime?: Date;
    _lastCustomerTime?: Date;
};

export class BusinessManager {
    private businessMap: Map<string, IBusiness>;

    constructor() {
        this.reset();
    }

    reset() {
        this.businessMap = new Map<string, IBusiness>();
    }

    addBusiness(business: Omit<IBusiness, "customerCreationInterval"> & { customerCreationInterval?: number }) {
        this.businessMap.set(
            business.remoteHost,
            {
                ...business,
                customerCreationInterval: business.customerCreationInterval ?? 1000 / business.customersPerSecond
            }
        );
    }

    /**
     * TODO: This should be part of another process, maybe a game loop?
     *       Written in GO or suttin.
     */
    generateCustomers(host: string) {
        const business = this.businessMap.get(host);
        if (!business) {
            throw new Error("Unknown business");
        }

        // If isFresh then just generate a customer from now
        const isFresh = !business._firstCxnTime || !business._lastScanTime;

        // Calculate time from last scan, if the interval contains multiples of `customersPerSecond` then
        // generate N customers with a staggered ttl
        if (business._lastCustomerTime) {
            const interval = Date.now() - business._lastCustomerTime.getTime();
            const customersToCreate = Math.floor(interval / business.customerCreationInterval);
            for (let i = 0; i < customersToCreate; i++) {
                this.createCustomerCxn(business, business.customerLifeMs - (i * business.customerCreationInterval));
            }
            if (customersToCreate) {
                business._lastCustomerTime = new Date(); // TODO ... not necessarily, some function of i * business.customerCreationInterval
            }
        }

        if (isFresh) {
            business._lastCustomerTime = business._firstCxnTime = new Date();
            this.createCustomerCxn(business, business.customerLifeMs);
        }

        console.log({ isFresh, lst: business._lastScanTime, fct: business._firstCxnTime });

        business._lastScanTime = new Date();
    }

    createCustomerCxn(business: IBusiness, ttl?: number) {
        networkManager.addActive(business.name, networkManager.generateIp(), ttl, business.remoteHost);
    }
}
