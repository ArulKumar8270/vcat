import { makeAutoObservable } from "mobx"
import { makePersistable, clearPersistedStore, getPersistedStore, hydrateStore, isHydrated, isPersisting, startPersisting, pausePersisting, stopPersisting } from 'mobx-persist-store';

class User {
    user_id = '';
    name = '';
    email = '';
    phone = '';
    delivery_charge = '';

    constructor() {
        makeAutoObservable(this)
        makePersistable(this, { name: 'user', properties: ['user_id', 'name', 'email', 'phone', 'delivery_charge'], storage: window.localStorage });
    }
    get isHydrated() {
        return isHydrated(this);
    }

    get isPersisting() {
        return isPersisting(this);
    }

    startPersist() {
        startPersisting(this);
    }


    async hydrateStore() {
        await hydrateStore(this);
    }

    async clearStoredDate() {
        await clearPersistedStore(this);
    }

    async getStoredData() {
        return getPersistedStore(this);
    }

    pausePersist() {
        pausePersisting(this);
    }


    disposePersist() {
        stopPersisting(this);
    }

    async rehydrateStore() {
        await hydrateStore(this);
    }

    setUserId(value) {
        this.user_id = value;
    }

    setName(value) {
        this.name = value;
    }

    setEmail(value) {
        this.email = value;
    }

    setPhone(value) {
        this.phone = value;
    }

    setDeliveryCharges(value) {
        this.delivery_charge = value;
    }
}


export default new User();