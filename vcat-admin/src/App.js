// Imports order //

// Plugins //
import React from "react";
import { observer } from "mobx-react";

// CSS  imports //
import "./components/css/pagestyle.css";
import "./components/css/main.css";
import "./components/css/sample.css";
import "./components/css/Otp.css";

// Common file imports //
import AppConfig from "./modals/AppConfig";
import User from "./modals/User";

// Api file imports //

// Components imports //
import Loader from "./components/Loader";

import ToastMessage from "./modals/ToastMessage";

// Prime Styles
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './components/css/primeStyle.css';

import Routes from "./Routes";
import { Footer } from "./components";
import ChatPopUp from "./components/ChatPopUp";
import AppLayoutConfig from "./common/AppLayoutConfig";
import DashboardHeader from "./pages/DashboardHeader";
import DashboardSideBar from "./pages/DashboardSideBar";

function App() {
  if (!AppConfig.isHydrated || !User.isHydrated) {
    return <Loader />;
  }
  const toast = <ToastMessage />;
  const routeComponent = <><Routes /></>;
  return (<>
    <div className="App pos-rel">
      {toast}
      {/* <ScrollToTop /> */}
      {AppConfig.api_key && AppLayoutConfig.showLayout ? <>
        <div
          className="app-container app-theme-white body-tabs-shadow dashboard-page fixed-sidebar fixed-header mt-0"
          style={{ minHeight: "75.9vh" }}
        >
          <HeaderComponent />
          <div className="app-main wrapper">
            <SideBarComponent />
            {routeComponent}
          </div>
          <ChatComponent />
          <FooterComponent />
        </div>
      </> : routeComponent}
    </div>
  </>
  );
}

const HeaderComponent = observer(() => {
  if (AppLayoutConfig.showHeader)
    return <DashboardHeader />;
  return <></>;
});

const SideBarComponent = observer(() => {
  if (AppLayoutConfig.showSidebar)
    return <DashboardSideBar />;
  return <></>;
});

const ChatComponent = observer(() => {
  if (AppLayoutConfig.showChat)
    return <ChatPopUp />;
  return <></>;
});

const FooterComponent = observer(() => {
  if (AppLayoutConfig.showFooter)
    return <Footer />;
  return <></>;
});

export default observer(App);
