import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md rounded-lg overflow-hidden mb-4 bg-gray-100">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment"  // Use the back camera on mobile devices
          }}
          onUserMedia={handleUserMedia}
          className="w-full"
        />
      </div>
      
      <button
        onClick={captureImage}
        disabled={!isCameraReady}
        className={`px-6 py-3 rounded-full font-medium text-white ${
          isCameraReady 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gray-400 cursor-not-allowed'
        } transition-colors`}
      >
        {isCameraReady ? 'Take Photo' : 'Camera Loading...'}
      </button>
    </div>
  );
}; 