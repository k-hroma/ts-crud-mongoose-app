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
    });
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
const getRecipies = async (): Promise<QueryResponse> => {
  try {
    const recipies = await Recipe.find()
    return createQueryResponse({
      success: true,
      message: "Recipes obtained successfully",
      data: recipies
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error occurred";
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Failed to obtain recipies",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }

 }

// C. Get a document by MongoDB ID
const getRecipeById = async (id: string): Promise<QueryResponse> => {
  try {
    const recipe = await Recipe.findById(id)
    if (!recipe) { 
      return createQueryResponse({
        success: false,
        message: "Recipe not found",
        error: {
          details: "There is no document with that ID",
          statusCode: 404
        }
      });
    }
    return createQueryResponse({
      success: true,
      message: "Recipe found successfully",
      data: recipe
    })
  } catch (error) { 
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500;
    return createQueryResponse({
      success: false,
      message: "Error searching for recipe",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
  }
  
 }

// D. Update a document by ID
const updateRecipe = async (id: string, data: RecipeUpdateInput): Promise<QueryResponse> => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, data, { new: true });
    if (!updatedRecipe) {
      return createQueryResponse({
        success: false,
        message: "Recipe not found",
        error: {
          details: "Id does not exist",
          statusCode: 404
        }
      })
    }
    return createQueryResponse({
      success: true,
      message: "Recipe successfully updated",
      data: updatedRecipe
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error"
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500
    return createQueryResponse({
      success: false,
      message: "Error at updating recipe",
      error: {
        details: errMsg,
        statusCode: statusCode
      }
    })
   }
  
 }

// E. Deletes a document by ID
const deleteRecipe = async (id: string): Promise<QueryResponse> => { 
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id)
    if (!deletedRecipe) {
      return createQueryResponse({
        success: false,
        message: "The recipe does not exist or has already been deleted",
        error: {
          details: "Recipe not found",
          statusCode: 404
        }
      })
    }
    return createQueryResponse({
      success: true,
      message: "Recipe successfully deleted",
      data: deletedRecipe
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error"
    const statusCode = typeof (error as any).code === "number" ? (error as any).code : 500
    return createQueryResponse ({
      success: false,
      message: "Error deleting book",
      error: {
        details: errMsg,
        statusCode:statusCode
      }
        
    })
    }
}

// 7. USAGE EXAMPLES

const main = async () => {
  // ---------> CREATE A NEW RECIPE DOCUMENT <---------
  console.log("---------> CREATE A NEW RECIPE DOCUMENT <---------")
  const responseCreateRecipe1 = await createRecipe({
    title: "Spinach Pie",
    description: "Vegetarian pie with spinach and cheese.",
    ingredients: [
      { name: "Spinach", amount: "300g" },
      { name: "Cream cheese", amount: "150g" },
      { name: "Eggs", amount: "2 units" }
    ],
    preparationTime: 45,
    portions: 4,
    isVegetarian: true
  });

  const responseCreateRecipe2 = await createRecipe({
    title: "Chicken Curry",
    description: "Indian-style curry with chicken.",
    ingredients: [
      { name: "Chicken breast", amount: "500g" },
      { name: "Curry powder", amount: "2 tablespoons" },
      { name: "Heavy cream", amount: "200ml" }
    ],
    preparationTime: 60,
    portions: 4,
    isVegetarian: false
  })

  const responseCreateRecipe3 = await createRecipe({
    title: "Oatmeal Cookies",
    description: "Healthy sugar-free snack.",
    ingredients: [
      { name: "Oats", amount: "2 cups" },
      { name: "Banana", amount: "2 ripe units" },
      { name: "Raisins", amount: "1/2 cup" }
    ],
    preparationTime: 25,
    portions: 12,
    isVegetarian: true
  })

  console.log(responseCreateRecipe1)
  console.log(responseCreateRecipe2)
  console.log(responseCreateRecipe3)

  // ---------> GET ALL RECIPIES FROM MONGO DB <---------
  console.log("---------> GET ALL RECIPIES FROM MONGO DB <---------")
  const responseGetRecipies = await getRecipies()
  console.log(responseGetRecipies)
  //to see the detail of the array of ingredients ->
  // console.log(JSON.stringify(responseGetRecipies, null, 2))

  // ---------> GET A DOCUMENT BY MONGO DB ID <---------
  console.log("---------> GET RECIPE BY ID <---------")
  const responseGetRecipieById = await getRecipeById("681bebac8674f23940fdb893")
  console.log(responseGetRecipieById)

  // ---------> UPDATE A DOCUMENT BY MONGO DB ID <---------
  console.log("---------> UPDATED RECIPE BY ID <---------")
  const responseUpdatedRecipe = await updateRecipe("681bebac8674f23940fdb893", { description: "Updated description" })
  console.log(responseUpdatedRecipe)

  // ---------> DELETE A DOCUMENT BY MONGO DB ID <---------
  console.log("---------> DELETED RECIPE BY ID <---------")
  const responseDeleteRecipe = await deleteRecipe("681c9e1120df336cb382c858")
  console.log(responseDeleteRecipe)
}

main()