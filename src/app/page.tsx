'use client';

import { useState, useEffect } from 'react';
import { Bot, Clock, Loader, Trash2 } from 'lucide-react';
import DietForm from '@/components/DietForm';
import DietPlan from '@/components/DietPlan';

interface SavedPlan {
  id: string;
  html: string;
  date: string;
}

export default function Home() {
  const [dietPlanHtml, setDietPlanHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    try {
      const plansJSON = localStorage.getItem('dietPlans');
      if (plansJSON) {
        setSavedPlans(JSON.parse(plansJSON));
      }
    } catch (e) {
      console.error("Could not load diet plans from local storage", e);
      setSavedPlans([]);
    }
  }, []);

  const handleSetPlan = (html: string | null) => {
    setDietPlanHtml(html);
    if (html) {
      const newPlan: SavedPlan = {
        html,
        date: new Date().toISOString(),
        id: `plan-${Date.now()}`,
      };

      try {
        const updatedPlans = [newPlan, ...savedPlans].slice(0, 2);
        localStorage.setItem('dietPlans', JSON.stringify(updatedPlans));
        setSavedPlans(updatedPlans);
      } catch (e) {
        console.error("Could not save diet plan to local storage", e);
      }
    }
  };

  const viewSavedPlan = (html: string) => {
    setDietPlanHtml(html);
  };

  const deletePlan = (id: string) => {
    try {
      const updatedPlans = savedPlans.filter((p) => p.id !== id);
      localStorage.setItem('dietPlans', JSON.stringify(updatedPlans));
      setSavedPlans(updatedPlans);
    } catch (e) {
      console.error("Could not delete diet plan from local storage", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="w-full max-w-3xl p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center justify-center h-96">
          <Loader className="h-16 w-16 text-indigo-400 animate-spin" />
          <p className="mt-4 text-white text-lg">Your AI nutritionist is preparing your plan...</p>
        </div>
      </div>
    );
  }

  if (dietPlanHtml) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <DietPlan planHtml={dietPlanHtml} onBack={() => setDietPlanHtml(null)} />
      </div>
    );
  }
  return (
    <div className="relative flex flex-col min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center">
        <div className="inline-block p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
          <Bot className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white">
          AI-Powered Diet Planner
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
          Craft your perfect meal plan in seconds. Just tell our AI your goals, and get a personalized, delicious diet tailored just for you.
        </p>
        <div className="mt-10 w-full max-w-4xl">
          <DietForm 
            setIsLoading={setIsLoading}
            setDietPlanHtml={handleSetPlan}
            setError={setError}
            isLoading={isLoading}
          />
          {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        </div>

        {savedPlans.length > 0 && (
          <div className="mt-12 w-full max-w-4xl">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Your Recent Diet Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative group bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="cursor-pointer" onClick={() => viewSavedPlan(plan.html)}>
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-indigo-400" />
                      <div>
                        <h4 className="font-bold text-white">Diet Plan</h4>
                        <p className="text-sm text-gray-400">
                          Created on {new Date(plan.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlan(plan.id);
                    }}
                    aria-label="Delete diet plan"
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 rounded-full bg-transparent hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full py-4 text-center text-gray-400 text-sm">
        <p>
          Built with Next.js and Gemini. Styled by{' '}
          <a
            href="https://github.com/Himanshu-Saraswat-01122004"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            YOGI
          </a>
        </p>
      </footer>
    </div>
  );
}
