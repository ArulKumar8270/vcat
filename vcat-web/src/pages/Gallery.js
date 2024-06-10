import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Dimensions from "../modals/Dimensions";
import "../components/css/gallery.css";
import GalleryCard from "../components/GalleryCard";
import CAFirms from "../components/img/events/CA-Firms.png";
import IncomeTax from "../components/img/events/Income-Tax.png";
import Understanding from "../components/img/events/Understanding.png";
import PopupModal from "../components/Popup";
import { callApi } from "../libraries/Api";

function Gallery(props) {
  const [initialEventName, setInitialEventName] = useState("");
  const [initalEventImages, setInitalEventImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalGallery, setModalGallery] = useState([]);
  const [modalGalleryInitial, setModalGalleryInitial] = useState("");

  const [showLoader, setShowLoader] = useState(true);

  const [galleryCategories, setGalleryCategories] = useState([]);
  const [splicedGalleryCategories, setSplicedGalleryCategories] = useState([]);

  function changeMainImage(index) {
    if (initalEventImages && initalEventImages.length > 0) {
      initalEventImages.push(mainImage);

      for (const [i, image] of initalEventImages.entries()) {
        if (i === index) {
          setMainImage(image);
          initalEventImages.splice(index, 1);
        }
      }
      setInitalEventImages([...initalEventImages]);
    }
  }

  function handleForwardPress() {
    const arr = [...modalGallery];
    const unShiftedImage = arr.shift();
    arr.push(modalGalleryInitial);
    setModalGalleryInitial(unShiftedImage);
    setModalGallery([...arr]);
  }

  function handleBackPress() {
    const arr = [...modalGallery];
    const poppedImage = arr.pop();
    arr.unshift(modalGalleryInitial);
    setModalGalleryInitial(poppedImage);
    setModalGallery([...arr]);
  }

  function handleViewMoreGallery() {
    const splicedArr = splicedGalleryCategories.splice(0, 5);
    setSplicedGalleryCategories([...splicedGalleryCategories]);
    const concatEventsGallery = galleryCategories.concat([...splicedArr]);
    setGalleryCategories([...concatEventsGallery]);
  }

  function getGalleryDetails(index) {
    for (const [i, data] of galleryCategories.entries()) {
      if (i === index) {
        setModalData({ ...data });
        const tempGallery = [...data.gallery];
        const shiftedImage = tempGallery.shift();
        data.gallery && data.gallery.length > 0
          ? setModalGalleryInitial(shiftedImage)
          : setModalGalleryInitial("");
        data.gallery && data.gallery.length > 0
          ? setModalGallery([...tempGallery])
          : setModalGallery([]);
      }
    }
    setShowModal(true);
  }

  function galleryApi() {
    const functionUrl = "eventsPage";

    callApi(functionUrl, {}, "GET")
      .then((response) => {
        if (response.statuscode === 200) {
          const result = response.result;
          const data = [];
          const pastEventsApi = result.past_events;
          const upcomingEventsApi = result.upcoming_events;
          let eventGalleryArr = [];
          let mainGalleryObj = {};

          if (pastEventsApi && pastEventsApi.length > 0) {
            for (const [i, eventData] of pastEventsApi.entries()) {
              const { name, gallery } = eventData;
              let obj = {};
              if (gallery && gallery.length > 0) {
                obj["eventName"] = name;
                gallery && gallery.length > 0
                  ? (obj["image"] = gallery[0])
                  : (obj["image"] = "");
                obj["gallery"] = [...gallery];
                eventGalleryArr.push({ ...obj });
              }
            }
          }
          if (eventGalleryArr && eventGalleryArr.length > 0) {
            for (const imageGallery of eventGalleryArr) {
              if (imageGallery.gallery.length > 0) {
                mainGalleryObj = eventGalleryArr.shift();
                break;
              }
            }
          }
          if (mainGalleryObj.gallery && mainGalleryObj.gallery.length > 0) {
            const shiftedImage = mainGalleryObj.gallery.shift();
            setInitialEventName(mainGalleryObj.eventName);
            setMainImage(shiftedImage);
            setInitalEventImages([...mainGalleryObj.gallery]);
          }
          const splicedEventGalleryArr = eventGalleryArr.splice(0, 5);
          setGalleryCategories([...splicedEventGalleryArr]);
          setSplicedGalleryCategories([...eventGalleryArr]);
          setShowLoader(false);
        } else {
          setInitialEventName("");
          setMainImage("");
          setInitalEventImages([]);
          setGalleryCategories([]);
          setSplicedGalleryCategories([]);
          setShowLoader(false);
        }
      })
      .catch((err) => {
        setInitialEventName("");
        setMainImage("");
        setInitalEventImages([]);
        setGalleryCategories([]);
        setSplicedGalleryCategories([]);
        setShowLoader(false);
      });
  }

  useEffect(() => {
    // setInitalEventImages([...arr]);
    // setGalleryCategories([...arr]);
    // setModalGallery([...arr]);
    // setMainImage(unsplash);
    // setModalGalleryInitial(unsplash);
    galleryApi();
  }, []);

  if (!mainImage) {
    // if (initalEventImages && initalEventImages.length === 0) {
    return (
      <div id="galleryParent">
        <div style={{ minHeight: "200px", position: "relative" }}>
          {showLoader ? (
            <div
              className="spinner-border"
              role="status"
              // style={{
              //   position: "relative",
              //   top: "5rem",
              //   left: "45rem",
              //   color: "#1c1777",
              //   marginBottom: "9rem",
              // }}
              id="galleryLoader"
            >
              {/* <span class="sr-only">Loading...</span> */}
            </div>
          ) : (
            // <div style={{ minHeight: "200px", position: "relative" }}>
            <h3
              id="noGallery"
              // style={{
              //   position: "absolute",
              //   top: "80px",
              //   left: "670px",
              // }}
            >
              No Gallery
            </h3>
            // </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="galleryParent" className="upev-bg">
        {/* <section style={{ marginBottom: "30rem" }}> */}
        <section id="initialGallerySection">
          <h1 id="initialEventName">{initialEventName}</h1>
          <div id="imageContainer">
            <div id="galleryMainImageContainer">
              <img src={mainImage} alt="gallery_pic" id="galleryMainImage" />
            </div>
          </div>
          <div id="mainImageListContainer">
            {initalEventImages &&
              initalEventImages.length > 0 &&
              initalEventImages.map((image, i) => (
                <div key={i} id="imageListContainer">
                  <img
                    src={image}
                    alt="event_pic"
                    id="imageList"
                    onClick={() => changeMainImage(i)}
                  />
                </div>
              ))}
          </div>
        </section>
        {/* <section
          style={{
            marginTop: Dimensions._windowWidth > 750 ? "0rem" : "4rem",
          }}
        > */}
        <div>
          <div id="galleryList">
            {galleryCategories &&
              galleryCategories.length > 0 &&
              galleryCategories.map((data, i) => (
                <GalleryCard
                  image={data.image}
                  label={data.eventName}
                  uniqueKey={i}
                  getGalleryDetails={getGalleryDetails}
                />
              ))}
          </div>
          <PopupModal
            show={showModal}
            onHide={() => setShowModal(false)}
            modalData={modalData}
            modalGallery={modalGallery}
            modalGalleryInitial={modalGalleryInitial}
            handleForwardPress={handleForwardPress}
            handleBackPress={handleBackPress}
          />
        </div>
        {/* </section> */}
        <div className="container-wrapper">
          <div className="row">
            <div
              className="d-flex align-item-center justify-center mb-4"
              id="buttonContainer"
            >
              <Button
                className="btn btn-primary m-auto"
                disabled={splicedGalleryCategories.length === 0}
                name="1"
                id="btn-view"
                onClick={handleViewMoreGallery}
              >
                View More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gallery;
