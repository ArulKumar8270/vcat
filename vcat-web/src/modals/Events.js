import { makeAutoObservable } from "mobx";
import {
  makePersistable,
  clearPersistedStore,
  getPersistedStore,
  hydrateStore,
  isHydrated,
  isPersisting,
  startPersisting,
  pausePersisting,
  stopPersisting,
} from "mobx-persist-store";

class Events {
  getOrganizer = "";
  getEventDetails = "";

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "events",
      properties: ["getOrganizer", "getEventDetails"],
      storage: window.localStorage,
    });
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

  getEventDetailsFunc() {
    return this.getEventDetails;
  }

  getOrganizerFunc() {
    return this.getOrganizer;
  }

  setEventFunctions(orgFunc, eveFunc) {
    this.getOrganizer = orgFunc;
    this.getEventDetails = eveFunc;
  }
}

export default new Events();
