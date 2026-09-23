import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  // const handleCategoryClick = () => {
    
  //   navigate(
  //     `/products?category=${encodeURIComponent(category.name)}`
  //   );
  // };
    const handleCategoryClick = () => {
    const targetCategory =
      category.name === "Travel Baggage"
        ? "Camping"
        : category.name;

    navigate(
      `/products?category=${encodeURIComponent(targetCategory)}`
    );
  };

  return (
    <article className="category-card">

      {/* Image */}
      <img
        src={category.image}
        alt={category.name}
        className="category-card-image"
      />

      {/* Dark overlay */}
      <div className="category-card-overlay"></div>

      {/* Top information */}
      <div className="category-card-top">

        <span className="category-division">
          {category.division}
        </span>

        <span className="category-specification">
          {category.specification}
        </span>

      </div>

      {/* Bottom information */}
      <div className="category-card-content">

        <h3>{category.name}</h3>

        <p>{category.description}</p>

        <button
          className="category-action"
          onClick={handleCategoryClick}
        >
          {category.action}

          <span>→</span>
        </button>

      </div>

    </article>
  );
}

export default CategoryCard;