import React from "react";

import images from "../../constants/images";

interface ImageHolderProps {
  photo?: string;
}

const ImageHolder = ({ photo }: ImageHolderProps) => {
  return (
    <>
      <div className="symbol symbol-100px symbol-circle mb-7">
        {photo && <img src={photo} alt="image" />}
        {!photo && <img src={images.mainLogo} alt="image" />}
      </div>
    </>
  );
};

export default ImageHolder;
