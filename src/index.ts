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
const createRecipe = async (data: IRecipe): Promise<QueryResponse> => {
  try { 
    const recipe = new Recipe(data)
    const addedRecipe = await recipe.save()
    return createQueryResponse({
      success: true,
      message: "Recipe created successfully",
      data: addedRecipe
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error occurred"
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Recipe creation failed",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
      }
}

// B. Get all recipies from database

// C. Get a document by MongoDB ID

// D. Update a document by ID

// E. Deletes a document by ID

// 7. USAGE EXAMPLES

const main = async () => {
  
  // CRUD OPERATIONS

  // ---------> CREATE A NEW RECIPE DOCUMENT <---------

  // const responseCreateRecipe = await createRecipe({
  //   title: "Spinach Pie",
  //   description: "Vegetarian pie with spinach and cheese.",
  //   ingredients: [
  //     { name: "Spinach", amount: "300g" },
  //     { name: "Cream cheese", amount: "150g" },
  //     { name: "Eggs", amount: "2 units" }
  //   ],
  //   preparationTime: 45,
  //   portions: 4,
  //   isVegetarian: true
  // });

  // const responseCreateRecipe = await createRecipe({
  //   title: "Chicken Curry",
  //   description: "Indian-style curry with chicken.",
  //   ingredients: [
  //     { name: "Chicken breast", amount: "500g" },
  //     { name: "Curry powder", amount: "2 tablespoons" },
  //     { name: "Heavy cream", amount: "200ml" }
  //   ],
  //   preparationTime: 60,
  //   portions: 4,
  //   isVegetarian: false
  // })

  // const responseCreateRecipe = await createRecipe({
  //   title: "Oatmeal Cookies",
  //   description: "Healthy sugar-free snack.",
  //   ingredients: [
  //     { name: "Oats", amount: "2 cups" },
  //     { name: "Banana", amount: "2 ripe units" },
  //     { name: "Raisins", amount: "1/2 cup" }
  //   ],
  //   preparationTime: 25,
  //   portions: 12,
  //   isVegetarian: true
  // })

  // console.log(responseCreateRecipe)


  // ---------> GET ALL RECIPIES FROM MONGO DB <---------
  
}

main()