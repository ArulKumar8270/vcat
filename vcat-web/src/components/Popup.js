// import React from "react";
// import { Modal } from "react-bootstrap";

// const PopupModal = (props) => {
//   const { show, onHide, modalData } = props;
//   console.log("modalData", modalData);
//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       {/* <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Modal heading
//         </Modal.Title>
//       </Modal.Header> */}
//       <Modal.Body>
//         {modalData && Object.keys(modalData).length > 0 && (
//           <>
//             <h4>Centered Modal</h4>
//             <p>
//               Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//               dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
//               ac consectetur ac, vestibulum at eros.
//             </p>
//           </>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default PopupModal;

import React, { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoChevronForwardCircle, IoChevronBackCircle } from "react-icons/io5";
import ReactModal from "react-modal";
import Dimensions from "../modals/Dimensions";
import "./css/gallery.css";

const PopupModal = (props) => {
  const {
    show,
    onHide,
    modalData,
    modalGallery,
    modalGalleryInitial,
    handleForwardPress,
    handleBackPress,
  } = props;
  console.log("props", props);

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    if (!show) document.body.style.overflow = "unset";
  }, [show]);

  return (
    <ReactModal
      isOpen={show}
      onAfterOpen={() => console.log("onAfterOpen_called--->")}
      onAfterClose={() => console.log("handleAfterCloseFunc_called--->")}
      onRequestClose={onHide}
      closeTimeoutMS={0}
      style={{
        overlay: {
          position: "fixed",
          top: Dimensions._windowWidth >= 576 ? 0 : 55,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(68, 70, 74, 1)",
        },
        content: {
          position: "absolute",
          // top: "40px",
          // left: "40px",
          // right: "40px",
          // bottom: "40px",
          top: Dimensions._windowWidth >= 576 ? "140px" : "40px",
          left: "10px",
          right: "10px",
          bottom: "40px",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "10px",
          outline: "none",
          padding: "20px",
        },
      }}
      contentLabel={"Gallery Modal"}
      portalClassName={"ReactModalPortal"}
      overlayClassName={"ReactModal__Overlay"}
      id={"some-id"}
      className={"ReactModal__Content"}
      bodyOpenClassName={"ReactModal__Body--open"}
      htmlOpenClassName={"ReactModal__Html--open"}
      ariaHideApp={true}
      shouldFocusAfterRender={true}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      shouldReturnFocusAfterClose={true}
      role={"dialog"}
      preventScroll={true}
      // parentSelector={() => document.body}
      aria={{
        labelledby: "heading",
        describedby: "full_description",
      }}
      // data={{ background: "green" }}
      // testId={""}
      // overlayRef={setOverlayRef}
      // contentRef={setContentRef}
      // overlayElement={(props, contentElement) => <div {...props}>{contentElement}</div>}
      // contentElement={(props, children) => <div {...props}>{children}</div>}
    >
      <>
        <AiOutlineCloseCircle
          size="2rem"
          onClick={onHide}
          id="closeCircleIcon"
        />
        {modalData && Object.keys(modalData).length > 0 && (
          <section>
            <h1 style={{ margin: "-2rem 0 1rem 0rem", width: "80rem" }}>
              {modalData.eventName}
            </h1>
            <div id="modelImageContainer">
              <div id="galleryModelMainImageContainer">
                <img
                  src={modalGalleryInitial}
                  alt="gallery_pic"
                  id="galleryModelMainImage"
                />
              </div>
            </div>
            <IoChevronBackCircle
              id="galleryBackIcon"
              size="2rem"
              onClick={handleBackPress}
            />
            <IoChevronForwardCircle
              id="galleryForwardIcon"
              size="2rem"
              onClick={handleForwardPress}
            />
            <div id="modelMainImageListContainer">
              {modalGallery &&
                modalGallery.length > 0 &&
                modalGallery.map((image, i) => (
                  <div key={i} id="modelImageListContainer">
                    <img src={image} alt="event_pic" id="modelImageList" />
                  </div>
                ))}
            </div>
          </section>
        )}
      </>
    </ReactModal>
  );
};

export default PopupModal;
