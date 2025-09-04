'use client';

import { useState, useEffect } from 'react';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

interface NutritionData {
  status: boolean;
  food: FoodItem[];
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  recipes: Recipe[];
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'foods' | 'recipes'>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setNutritionData(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    } else if (file) {
      setError('Please select a valid image file');
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    input.click();
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('https://n8n.phixlab.com/webhook-test/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      // Handle different response structures
      if (result?.output?.status) {
        // Direct output object
        console.log('Using direct output structure');
        setNutritionData(result.output);
      } else if (Array.isArray(result) && result[0]?.output?.status) {
        // Array with output object
        console.log('Using array output structure');
        setNutritionData(result[0].output);
      } else if (result?.status) {
        // Direct result object
        console.log('Using direct result structure');
        setNutritionData(result);
      } else {
        console.error('Unexpected response structure:', result);
        setError('Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setNutritionData(null);
    setError(null);
    setActiveTab('overview');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            PHIXLAB
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
            <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            AI-Powered Nutrition Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-black dark:text-white">Understand</span>
            <br />
            <span className="text-black dark:text-white">your </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              food
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-3xl mx-auto mb-16">
            Advanced AI that instantly analyzes your meals.
            <br />
            Get precise nutrition data from a single photo.
          </p>
        </div>
      </section>

      {/* Main App Interface */}
      <section className="relative px-6 pb-32">
        <div className="max-w-2xl mx-auto">
          {!selectedImage ? (
            <div className="relative">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-12 text-center shadow-2xl">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                  Capture your meal
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 font-light">
                  Upload from your gallery or take a fresh photo
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <label className="group relative overflow-hidden bg-black dark:bg-white text-white dark:text-black font-semibold py-5 px-10 rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center gap-3 text-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <svg className="relative z-10 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="relative z-10">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                  
                  <button
                    onClick={handleCameraCapture}
                    className="group relative overflow-hidden bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold py-5 px-10 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center gap-3 text-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <svg className="relative z-10 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="relative z-10">Take Photo</span>
                  </button>
                </div>
              </div>
              
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8">
                  <div className="relative mb-8 group">
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Selected meal"
                        className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                        onError={() => setError('Failed to display image')}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300" />
                  </div>
                  
                  {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                      <p className="text-red-600 dark:text-red-400 text-center font-medium">
                        {error}
                      </p>
                    </div>
                  )}
                  
                  {!nutritionData && !isAnalyzing && (
                    <div className="text-center mb-8">
                      <button
                        onClick={analyzeImage}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white font-bold py-5 px-12 rounded-2xl text-lg transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-3xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="relative z-10">Analyze Nutrition</span>
                      </button>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center py-16">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-8 text-xl text-gray-600 dark:text-gray-300 font-medium">
                        Analyzing your meal...
                      </p>
                    </div>
                  )}

                  {nutritionData && (
                    <div className="mb-8">
                      {/* Tab Navigation */}
                      <div className="flex justify-center mb-8">
                        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 rounded-2xl p-1.5 inline-flex">
                          <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                              activeTab === 'overview'
                                ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            Overview
                          </button>
                          <button
                            onClick={() => setActiveTab('foods')}
                            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                              activeTab === 'foods'
                                ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            Foods ({nutritionData.food?.length || 0})
                          </button>
                          <button
                            onClick={() => setActiveTab('recipes')}
                            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                              activeTab === 'recipes'
                                ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            Recipes ({nutritionData.recipes?.length || 0})
                          </button>
                        </div>
                      </div>

                      {/* Tab Content */}
                      <div className="min-h-[400px]">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                          <div className="space-y-8">
                            <div>
                              <h3 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">
                                Total Nutrition
                              </h3>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                  <div className="relative z-10">
                                    <div className="text-4xl font-bold mb-2">{nutritionData.total.calories}</div>
                                    <div className="text-sm opacity-90 font-medium uppercase tracking-wider">Calories</div>
                                  </div>
                                </div>
                                
                                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                  <div className="relative z-10">
                                    <div className="text-4xl font-bold mb-2">{nutritionData.total.protein}g</div>
                                    <div className="text-sm opacity-90 font-medium uppercase tracking-wider">Protein</div>
                                  </div>
                                </div>
                                
                                <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                  <div className="relative z-10">
                                    <div className="text-4xl font-bold mb-2">{nutritionData.total.carbs}g</div>
                                    <div className="text-sm opacity-90 font-medium uppercase tracking-wider">Carbs</div>
                                  </div>
                                </div>
                                
                                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                  <div className="relative z-10">
                                    <div className="text-4xl font-bold mb-2">{nutritionData.total.fat}g</div>
                                    <div className="text-sm opacity-90 font-medium uppercase tracking-wider">Fat</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Foods Tab */}
                        {activeTab === 'foods' && nutritionData.food && (
                          <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">
                              Food Breakdown
                            </h3>
                            
                            <div className="space-y-4">
                              {nutritionData.food.map((food, index) => (
                                <div key={index} className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 rounded-2xl p-6 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300">
                                  <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                      <h4 className="text-xl font-bold text-black dark:text-white mb-2">{food.name}</h4>
                                      <p className="text-gray-600 dark:text-gray-400 font-medium">{food.quantity}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="text-3xl font-bold text-red-600">{food.calories}</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">calories</div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-6">
                                    <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                      <div className="text-2xl font-bold text-blue-600 mb-1">{food.protein}g</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Protein</div>
                                    </div>
                                    <div className="text-center bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                                      <div className="text-2xl font-bold text-amber-600 mb-1">{food.carbs}g</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Carbs</div>
                                    </div>
                                    <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                                      <div className="text-2xl font-bold text-purple-600 mb-1">{food.fat}g</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">Fat</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recipes Tab */}
                        {activeTab === 'recipes' && nutritionData.recipes && (
                          <div className="space-y-8">
                            <h3 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">
                              Recipe Suggestions
                            </h3>
                            
                            <div className="space-y-8">
                              {nutritionData.recipes.map((recipe, index) => (
                                <div key={index} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 rounded-2xl p-8">
                                  <div className="mb-8">
                                    <h4 className="text-2xl font-bold text-black dark:text-white mb-4">{recipe.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{recipe.description}</p>
                                  </div>
                                  
                                  <div className="grid lg:grid-cols-2 gap-10">
                                    <div>
                                      <h5 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                        Ingredients
                                      </h5>
                                      <div className="space-y-3">
                                        {recipe.ingredients.map((ingredient, idx) => (
                                          <div key={idx} className="flex items-start gap-4 bg-white/30 dark:bg-gray-700/30 rounded-xl p-3">
                                            <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                                              {idx + 1}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">{ingredient}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        Instructions
                                      </h5>
                                      <div className="space-y-4">
                                        {recipe.steps.map((step, idx) => (
                                          <div key={idx} className="flex items-start gap-4">
                                            <span className="bg-blue-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mt-1 flex-shrink-0">
                                              {idx + 1}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={resetApp}
                      className="group relative overflow-hidden bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-2xl transition-all duration-500 hover:scale-105 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative z-10">Analyze Another Meal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-400 font-light">
            Powered by PHIXLAB Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
