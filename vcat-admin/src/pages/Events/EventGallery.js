import React, { useEffect, useState } from "react";
import { Image } from 'primereact/image';
import { AiOutlineCloseCircle } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";

import logo from "../../components/img/logo.png";
import { Button } from "primereact/button";
import { EventAutoPopulate, saveEventGallery } from "../../libraries/event";
import { useRef } from "react";
import { uploadMedia } from "../../common/uploadFile";
import ConfirmModal from "../../components/ConfirmModal";
import { DataView } from 'primereact/dataview';
import { Checkbox } from 'primereact/checkbox';

import "./EventGallery.css";
const EventGallery = ({
    id,
    title,
    onClose,
    show,
    saveAccess,
}) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const fileUploadRef = useRef();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteImageUrls, setDeleteImageUrls] = useState([]);
    const fetchImages = async () => {
        setLoading(true);
        if (id) {
            await EventAutoPopulate(id).then((response) => {
                if (response) {
                    const { status, result } = response;
                    if (status === 'success' && result) {
                        const { events } = result;
                        if (events) {
                            const { gallery } = events;
                            if (gallery && typeof gallery === "string") {
                                const newGallery = JSON.parse(gallery);
                                setImages(Array.isArray(newGallery) ? newGallery : []);
                            }
                        }
                    }
                }
            })
        }
        setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => fetchImages(), [id]);

    const callback = async (response) => {
        if (response) {
            const { status, result } = response;
            if (status === "success" && result) {
                const { url } = result;
                if (url) {
                    const newImages = [...images];
                    newImages.push(url);
                    const requestData = { gallery: newImages || [] };
                    await saveEventGallery(requestData, id);
                    await fetchImages();
                }
            }
        }
        if (loading)
            setLoading(false);
    }

    const addImages = async (files, preventDefault) => {
        setLoading(true);
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            await uploadMedia(file, callback);
        }
    }

    const deleteImages = async (urls = []) => {
        setLoading(true);
        const requestData = { gallery: Array.isArray(images) ? images.filter((image) => !urls.includes(image)) : [] };
        await saveEventGallery(requestData, id);
        await fetchImages();
        if (loading)
            setLoading(false);
    };

    const modalHeader = <Modal.Header>
        <div className="w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <div>
                    <img src={logo} alt="logo" />
                </div>
                <div className="text-white ml-2">
                    {`${title} Gallery` || "Gallery"}
                </div>
            </div>
            <span
                style={{ cursor: "pointer" }}
                className="mx-3 text-white"
                onClick={() => {
                    setImages([]);
                    if (onClose)
                        onClose();
                }}>
                <AiOutlineCloseCircle
                    style={{ width: "24px", height: "24px" }}
                />
            </span>
        </div>
    </Modal.Header>;
    const contentHeader = saveAccess ? <div className="d-flex justify-content-between mb-3">
        <div className="col-auto p-0 m-0">
            <Button
                label={selectedImages === images ? "Clear Selection" : "Select All"}
                className="rounded-pill"
                icon={`pi pi-${selectedImages === images ? "ban" : "check-square"}`}
                iconPos="left"
                onClick={() => setSelectedImages(selectedImages === images ? [] : images)} />
        </div>
        <div className="col-auto d-flex justify-content-end p-0 m-0">
            {selectedImages.length > 0 ? <div>
                <Button
                    label="Delete Images"
                    className="rounded-pill"
                    icon="pi pi-trash"
                    iconPos="left"
                    onClick={async () => {
                        setShowConfirmModal(true);
                    }} />
            </div> : null}
            <div>
                <input
                    ref={fileUploadRef}
                    type="file"
                    multiple={false}
                    accept="image/*"
                    onChange={async ({ target: { files }, preventDefault }) => await addImages(files, preventDefault)}
                    className="d-none"
                />
                <Button
                    label="Upload Image"
                    className="rounded-pill ml-3"
                    icon="pi pi-upload"
                    iconPos="left"
                    onClick={() => fileUploadRef?.current?.click()}
                />
            </div>
        </div>
    </div> : null;
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
                        <div className="d-flex flex-column">
                            <DataView
                                value={images}
                                layout="grid"
                                loading={loading}
                                header={contentHeader}
                                itemTemplate={(image) => {
                                    return <div className="col-12 col-md-4 imageBox d-flex flex-column bg-light border border-white rounded">
                                        <div className="col d-flex flex-column align-items-center justify-content-center">
                                            <Image
                                                src={image}
                                                alt="Image"
                                                preview
                                                className="d-flex align-items-center justify-content-center"
                                                imageClassName="border-0 rounded shadow-lg img-fluid m-3"
                                                style={{ width: "100%", height: "100%" }}
                                                imageStyle={{ minWidth: "75%", height: "auto" }} />
                                        </div>
                                        {saveAccess ?
                                            <div className={`col-auto d-flex mt-2 col-auto align-items-center justify-content-center ${selectedImages.includes(image) ? "" : ""}`}>
                                                <Checkbox
                                                    className="bg-light"
                                                    inputId="binary"
                                                    checked={selectedImages.includes(image)}
                                                    onChange={({ checked }) => setSelectedImages(checked ? [...selectedImages, image] : selectedImages.filter((item) => item !== image))} />
                                                <Button
                                                    label="Delete"
                                                    icon="pi pi-trash"
                                                    iconPos="left"
                                                    className="rounded-pill ml-2"
                                                    onClickCapture={() => {
                                                        setDeleteImageUrls([image]);
                                                        setShowConfirmModal(true);
                                                    }}
                                                />
                                            </div> : null}
                                    </div>
                                }}
                                paginator
                                rows={9} />
                        </div>
                    </Modal.Body>
                </div>
            </Modal>

            <ConfirmModal
                delete={true}
                visible={showConfirmModal}
                heading="Delete Speaker"
                title="Are you sure you want to delete the Speaker?"
                confirm={async () => {
                    if (deleteImageUrls && deleteImageUrls.length > 0) {
                        await deleteImages(deleteImageUrls);
                        setDeleteImageUrls([]);
                    } else {
                        await deleteImages(selectedImages);
                        setSelectedImages([]);
                    }
                    setShowConfirmModal(false);
                }}
                handleClose={() => {
                    setDeleteImageUrls([]);
                    setShowConfirmModal(false);
                }}
            />
        </div>
    );
}
export default EventGallery;
