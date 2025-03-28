# Cal AI Web

A web application that uses AI to analyze food images and calculate nutrition information.

## Features

- Capture food images using your device camera
- AI-powered food analysis that identifies foods and calculates nutrition
- Detailed nutritional breakdown (calories, protein, carbs, fat)
- Manual entry option for customizing food details
- Responsive design that works on mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key (for AI-powered food recognition)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cal-ai-web.git
   cd cal-ai-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   # For development without OpenAI API, use mock data
   NEXT_PUBLIC_USE_MOCK_DATA=true
   
   # For production with real AI analysis
   # NEXT_PUBLIC_USE_MOCK_DATA=false
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

This app is designed to be easily deployed to Vercel:

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Deploy your app:
   ```bash
   vercel
   ```
4. Set up environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_USE_MOCK_DATA` = false (for production)
   - `OPENAI_API_KEY` = your OpenAI API key

You can also connect your GitHub repository to Vercel for automatic deployments.

## Configuration

### OpenAI Integration

This application uses OpenAI's GPT-4o model with vision capabilities to analyze food images. To use it:

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key from your OpenAI dashboard
3. Add your API key to the `.env.local` file:
   ```
   NEXT_PUBLIC_USE_MOCK_DATA=false
   OPENAI_API_KEY=your_openai_api_key
   ```

### Mock Mode vs. Real API Mode

- By default, the application runs in mock mode, generating random food data
- To use OpenAI for real food recognition:
  1. Get your OpenAI API key
  2. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in your `.env.local` file
  3. Set `OPENAI_API_KEY=your_openai_api_key` in your `.env.local` file

## Tech Stack

- Next.js - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- OpenAI API - Food recognition and analysis
- API Routes - Backend functionality

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
cal-ai-web/
├── app/                # Next.js App Router
│   ├── components/     # React components
│   │   ├── Camera.tsx  # Camera component for image capture
│   │   ├── FoodAnalysis.tsx # Display nutritional analysis
│   │   ├── ManualEntry.tsx  # Manual food entry component
│   │   └── ErrorMessage.tsx # Error message component
│   ├── utils/          # Utility functions
│   │   └── foodAnalysisApi.ts # Mock API for food analysis
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Main page component
├── public/             # Static assets
└── next.config.ts      # Next.js configuration
```

## How It Works

1. **Image Capture**: Take a photo of your food using your device camera
2. **API Processing**: The image is sent to OpenAI's Vision API, which identifies the food items
3. **Nutritional Analysis**: The API returns detailed nutritional information
4. **Result Display**: The app shows a breakdown of calories, macronutrients, and individual food items

## Limitations

This web demo is a simplified version of the Cal AI mobile app:

- The AI analysis is simulated with random data
- Volume estimation is not actually performed
- No user data is stored or persisted

## Future Improvements

- Connect to a real AI model for accurate food recognition
- Implement user accounts and meal history
- Add barcode scanning functionality
- Integrate with food databases for more accurate nutritional information
#   d d a y - c a l a i 
 
 