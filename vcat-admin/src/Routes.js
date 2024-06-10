import React from "react";
import { Switch } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./common/Element";

// Pages imports //
// Public Pages 
import LogIn from "./pages/LogIn/LogIn";
import CreatePassword from "./pages/LogIn/CreatePassword";
import Otp from "./pages/LogIn/Otp";
import ChangePassword from "./pages/LogIn/ChangePassword";
import ForgotPassword from "./pages/LogIn/ForgotPassword";
// Private Pages
import HomeDashboard from "./pages/Home/HomeDashboard";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Chat-System/Messages";
import MomDashboard from "./pages/MOM/MomDashboard";
import DocumentDashboard from "./pages/Documents/DocumentDashboard";
import CareerDashboard from "./pages/Career/CareerDashboard";
import MemberDashboard from "./pages/Member-Management/MemberDashboard";
import PermissionDashboard from "./pages/Permissions/PermissionDashboard";
import RoleDashboard from "./pages/Roles/RoleDashboard";
import WingDashboard from "./pages/Wings/WingDashboard";
import ContentDashboard from "./pages/Content-Management/ContentDashboard";
import EventDashboard from "./pages/Events/EventDashboard";
import MeetingDashboard from "./pages/Meeting/MeetingDashboard";
import ResourcesDashboard from "./pages/Resources/ResourcesDashboard";
import Register from "./pages/Register/Register";

export default function Routes(props) {

    return (
        <Switch>
            {/*  Public Pages  */}
            <PublicRoute exact path="/" component={LogIn} />
            <PublicRoute exact path="/otp" component={Otp} />
            <PublicRoute exact path="/forgot" component={ForgotPassword} />
            <PublicRoute exact path="/change" component={ChangePassword} />
            <PublicRoute exact path="/create" component={CreatePassword} />
            <PublicRoute exact path="/register/:secret_key" component={Register} />
            {/*  Private Pages  */}
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/home" component={HomeDashboard} />
            <PrivateRoute exact path="/messages" component={Messages} />
            <PrivateRoute exact path="/notifications" component={HomeDashboard} />
            <PrivateRoute exact path="/mom" component={MomDashboard} />
            <PrivateRoute exact path="/meeting" component={MeetingDashboard} />
            <PrivateRoute exact path="/career" component={CareerDashboard} />
            <PrivateRoute exact path="/document" component={DocumentDashboard} />
            <PrivateRoute exact path="/resources" component={ResourcesDashboard} />
            <PrivateRoute exact path="/member" component={MemberDashboard} />
            <PrivateRoute exact path="/wing" component={WingDashboard} />
            <PrivateRoute exact path="/content" component={ContentDashboard} />
            <PrivateRoute
                exact
                path="/permission"
                component={PermissionDashboard}
            />
            <PrivateRoute exact path="/role" component={RoleDashboard} />
            <PrivateRoute exact path="/event" component={EventDashboard} />
            <PrivateRoute exact path="/post" component={HomeDashboard} />
            <PrivateRoute exact path="/profile" component={HomeDashboard} />
            <PrivateRoute exact path="/feed" component={HomeDashboard} />
            <PrivateRoute exact path="/feed/:id" component={HomeDashboard} />

            <PublicRoute path="*" component={() => "404 Not Found"} />
            {/* <PublicRoute path="/calender" component={} /> */}
        </Switch>
    );
}