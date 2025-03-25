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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Manual Food Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {foodItems.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Food Item {index + 1}</h3>
              {foodItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFoodItem(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">Food Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., Grilled Chicken Breast"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Calories</label>
                <input
                  type="number"
                  value={item.calories}
                  onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Calories (kcal)"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Portion</label>
                <input
                  type="text"
                  value={item.portion}
                  onChange={(e) => handleFoodItemChange(index, 'portion', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E.g., 1 cup, 100g"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={item.protein}
                  onChange={(e) => handleFoodItemChange(index, 'protein', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Protein (g)"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={item.carbs}
                  onChange={(e) => handleFoodItemChange(index, 'carbs', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Carbs (g)"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={item.fat}
                  onChange={(e) => handleFoodItemChange(index, 'fat', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fat (g)"
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddFoodItem}
          className="w-full py-2 border border-dashed border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          + Add another food item
        </button>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}; 