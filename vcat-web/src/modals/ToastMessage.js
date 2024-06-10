import React from "react";
import { observer } from "mobx-react";
import Toast from "react-bootstrap/Toast";
import AppConfig from "./AppConfig";

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
    return (
      <>
        {success !== "" || error !== "" ? (
          <div
            className="border-radius toast-outer bg-white position-absolute"
            bg={success}
          >
            <Toast
              onClose={this.closeMessage}
              show={status}
              delay={3000}
              autohide
              className="toast-box"
            >
              <Toast.Body
                className={
                  success
                    ? "normal-font-size success toast-success"
                    : "normal-font-size success toast-error"
                }
              >
                <p className={`small-font-size fw-bold ${classMessage}`}>
                  {message}
                </p>
                <p
                  className={
                    success
                      ? "small-font-size text-success fw-bold"
                      : "small-font-size text-danger fw-bold"
                  }
                >
                  {success ? success : error}
                </p>
              </Toast.Body>
            </Toast>
          </div>
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
