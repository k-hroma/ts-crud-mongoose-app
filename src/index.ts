import { connectDB } from "./config/mongo";
import { Schema, model } from 'mongoose';

// 1. Connect to MongoDB database
connectDB()

// 2. TypeScript Interfaces

// A. Standar response format for all operations
interface QueryResponse { 
  success: boolean
  message: string
  data?: IRecipe | IRecipe[] | null
  error?: {
    details: string
    statusCode: number
  } | null
}

// B. Recipe document structure

// Ingredient structure for recipes
interface IIngredients { 
  name: string,
  amount:string,
}

// Complete recipe document structure
interface IRecipe {
  title: string, 
  description?: string,
  ingredients: IIngredients[],
  preparationTime: number,
  portions: number,
  isVegetarian:boolean
 }

// C. Input requirements for recipe creation
interface RecipeInput { 
  title: string, 
  description?: string,
  ingredients: IIngredients[],
  preparationTime: number,
  portions: number,
  isVegetarian?:boolean
}

// D. Input requirements for recipe updates (all fields optional)
interface RecipeUpdateInput { 
  title?: string, 
  description?: string,
  ingredients?: IIngredients[],
  preparationTime?: number,
  portions?: number,
  isVegetarian?:boolean
}

// 3. Mongoose Schema Definition
const RecipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String, required: true }
  }],
  preparationTime: {
    type: Number,
    required: true
  },
  portions: {
    type: Number,
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false,
  timestamps: true
});

// 4. Mongoose Model
const Recipe = model<IRecipe>("Recipe", RecipeSchema);

// 5. Response utility Function
const createQueryResponse = ({ success, message, data = null, error = null }: QueryResponse): QueryResponse => { return { success, message, data, error } };


// 6. CRUD Operations

// A. Create a new recipe document

// B. Get all recipies from database

// C. Get a document by MongoDB ID

// D. Update a document by ID

// E. Deletes a document by ID

// 7. Usage Examples