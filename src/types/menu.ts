export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  removedIngredients: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
