export interface UserData {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'weight-loss' | 'weight-gain' | 'maintenance';
  dietPreference: 'vegetarian' | 'non-vegetarian' | 'eggetarian';
  dietStyle: string;
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

