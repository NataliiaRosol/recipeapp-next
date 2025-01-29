import axios from "axios";
import Image from "next/image";
import React from "react";

async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const recipe = res.data.meals[0];

  console.log(recipe);

  const ingredients = Object.keys(recipe)
    .filter((key) => key.startsWith("strIngredient") && recipe[key]) // фільтруємо тільки інгредієнти
    .map((key) => recipe[key]); // отримуємо значення інгредієнтів

  const measures = Object.keys(recipe)
    .filter((key) => key.startsWith("strMeasure") && recipe[key])
    .map((key) => recipe[key]);

  const ingradientsWithMeasures = ingredients.map((ingradient, index) => {
    return {
      ingradient,
      measure: measures[index] || "",
    };
  });

  return (
    <div className="mx-5 my-5">
      <div className="mx-auto">
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-5">
          {recipe.strMeal}
        </h1>
        <div className="flex flex-col md:flex-row  justify-center gap-10">
          <Image
            width={500}
            height={500}
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
          />

          <ul>
            <span className="font-bold">Ingredients:</span>
            {ingradientsWithMeasures.map((item, index) => (
              <li key={index}>
                <span className="text-sm leading-4 text-gray-900">
                  {item.ingradient}
                </span>
                {item.measure && (
                  <span className="text-gray-500 ml-1 text-sm leading-4">
                    ({item.measure})
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-2">
            <p className="text-sm mb-5">
              Area:{" "}
              <span className="px-5 py-2 bg-gray-300 rounded-3xl">
                {recipe.strArea}
              </span>{" "}
            </p>
            <p className="text-sm">
              Category:{" "}
              <span className="px-5 py-2 bg-red-300 rounded-3xl">
                {recipe.strCategory}
              </span>
            </p>
          </div>
        </div>

        <div className="">
          <p className="mt-10 max-w-[1400px] mx-auto">
            {recipe.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailsPage;
