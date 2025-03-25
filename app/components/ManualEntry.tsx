import React, { useState } from 'react';
import { NutritionData, FoodItem } from './FoodAnalysis';

interface ManualEntryProps {
  onSave: (data: NutritionData) => void;
  onCancel: () => void;
}

interface FoodItemInput extends Omit<FoodItem, 'calories' | 'protein' | 'carbs' | 'fat'> {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({ onSave, onCancel }) => {
  const [foodItems, setFoodItems] = useState<FoodItemInput[]>([{
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    portion: ''
  }]);

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, {
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      portion: ''
    }]);
  };

  const handleFoodItemChange = (index: number, field: keyof FoodItemInput, value: string) => {
    const newFoodItems = [...foodItems];
    newFoodItems[index] = {
      ...newFoodItems[index],
      [field]: value
    };
    setFoodItems(newFoodItems);
  };

  const handleRemoveFoodItem = (index: number) => {
    if (foodItems.length > 1) {
      const newFoodItems = [...foodItems];
      newFoodItems.splice(index, 1);
      setFoodItems(newFoodItems);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty food items
    const filteredFoodItems = foodItems.filter(item => item.name.trim() !== '');
    
    // Validate form
    if (filteredFoodItems.length === 0) {
      alert('Please add at least one food item');
      return;
    }
    
    // Convert string values to numbers
    const detailedFoodItems: FoodItem[] = filteredFoodItems.map(item => ({
      name: item.name,
      calories: parseInt(item.calories, 10) || 0,
      protein: parseInt(item.protein, 10) || 0,
      carbs: parseInt(item.carbs, 10) || 0,
      fat: parseInt(item.fat, 10) || 0,
      portion: item.portion || 'Standard serving'
    }));
    
    // Calculate totals
    const totals = detailedFoodItems.reduce((acc, food) => {
      acc.calories += food.calories || 0;
      acc.protein += food.protein || 0;
      acc.carbs += food.carbs || 0;
      acc.fat += food.fat || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Create nutrition data object
    const nutritionData: NutritionData = {
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      foods: detailedFoodItems.map(item => item.name),
      foodDetails: detailedFoodItems
    };
    
    onSave(nutritionData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="p-2 -ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-lg font-bold">Manual Food Entry</h2>
        <div className="w-5"></div> {/* Spacer for centering */}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4 mb-4">
          {foodItems.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                    {index + 1}
                  </div>
                  <h3 className="font-medium">Food Item</h3>
                </div>
                {foodItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFoodItem(index)}
                    className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Food Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="E.g., Grilled Chicken Breast"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Calories</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.calories}
                        onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">kcal</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Portion</label>
                    <input
                      type="text"
                      value={item.portion}
                      onChange={(e) => handleFoodItemChange(index, 'portion', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="100g"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Protein</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.protein}
                        onChange={(e) => handleFoodItemChange(index, 'protein', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">g</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Carbs</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.carbs}
                        onChange={(e) => handleFoodItemChange(index, 'carbs', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">g</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Fat</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.fat}
                        onChange={(e) => handleFoodItemChange(index, 'fat', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleAddFoodItem}
          className="w-full py-3 border border-dashed border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-colors mb-4 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add another food item
        </button>
        
        <div className="sticky bottom-0 pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}; 