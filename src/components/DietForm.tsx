'use client';

import { useState, FormEvent } from 'react';

interface DietFormProps {
  setIsLoading: (loading: boolean) => void;
  setDietPlanHtml: (html: string | null) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
}
import { Target, Weight, User, Zap, Dumbbell, Ruler, Bot, Loader, Leaf, Globe, ChevronDown, AlertTriangle, Ban } from 'lucide-react';
import type { UserData } from '@/lib/diet-calculator';

export default function DietForm({ setIsLoading, setDietPlanHtml, setError, isLoading }: DietFormProps) {
  const [formData, setFormData] = useState<Omit<UserData, 'age' | 'height' | 'weight'>>({
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'weight-loss',
    dietPreference: 'vegetarian',
    dietStyle: 'North Indian',
    allergies: '',
    exclude: '',
  });
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'age') setAge(value);
    else if (name === 'height') setHeight(value);
    else if (name === 'weight') setWeight(value);
    else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDietPlanHtml(null);
    setError(null);

    const numericAge = parseInt(age, 10);
    const numericHeight = parseInt(height, 10);
    const numericWeight = parseInt(weight, 10);

    if (isNaN(numericAge) || isNaN(numericHeight) || isNaN(numericWeight)) {
        setError('Please enter valid numbers for age, height, and weight.');
        setIsLoading(false);
        return;
    }

    const fullData: UserData = { ...formData, age: numericAge, height: numericHeight, weight: numericWeight };

    try {
      const response = await fetch('/api/generate-diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate diet plan');
      }

      const result = await response.json();
      setDietPlanHtml(result.dietPlanHtml);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
      <div className="text-center">
        <Bot className="mx-auto h-12 w-12 text-indigo-400" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Personalize Your Plan</h2>
        <p className="mt-2 text-lg leading-8 text-gray-300">Tell us about yourself to get started.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal */}
        <div className="relative">
          <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">Your Goal</label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select id="goal" name="goal" value={formData.goal} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option value="weight-loss">Weight Loss</option>
              <option value="weight-gain">Weight Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">Age</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" id="age" name="age" value={age} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g., 25" required />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Height and Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" id="height" name="height" value={height} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g., 180" required />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" id="weight" name="weight" value={weight} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g., 75" required />
            </div>
          </div>
        </div>
        
        {/* Diet Preference and Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="dietPreference" className="block text-sm font-medium text-gray-300 mb-2">Diet Preference</label>
            <div className="relative">
              <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select id="dietPreference" name="dietPreference" value={formData.dietPreference} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="dietStyle" className="block text-sm font-medium text-gray-300 mb-2">Cuisine Style</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select id="dietStyle" name="dietStyle" value={formData.dietStyle} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                <option value="North Indian">North Indian</option>
                <option value="South Indian">South Indian</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity Level */}
        <div className="relative">
          <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
          <div className="relative">
            <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <button type="button" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="flex items-center justify-between w-full text-left text-indigo-300 font-semibold">
            <span>Advanced Options</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAdvancedOpen && (
            <div className="space-y-6 pt-4 animate-fade-in-down">
              <div className="relative">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-300 mb-2">Allergies or Intolerances</label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" id="allergies" name="allergies" value={formData.allergies} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g., lactose, gluten, nuts" />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="exclude" className="block text-sm font-medium text-gray-300 mb-2">Foods to Exclude</label>
                <div className="relative">
                  <Ban className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" id="exclude" name="exclude" value={formData.exclude} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g., mushrooms, spicy food" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-3" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Generate My Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
