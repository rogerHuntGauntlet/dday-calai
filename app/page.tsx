"use client";

import React, { useState } from 'react';
import { Camera } from './components/Camera';
import { FoodAnalysis, NutritionData } from './components/FoodAnalysis';
import { ManualEntry } from './components/ManualEntry';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeFoodImage } from './utils/foodAnalysisApi';

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'camera' | 'history' | 'profile'>('camera');

  // Get current time for the status bar
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleImageCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setIsAnalyzing(true);
    setErrorMessage(null);
    
    try {
      const result = await analyzeFoodImage(imageSrc);
      setNutritionData(result);
    } catch (error) {
      // Error is logged but not otherwise used
      console.error('Error analyzing food image:', error);
      setErrorMessage('Failed to analyze the food image. Please try again or enter details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setNutritionData(null);
    setShowManualEntry(false);
    setErrorMessage(null);
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setErrorMessage(null);
  };

  const handleManualSave = (data: NutritionData) => {
    setNutritionData(data);
    setShowManualEntry(false);
    setErrorMessage(null);
  };

  const handleManualCancel = () => {
    setShowManualEntry(false);
  };

  const handleRetry = () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    
    // Simulate retrying the analysis
    setTimeout(async () => {
      try {
        if (capturedImage) {
          const result = await analyzeFoodImage(capturedImage);
          setNutritionData(result);
        }
      } catch {
        setErrorMessage('Failed to analyze the food image. Please try again or enter details manually.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Status Bar */}
      <div className="px-4 pt-2 pb-1 flex justify-between items-center bg-black text-white">
        <div className="text-sm font-semibold">{currentTime}</div>
        <div className="flex space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12a2 2 0 010 4H8a2 2 0 110-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11h7a2 2 0 010 4h-7m-4-7v10a1 1 0 01-1 1H6a1 1 0 01-1-1v-10a1 1 0 011-1h2a1 1 0 011 1z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* App Header */}
      <header className="bg-green-600 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center">
            Cal<span className="bg-white text-black px-2 rounded-md ml-1">AI</span>
          </h1>
          <button className="text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-16">
        <div className="max-w-md mx-auto">
          {currentTab === 'camera' && (
            <>
              {!capturedImage ? (
                <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Track calories with just a picture</h2>
                    <p className="text-gray-600 text-sm">
                      Take a photo of your food and our AI will instantly calculate calories and nutrients
                    </p>
                  </div>
                  <Camera onCapture={handleImageCapture} />
                </div>
              ) : showManualEntry ? (
                <ManualEntry onSave={handleManualSave} onCancel={handleManualCancel} />
              ) : (
                <>
                  {errorMessage && <ErrorMessage message={errorMessage} onRetry={handleRetry} />}
                  <FoodAnalysis
                    imageSrc={capturedImage}
                    nutritionData={nutritionData}
                    isLoading={isAnalyzing}
                    onReset={handleReset}
                    onManualEntry={handleManualEntry}
                  />
                </>
              )}
          
              {!showManualEntry && !capturedImage && (
                <div className="mt-4 bg-white rounded-2xl shadow-md p-4">
                  <h2 className="text-lg font-bold mb-2">How Cal AI Works</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li className="text-gray-700">
                      <span className="font-medium">Image Capture:</span> Take a photo of your meal
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Volume Estimation:</span> AI figures out portions
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Food Identification:</span> AI identifies food types
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Nutritional Analysis:</span> Calculate nutrients
                    </li>
                  </ol>
                </div>
              )}
            </>
          )}

          {currentTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Meal History</h2>
              <div className="text-center text-gray-500 py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No meal history yet</p>
                <p className="text-sm mt-1">Your logged meals will appear here</p>
              </div>
            </div>
          )}

          {currentTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">My Profile</h2>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Guest User</h3>
                  <p className="text-gray-500 text-sm">Create an account to save your progress</p>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium">Sign Up</button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium mt-2">Log In</button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2">
        <button 
          onClick={() => setCurrentTab('history')} 
          className={`flex flex-col items-center justify-center w-20 h-full ${currentTab === 'history' ? 'text-green-600' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">History</span>
        </button>
        <button 
          onClick={() => {
            setCurrentTab('camera');
            handleReset();
          }} 
          className={`flex flex-col items-center justify-center w-20 h-full ${currentTab === 'camera' ? 'text-green-600' : 'text-gray-500'}`}
        >
          <div className={`rounded-full p-2 ${currentTab === 'camera' ? 'bg-green-100' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1">Camera</span>
        </button>
        <button 
          onClick={() => setCurrentTab('profile')} 
          className={`flex flex-col items-center justify-center w-20 h-full ${currentTab === 'profile' ? 'text-green-600' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
