// Function to save data to localStorage
export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Function to load data from localStorage
export const loadData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};