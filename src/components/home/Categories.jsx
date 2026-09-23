import { categories } from "../../constants/categories";
import CategoryCard from "./CategoryCard";
import "./Categories.css";

function Categories() {
  return (
    <section className="categories">
      <div className="categories-container">

        {/* Section Header */}
        <div className="categories-header">

          <div>
            <p className="categories-label">
              01 // Equipment Divisions
            </p>

            <h2>Explore The Adventure</h2>
          </div>

          {/* <p className="categories-intro">
            Gear for every journey, from high-elevation mountain
            passes to unmapped remote trails.
          </p> */}

        </div>

        {/* Category Cards */}
        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;