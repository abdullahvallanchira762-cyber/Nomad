import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchProducts,
  addProduct,
  editProduct,
  removeProduct,
} from "../../redux/slice/productSlice";

import formatPrice from "../../utils/formatPrice";

import "./AdminProducts.css";


const emptyForm = {
  name: "",
  category: "",
  price: "",
  duration: "",
  difficulty: "",
  stock: "",
  featured: false,
  rating: "",
  image: "",
  images: [],
  description: "",
};


function AdminProducts() {

  const dispatch = useDispatch();

  const {
    items,
    loading,
    mutationLoading,
    error,
  } = useSelector(
    (state) => state.products
  );


  /* =====================================================
     SEARCH / FILTER
  ===================================================== */

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [showSearch, setShowSearch] =
    useState(false);

  const [showFilters, setShowFilters] =
    useState(false);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);


  /* =====================================================
     FORM
  ===================================================== */

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const itemsPerPage = 6;


  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = useMemo(() => {

    return [
      "All",
      ...new Set(
        items.map(
          (product) => product.category
        )
      ),
    ];

  }, [items]);


  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {

      return items.filter((product) => {

        const matchesSearch =
          product.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "All" ||
          product.category === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      });

    }, [
      items,
      search,
      category,
    ]);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    filteredProducts.length /
      itemsPerPage
  );

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const currentProducts =
    filteredProducts.slice(
      (safePage - 1) *
        itemsPerPage,

      safePage * itemsPerPage
    );


  /* =====================================================
     FORM INPUT
  ===================================================== */

  const handleInputChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  /* =====================================================
     OPEN ADD PRODUCT
  ===================================================== */

  const handleAddClick = () => {

    setEditingProduct(null);

    setForm(emptyForm);

    setShowForm(true);
  };


  /* =====================================================
     OPEN EDIT PRODUCT
  ===================================================== */

  const handleEditClick = (product) => {

    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      duration: product.duration || "",
      difficulty: product.difficulty || "",
      stock: product.stock ?? "",
      featured: Boolean(product.featured),
      rating: product.rating ?? "",

      image: product.image || "",

      images:
        product.images?.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [],

      description:
        product.description || "",
    });

    setShowForm(true);
  };


  /* =====================================================
     IMAGE PATH HANDLER
  ===================================================== */

  const handleImagePathChange = (
    index,
    value
  ) => {

    setForm((previous) => {

      const updatedImages =
        [...previous.images];

      updatedImages[index] = value;

      return {
        ...previous,

        images: updatedImages,

        image:
          index === 0
            ? value
            : previous.image ||
              updatedImages[0] ||
              "",
      };
    });
  };


  /* =====================================================
     ADD IMAGE FIELD
  ===================================================== */

  const handleAddImageField = () => {

    if (form.images.length >= 6) {

      toast.error(
        "You can add a maximum of 6 images."
      );

      return;
    }

    setForm((previous) => ({
      ...previous,

      images: [
        ...previous.images,
        "",
      ],
    }));
  };


  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  const handleRemoveImage = (index) => {

    setForm((previous) => {

      const updatedImages =
        previous.images.filter(
          (_, imageIndex) =>
            imageIndex !== index
        );

      const validImages =
        updatedImages.filter(
          (image) =>
            image.trim() !== ""
        );

      return {
        ...previous,

        images: updatedImages,

        image:
          validImages[0] || "",
      };
    });
  };


  /* =====================================================
     CLOSE FORM
  ===================================================== */

  const handleCloseForm = () => {

    if (mutationLoading) {
      return;
    }

    setShowForm(false);

    setEditingProduct(null);

    setForm(emptyForm);
  };


  /* =====================================================
     SUBMIT PRODUCT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!form.name.trim()) {

      toast.error(
        "Product name is required."
      );

      return;
    }


    if (!form.category) {

      toast.error(
        "Please select a category."
      );

      return;
    }


    if (
      !form.price ||
      Number(form.price) <= 0
    ) {

      toast.error(
        "Price must be greater than 0."
      );

      return;
    }


    if (!form.duration.trim()) {

      toast.error(
        "Duration is required."
      );

      return;
    }


    if (!form.difficulty.trim()) {

      toast.error(
        "Difficulty is required."
      );

      return;
    }


    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {

      toast.error(
        "Stock cannot be negative."
      );

      return;
    }


    if (
      form.rating === "" ||
      Number(form.rating) < 0 ||
      Number(form.rating) > 5
    ) {

      toast.error(
        "Rating must be between 0 and 5."
      );

      return;
    }


    const validImages =
      form.images.filter(
        (image) =>
          image.trim() !== ""
      );


    if (validImages.length === 0) {

      toast.error(
        "Please add at least one product image."
      );

      return;
    }


    if (!form.description.trim()) {

      toast.error(
        "Product description is required."
      );

      return;
    }


    const productData = {

      name:
        form.name.trim(),

      category:
        form.category.trim(),

      price:
        Number(form.price),

      duration:
        form.duration.trim(),

      difficulty:
        form.difficulty.trim(),

      stock:
        Number(form.stock),

      featured:
        Boolean(form.featured),

      rating:
        Number(form.rating),

      image:
        validImages[0] || "",

      images:
        validImages,

      description:
        form.description.trim(),
    };


    if (
      !productData.name ||
      !productData.category ||
      productData.images.length === 0 ||
      !productData.description
    ) {

      toast.error(
        "Please add at least one product image."
      );

      return;
    }


    try {

      if (editingProduct) {

        await dispatch(
          editProduct({
            id: editingProduct.id,
            productData,
          })
        ).unwrap();

        toast.success(
          "Product updated successfully."
        );

      } else {

        await dispatch(
          addProduct(productData)
        ).unwrap();

        toast.success(
          "Product added successfully."
        );
      }


      handleCloseForm();

    } catch (err) {

      toast.error(
        err ||
          "Something went wrong."
      );
    }
  };


  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const handleDelete = async (
    product
  ) => {

    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }


    try {

      await dispatch(
        removeProduct(product.id)
      ).unwrap();

      toast.success(
        "Product deleted successfully."
      );


      if (
        currentProducts.length === 1 &&
        currentPage > 1
      ) {

        setCurrentPage(
          currentPage - 1
        );
      }

    } catch (err) {

      toast.error(
        err ||
          "Failed to delete product."
      );
    }
  };


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <section className="admin-products">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-products-header">

        <div>

          <span className="admin-section-eyebrow">
            CATALOG / PRODUCTS
          </span>

          <h2>
            Products
          </h2>

          <p>
            Manage the expedition equipment
            available in the Nomad store.
          </p>

        </div>


        <button
          type="button"
          className="admin-primary-button"
          onClick={handleAddClick}
        >

          <span className="material-symbols-outlined">
            add
          </span>

          Add Product

        </button>

      </div>


      {/* =================================================
          SEARCH + FILTER CONTROLS
      ================================================= */}

      <div className="admin-products-controls">


        {/* SEARCH */}

        <div
          className={`admin-product-search-wrapper ${
            showSearch
              ? "open"
              : ""
          }`}
        >

          <div className="admin-product-search">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
            />

          </div>


          <button
            type="button"
            className="admin-product-search-button"
            onClick={() => {

              setShowSearch(
                (value) =>
                  !value
              );

            }}
            aria-label="Search products"
          >

            <span className="material-symbols-outlined">
              search
            </span>

          </button>

        </div>


        {/* FILTER */}

        <div className="admin-product-filter-wrapper">

          <button
            type="button"
            className={`admin-product-filter-button ${
              showFilters
                ? "active"
                : ""
            }`}
            onClick={() => {

              setShowFilters(
                (value) =>
                  !value
              );

            }}
            aria-label="Filter products"
          >

            <span className="material-symbols-outlined">
              tune
            </span>

          </button>


          {/* FILTER PANEL */}

          <div
            className={`admin-product-filter-panel ${
              showFilters
                ? "open"
                : ""
            }`}
          >

            <div className="admin-product-filter-header">

              <span>
                FILTER PRODUCTS
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(false)
                }
                aria-label="Close filters"
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>


            <div className="admin-product-filter-field">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {

                  setCategory(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
              >

                {categories.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-products-error">
          {error}
        </div>

      )}


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="admin-products-table-wrapper">

        {loading ? (

          <div className="admin-products-state">

            <span className="material-symbols-outlined">
              progress_activity
            </span>

            Loading products...

          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="admin-products-state">

            <span className="material-symbols-outlined">
              inventory_2
            </span>

            <strong>
              No products found
            </strong>

            <span>
              Try changing your search
              or category filter.
            </span>

          </div>

        ) : (

          <table className="admin-products-table">

            <thead>

              <tr>

                <th>
                  PRODUCT
                </th>

                <th>
                  CATEGORY
                </th>

                <th>
                  PRICE
                </th>

                <th>
                  STOCK
                </th>

                <th>
                  RATING
                </th>

                <th>
                  FEATURED
                </th>

                <th>
                  ACTIONS
                </th>

              </tr>

            </thead>


            <tbody>

              {currentProducts.map(
                (product) => (

                  <tr key={product.id}>


                    {/* PRODUCT */}

                    <td>

                      <div className="admin-product-info">

                        <div className="admin-product-image">

                          <img
                            src={product.image}
                            alt={product.name}
                          />

                        </div>


                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            ID: {product.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      <span className="admin-category">
                        {product.category}
                      </span>

                    </td>


                    {/* PRICE */}

                    <td>

                      {formatPrice(
                        product.price
                      )}

                    </td>


                    {/* STOCK */}

                    <td>

                      <span
                        className={
                          product.stock === 0
                            ? "stock-out"
                            : product.stock <= 5
                            ? "stock-low"
                            : "stock-good"
                        }
                      >
                        {product.stock}
                      </span>

                    </td>


                    {/* RATING */}

                    <td>

                      <span className="admin-rating">

                        <span>
                          ★
                        </span>

                        {product.rating}

                      </span>

                    </td>


                    {/* FEATURED */}

                    <td>

                      {product.featured ? (

                        <span className="featured-badge">
                          FEATURED
                        </span>

                      ) : (

                        <span className="not-featured">
                          —
                        </span>

                      )}

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="admin-product-actions">

                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            handleEditClick(
                              product
                            )
                          }
                        >

                          <span className="material-symbols-outlined">
                            edit
                          </span>

                        </button>


                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                        >

                          <span className="material-symbols-outlined">
                            delete
                          </span>

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>


      {/* =================================================
          PAGINATION
      ================================================= */}

      {totalPages > 1 && (

        <div className="admin-pagination">

          <button
            type="button"
            disabled={
              safePage === 1
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  page - 1
              )
            }
            aria-label="Previous page"
          >
            ←
          </button>


          <span>

            PAGE{" "}

            <strong>
              {safePage}
            </strong>{" "}

            / {totalPages}

          </span>


          <button
            type="button"
            disabled={
              safePage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  page + 1
              )
            }
            aria-label="Next page"
          >
            →
          </button>

        </div>

      )}


      {/* =================================================
          FORM MODAL
      ================================================= */}

      {showForm && (

        <div
          className="admin-product-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              handleCloseForm();

            }

          }}
        >

          <div className="admin-product-modal">


            {/* MODAL HEADER */}

            <div className="admin-product-modal-header">

              <div>

                <span className="admin-section-eyebrow">

                  {editingProduct
                    ? "CATALOG / EDIT"
                    : "CATALOG / NEW"}

                </span>

                <h3>

                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}

                </h3>

              </div>


              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                disabled={
                  mutationLoading
                }
              >

                <span className="material-symbols-outlined">
                  close
                </span>

              </button>

            </div>


            {/* FORM */}

            <form
              className="admin-product-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="admin-form-grid">


                {/* NAME */}

                <label>

                  <span>
                    Product Name
                  </span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </label>


                {/* CATEGORY */}

                <div className="admin-form-field">

                  <label htmlFor="category">
                    CATEGORY
                  </label>

                  <select
                    id="category"
                    className="admin-form-select"
                    value={
                      form.category
                    }
                    onChange={(e) =>
                      setForm(
                        (previous) => ({
                          ...previous,

                          category:
                            e.target
                              .value,
                        })
                      )
                    }
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option value="Helmets">
                      Helmets
                    </option>

                    <option value="Riding Gear">
                      Riding Gear
                    </option>

                    <option value="Camping">
                      Camping
                    </option>

                  </select>

                </div>


                {/* PRICE */}

                <label>

                  <span>
                    Price
                  </span>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </label>


                {/* STOCK */}

                <label>

                  <span>
                    Stock
                  </span>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </label>


                {/* DURATION */}

                <label>

                  <span>
                    Duration
                  </span>

                  <input
                    name="duration"
                    value={
                      form.duration
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. 7 Days"
                    required
                  />

                </label>


                {/* DIFFICULTY */}

                <label>

                  <span>
                    Difficulty
                  </span>

                  <input
                    name="difficulty"
                    value={
                      form.difficulty
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. Challenging"
                    required
                  />

                </label>


                {/* RATING */}

                <label>

                  <span>
                    Rating
                  </span>

                  <input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={
                      form.rating
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </label>


                {/* =================================================
                    IMAGE UPLOAD SECTION
                ================================================= */}

                <div className="admin-image-upload-section">

                  <div className="admin-image-upload-header">

                    <span className="admin-image-upload-label">
                      Product Images
                    </span>

                    <span className="admin-image-count">
                      {form.images.length} / 6
                    </span>

                  </div>


                  <div className="admin-image-path-list">

                    {form.images.map(
                      (
                        image,
                        index
                      ) => (

                        <div
                          className="admin-image-path-row"
                          key={index}
                        >

                          <div className="admin-image-number">
                            {index + 1}
                          </div>


                          <input
                            type="text"
                            value={image}
                            onChange={(e) =>
                              handleImagePathChange(
                                index,
                                e.target
                                  .value
                              )
                            }
                            placeholder="/images/products/product-image.jpg"
                          />


                          <button
                            type="button"
                            className="admin-remove-image-path"
                            onClick={() =>
                              handleRemoveImage(
                                index
                              )
                            }
                            disabled={
                              mutationLoading
                            }
                          >

                            <span className="material-symbols-outlined">
                              close
                            </span>

                          </button>

                        </div>

                      )
                    )}

                  </div>


                  {form.images.length < 6 && (

                    <button
                      type="button"
                      className="admin-add-image-button"
                      onClick={
                        handleAddImageField
                      }
                    >

                      <span className="material-symbols-outlined">
                        add
                      </span>

                      Add Image Path

                    </button>

                  )}


                  {form.images.length > 0 && (

                    <div className="admin-image-preview-grid">

                      {form.images
                        .filter(
                          (image) =>
                            image.trim() !== ""
                        )
                        .map(
                          (
                            image,
                            index
                          ) => (

                            <div
                              className={`admin-image-preview ${
                                index === 0
                                  ? "admin-image-preview-main"
                                  : ""
                              }`}
                              key={`${image}-${index}`}
                            >

                              <img
                                src={image}
                                alt={`Product preview ${
                                  index + 1
                                }`}
                              />


                              {index === 0 && (

                                <span className="admin-main-image-badge">
                                  MAIN
                                </span>

                              )}

                            </div>

                          )
                        )}

                    </div>

                  )}

                </div>


                {/* DESCRIPTION */}

                <label>

                  <span>
                    Description
                  </span>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleInputChange
                    }
                    rows="5"
                    required
                  />

                </label>


                {/* FEATURED */}

                <label className="admin-featured-checkbox">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      form.featured
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  <span>
                    Featured product
                  </span>

                </label>


                {/* FORM BUTTONS */}

                <div className="admin-product-form-actions">

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={
                      handleCloseForm
                    }
                    disabled={
                      mutationLoading
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={
                      mutationLoading
                    }
                  >

                    {mutationLoading
                      ? "Saving..."
                      : editingProduct
                      ? "Save Changes"
                      : "Create Product"}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}

    </section>
  );
}


export default AdminProducts;