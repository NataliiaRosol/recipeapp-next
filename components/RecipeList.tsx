"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import RecipeListLoading from "./RecipeListLoading";
import Image from "next/image";
import Link from "next/link";

interface Recipe {
  idMeal: string;
  strArea: string;
  strCategory: string;
  strMeal: string;
  strMealThumb: string;
}
interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function RecipeList() {
  const [pageRecipes, setPageRecipes] = useState<Recipe[]>([]); // Recipes for current page
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [totalRecipes, setTotalRecipes] = useState<number>(0); // Recipe total number
  const [categories, setCategories] = useState<string[]>([]); // Categories list
  const [loading, setLoading] = useState<boolean>(false);

  const recipesPerPage = 10;

  // Get categories
  const fetchCategories = async () => {
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    return res.data.categories.map(
      (category: { strCategory: string }) => category.strCategory
    );
  };

  // Get recipies by category
  const fetchRecipesByCategory = async (category: string) => {
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    return res.data.meals.map((meal :Meal) => ({ ...meal, category })) || [];
       
  };

  // Get recipe details by id
  const fetchRecipeDetails = async (idMeal: string) => {
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    );
    return res.data.meals[0];
  };

  // Get all categories and calculate recipes total
  const fetchCategoriesAndTotalRecipes = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);

      // Recipe total number
      const recipePromises = fetchedCategories.map((category: string) => {
        return fetchRecipesByCategory(category);
      });
      console.log(recipePromises);

      const recipesByCategory = await Promise.all(recipePromises);
      const allRecipes = recipesByCategory.flat();

      setTotalRecipes(allRecipes.length);
    } catch (error) {
      console.error("Error fetching categories or recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load recipes for current page
  const fetchRecipesForPage = async (pageNumber: number) => {
    setLoading(true);
    try {
      const startIndex = (pageNumber - 1) * recipesPerPage;
      const endIndex = startIndex + recipesPerPage;

      const recipePromises = [];
      let fetchedCount = 0;

      for (const category of categories) {
        if (fetchedCount >= endIndex) break;

        const categoryRecipes = await fetchRecipesByCategory(category);

        for (const recipe of categoryRecipes) {
          if (fetchedCount >= endIndex) break;

          if (fetchedCount >= startIndex) {
            recipePromises.push(fetchRecipeDetails(recipe.idMeal));
          }
          fetchedCount++;
        }
      }

      const detailedRecipes = await Promise.all(recipePromises);
      setPageRecipes(detailedRecipes);
    } catch (error) {
      console.error("Error fetching recipes for page:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndTotalRecipes();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchRecipesForPage(currentPage);
    }
  }, [currentPage, categories]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  return (
    <div className="my-3">
      {loading ? (
        <RecipeListLoading />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center mb-5">
            {pageRecipes.map((recipe) => (
              <Link href={`/${recipe.idMeal}`} key={recipe.idMeal} className="w-[300px] xl:w-[400px] mx-auto bg-white shadow-lg rounded-lg p-4">
                <Image width={'200'} height={'200'} src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-[200px] object-cover rounded-md" />
                <h3 className="text-lg font-semibold my-2 line-clamp-2 max-h-[75px] overflow-hidden">{recipe.strMeal}</h3>
                <p className="text-sm text-gray-600">Category: {recipe.strCategory}</p>
                <p className="text-sm text-gray-600">Area: {recipe.strArea}</p>
              </Link>
            ))}
          </div>
          <div className="">
            {Array.from({
              length: Math.ceil(totalRecipes / recipesPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
