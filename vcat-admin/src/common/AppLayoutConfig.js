import { makeAutoObservable } from "mobx";

class AppLayoutConfig {
    showLayout = true;
    showHeader = true;
    showFooter = true;
    showChat = true;
    showSidebar = true;
    showSideCalendar = true;
    showRecentEvents = true;
    showLatestEvents = true;
    showCareers = true;
    constructor() {
        makeAutoObservable(this)
    }
    setShowLayout = (value) => {
        if (this.showLayout !== value)
            this.showLayout = value;
    };
    setShowHeader = (value) => {
        if (this.showHeader !== value)
            this.showHeader = value;
    };
    setShowFooter = (value) => {
        if (this.showFooter !== value)
            this.showFooter = value;
    };
    setShowChat = (value) => {
        if (this.showChat !== value)
            this.showChat = value;
    };
    setShowSidebar = (value) => {
        if (this.showSidebar !== value)
            this.showSidebar = value;
    };
    setShowSideCalendar = (value) => {
        if (this.showSideCalendar !== value)
            this.showSideCalendar = value;
    };
    setShowRecentEvents = (value) => {
        if (this.showRecentEvents !== value)
            this.showRecentEvents = value;
    };
    setShowLatestEvents = (value) => {
        if (this.showLatestEvents !== value)
            this.showLatestEvents = value;
    };
    setShowCareers = (value) => {
        if (this.showCareers !== value)
            this.showCareers = value;
    };

}
export default new AppLayoutConfig();