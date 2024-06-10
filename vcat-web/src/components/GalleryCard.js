import React from "react";

const GalleryCard = ({ image, label, uniqueKey, getGalleryDetails }) => {
  return (
    <>
      <div
        id="galleryCardContainer"
        key={uniqueKey}
        onClick={() => getGalleryDetails(uniqueKey)}
      >
        <div>
          <img src={image} alt="event_pic" id="galleryCardImage" />
        </div>
        <h3 id="galleryLabel">{label}</h3>
      </div>
    </>
  );
};

export default GalleryCard;
