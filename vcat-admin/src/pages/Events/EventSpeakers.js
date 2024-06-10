import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";

import logo from "../../components/img/logo.png";
import { Button } from "primereact/button";
import { deleteEventSpeaker, getEventSpeakers, saveEventSpeaker, updateEventSpeaker } from "../../libraries/event";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRef } from "react";
import User from "../../modals/User";
import { uploadMedia } from "../../common/uploadFile";
import { BsTrashFill, BsUpload } from "react-icons/bs";
import AppConfig from "../../modals/AppConfig";
import ConfirmModal from "../../components/ConfirmModal";

const EventSpeakers = ({
    id,
    title,
    onClose,
    show,
    saveAccess,
}) => {
    const [speakers, setSpeakers] = useState([]);
    const emptySpeakerModel = () => {
        return {
            speaker: "",
            position: "",
            image: null,
            event_id: id,
            user_id: User.user_id,
        }
    };
    const fileUploadRef = useRef();
    const [speakerModel, setSpeakerModel] = useState(emptySpeakerModel());
    const [formErrorModel, setFormErrorModel] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteSpeakerId, setDeleteSpeakerId] = useState(null);
    const fetchSpeakersApi = async () => {
        if (id) {
            const response = await getEventSpeakers(id);
            if (response) {
                const { status, result } = response;
                if (status === 'success' && result) {
                    const { eventSpeakers } = result;
                    if (eventSpeakers && Array.isArray(eventSpeakers) && eventSpeakers.length > 0) {
                        setSpeakers(eventSpeakers);
                    } else {
                        setSpeakers([]);
                    }
                }
            }
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchSpeakersApi(), [id]);

    const newSpeaker = () => {
        setSpeakerModel({ ...emptySpeakerModel() });
        setShowForm(true);
    };

    const deleteSpeaker = async () => {
        await deleteEventSpeaker(deleteSpeakerId);
        await fetchSpeakersApi();
        setDeleteSpeakerId(null);
        setShowConfirmModal(false);
    };

    const editSpeaker = (selectedSpeaker) => {
        const speaker = {
            ...emptySpeakerModel(),
            id: selectedSpeaker.id,
            speaker: selectedSpeaker.speaker,
            position: selectedSpeaker.position,
            image: selectedSpeaker.image,
        };
        setSpeakerModel(speaker);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setSpeakerModel({ ...emptySpeakerModel() });
    };

    const saveSpeaker = async (e) => {
        e.preventDefault();
        if (speakerModel.speaker && speakerModel.position) {
            let response;
            if (speakerModel?.id) {
                response = await updateEventSpeaker(speakerModel, speakerModel.id);
            } else {
                response = await saveEventSpeaker(speakerModel);
            }
            AppConfig.setMessage(response?.result, response?.status !== "success");
            await fetchSpeakersApi();
            closeForm();
        } else {
            AppConfig.showValidationError();
            setFormErrorModel({
                ...formErrorModel,
                speaker: speakerModel.speaker ? false : "Field empty",
                position: speakerModel.position ? false : "Field empty",
            });
        }
    }

    const callback = async (response) => {
        if (response) {
            const { status, result } = response;
            if (status === "success" && result) {
                const { url } = result;
                if (url) {
                    setSpeakerModel({ ...speakerModel, image: url })
                }
            }
        }
    }
    const uploadProfile = async (files, preventDefault) => {
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            await uploadMedia(file, callback);
        }
    }
    const modalHeader = <Modal.Header>
        <div className="w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <div>
                    <img src={logo} alt="logo" />
                </div>
                <div className="text-white ml-2">
                    {`${title} Event Speakers` || "Event Speakers"}
                </div>
            </div>
            <span
                style={{ cursor: "pointer" }}
                className="mx-3 text-white"
                onClick={() => {
                    if (onClose)
                        onClose();
                    setSpeakerModel({ ...emptySpeakerModel() });
                    setShowForm(false);
                    setSpeakers([]);
                }}>
                <AiOutlineCloseCircle
                    style={{ width: "24px", height: "24px" }}
                />
            </span>
        </div>
    </Modal.Header>;

    return (
        <div>
            <Modal
                size="md"
                className="border-style rounded"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
            >
                {modalHeader}
                <div className="p-3">
                    <Modal.Body>
                        {showForm ? <>
                            <div
                                className="d-flex flex-column justify-content-center align-items-center"
                            >
                                <div className="col-12 col-md-6 input-row mb-3">
                                    <div className="form-padding mb-3">
                                        <label className="dflex align-center">
                                            Speaker Name <span className="asterik">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrorModel.speaker ? "validationError" : ""}`}
                                            id="speakerName"
                                            placeholder={formErrorModel?.speaker || "Enter the Speaker Name"}
                                            value={speakerModel.speaker}
                                            onChange={({ target: { value } }) =>
                                                setSpeakerModel({ ...speakerModel, speaker: value })
                                            }
                                            onFocus={() =>
                                                setFormErrorModel({ ...formErrorModel, speaker: false })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 input-row mb-3">
                                    <div className="form-padding mb-3">
                                        <label className="dflex align-center">
                                            Speaker Position <span className="asterik">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrorModel?.position ? "validationError" : ""}`}
                                            id="speakerName"
                                            placeholder={formErrorModel?.position || "Enter the Speaker Name"}
                                            value={speakerModel.position}
                                            onChange={({ target: { value } }) =>
                                                setSpeakerModel({ ...speakerModel, position: value })
                                            }
                                            onFocus={() =>
                                                setFormErrorModel({ ...formErrorModel, position: false })
                                            }
                                        />
                                    </div>
                                </div>
                                {speakerModel?.image ? (
                                    <div className="col-12 col-md-6 primary-color text-white">
                                        <div
                                            className="d-flex my-3"
                                            style={{ justifyContent: "space-between", alignItems: "center" }}
                                        >
                                            <>
                                                <div className="col-md-3">
                                                    <div className="thumbnail-image">
                                                        <img
                                                            src={speakerModel?.image}
                                                            alt="Profile"
                                                            style={{
                                                                width: "50px",
                                                                height: "auto",
                                                                borderRadius: "unset",
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <BsTrashFill
                                                        className="theme-font-color big-font-size m-2 pointer"
                                                        onClick={() => setSpeakerModel({ ...speakerModel, image: null })}
                                                    />
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-12 col-md-6">
                                        <input
                                            className="form-control bsUpload d-none"
                                            id="speakerProfile"
                                            ref={fileUploadRef}
                                            type="file"
                                            multiple={false}
                                            accept="image/*"
                                            onChange={async ({ target: { files }, preventDefault }) => await uploadProfile(files, preventDefault)}
                                            onFocus={() =>
                                                setFormErrorModel({ ...formErrorModel, image: false })
                                            }
                                        />
                                        <Button
                                            type="button"
                                            className="btn w-100 small-font-size font-style"
                                            onClick={({ preventDefault }) => {
                                                fileUploadRef?.current?.click();
                                                return false;
                                            }}
                                        >
                                            <div className="d-flex flex-column">
                                                <div className="d-flex mb-2">
                                                    <BsUpload />
                                                    <span className="mx-3">Upload Profile Image </span>
                                                </div>
                                                <div className="d-flex">
                                                    <p
                                                        className="small-font-size my-0"
                                                        style={{ fontSize: "0.8rem" }}
                                                    >
                                                        Image resolution should be less than 5mb
                                                    </p>
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                )}
                                <div className="d-flex col-12 col-md-6 justify-content-between mt-3">
                                    <button
                                        type="button"
                                        className="btn  event-cta-trans"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn  event-cta" onClick={saveSpeaker}>
                                        {speakerModel?.id ? "Update Speaker Details" : "Add Speaker"}
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </> : null}
                        <div className="d-flex flex-column">
                            <div className="d-flex justify-content-between">
                                <div className="col-auto d-flex align-items-center font-bold h5" >
                                    Speakers
                                </div>
                                <div className="d-flex" >
                                    {!showForm && saveAccess ?
                                        <div className="col d-flex align-items-center justify-content-center">
                                            <Button label="Add" className="rounded-pill" onClick={() => newSpeaker()} />
                                        </div>
                                        : null}
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex flex-column">
                                {speakers && speakers.length > 0 ? speakers.map(({ id: speakerId, speaker, image, position }) => {
                                    return <div className="d-flex justify-content-between row-hover px-3 py-1">
                                        <div className="col-auto d-flex align-items-center">
                                            {`${speaker} ${position}`}
                                        </div>
                                        <div className="d-flex" >
                                            {!showForm && saveAccess ? <>
                                                <div className="col d-flex align-items-center justify-content-center">
                                                    <MdEdit
                                                        size={40}
                                                        color="white"
                                                        onClick={() => editSpeaker({ id: speakerId, speaker, image, position })}
                                                        style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                                                    />
                                                </div>
                                                <div className="col d-flex align-items-center justify-content-center">
                                                    <MdDelete
                                                        size={40}
                                                        color="white"
                                                        onClick={() => {
                                                            setDeleteSpeakerId(speakerId);
                                                            setShowConfirmModal(true);
                                                        }}
                                                        style={{ cursor: "pointer", backgroundColor: "#464eb8", borderRadius: 20, borderColor: "white", borderWidth: 1, padding: 8 }}
                                                    />
                                                </div>
                                            </> : null}
                                        </div>
                                    </div>
                                }) : <div>Speakers not added</div>}
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
            <ConfirmModal
                delete={true}
                visible={showConfirmModal}
                heading="Delete Speaker"
                title="Are you sure you want to delete the Speaker?"
                confirm={() => deleteSpeaker()}
                handleClose={() => {
                    setDeleteSpeakerId(null);
                    setShowConfirmModal(false);
                }}
            />
        </div>
    );
}
export default EventSpeakers;