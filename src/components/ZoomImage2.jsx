import { useRef, useMemo, useEffect, useState } from "react";

const ZoomImage2 = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [draggind, setDragging] = useState(false);

  const image = "https://placehold.co/600x400";

  const touch = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const observer = useRef(null);
  const background = useMemo(() => new Image(), [image]);

  const handleClick = () => {
    console.log("Clicked");
    if (!draggind) {
      if (zoom === 1.7) {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      } else {
        setZoom(1.7);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (draggind) {
      const { x, y } = touch.current;
      console.log("x, y: ", x, " | ", y);
      const { clientX, clientY } = event;
      console.log("client X, Y: ", clientX, " | ", clientY);
      setOffset({
        x: offset.x + (x - clientX),
        y: offset.y + (y - clientY),
      });
      touch.current = { x: clientX, y: clientY };
    }
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    touch.current = { x: clientX, y: clientY };
    setDragging(true);
  };

  const handleMouseUp = () => setDragging(false);

  const draw = () => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      // Set canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Clear canvas and scale it
      context.translate(-offset.x, -offset.y);
      context.scale(zoom, zoom);
      context.clearRect(0, 0, width, height);

      // Make sure we're zooming to the center
      const x = (context.canvas.width / zoom - background.width) / 1;
      const y = (context.canvas.height / zoom - background.height) / 1;

      // Draw image
      context.drawImage(background, x, y);
    }
  };

  useEffect(() => {
    observer.current = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const { width, height } = background;
        // If width of the container is smaller than image, scale image down
        if (target.clientWidth < width) {
          // Calculate scale
          const scale = target.clientWidth / width;

          // Redraw image
          canvasRef.current.width = width * scale;
          canvasRef.current.height = height * scale;
          canvasRef.current
            .getContext("2d")
            .drawImage(background, 0, 0, width * scale, height * scale);
        }
      });
    });
    observer.current.observe(containerRef.current);

    return () => observer.current.unobserve(containerRef.current);
  }, []);

  useEffect(() => {
    background.src = image;

    if (canvasRef.current) {
      background.onload = () => {
        // Get the image dimensions
        const { width, height } = background;
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Set image as background
        canvasRef.current.getContext("2d").drawImage(background, 0, 0);
      };
    }
  }, [background]);

  useEffect(() => {
    draw();
  }, [zoom, offset]);

  return (
    <div ref={containerRef}>
      <canvas
        onDoubleClickCapture={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
      />
    </div>
  );
};

export default ZoomImage2;
