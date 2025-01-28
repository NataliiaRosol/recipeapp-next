import RecipeList from "@/components/RecipeList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h1>Recipe list</h1>
      {/* Search */}
      <Link href={'/favourites'} >Favourites</Link>
      {/* Category list */}

      <RecipeList />
    </div>
  );
}
