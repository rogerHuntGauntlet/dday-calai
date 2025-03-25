import { NextRequest, NextResponse } from 'next/server';
import { FoodItem } from '../../components/FoodAnalysis';
import OpenAI from 'openai';

// OpenAI Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Define interface for the API response item
interface ApiResponseItem {
  name: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
  portion?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // If OpenAI API key is not available, return mock data for development
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, returning mock data');
      return NextResponse.json(generateMockResponse(), { status: 200 });
    }
    
    // Call OpenAI's Vision API to analyze the food image
    try {
      const result = await analyzeWithOpenAI(image);
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      // Extract more detailed error information if available
      let errorDetails = String(error);
      if (error.response) {
        errorDetails = JSON.stringify({
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to analyze food image', details: errorDetails },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing food image:', error);
    
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Analyzes food image using OpenAI's Vision API
 * @param imageBase64 Base64 encoded image
 * @returns Structured nutrition data
 */
async function analyzeWithOpenAI(imageBase64: string): Promise<any> {
  // Create system prompt that instructs GPT-4 to analyze the food
  const systemPrompt = `
    You are a nutrition expert that analyzes food images. 
    Identify all visible food items and provide accurate nutritional information for each.
    
    For each food item, estimate:
    1. Food name
    2. Portion size (e.g., "1 cup", "100g", "1 medium")
    3. Calories
    4. Protein (in grams)
    5. Carbohydrates (in grams)
    6. Fat (in grams)
    
    Respond with a JSON object in this exact format:
    {
      "foodItems": [
        {
          "name": "Food Name",
          "portion": "Portion size",
          "calories": 123,
          "protein": 12,
          "carbs": 34,
          "fat": 5
        },
        ...additional food items
      ]
    }
    
    Important notes:
    - Don't include any explanations, only the JSON object.
    - Use realistic nutritional values based on standard food databases.
    - Provide values as numbers, not strings.
    - If you can't identify a food with certainty, make your best guess.
  `;

  try {
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analyze this food image and provide nutritional information in JSON format." 
            },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/jpeg;base64,${imageBase64}` 
              } 
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned an empty response');
    }
    
    console.log("OpenAI response received:", content.substring(0, 100) + "...");
    
    const parsedResponse = JSON.parse(content);
    
    // Check if the response has the expected structure
    if (!parsedResponse.foodItems || !Array.isArray(parsedResponse.foodItems)) {
      console.error("Unexpected response format:", parsedResponse);
      throw new Error('OpenAI response does not contain foodItems array');
    }
    
    // Extract food items from the response
    const foodDetails: FoodItem[] = parsedResponse.foodItems.map((item: any) => ({
      name: item.name,
      calories: Math.round(item.calories) || 0,
      protein: Math.round(item.protein) || 0,
      carbs: Math.round(item.carbs) || 0,
      fat: Math.round(item.fat) || 0,
      portion: item.portion || 'Standard serving',
    }));
    
    // Calculate totals
    const totals = foodDetails.reduce((acc, food) => {
      acc.calories += food.calories || 0;
      acc.protein += food.protein || 0;
      acc.carbs += food.carbs || 0;
      acc.fat += food.fat || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Return in the format expected by the frontend
    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      foods: foodDetails.map(item => item.name),
      foodDetails: foodDetails,
    };
  } catch (error: any) {
    console.error("OpenAI API call failed:", error);
    if (error.response) {
      console.error("OpenAI API error details:", error.response.data);
    }
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Generate mock response for development without API key
function generateMockResponse() {
  const foodOptions: FoodItem[] = [
    { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: '100g' },
    { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, portion: '1 cup cooked' },
    { name: 'Steamed Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, portion: '1 cup' },
    { name: 'Salmon', calories: 206, protein: 22.1, carbs: 0, fat: 13, portion: '100g' },
    { name: 'Quinoa', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, portion: '1 cup cooked' },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, portion: '1 cup raw' },
    { name: 'Steak', calories: 271, protein: 25.6, carbs: 0, fat: 18.5, portion: '100g' },
    { name: 'Mashed Potatoes', calories: 174, protein: 2.5, carbs: 36.6, fat: 2.1, portion: '1 cup' },
    { name: 'Asparagus', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.2, portion: '6 spears' },
    { name: 'Avocado', calories: 234, protein: 2.9, carbs: 12.5, fat: 21.5, portion: '1 medium' },
    { name: 'Sweet Potato', calories: 114, protein: 2.1, carbs: 26.8, fat: 0.1, portion: '1 medium' },
    { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4, portion: '170g container' },
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
  
  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
    foods: selectedFoods.map(food => food.name),
    foodDetails: selectedFoods,
  };
} 