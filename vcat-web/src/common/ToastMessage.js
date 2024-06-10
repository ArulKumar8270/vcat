import React from "react";
import { observer } from "mobx-react";
import AppConfig from "../modals/AppConfig";
import moment from "moment";

class ToastMessage extends React.Component {
  render() {
    const status = AppConfig.status;
    const success = AppConfig.success;
    const error = AppConfig.error;
    let message = "Error!";
    let classMessage = "text-danger";
    if (success) {
      message = "Success !";
      classMessage = "text-success";
    }
    console.log("message => ", success, error, status);
    return (
      <>
        {success !== "" || error !== "" ? (
          <>
            <button type="button" className="btn btn-primary" id="liveToastBtn">
              Show live toast
            </button>

            <div
              className="position-fixed bottom-0 end-0 p-3"
              style="z-index: 11"
              onClose={this.closeMessage}
              show={status}
              delay={3000}
              autohide
            >
              <div
                id="liveToast"
                className="toast hide"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div
                  className={
                    success
                      ? "normal-font-size success toast-success toast-header"
                      : "toast-header normal-font-size success toast-error"
                  }
                >
                  <strong
                    className={`me-auto small-font-size fw-bold ${classMessage}`}
                  >
                    {message}
                  </strong>
                  {/* <small>{moment(notifications.date).format('HH:mm:ss') ? moment(notifications.date).format('HH:mm:ss') : '-'} ago</small> */}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="toast-body">
                  <strong
                    className={`me-auto small-font-size fw-bold ${classMessage}`}
                  >
                    {message}
                  </strong>
                  <p
                    className={
                      success
                        ? "small-font-size text-success fw-bold"
                        : "small-font-size text-danger fw-bold"
                    }
                  >
                    {success ? success : error}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
    );
  }

  //close message
  closeMessage = () => {
    AppConfig.setMessage("", true);
    AppConfig.setMessage("", false);
  };
}

export default observer(ToastMessage);
