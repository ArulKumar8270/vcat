import { makeAutoObservable } from "mobx"
import { makePersistable, clearPersistedStore, getPersistedStore, hydrateStore, isHydrated, isPersisting, startPersisting, pausePersisting, stopPersisting } from 'mobx-persist-store';

class User {
    user_id = '';
    person_name = '';
    email = '';
    UserImage = '';
    phone = '';
    Userstatus = '';
    refresh = '';
    UserLastSeen = '';
    StatusCommonId = '';
    constructor() {
        makeAutoObservable(this)
        makePersistable(this, { name: 'Member', properties: ['user_id', 'person_name', 'email', 'phone', 'UserImage','refresh','Userstatus','UserLastSeen','StatusCommonId'], storage: window.localStorage });
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
    setUserImage(value) {
        this.UserImage = value;
    }
    setUserLastSeen(value) {
        this.UserLastSeen = value;
    }
    setName(value) {
        this.person_name = value;
    }
    setUserStatus(value) {
        this.Userstatus = value;
    }
    setStatusCommonId(value) {
        this.StatusCommonId = value;
    }
    setRefresh(value) {
        this.refresh = value;
    }
    
}


export default new User();