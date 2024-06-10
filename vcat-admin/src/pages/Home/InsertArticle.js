import React, { createRef } from 'react';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrArticle, GrDocumentText, GrDocumentPdf, GrYoutube } from "react-icons/gr";
import { BsCardImage } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { observer } from 'mobx-react';
import ReactQuill from 'react-quill';
import Modal from 'react-bootstrap/Modal'

// CSS  imports //
import 'react-quill/dist/quill.snow.css';

// Common file imports //
import { uploadMedia } from "../../common/uploadFile";
import User from '../../modals/User';
import AppConfig from '../../modals/AppConfig';

// Api file imports //
import { HomeFeedInsert, editFeedAutoPopulate, updateFeed, getUsersDropdown } from '../../libraries/dashboard';
import Notifications from '../../common/Notifications';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

const IMAGE_MAX_FILE_SIZE = 5000000;
const VIDEO_MAX_FILE_SIZE = 10000000;
const DOC_MAX_FILE_SIZE = 5000000;


class InsertArticle extends React.Component {
    editorRef = createRef();
    usersFilterInputRef = createRef();
    state = {
        userDetails: {},
        userPermissions: {},
        Permissions: [],
        LatestEvents: [],
        ApiPermissions: [],
        document: '',
        document_name: '',
        mediaType: '',
        mediaSize: '',
        article: '',
        articleDescription: '',
        insertArticle: false,
        insertImage: false,
        insertVideo: false,
        insertDocument: false,
        media: '',
        errorCodeVideo: 0,
        errorCodeImage: 0,
        errorCodeDoc: 0,
        showSelectUser: false,
        userList: [],
        usersFilterValue: "",

        imageSizeError: "",
        videoSizeError: "",
        docSizeError: "",
        fileUploadErrorInsertArticle: ""
    }

    async componentDidMount() {
        const { password } = this.props;
        if (password) {
            this.setState({ password });
        }
        const response = await getUsersDropdown();
        if (response) {
            const { result: userList, status } = response;
            if (status === 'success' && Array.isArray(userList) && userList.length > 0) {
                this.setState({ userList });
            }
        }

    }

    async componentDidUpdate(prevProps) {
        const FeedId = this.props.FeedId;
        if (this.props.insertArticle !== prevProps.insertArticle && FeedId && this.props.insertArticle) {
            this.setState({ insertArticle: this.props.insertArticle });
            const response = await editFeedAutoPopulate(FeedId);
            if (response && response.status === 'success') {
                const result = response.result.feeds;
                this.setState({
                    articleDescription: result?.discription,
                    media: result?.feed_paths,
                });
            }
        }
    }

    handleChangeA = (articleDescription) => this.setState({ articleDescription });

    renderInsertNewPost() {
        return <Modal
            size='md'
            className="border-style rounded insert-post"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.props.insertArticle}
        >
            <Modal.Header>
                <div className="form-head width100 dflex jc-sb align-center">
                    <div className="width100 dflex align-center">
                        <GrArticle
                            style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                stroke: "#70b5f9",
                                color: "#70b5f9",
                            }}
                            className="form-svg"
                        />
                        <h5
                            className="mt-1 ml-2 align-self-center"
                            style={{ color: "#fff" }}
                        >
                            Create an Article
                        </h5>
                    </div>
                    <button
                        className="popup-button closeText"
                        onClick={this.handleClose}
                    >
                        <span>
                            <AiOutlineCloseCircle />
                        </span>
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form className="align-items-center event-form" onSubmit={this.SubmitPost} autoComplete="off" autoSave="off">
                    <div className='mb-4 mb-3 mt-2'>
                        <ReactQuill
                            ref={(ref) => this.editorRef = ref}
                            value={this.state.articleDescription}
                            onKeyPress={(e) => {
                                if (e?.key === "@") {
                                    e?.preventDefault();
                                    this.editorRef?.editor?.blur();
                                    this.setState({ showSelectUser: true, usersFilterValue: "" });
                                    if (this.usersFilterInputRef && this.usersFilterInputRef?.current) this.usersFilterInputRef?.current?.focus();
                                }
                            }}
                            onChange={this.handleChangeA}
                            modules={this.modules}
                            formats={this.formats}
                            placeholder="What do you want to talk about?"
                            className="quill-content"
                        />
                    </div>
                    {Notifications?.DocType ? <p>{Notifications?.DocType}</p> : Notifications?.DocType}
                    {this.state.media ?
                        this.state.media.split('.').pop() === 'jpg' || this.state.media.split('.').pop() === 'png' || this.state.media.split('.').pop() === 'jpeg' || this.state.media.split('.').pop() === 'gif' ?
                            parseInt(Notifications.Img_media_size) > 5000000 ?
                                <div className='form-padding mb-4 mb-3 mt-2'>
                                    <p>The file size is should be less than 5mb</p>
                                </div> :
                                <div className="col-md-12">
                                    {this.renderThumbnailImage()}
                                </div> :
                            this.state.media.split('.').pop() === 'mp4' || this.state.media.split('.').pop() === 'ogg' || this.state.media.split('.').pop() === 'mov' ?
                                parseInt(Notifications.Vid_media_size) > 10000000 ?
                                    <div className="col-md-12">
                                        <p>The file size is should be less than 10mb</p>
                                    </div> :
                                    <div className="col-md-12">
                                        {this.renderThumbnailVideo()}
                                    </div>
                                : this.state.media.split('.').pop() === 'pdf' || this.state.media.split('.').pop() === 'txt' || this.state.media.split('.').pop() === 'doc' || this.state.media.split('.').pop() === 'docx' ?
                                    parseInt(Notifications.Doc_media_size) < 5000000 ?
                                        <div className="col-md-12">
                                            {this.renderThumbnailFile()}
                                        </div>
                                        :
                                        <div className="col-md-12">
                                            <p>The file size is should be less than 5mb</p>
                                        </div> : null
                        : null}
                    <div className="insert-post-actions home-dashboard dflex start-post cta-section jc-sb mt-3">
                        <div className="dflex jc-sb col-8 px-0 mr-2" >
                            <div className="insert-post-action-svg event-svg dflex col-4 px-0">
                                <div className='form-padding pos-rel dflex' style={{ width: '100%' }}>
                                    <input
                                        className="form-control bsUpload"
                                        id="uploadImage"
                                        placeholder="Select Image"
                                        type="file"
                                        data-max-size="2048"
                                        accept=".jpg, .png, .jpeg"
                                        // onChange={this.selectUploadImage}
                                        onChange={(e) => {
                                            let check = true;
                                            if (e.target.files && e.target.files.length > 0) {
                                                if (Number(e.target.files[0].size) > IMAGE_MAX_FILE_SIZE) check = false;
                                                if (check) {
                                                    this.setState({ fileUploadErrorInsertArticle: "" });
                                                    this.selectUploadImage(e);
                                                }
                                                else {
                                                    this.setState({ fileUploadErrorInsertArticle: "The image size must be less than 5mb" });
                                                    e.target.value = null;
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="insert-post-action-svg video-svg dflex col-4 feed-upload px-0">
                                <div className='form-padding pos-rel dflex' style={{ width: '100%' }}>
                                    <input
                                        className="form-control bsUpload "
                                        id="uploadVideo"
                                        type="file"
                                        data-max-size="10240"
                                        accept=".mp4, .ogg, .mov"
                                        // onChange={this.selectUploadVideo}
                                        onChange={(e) => {
                                            let check = true;
                                            if (e.target.files && e.target.files.length > 0) {
                                                if (Number(e.target.files[0].size) > VIDEO_MAX_FILE_SIZE) check = false;
                                                if (check) {
                                                    this.setState({ fileUploadErrorInsertArticle: "" });
                                                    this.selectUploadVideo(e);
                                                }
                                                else {
                                                    this.setState({ fileUploadErrorInsertArticle: "The video size must be less than 10mb" });
                                                    e.target.value = null;
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="insert-post-action-svg event-svg dflex col-4  feed-upload px-0">
                                <div className='form-padding  pos-rel dflex' style={{ width: '100%' }}>
                                    <input
                                        className="form-control bsUpload "
                                        id="uploadAgendaFile"
                                        type="file"
                                        accept=".pdf, .xlx, .xls, .csv, .txt"
                                        // onChange={this.selectUploadDocument}
                                        onChange={(e) => {
                                            let check = true;
                                            if (e.target.files && e.target.files.length > 0) {
                                                if (Number(e.target.files[0].size) > DOC_MAX_FILE_SIZE) check = false;
                                                if (check) {
                                                    this.setState({ fileUploadErrorInsertArticle: "" });
                                                    this.selectUploadDocument(e);
                                                }
                                                else {
                                                    this.setState({ fileUploadErrorInsertArticle: "The document size must be less than 5mb" });
                                                    e.target.value = null;
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="insert-post-action-svg event-svg dflex col-4 px-0 feed-upload">
                            <button type="submit " style={{ width: '100%' }} className="btn event-cta my-2"
                            >Post</button>
                        </div>
                    </div>
                </form>
                {this.state.fileUploadErrorInsertArticle && <small className='text-danger' >{this.state.fileUploadErrorInsertArticle}</small>}
            </Modal.Body>
        </Modal>
    }

    handleSingleMediaClose = () => {
        Notifications.setDocType("");
        Notifications.setMediaSizeDoc("");
        Notifications.setMediaSizeImg("");
        Notifications.setMediaSizeVid("");
        this.setState({
            media: '',
        }, () => {
            this.props.closeModel(false);
        });
    }

    renderInsertImage() {
        const { errorCodeImage } = this.state;
        return <Modal
            size='md'
            className="border-style rounded insert-post"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.props.insertImage}
        > <Modal.Header>
                <div className="form-head width100 dflex jc-sb align-center">
                    <div className="width100 dflex align-center">
                        <BsCardImage
                            style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                stroke: "#70b5f9",
                                color: "#70b5f9",
                            }}
                            className="form-svg"
                        />
                        <h5
                            className="mt-1 ml-2 align-self-center"
                            style={{ color: "#fff" }}
                        >
                            Upload an image
                        </h5>
                    </div>
                    <button
                        className="popup-button closeText"
                        onClick={this.handleClose}
                    >
                        <span>
                            <AiOutlineCloseCircle />
                        </span>
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form className="align-items-center event-form" onSubmit={this.SubmitImage} autoComplete="off" autoSave="off">
                    <div className='form-padding mb-4 mb-3 mt-2'>
                        {this.state?.media && parseInt(Notifications?.Img_media_size) < 5000000 ?
                            <div className="col-md-12">
                                {this.renderThumbnailImage()}
                            </div> :
                            <div>
                                {/* <div className="form-padding mb-4 mb-3 mt-2">
                                    <p>The file size is should be less than 5mb</p>
                                    {Notifications?.DocType ? <p>{Notifications?.DocType}</p> : Notifications?.DocType}
                                </div> */}
                                {/* <input
                                        className="form-control border-0"
                                        id="uploadImage"
                                        placeholder="Select Image"
                                        type="file"
                                        accept=".jpg, .png, .jpeg"
                                        onChange={(e) => {
                                            let check = true;
                                            if (e.target.files && e.target.files.length > 0) {
                                                if (Number(e.target.files[0].size) > IMAGE_MAX_FILE_SIZE) check = false;
                                                if (check)
                                                    this.selectUploadImage(e);
                                                else {
                                                    this.setState({ imageSizeError: true })
                                                }
                                            }
                                        }}
                                    /> */}
                                <label for="image-upload-dialog-control" class="form-label">The file size is should be less than 5mb</label>
                                <input class="form-control bsUpload" type="file" id="image-upload-dialog-control"
                                    accept=".jpg, .png, .jpeg"
                                    onChange={(e) => {
                                        let check = true;
                                        if (e.target.files && e.target.files.length > 0) {
                                            if (Number(e.target.files[0].size) > IMAGE_MAX_FILE_SIZE) check = false;
                                            if (check) {
                                                this.setState({ imageSizeError: "" });
                                                this.selectUploadImage(e);
                                            }
                                            else {
                                                this.setState({ imageSizeError: true });
                                                e.target.value = null;
                                                e.preventDefault();
                                            }
                                        }
                                    }} />
                                {this.state?.imageSizeError && <small className='text-danger'>The image size must be less than 5mb</small>}
                                {this.state?.media && errorCodeImage === 2 ?
                                    <div className='col-md-2'>
                                        <div className='form-padding mb-4 mb-3 mt-2'>
                                            <p>The file size is should be less than 5mb</p>
                                        </div>
                                        <BsTrashFill
                                            className="theme-font-color big-font-size m-2 pointer"
                                            style={{ width: '1.5rem', height: '1.5rem' }}
                                            onClick={() => this.setState({ media: '', errorCodeImage: 0 })} />
                                    </div>
                                    : null
                                }
                            </div>
                        }
                    </div>
                    <div className="cta-section dflex jc-sb">
                        <button
                            type="button"
                            className="btn event-cta-trans font-style py-2 align-center my-2"
                            onClick={this.handleSingleMediaClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn event-cta btn dflex font-style align-center py-2 my-2">
                            Upload
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    }

    renderInsertVideo() {
        return (
            <>
                <Modal
                    size='md'
                    className="border-style rounded insert-post"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.props.insertVideo}
                > <Modal.Header>
                        <div className="form-head width100 dflex jc-sb align-center">
                            <div className="width100 dflex align-center">
                                <GrYoutube
                                    style={{
                                        width: "1.5rem",
                                        height: "1.5rem",
                                        stroke: "#70b5f9",
                                        color: "#70b5f9",
                                    }}
                                    className="form-svg"
                                />
                                <h5
                                    className="mt-1 ml-2 align-self-center"
                                    style={{ color: "#fff" }}
                                >
                                    Upload a video
                                </h5>
                            </div>
                            <button
                                className="popup-button closeText"
                                onClick={this.handleClose}
                            >
                                <span>
                                    <AiOutlineCloseCircle />
                                </span>
                            </button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="align-items-center event-form" onSubmit={this.SubmitVideo} autoComplete="off" autoSave="off">
                            <div className='form-padding mb-4 mb-3 mt-2'>
                                {this.state?.mediaType === 'video/mp4' ?
                                    <div className="col-md-12">
                                        {Number(Notifications.Vid_media_size) < 10000000 ?
                                            <div className='form-padding mb-4 mb-3 mt-2'>
                                                <p>The file size is should be less than 10mb</p>
                                                {Notifications?.DocType ? <p>{Notifications?.DocType}</p> : Notifications?.DocType}
                                            </div> : this.renderThumbnailVideo()}
                                    </div> :
                                    <div>
                                        <label for="video-upload-dialog-control" class="form-label">The file size is should be less than 10mb</label>
                                        <input class="form-control bsUpload" type="file" id="video-upload-dialog-control"
                                            accept=".mp4, .ogg, .mov"
                                            onChange={(e) => {
                                                let check = true;
                                                if (e.target.files && e.target.files.length > 0) {
                                                    if (Number(e.target.files[0].size) > VIDEO_MAX_FILE_SIZE) check = false;
                                                    if (check) {
                                                        this.setState({ videoSizeError: "" });
                                                        this.selectUploadVideo(e);
                                                    }
                                                    else {
                                                        this.setState({ videoSizeError: true });
                                                        e.target.value = null;
                                                        e.preventDefault();
                                                    }
                                                }
                                            }} />
                                        {this.state?.videoSizeError && <small className='text-danger'>The video size must be less than 10mb</small>}
                                        {/* <input
                                            className="form-control bsUpload "
                                            id="uploadImage"
                                            placeholder="Select video"
                                            type="file"
                                            accept=".mp4, .ogg, .mov"
                                            onChange={this.selectUploadVideo}
                                        /> */}
                                    </div>
                                }
                            </div>
                            <div className="cta-section dflex jc-sb">
                                <button
                                    type="button"
                                    className="btn event-cta-trans font-style py-2 align-center my-2"
                                    onClick={this.handleSingleMediaClose}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn event-cta btn dflex font-style align-center py-2 my-2">
                                    Upload
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>

            </>
        )
    }

    renderInsertDocument() {
        return <Modal
            size='md'
            className="border-style rounded insert-post"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.props.insertDocument}
        > <Modal.Header>
                <div className="form-head width100 dflex jc-sb align-center">
                    <div className="width100 dflex align-center">
                        <GrArticle style={{ width: '1.5rem', height: '1.5rem', stroke: '#70b5f9', color: '#70b5f9' }} className="form-svg" />
                        <h5
                            className="mt-1 ml-2 align-self-center"
                            style={{ color: "#fff" }}
                        >
                            Upload document
                        </h5>
                    </div>
                    <button
                        className="popup-button closeText"
                        onClick={this.handleSingleMediaClose}
                    >
                        <span>
                            <AiOutlineCloseCircle />
                        </span>
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form className="align-items-center event-form" onSubmit={this.SubmitDocument} autoComplete="off" autoSave="off">
                    <div className='form-padding mb-4 mb-3 mt-2'>
                        {this.state.mediaType === 'file/pdf' ?
                            <div className="col-md-12">
                                {parseInt(Notifications.Doc_media_size) < parseInt(5000000) ?
                                    this.renderThumbnailFile()

                                    : <div className='form-padding mb-4 mb-3 mt-2'>
                                        <p>The file size is should be less than 5mb</p>
                                        <>
                                            {Notifications?.DocType ? <>
                                                <p>{Notifications?.DocType}</p></> : <>{Notifications?.DocType}</>}
                                        </>
                                    </div>}
                            </div>
                            :
                            <div>
                                {/* <input
                                    className="form-control bsUpload "
                                    id="uploadImage"
                                    placeholder="Select Image"
                                    type="file"
                                    accept=".pdf, .xlx, .xls, .csv, .txt"
                                    onChange={this.selectUploadDocument}
                                /> */}

                                <label for="doc-upload-dialog-control" class="form-label">The file size is should be less than 5mb</label>
                                <input class="form-control bsUpload" type="file" id="doc-upload-dialog-control"
                                    accept=".pdf, .xlx, .xls, .csv, .txt"
                                    onChange={(e) => {
                                        let check = true;
                                        if (e.target.files && e.target.files.length > 0) {
                                            if (Number(e.target.files[0].size) > DOC_MAX_FILE_SIZE) check = false;
                                            if (check) {
                                                this.setState({ docSizeError: "" });
                                                this.selectUploadDocument(e);
                                            }
                                            else {
                                                this.setState({ docSizeError: true });
                                                e.target.value = null;
                                                e.preventDefault();
                                            }
                                        }
                                    }} />
                                {this.state?.docSizeError && <small className='text-danger'>The document size must be less than 5mb</small>}
                            </div>
                        }
                    </div>
                    <div className="cta-section dflex jc-sb">
                        <button type="button" className="btn  event-cta-trans font-style py-2 align-center my-2" onClick={this.handleSingleMediaClose}
                        >Cancel</button>
                        <button type="submit " className="btn  event-cta btn dflex  font-style align-center py-2 my-2"
                        >Upload</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>;
    }

    handleClose = () => {
        Notifications.setDocType("");
        Notifications.setMediaSizeDoc("");
        Notifications.setMediaSizeImg("");
        Notifications.setMediaSizeVid("");
        this.setState({
            document: '',
            document_name: '',
            mediaType: '',
            mediaSize: '',
            article: '',
            articleDescription: '',
            FeedId: '',
            insertArticle: false,
            insertImage: false,
            insertVideo: false,
            insertDocument: false,
            media: '',
            errorCodeVideo: 0,
            errorCodeImage: 0,
            errorCodeDoc: 0,

            imageSizeError: "",
            videoSizeError: "",
            docSizeError: "",
            fileUploadErrorInsertArticle: "",
        }, () => {
            this.props.closeModel(false);
        });
    }

    // Select file
    selectUploadImage = (e) => {
        e?.preventDefault();
        const media = e.target.files[0];
        const mediaSize = e.target.files[0].size;
        Notifications.setMediaSizeImg(mediaSize);
        let errorCodeImage = 0;
        if (!mediaSize) {
            errorCodeImage = 1;
        } else if (parseInt(mediaSize) > parseInt(5000000)) {
            errorCodeImage = 2;
        }
        else return uploadMedia(media, this.callBackImage);
        this.setState({ mediaSize: mediaSize, errorCodeImage })
    };

    callBackImage = (response = false) => {
        if (response && response.status === "success") {
            this.setState({
                media: response.result.url,
                mediaName: response.result.mediaName
            }, () => {
            })

        }
    }


    handleUploadImage = (e) => {
        e?.preventDefault();
        const fileSelectorAgenda = document.getElementById("uploadImage");
        fileSelectorAgenda.click();

    };

    selectUploadVideo = async (e) => {
        e?.preventDefault();
        const media = e.target.files[0];
        const mediaSize = e.target.files[0].size;
        Notifications.setMediaSizeVid(mediaSize);
        let error = false;
        let errorCodeVideo = 0;
        if (mediaSize === undefined || mediaSize === null) {
            error = true;
            errorCodeVideo = 1;
        }
        if (Number(mediaSize) > Number(10000000)) {
            error = true;
            errorCodeVideo = 2;
        }
        this.setState({ mediaSize: mediaSize, errorCodeVideo });
        if (!error)
            await uploadMedia(media, this.callBackVideo);
    };

    callBackVideo = (response = false) => {
        if (response && response.status === "success") {
            this.setState({
                media: response.result.url,
                mediaName: response.result.mediaName
            })
        }
    }

    handleUploadVideo = (e) => {
        e?.preventDefault();
        const fileSelectorAgenda = document.getElementById("uploadVideo");
        fileSelectorAgenda.click();

    };

    selectUploadDocument = async (e) => {
        e?.preventDefault();
        const document = e.target.files[0];
        const document_name = e.target.files[0].name;
        const mediaSize = e.target.files[0].size;
        Notifications.setMediaSizeDoc(mediaSize);
        let error = false;
        let errorCodeDoc = 0;
        if (mediaSize === undefined || mediaSize === null) {
            error = true;
            errorCodeDoc = 1;
        }
        if (Number(mediaSize) > Number(5000000)) {
            error = true;
            errorCodeDoc = 2;
        }
        this.setState({ document_name: document_name, errorCodeDoc })
        if (!error)
            await uploadMedia(document, this.callBackDocument);
    };

    callBackDocument = (response = false) => {
        if (response && response.status === "success") {
            this.setState({
                media: response.result.url,
                document: response.result.url,
                document_name: response.result.file_name
            })
        }
    }

    handleUploadDocument = (e) => {
        e?.preventDefault();
        const fileSelectorAgenda = document.getElementById("uploadDocument");
        fileSelectorAgenda.click();

    };

    renderThumbnailImage = () => {
        return this.state.media ? (this.state.media.split('.').pop() === 'jpg' || this.state.media.split('.').pop() === 'png' || this.state.media.split('.').pop() === 'jpeg' || this.state.media.split('.').pop() === 'gif') ?
            <div className='d-flex my-3' style={{ justifyContent: "space-between", alignItems: "center", height: '15rem', overflow: 'auto' }}>
                <div className="col-md-10 ">
                    <div className='thumbnail-image'>
                        <img src={this.state.media} alt='feedImage' style={{ width: "100%", height: "auto", borderRadius: "unset" }} />
                    </div>
                </div>
                <div className='col-md-2'>
                    <BsTrashFill className="theme-font-color big-font-size m-2 pointer" style={{ width: '1.5rem', height: '1.5rem' }} onClick={() => this.setState({ media: '', errorCodeImage: 0 })} />
                </div>
            </div> :
            <div className='form-padding mb-4 mb-3 mt-2'>
                <p>The file type should be jpg,jpeg,gif or png</p>
            </div> : null;
    }

    renderThumbnailVideo = () => {
        return this.state.media && this.state.media.split('.').pop() === 'mp4' ?
            <div className='d-flex my-3' style={{ justifyContent: "space-between", alignItems: "center", height: '15rem', overflow: 'auto' }}>
                <div className="col-md-10 ">

                    <div className='thumbnail-image'>
                        <video width="320" height="240" controls>
                            <source src={this.state.media} type="video/mp4" />
                            <source src={this.state.media} type="video/ogg" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                </div>
                <div className='col-md-2'>
                    <BsTrashFill className="theme-font-color big-font-size m-2 pointer" style={{ width: '1.5rem', height: '1.5rem' }} onClick={() => this.setState({ media: '', errorCodeVideo: 0 })} />
                </div>
            </div>
            : <div className='form-padding mb-4 mb-3 mt-2'>
                <p>The file type should be mp4</p>
            </div>;
    }

    renderThumbnailFile = () => {
        return (
            <div className='d-flex my-3' style={{ justifyContent: "space-between", alignItems: "center", height: 'auto', overflow: 'auto' }}>
                <>
                    {this.state.media.split('.').pop() === 'pdf' ?
                        <div className="col-md-10 ">
                            <div className='thumbnail-image'>
                                <GrDocumentPdf style={{ width: "50px", height: "50px", cursor: "pointer" }} />
                            </div>
                        </div> :
                        <div className="col-md-10 ">
                            <div className='thumbnail-image'>
                                <GrDocumentText style={{ width: "50px", height: "50px", cursor: "pointer" }} />
                            </div>
                        </div>}
                    <div className='col-md-2'>
                        <BsTrashFill className="theme-font-color big-font-size m-2 pointer" style={{ width: '1.5rem', height: '1.5rem' }} onClick={() => this.setState({ media: '' })} />
                    </div>
                </>
            </div>

        )
    }

    SubmitImage = async (e) => {
        e?.preventDefault();
        if (this.state.media) {
            this.setState({
                insertImage: false,
                insertArticle: true,
            })
            this.props.redirectModel();
        }
    }

    SubmitVideo = async (e) => {
        e?.preventDefault();
        if (this.state.media) {
            this.setState({
                insertVideo: false,
                insertArticle: true,
            })
            this.props.redirectModel();
        }
    }

    SubmitDocument = async (e) => {
        e?.preventDefault();
        if (this.state.document) {
            this.setState({
                insertArticle: true,
                insertDocument: false
            })
            this.props.redirectModel();
        }
    }

    SubmitPost = async (e) => {
        const editPost = this.props.FeedId;
        e?.preventDefault();
        if (this.state.media || this.state.document || this.state.articleDescription) {
            const user_id = User.user_id;
            const requestData = {
                discription: this.state.articleDescription,
                user_id: user_id,
                feed_name: 'post',
                filePath: this.state.media,
            }
            if (editPost) {
                requestData['user_id'] = User.user_id;
                const response = await updateFeed(requestData, editPost);
                if (response && response.status === 'success') {
                    this.props.closeModel(false);
                    AppConfig.setMessage('Feed updated successfully', false);
                } else if (response.status === 'error') {
                    AppConfig.setMessage(response?.result);
                }
            } else {
                const response = await HomeFeedInsert(requestData);
                if (response && response.status === 'success') {
                    this.props.closeModel();
                    window.location.reload(true);
                    AppConfig.setMessage('Feed updated successfully', false);
                    User.setRefresh(true);
                } else if (response.status === 'error') {
                    const result = response.result;
                    let message = result;
                    if (result[Object.keys(response.result)[0]]) {
                        message = result[Object.keys(response.result)[0]];
                    }
                    AppConfig.setMessage(message);
                }
            }
        }
    }

    renderTagUser() {
        const { userList } = this.state;
        return <Modal
            size='md'
            className="cus-modal border-style rounded insert-post"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state?.showSelectUser}
        >
            <Modal.Header>
                <div
                    className="d-flex justify-content-between w-100"
                >
                    <div className="col d-flex justify-content-start align-items-center">
                        <h5
                            className="mt-1 ml-2 align-self-center"
                            style={{ color: "#fff" }}
                        >
                            Find Member
                        </h5>
                    </div>
                    <button
                        className="popup-button closeText"
                        onClick={() => {
                            this.setState({ showSelectUser: false, usersFilterValue: "" });
                        }}
                    >
                        <span>
                            <AiOutlineCloseCircle />
                        </span>
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body style={{ height: "auto" }}>
                <div className="d-flex flex-column">
                    <InputText
                        ref={(ref) => this.usersFilterInputRef = ref}
                        autoFocus
                        value={this.state.usersFilterValue}
                        onChange={(e) => this.setState({ usersFilterValue: e.target.value })}
                        placeholder="Please type here to filter" />
                    <div
                    >
                        <DataTable
                            scrollable
                            scrollHeight="400px"
                            className="mt-2"
                            value={userList}
                            selectionMode="single"
                            onSelectionChange={({ value: { label } }) => {
                                this.setState(
                                    { articleDescription: `<p>${this.state.articleDescription}<b>${label}</b> </p>`, showSelectUser: false, usersFilterValue: "" }
                                );
                            }}
                            dataKey="value"
                            responsiveLayout="scroll"
                            globalFilterFields={["label"]}
                            filters={{
                                'global': { value: this.state?.usersFilterValue, matchMode: FilterMatchMode.CONTAINS }
                            }}
                        >
                            <Column field="label" header="Names"></Column>
                        </DataTable>
                    </div>
                </div>
            </Modal.Body>
        </Modal>;
    }

    render() {
        return (
            <>
                {this.renderInsertNewPost()}
                {this.renderInsertImage()}
                {this.renderInsertVideo()}
                {this.renderInsertDocument()}
                {this.renderTagUser()}
            </>
        )
    }
}

export default observer(InsertArticle)
