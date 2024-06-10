// Imports order //

// Plugins //
import React from 'react';
import { observer } from 'mobx-react';
import { doc, query, where, setDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { BsChevronUp, BsDashLg } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import moment from 'moment';
import { db } from '../firebase';

// CSS  imports //
import profile from '../components/img/profile.png'
import 'react-quill/dist/quill.snow.css';

// Common file imports //
import User from '../modals/User';
import { Permissions, ApiPermissions } from '../common/Permission';
import Notifications from '../common/Notifications';

// Api file imports //
import { memberAutoPopulate } from '../libraries/memberDashboard';
import { All_Users, dashboard } from '../libraries/dashboard';

// Components imports //
// import DashboardHeader from '../DashboardHeader';
import MessageChat from '../components/MessageChat';
import ChatModel from '../common/ChatModel';


class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {},
      Current_User: '',
      userPermissions: {},
      Permissions: [],
      LatestEvents: [],
      ApiPermissions: [],
      clicked: false,
      Members: [],
      MemberId: '',
      MemberName: '',
      MemberStatus: '',
      MemberImage: '',
      messages: [],
      UserMessages: [],
      userdetail: {},
      chatCommonId: '',
      chatUpArrow: false,
      ChatShown: false,
      SearchListMessage: ''
    }
  }

  async componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.password });
    }
    this.All_Users();
    const response = await dashboard();
    const result = response.result;
    if (response && response.status === 'success') {
      const userPermissions = [];
      const userDetail = [];
      for (let i in result.userDetails) {
        userDetail.push(result.userDetails[i].name);
      }
      for (let i in result.userPermissions) {
        userPermissions.push(result.userPermissions[i].name);
      }
      this.setState({
        userDetails: response.result.userDetails[0],
        userPermissions: userPermissions,
        Permissions: Permissions,
        ApiPermissions: ApiPermissions,
        Current_User: userDetail
      });

    }
    this.GetStatus();
  }

  All_Users = async () => {
    const { search } = this.state;
    const requestData = { search };
    const members = await All_Users(requestData);
    const MemberList = members.result.all_users
    this.setState({ Members: MemberList }, () => {
      this.GetStatus();
    })
    if (MemberList === []) {
      this.setState({
        SearchListMessage: "No User Found"
      })
    }
  }

  GetStatus = () => {
    const StatusCommonId = User.StatusCommonId;
    const { Members } = this.state;
    if (User.user_id && StatusCommonId) {
      const q = query(collection(db, "Status"), where('status', '==', true));
      onSnapshot(q, (querySnapshot) => {
        const allMembers = [];
        const availableMembers = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          for (let j in Members) {
            if (Members[j]['id'] === parseInt(data['user_id'])) {
              availableMembers.push(data['user_id']);
              Members[j]['availability'] = data['status'];
              Members[j]['lastSeen'] = data['lastSeen'];
              allMembers.push(Members[j]);
              break;
            }
          }
        });
        for (let j in Members) {
          if (!availableMembers.includes(Members[j]['id'])) {
            Members[j]['availability'] = false;
            Members[j]['lastSeen'] = '';
            allMembers.push(Members[j]);
          }
        }
        this.setState({ Members: allMembers });
      });
    }
  }

  singleMember = async (id) => {
    const response = await memberAutoPopulate(id);

    if (response && response.status === 'success') {

      let result = response.result.users;
      ChatModel.setChatMemberDetails(result);
      this.setState({
        MemberId: result.id,
        MemberImage: result.image,
        MemberName: result.name,
        userdetail: result
      })
    }

  }

  openChat = async (e, id, name, image, availability) => {
    await this.singleMember(id);
    const fromID = User.user_id;
    const groupQ1 = query(collection(db, "Group"), where("fromId", "==", fromID), where("toId", "==", id));
    const groupQ2 = query(collection(db, "Group"), where("toId", "==", fromID), where("fromId", "==", id));
    let commonId = '';
    const querySnapshot1 = await getDocs(groupQ1);
    querySnapshot1.forEach((doc) => {
      const data = doc.data();
      const user_id = User.user_id;
      if ((data.fromId === user_id && data.toId === id) || (data.fromId === id && data.toId === user_id)) {
        commonId = data.commonId;
      }
    });

    const querySnapshot2 = await getDocs(groupQ2);
    querySnapshot2.forEach((doc) => {
      const data = doc.data();
      const user_id = User.user_id;
      if ((data.fromId === user_id && data.toId === id) || (data.fromId === id && data.toId === user_id)) {
        commonId = data.commonId;
      }
    });
    if (!commonId) {
      commonId = moment().unix().toString();
      await setDoc(doc(db, "Group/" + commonId), {
        commonId: commonId,
        fromId: User.user_id,
        toId: id
      });
    }
    await setDoc(doc(db, "Users/" + id), {
      commonId: commonId,
      id: id
    });
    if (id) {
      Notifications.setName(name);
      Notifications.setUserId(id);
      Notifications.setProfileImage(image);
      // const PersonName = this.state.MemberName
      // const PersonId = this.state.MemberId
      // const PersonImage = this.state.MemberImage
      this.setState({
        // MemberId: PersonId,
        // MemberImage: PersonImage,
        // MemberName: PersonName,
        chatCommonId: commonId,
        MemberStatus: availability
      });
      ChatModel.setChatCommonId(commonId);
      ChatModel.setChatMemberAvailabilityStatus(availability);
    }
    this.setState({ ChatShown: true })
  }

  callApiSearch = (e) => {
    const { value } = e.target;
    this.setState({ rows: [], current_page: 1, search: value }, async () => {
      await this.All_Users();
    });
    // if (this.state.search === '') {
    //   this.All_Users();
    // }
  };

  renderChatSidebar() {
    const searchActive = 'active';
    const { Members } = this.state;
    // const userChatImg = <img src={User.UserImage ? User.UserImage : profile} alt="CIMG" />;
    // const chatStatusIcon = User.Userstatus ? <p className='mb-0'><span className="statusSignal count" style={{ top: '65%', left: '82.5%' }}>&nbsp;</span></p> : null;
    // const chatStatus = User.Userstatus ? "Online" : "Offline";
    // const chatButton = <div className="insert-post-main align-center p-2 info-strip mb-2" id=''>
    //   <div className="dflex align-center">
    //     <div className="display-post  px-0 dflex align-center pos-rel">
    //       <div className="user-image m-0 px-0" >
    //         {userChatImg}
    //         {chatStatusIcon}
    //       </div>
    //       <div className='t-l ml-3'>
    //         <h6 className='tt-c mb-0'>Messaging</h6>
    //         <span className='mb-0'>{chatStatus}</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>;
    return (
      <>
        <div className={`search-wrapper ${searchActive} dflex align-center p-1 `} style={{ width: '100%', justifyContent: 'center' }}>
          <div className="input-holder mr-2 header-shadow p-1" style={{ width: '100%', backgroundColor: '#ebecfc', borderRadius: '0px' }}>
            <button className="search-icon" style={{ float: 'none' }} onClick={async () => { await this.All_Users(); }}><span></span></button>
            <input type="text" className="search-input ml-4" placeholder="Search member" onChange={this.callApiSearch} />
          </div>
        </div>
        {this.state.SearchListMessage ? <div>
          <p>{this.state.SearchListMessage}</p>
        </div> :
          <div className="message-box users px-2">
            {Members.length > 0 && Members.map((text, i) => {
              return (
                <>
                  {text.id === User.user_id ?
                    null :
                    <div key={i} onClick={async (e) => await this.openChat(e, text.id, text.name, text.image, text.availability)} className="pointer insert-post-main mt-1 dflex px-0 py-2 align-center" >
                      <div className="user-image col-1 m-0 p-0 mr-3 pos-rel">
                        <img src={text?.image || profile} alt="Cimg" />
                        {text.availability ?
                          < p className='mb-0 '><span className="statusSignal count" style={{ top: '65%', left: '100%' }}></span></p> :
                          < a className='mb-0 ' href='null'><span className="statusSignal offline count" style={{ top: '65%', left: '100%' }}></span></a>}
                      </div>
                      <div className="display-post col-10 px-0 ml-3 box-bottom pb-3 dflex jc-sb">
                        <p className='mb-0 font-bold'>{text.name}</p>
                      </div>
                    </div>
                  }
                </>
              )
            })}
          </div>
        }
      </>
    )
  }

  renderChat() {
    // const last_seen = moment(User.UserLastSeen).fromNow();
    let chatProfile = <img src={this.state.MemberImage} alt="profiles" />;
    // if (this.state.MemberImage)
    if (ChatModel.chatMemberDetails.image)
      chatProfile = <img src={profile} alt="profiles" />;
    let chatStatus = < a className='mb-0'><span className="statusSignal offline count" style={{ top: '62%', left: '104%' }}></span></a>;
    // if (this.state.MemberStatus)
    if (ChatModel.chatMemberAvailability)
      chatStatus = < a className='mb-0'><span className="statusSignal count" style={{ top: '62%', left: '104%' }}></span></a>
    let chatPersonName = "User Name";
    // if (this.state.MemberName)
    //   chatPersonName = this.state.MemberName;
    if (ChatModel.chatMemberDetails.name)
      chatPersonName = ChatModel.chatMemberDetails.name;
    return (
      <div className="start-post p-0  display-post-main header-shadow">
        <div className="insert-post-main align-center p-2 info-strip">
          <div className="dflex align-center">
            <div className="display-post col-12 px-1 dflex align-center pos-rel">
              <div className="user-image col-1 m-0 px-0 pos-rel" >
                {chatProfile}
                {chatStatus}
              </div>
              <div className='col-11'>
                <h6 className='tt-c ml-1 mb-0'>{chatPersonName}</h6>
              </div>
            </div>
          </div>
        </div>
        {/* {this.state.MemberId ? this.renderOpenChat() : null} */}
        {ChatModel.chatMemberDetails.id ? this.renderOpenChat() : null}
      </div>
    )


  }

  renderOpenChat() {
    const { chatCommonId } = this.state;
    const chatBox = <MessageChat
      // userDetails={this.state.userdetail}
      // MemberId={this.state.MemberId}
      // MemberStatus={this.state.MemberStatus}
      // MemberImage={this.state.MemberImage}
      // MemberName={this.state.MemberName}
      // commonId={chatCommonId}
      userDetails={ChatModel.chatMemberDetails}
      MemberId={ChatModel.chatMemberDetails.id}
      MemberStatus={ChatModel.chatMemberAvailability}
      MemberImage={ChatModel.chatMemberDetails.image}
      MemberName={ChatModel.chatMemberDetails.name}
      commonId={chatCommonId}
    // Current_User={this.state.Current_User}
    />;
    return (
      <div className="insert-post-main px-2 align-center">
        {chatBox}
      </div>
    )
  }

  render() {
    // let classStatus = 'close-chat';
    // if (this.state.shown) {
    //   classStatus = 'open-chat';
    // }
    let openChatBox = 'close-chat-box';
    let chatVisibilityButton = <button className='up-button no-style no-hover chat-svg pr-5' type='button'
      onClick={() => {
        // let ChatOpenStatus = shown === false ? true : false;
        // shown=ChatOpenStatus;
        // this.setState({ chatUpArrow: true });
        ChatModel.openChat();
      }}><BsChevronUp style={{ width: '1.2rem', height: '1.2rem' }} /></button>;
    // if (this.state.chatUpArrow)
    if (ChatModel.chatVisibility) {
      openChatBox = 'open-chat-box';
      chatVisibilityButton = <button className='up-button no-style no-hover chat-svg pr-5' type='button'
        onClick={() => {
          // this.setState({ chatUpArrow: false });
          ChatModel.minimizeChat();
        }}><BsDashLg style={{ width: '1.2rem', height: '1.2rem' }} /></button>;
    }
    const userChatImg = <img src={User.UserImage ? User.UserImage : profile} alt="CIMG" />;
    const chatStatusIcon = User.Userstatus ? <p className='mb-0'><span className="statusSignal count" style={{ top: '65%', left: '82.5%' }}>&nbsp;</span></p> : null;
    const chatStatus = User.Userstatus ? "Online" : "Offline";
    const chatButton = <div className="insert-post-main align-center p-2 info-strip mb-2 shadow-lg"
      >
      <div className="dflex align-center">
        <div className="display-post  px-0 dflex align-center pos-rel">
          <div className="user-image m-0 px-0" >
            {userChatImg}
            {chatStatusIcon}
          </div>
          <div className='t-l ml-3'>
            <h6 className='tt-c mb-0'>Messaging</h6>
            <span className='mb-0'>{chatStatus}</span>
          </div>
        </div>
      </div>
    </div>;
    let chatMessages;
    // if (this.state.ChatShown || ChatModel.chatListVisibility)
    if (typeof ChatModel.chatMemberDetails === 'object' && 'id' in ChatModel.chatMemberDetails)
      chatMessages = <div className={`chat-popup header-shadow ${openChatBox}`} id="myForm" style={{ right: '380px' }}>
        <form className="form-container start-post pos-rel pt-0 px-0" autoComplete="off" autoSave="off">
          <div className='d-flex'>
            {chatVisibilityButton}
            <button className='up-button no-style no-hover chat-svg' type='button'
              onClick={() => {
                ChatModel.closeChat();
              }}><AiOutlineCloseCircle style={{ width: '1.2rem', height: '1.2rem' }} /></button>
          </div>
          {this.renderChat()}
        </form>
      </div>;
    return (
      <div>
        <div className="message-box px-2 pop-up-chat-box pos-rel  message-main body-tabs-shadow fixed-sidebar home-dashboard fixed-header mt-0">
          <>
            <div
              className={`chat-popup header-shadow open-chat`}
              id="myForm"
              style={{
                background: "transparent",
                boxShadow: "none"
              }}>
              <form className={`${ChatModel.chatListVisibility ? "form-container start-post" : ""} pos-rel pt-0 px-0`} autoComplete="off" autoSave="off">
                <div className='dflex jc-end '>
                  {ChatModel.chatListVisibility ?
                    <button className='up-button no-style no-hover chat-svg' type='button'
                      onClick={() => {
                        ChatModel.closeChatList()
                      }}><BsDashLg style={{ width: '1.2rem', height: '1.2rem' }} /></button>
                    :
                    <button className='up-button no-style no-hover chat-svg' type='button'
                      onClick={() => {
                        ChatModel.openChatList()
                      }}><BsChevronUp style={{ width: '1.2rem', height: '1.2rem' }} /></button>}
                </div>
                {chatButton}
                {ChatModel.chatListVisibility ? this.renderChatSidebar() : <></>}
              </form>
            </div>
            {chatMessages}
          </>
        </div>
      </div>
    );
  }
}

export default observer(Messages)