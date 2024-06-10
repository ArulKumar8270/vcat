import { makePersistable, clearPersistedStore, getPersistedStore, hydrateStore, isHydrated, isPersisting, startPersisting, pausePersisting, stopPersisting } from 'mobx-persist-store';
import { makeAutoObservable } from "mobx"

class AppConfig {
    api_key = '';
    loader = false;
    message = '';
    status = false;
    error = '';

    constructor() {
        makeAutoObservable(this)
        makePersistable(this, { name: 'app', properties: ['api_key'], storage: window.localStorage });
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

    setApiKey(value) {
        this.api_key = value;
    }
    setMessage(message, error = true) {
        if (error) {
            this.error = message;
        } else {
            this.success = message;
        }
        if (message) {
            this.status = true;
        } else {
            this.status = false;
        }
    }
    setLoader(value) {
        this.loader = value;
    }


};

export default new AppConfig();