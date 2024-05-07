export const validation = (title, description, code, price, status, stock, category, thumbnails) => {
    const errors = [];
    if (!title) {
      errors.push("Title is required.");
    } else if (typeof title !== "string" || title.trim() === "") {
      errors.push("Title must be a non-empty string.");
    }
  
    if (!description) {
      errors.push("Description is required.");
    } else if (typeof description !== "string" || description.trim() === "") {
      errors.push("Description must be a non-empty string.");
    }
  
    if (!code) {
      errors.push("Code is required.");
    } else if (typeof code !== "string" || code.trim() === "") {
      errors.push("Code must be a non-empty string.");
    }
  
    if (!price || isNaN(price) || price <= 0) {
      errors.push(
        "Price is required, must be a number, and must be greater than 0."
      );
    }
  
    if (typeof status !== "boolean") {
      errors.push("Status must be a boolean value (true or false).");
    }
  
    if (!stock || isNaN(stock) || stock < 0) {
      errors.push(
        "Stock is required, must be a number, and must be non-negative."
      );
    }
  
    if (!category) {
      errors.push("Category is required.");
    } else if (typeof category !== "string" || category.trim() === "") {
      errors.push("Category must be a non-empty string.");
    }
  
    if (
      thumbnails &&
      (!Array.isArray(thumbnails) ||
        thumbnails.some((thumbnail) => typeof thumbnail !== "string"))
    ) {
      errors.push("Thumbnails must be an array of strings (image URLs).");
    }
    return errors;
  };

  const compareObjects = (obj1, obj2, excludedProp) => {
    for (const prop in obj1) {
      if (prop === excludedProp) continue;
      if (obj1[prop] !== obj2[prop]) return false;
    }
  
    for (const prop in obj2) {
      if (prop === excludedProp) continue;
      if (obj1[prop] !== obj2[prop]) return false;
    }
  
    return true;
  }

