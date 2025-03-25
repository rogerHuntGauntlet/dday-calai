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
      <div className="mb-4 relative">
        <div 
          className="w-full h-80 rounded-lg shadow-md bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
          role="img"
          aria-label="Food image"
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-4 border-green-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Analyzing your food...</p>
          </div>
        </div>
      ) : nutritionData ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 text-center">Nutrition Analysis</h2>
          
          {/* Macro nutrients summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-xl font-bold">{nutritionData.calories} kcal</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-xl font-bold">{nutritionData.protein}g</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-xl font-bold">{nutritionData.carbs}g</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Fat</p>
              <p className="text-xl font-bold">{nutritionData.fat}g</p>
            </div>
          </div>

          {/* Nutrition distribution pie chart representation */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Macronutrient Distribution</h3>
            <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
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

          {/* Identified foods */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Identified Foods:</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              {nutritionData.foodDetails ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-2">Food</th>
                      <th className="pb-2 text-right">Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.foodDetails.map((food, index) => (
                      <tr key={index} className="border-b border-gray-200 last:border-0">
                        <td className="py-2">
                          <div>{food.name}</div>
                          {food.portion && <div className="text-xs text-gray-500">{food.portion}</div>}
                        </td>
                        <td className="py-2 text-right">{food.calories || '-'} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <ul className="list-disc pl-5">
                  {nutritionData.foods.map((food, index) => (
                    <li key={index} className="text-gray-700 py-1">{food}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={onManualEntry}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Not accurate? Enter food details manually
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-medium transition-colors"
        >
          Take Another Photo
        </button>
      </div>
    </div>
  );
}; 