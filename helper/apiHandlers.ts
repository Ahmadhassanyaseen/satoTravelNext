import axios from "axios";

// Reusable function to fetch data from an API
export const getAll = async ({ type, url }: { type: string; url: string }) => {
  try {
    const res = await axios.get(url); // Await the axios request
    return res.data; // Return the response data
  } catch (err) {
    console.error("Error fetching data: ", err); // Log the error
    console.log("Error type:", type); // Log the type if needed
    return []; // Return an empty array if an error occurs
  }
};
