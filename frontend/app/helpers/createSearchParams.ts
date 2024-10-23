import { IProfileSearch } from "../interfaces";

export const createSearchParams = (paramsObj:IProfileSearch) => {
    const searchParams = new URLSearchParams();
  
    Object.entries(paramsObj).forEach(([key, value]) => {
      // Check if the value is an array (for multi-select options)
      if (Array.isArray(value)) {
        value.forEach(val => searchParams.append(key, val));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
  
    return searchParams.toString();  // Returns the query string
};