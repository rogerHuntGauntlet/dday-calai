import React from 'react';

export interface FoodItem {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  portion?: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
  foodDetails?: FoodItem[];
}

interface FoodAnalysisProps {
  imageSrc: string;
  nutritionData: NutritionData | null;
  isLoading: boolean;
  onReset: () => void;
  onManualEntry: () => void;
}

export const FoodAnalysis: React.FC<FoodAnalysisProps> = ({
  imageSrc,
  nutritionData,
  isLoading,
  onReset,
  onManualEntry,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Image with overlay info */}
      <div className="mb-4 relative">
        <div 
          className="w-full h-64 rounded-2xl shadow-md bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${imageSrc})` }}
          role="img"
          aria-label="Food image"
        >
          {/* Image overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Camera controls */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Food calories info overlay */}
          {nutritionData && !isLoading && (
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-80">Total Calories</div>
                  <div className="text-2xl font-bold">{nutritionData.calories} kcal</div>
                </div>
                <div className="bg-green-500 rounded-full px-3 py-1 text-xs font-medium">
                  Logged
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <div className="flex flex-col items-center py-6">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Analyzing your food...</p>
            <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
          </div>
        </div>
      ) : nutritionData ? (
        <div className="space-y-4">
          {/* Macro nutrients summary */}
          <div className="bg-white rounded-2xl shadow-md p-5 mb-2">
            <h2 className="text-lg font-bold mb-4">Nutrition Summary</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-xl font-bold">{nutritionData.calories} kcal</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-xl font-bold">{nutritionData.protein}g</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-xl font-bold">{nutritionData.carbs}g</p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-xl font-bold">{nutritionData.fat}g</p>
              </div>
            </div>

            {/* Nutrition distribution bar */}
            <div className="mb-2">
              <h3 className="font-medium text-sm mb-2">Macronutrient Distribution</h3>
              <div className="h-5 w-full bg-gray-200 rounded-full overflow-hidden">
                {nutritionData.calories > 0 && (
                  <>
                    <div 
                      className="h-full bg-green-500 float-left" 
                      style={{ 
                        width: `${Math.round((nutritionData.protein * 4 / nutritionData.calories) * 100)}%` 
                      }}
                    />
                    <div 
                      className="h-full bg-yellow-500 float-left" 
                      style={{ 
                        width: `${Math.round((nutritionData.carbs * 4 / nutritionData.calories) * 100)}%` 
                      }}
                    />
                    <div 
                      className="h-full bg-red-500 float-left" 
                      style={{ 
                        width: `${Math.round((nutritionData.fat * 9 / nutritionData.calories) * 100)}%` 
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Protein</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <span>Carbs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <span>Fat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Identified foods card */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Food Items</h3>
              <button className="text-green-600 text-sm">Edit</button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3">
              {nutritionData.foodDetails ? (
                <div className="divide-y divide-gray-200">
                  {nutritionData.foodDetails.map((food, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{food.name}</div>
                          {food.portion && <div className="text-xs text-gray-500">{food.portion}</div>}
                        </div>
                        <div className="text-right">
                          <div>{food.calories || '0'} kcal</div>
                          <div className="text-xs text-gray-500">
                            P: {food.protein || '0'}g | C: {food.carbs || '0'}g | F: {food.fat || '0'}g
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc pl-5">
                  {nutritionData.foods.map((food, index) => (
                    <li key={index} className="text-gray-700 py-1">{food}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={onManualEntry}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Not accurate? Enter food details manually
              </button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onReset}
              className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Take Another
            </button>
            <button
              className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors"
            >
              Save to Log
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}; 