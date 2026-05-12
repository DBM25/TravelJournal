import { clsx } from "clsx";


export const cn = (...inputs) => {
  return clsx(inputs);
};


export const conditionalClass = (condition, trueClass, falseClass = "") => {
  return condition ? trueClass : falseClass;
};
