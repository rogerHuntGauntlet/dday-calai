import { NutritionData, FoodItem } from '../components/FoodAnalysis';

/**
 * Analyzes a food image and returns nutrition data.
 * @param imageBase64 Base64 encoded image string
 * @returns Promise resolving to nutrition data
 */
export async function analyzeFoodImage(imageBase64: string): Promise<NutritionData> {
  // For demo/dev fallback when API is not available
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    console.log('Using mock data for food analysis');
    return generateMockData();
  }
  
  try {
    console.log('Analyzing food image with OpenAI...');
    // Remove the data URL prefix to get just the base64 content
    const base64Data = imageBase64.split(',')[1];
    
    // Call the actual API endpoint
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Data }),
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to analyze food image';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Food analysis complete. Identified:', data.foods.join(', '));
    return {
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      foods: data.foods,
      foodDetails: data.foodDetails,
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw error;
  }
}

// Mock function for development and fallback purposes
function generateMockData(): Promise<NutritionData> {
  return new Promise((resolve) => {
    // Simulate API call delay (1-2 seconds)
    setTimeout(() => {
      // Generate random nutrition data for demo purposes
      const foodOptions: FoodItem[] = [
        { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: '100g' },
        { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, portion: '1 cup cooked' },
        { name: 'Steamed Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, portion: '1 cup' },
        { name: 'Salmon', calories: 206, protein: 22.1, carbs: 0, fat: 13, portion: '100g' },
        { name: 'Quinoa', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, portion: '1 cup cooked' },
        { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, portion: '1 cup raw' }
      ];
      
      // Randomly select 2-3 food items
      const numItems = Math.floor(Math.random() * 2) + 2;
      const selectedFoods: FoodItem[] = [];
      const usedIndices = new Set();
      
      while (selectedFoods.length < numItems) {
        const index = Math.floor(Math.random() * foodOptions.length);
        if (!usedIndices.has(index)) {
          usedIndices.add(index);
          selectedFoods.push(foodOptions[index]);
        }
      }
      
      // Calculate totals
      const totals = selectedFoods.reduce((acc, food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      resolve({
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat),
        foods: selectedFoods.map(food => food.name),
        foodDetails: selectedFoods,
      });
    }, 1000 + Math.random() * 1000);
  });
} 