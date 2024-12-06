export function setData(data: any) {
  // Save the user data to localStorage as a JSON string
  localStorage.setItem("user", JSON.stringify(data));
}

export function getData() {
  // Retrieve the user data from localStorage and parse it back to an object
  const userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData); // Parse the stored JSON string back to an object
  }
  return null; // If there's no user data, return null
}

export function removeData() {
  // Remove the user data from localStorage
  localStorage.removeItem("user");
}
