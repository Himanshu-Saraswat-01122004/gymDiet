export interface UserData {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'weight-loss' | 'weight-gain' | 'maintenance';
  dietPreference: 'vegetarian' | 'non-vegetarian' | 'eggetarian';
  dietStyle: string;
  allergies?: string;
  exclude?: string;
}

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export const calculateBMR = (data: Omit<UserData, 'activityLevel' | 'goal'>) => {
  const { age, gender, height, weight } = data;
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
};

export const calculateCalories = (data: UserData) => {
  const bmr = calculateBMR(data);
  const multiplier = activityFactors[data.activityLevel];
  const tdee = bmr * multiplier;

  switch (data.goal) {
    case 'weight-loss':
      return tdee - 500;
    case 'weight-gain':
      return tdee + 500;
    case 'maintenance':
    default:
      return tdee;
  }
};

export interface Macronutrients {
  protein: number;
  carbs: number;
  fats: number;
}

const macroRatios = {
  'weight-loss': { protein: 0.4, carbs: 0.3, fats: 0.3 },
  'maintenance': { protein: 0.3, carbs: 0.4, fats: 0.3 },
  'weight-gain': { protein: 0.3, carbs: 0.5, fats: 0.2 },
};

export const calculateMacronutrients = (
  totalCalories: number,
  goal: 'weight-loss' | 'weight-gain' | 'maintenance'
): Macronutrients => {
  const ratios = macroRatios[goal];

  const proteinCalories = totalCalories * ratios.protein;
  const carbCalories = totalCalories * ratios.carbs;
  const fatCalories = totalCalories * ratios.fats;

  // 1g protein = 4 cal, 1g carb = 4 cal, 1g fat = 9 cal
  const proteinGrams = Math.round(proteinCalories / 4);
  const carbGrams = Math.round(carbCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fats: fatGrams,
  };
};

export const calculateWaterIntake = (weight: number): number => {
  // A common recommendation is 30-35ml of water per kg of body weight.
  // We'll use 35ml/kg as a baseline.
  const waterInLiters = (weight * 35) / 1000;
  // Return rounded to one decimal place
  return Math.round(waterInLiters * 10) / 10;
};


