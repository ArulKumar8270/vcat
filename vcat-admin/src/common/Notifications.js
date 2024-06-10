import { makeAutoObservable } from "mobx"
import { makePersistable, clearPersistedStore, getPersistedStore, hydrateStore, isHydrated, isPersisting, startPersisting, pausePersisting, stopPersisting } from 'mobx-persist-store';

class Notifications {
    chatUser_id = '';
    profile_image = '';
    name = '';
    status = '';
    chatCommonId = '';
    notificationCount = 0;
    postActivityStatus = false;
    feedViewId ='';
    searchPost='';
    DocType = '';
    Img_media_size = '';
    Doc_media_size = '';
    UserRole='';
    Vid_media_size = '';
    currentID = '';
    DocTypeError = 0;
    memberStatus = false;
    momformStatus = false;
    meetingformStatus = false;
    docformStatus = false;
    eventformStatus = false;
    careerformStatus = false;
    memberformStatus = false;
    roleformStatus = false;
    wingformStatus = false;
    permformStatus = false;
    resourcesStatus = false;
    constructor() {
        makeAutoObservable(this)
        makePersistable(this, { name: 'chat', properties: ['momformStatus', 'meetingformStatus','docformStatus', 'eventformStatus','careerformStatus' ,'memberformStatus' ,'roleformStatus','wingformStatus','permformStatus' ,'resourcesStatus','chatUser_id','UserRole','DocType','DocTypeError', 'name','chatCommonId', 'status','Img_media_size' ,'Doc_media_size','Vid_media_size','profile_image', 'notificationCount','feedViewId','currentID','searchPost','memberStatus'], storage: window.localStorage });
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
    setUserRole(value) {
        this.UserRole = value;
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
        this.chatUser_id = value;
    }
    setCurrentId(value) {
        this.currentID = value;
    }
    setName(value) {
        this.name = value;
    }

    setStatus(value) {
        this.status = value;
    }
    setFeedViewId(value) {
        this.feedViewId = value;
    }
    setPostActivityStatus(value) {
        this.postActivityStatus = value;
    }
    setSearchPost(value) {
        this.searchPost = value;
    }
    setProfileImage(value) {
        this.profile_image = value;
    }
    setChatCommonId(value) {
        this.chatCommonId = value;
    }
    setNotificationCount(value) {
        this.notificationCount = value;
    }
    setDocType(value) {
        this.DocType = value;
    }
    setDocTypeError(value) {
        this.DocTypeError = value;
    }
    setMediaSizeDoc(value) {
        this.Doc_media_size = value;
    }
    setMediaSizeVid(value) {
        this.Vid_media_size = value;
    }
    setMediaSizeImg(value) {
        this.Img_media_size = value;
    }
    setmemberStatus(value) {
        this.memberStatus = value;
    }
    setmomformStatus(value) {
        this.momformStatus = value;
    }
    setmeetingformStatus(value) {
        this.meetingformStatus = value;
    }
    setdocformStatus(value) {
        this.docformStatus = value;
    }
    seteventformStatus(value) {
        this.eventformStatus = value;
    }
    setcareerformStatus(value) {
        this.careerformStatus = value;
    }
    setmemberformStatus(value) {
        this.memberformStatus = value;
    }
    setroleformStatus(value) {
        this.roleformStatus = value;
    }
    setwingformStatus(value) {
        this.wingformStatus = value;
    }
    setpermformStatus(value) {
        this.permformStatus = value;
    }
    setresourcesStatus(value) {
        this.resourcesStatus = value;
    }
}


export default new Notifications();