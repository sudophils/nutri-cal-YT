# 🍽️ PHIXLAB Calories AI

A simple, mobile-first landing page that allows users to upload or capture meal photos and get instant macronutrient analysis (protein, carbs, fat, calories) via AI.

## ✨ Features

- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Image Upload**: Upload existing photos from device gallery
- **Camera Capture**: Take photos directly using device camera
- **Instant Analysis**: Get nutrition breakdown in seconds
- **Beautiful UI**: Clean, modern interface with Tailwind CSS
- **Dark Mode Support**: Automatic dark/light theme support

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Image Processing**: Built-in Next.js Image component
- **API**: Next.js API Routes

## 📱 How to Use

1. **Upload or Capture**: Choose to upload an existing photo or take a new one
2. **Analyze**: Click the "Analyze Nutrition" button
3. **View Results**: See instant breakdown of calories, protein, carbs, and fat
4. **Repeat**: Analyze another meal with the reset button

## 🔧 API Integration

The app currently uses mock data for nutrition analysis. To integrate with a real AI service:

1. Replace the mock function in `/src/app/api/analyze/route.ts`
2. Add your AI service API key to environment variables
3. Update the analysis logic with your preferred service (OpenAI Vision, Google Vision, etc.)

Example integration:
```typescript
// Add to .env.local
AI_SERVICE_API_KEY=your_api_key_here

// Update the analysis function
async function analyzeNutritionWithAI(base64Image: string) {
  const response = await fetch('YOUR_AI_SERVICE_ENDPOINT', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`,
    },
    body: JSON.stringify({
      image: base64Image,
      prompt: "Analyze nutrition content..."
    }),
  });
  return response.json();
}
```

## 🚀 Deployment

Deploy easily on Vercel:

```bash
npm i -g vercel
vercel
```

Or use the [Vercel Platform](https://vercel.com/new) for one-click deployment.

## 📝 Project Structure

```
src/
├── app/
│   ├── api/analyze/
│   │   └── route.ts          # Nutrition analysis API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main landing page
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
