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
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-black">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "environment",  // Use the back camera on mobile devices
            width: { ideal: 1080 },
            height: { ideal: 1080 }
          }}
          onUserMedia={handleUserMedia}
          className="w-full h-full object-cover"
        />
        
        {/* Camera grid overlay */}
        <div className="absolute inset-0 border-2 border-white opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <div className="border-r border-b border-white opacity-20"></div>
          <div className="border-r border-l border-b border-white opacity-20"></div>
          <div className="border-l border-b border-white opacity-20"></div>
          <div className="border-r border-t border-b border-white opacity-20"></div>
          <div className="border border-white opacity-20"></div>
          <div className="border-l border-t border-b border-white opacity-20"></div>
          <div className="border-r border-t border-white opacity-20"></div>
          <div className="border-r border-l border-t border-white opacity-20"></div>
          <div className="border-l border-t border-white opacity-20"></div>
        </div>
        
        {/* Camera UI elements */}
        <div className="absolute top-3 right-3">
          <button className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="w-full flex justify-center items-center mb-2">
        <button
          onClick={captureImage}
          disabled={!isCameraReady}
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isCameraReady 
              ? 'bg-white border-4 border-gray-300' 
              : 'bg-gray-300'
          } transition-colors`}
          aria-label="Take photo"
        >
          <div className={`w-12 h-12 rounded-full ${
            isCameraReady 
              ? 'bg-red-500' 
              : 'bg-gray-400'
          }`}></div>
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        {isCameraReady ? 'Tap the button to take a photo' : 'Camera is loading...'}
      </p>
    </div>
  );
}; 