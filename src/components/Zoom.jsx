import { useState } from "react";

const ZoomableImage = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClick = () => {
    console.log("Clicked");
    setIsZoomed((prevIsZoomed) => !prevIsZoomed);
  };

  const style = {
    transform: isZoomed ? "scale(1.6)" : "scale(1)",
    transition: "transform .3s",
  };


  return (
    <>
      <div className="img-container">
        <img
          src="https://placehold.co/600x400"
          alt="Zoomable"
          style={style}
          onDoubleClickCapture={handleClick}
        />
      </div>
      <button onDoubleClick={handleClick}>Click me</button>
    </>
  );
};

export default ZoomableImage;
