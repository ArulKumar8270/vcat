import { makeAutoObservable } from "mobx"

class ChatModel {

    chatListVisibility = false;

    chatMemberDetails = {};

    chatMemberAvailability = false;

    chatCommonId;

    chatVisibility = false;

    constructor() {
        makeAutoObservable(this)
    }

    openChatList() {
        this.chatListVisibility = true;
    }

    closeChatList() {
        this.chatListVisibility = false;
    }

    setChatMemberDetails(chatMemberDetails) {
        this.chatMemberDetails = chatMemberDetails;
    }

    setChatMemberAvailabilityStatus(chatMemberAvailability) {
        this.chatMemberAvailability = chatMemberAvailability;
    }

    setChatCommonId(chatCommonId) {
        this.chatCommonId = chatCommonId;
    }

    openChat() {
        this.chatVisibility = true;
    }

    minimizeChat() {
        this.chatVisibility = false;
    }

    closeChat() {
        this.chatMemberDetails = {};
        this.chatMemberAvailability = false;
        this.chatCommonId = null;
        this.chatVisibility = false;
    }
}

export default new ChatModel();