const formatPrice = (value) => {
  const numericValue = Number(value || 0);

  return `₹${numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
};

export default formatPrice;
