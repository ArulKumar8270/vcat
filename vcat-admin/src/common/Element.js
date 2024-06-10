import AppConfig from "../modals/AppConfig";
import { observer } from "mobx-react-lite";
import { useLocation, Redirect, Route } from "react-router";
import * as React from "react";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

/**
 *
 * @param{props} route elements
 * @returns page route
 */
export const PublicRoute = observer((props) => {
  const currentPath = useLocation();
  const routes = ["/", "/login", "/forgotpassword", "/otp", "/createPassword"];
  if (AppConfig.api_key && routes.includes(currentPath.pathname)) {
    return <Redirect to="/dashboard" />;
  }

  return <Route {...props} />;
});
/**
 *
 * @param {*} route elements
 * @returns square page route
 */
export const PrivateRoute = ({ component: PageComponent, ...props }) => {
  return (
    <Route
      {...props}
      render={(props) =>
        AppConfig.api_key !== "" ? (
          <PageComponent {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
