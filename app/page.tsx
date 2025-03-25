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

  const handleImageCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setIsAnalyzing(true);
    setErrorMessage(null);
    
    try {
      const result = await analyzeFoodImage(imageSrc);
      setNutritionData(result);
    } catch (_) {
      console.error('Error analyzing food image:', _);
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
      } catch (_) {
        setErrorMessage('Failed to analyze the food image. Please try again or enter details manually.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-green-600 mr-2">Cal</span>
            <span className="bg-black text-white px-2 rounded-md">AI</span>
            <span className="text-sm font-normal ml-3 text-gray-500">Web Version</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {!capturedImage ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Track calories with just a picture</h2>
                <p className="text-gray-600">
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
          
          {!showManualEntry && (
            <div className="mt-12 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">How Cal AI Works</h2>
              <ol className="list-decimal pl-5 space-y-3">
                <li className="text-gray-700">
                  <span className="font-medium">Image Capture:</span> Take a photo of your meal
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Volume Estimation:</span> AI figures out the volume of your food
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Food Identification:</span> AI identifies the different foods in your meal
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Nutritional Analysis:</span> Calculate calories, protein, carbs and fat
                </li>
              </ol>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white mt-12 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Cal AI Web Demo - Track your calories with just a picture.
          </p>
        </div>
      </footer>
    </div>
  );
}
