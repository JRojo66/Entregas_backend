import { ERROR_TYPE } from "./utils/EErrors.js";
import { CustomError } from "./utils/CustomError.js";
import { productsArguments } from './utils/productErrors.js';
import "express-async-errors";

export const validationProducts = (title, description, code, price, status, stock, category, thumbnails) => {
    const errors = [];
    if (!title || typeof title !== "string" || title.trim() === "") {
      CustomError.createError("Missing or wrong argument", productsArguments("title"), "Title is missing or not a string", ERROR_TYPE.INVALID_ARGUMENTS);
    } 
  
    if (!description || typeof  description !== "string" || description.trim() === "") {
      CustomError.createError("Missing or wrong argument", productsArguments("description"), "Description is missing or not a string", ERROR_TYPE.INVALID_ARGUMENTS);
    } 
  
    if (!code || typeof code !== "string" || code.trim() === "") {
      CustomError.createError("Missing or wrong argument", productsArguments("code"), "Code is missing or not a string", ERROR_TYPE.INVALID_ARGUMENTS);
    } 
  
    if (!price || isNaN(price) || price <= 0) {
      CustomError.createError("Missing or wrong argument", productsArguments("price"), "Price is missing or not a number", ERROR_TYPE.INVALID_ARGUMENTS);
    }
  
    if (typeof status !== "boolean") {
      CustomError.createError("Missing or wrong argument", productsArguments("status"), "Status is missing or not boolean", ERROR_TYPE.INVALID_ARGUMENTS);
    }
  
    if (!stock || isNaN(stock) || stock < 0) {
      CustomError.createError("Missing or wrong argument", productsArguments("stock"), "Stock is missing, not a nummber or negative", ERROR_TYPE.INVALID_ARGUMENTS);
    }
  
    if (!category || typeof category !== "string" || category.trim() === "") {
      CustomError.createError("Missing or wrong argument", productsArguments("category"), "Category  is missing, not a nummber or negative", ERROR_TYPE.INVALID_ARGUMENTS);
    } 
  
    if (
      thumbnails &&
      (!Array.isArray(thumbnails) ||
        thumbnails.some((thumbnail) => typeof thumbnail !== "string"))
    ) {
      CustomError.createError("Missing or wrong argument", productsArguments("thumbnail"), "Thumbnail  is missing or not a string", ERROR_TYPE.INVALID_ARGUMENTS);
    }
    return errors;
  };

  export const validationUser = (name, lastName, email, age, password) => {
    const errors = [];  
    if (!name) {
      errors.push("Name is required.");
    } else if (typeof name !== "string" || name.trim() === "") {
      errors.push("Name must be a non-empty string.");
    }
  
    if (!lastName) {
      errors.push("Last Name is required.");
    } else if (typeof lastName !== "string" || lastName.trim() === "") {
      errors.push("Last Name must be a non-empty string.");
    }
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email) {
      errors.push("email is required.");
    } else if (!regex.test(email)) {
      console.log(typeof email);
      errors.push("email must be a valid email address");
    }
  
    if (!age || isNaN(age) || age <= 0) {
      errors.push(
        "Age is required, must be a number, and must be greater than 0."
      );
    }
  
    if (!password) {
      errors.push("Password is required.");
    } else if (typeof password !== "string" || password.trim() === "") {
      errors.push("Category must be a non-empty string.");
    }
  
    return errors;
  };

  export const validationLogin = (email, password) => {
    const errors = [];  
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email) {
      errors.push("email is required.");
    } else if (!regex.test(email)) {
      console.log(typeof email);
      errors.push("email must be a valid email address");
    }
    if (!password) {
      errors.push("Password is required.");
    } else if (typeof password !== "string" || password.trim() === "") {
      errors.push("Category must be a non-empty string.");
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



