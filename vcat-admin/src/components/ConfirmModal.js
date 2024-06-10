import { observer } from "mobx-react";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { BsTrash } from "react-icons/bs";

class ConfirmModal extends React.Component {
    render() {
        return (
            <div className="confirm-modal">
                <Modal
                    show={this.props.visible}
                    onHide={() => this.props.handleClose(false)}
                    dialogClassName="modal-100w"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="confirm"
                // style={{maxWidth:'500px'}}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title text-center">
                            <div className="d-flex justify-content-center  text-center theme-font-color">
                                <span className="smallText text-center d-flex justify-content-center align-items-center">
                                    <h5 className="pl-3">{this.props?.heading || "Delete"}</h5>
                                </span>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.delete && (
                            <div className="d-flex justify-content-center mt-5 mb-4">
                                <BsTrash className="pointer mx-2" icon="trash-solid" size={50} color="#E40045" />
                            </div>
                        )}
                        <div className="d-flex justify-content-center mt-5 mb-4">
                            <p className="smallText" style={{ textAlign: "center" }}>
                                {this.props.title}
                            </p>
                        </div>
                        <div className="d-flex  jc-sb mt-5 mb-4">
                            <button
                                type="submit"
                                className="btn  event-cta-trans"
                                onClick={() => this.props.confirm()}
                            >
                                Confirm
                            </button>
                            &nbsp;&nbsp;&nbsp;
                            <button
                                type="submit"
                                className="btn  event-cta-trans"
                                onClick={() => this.props.handleClose(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default observer(ConfirmModal);
