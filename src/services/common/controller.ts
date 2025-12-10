// create a function to handle request, response and error, input is a function that returns a promise
export const handleRequest = async (fn: () => Promise<any>) => {
  try {
    return await fn();
  } catch (error) {
    throw error;
  }
};
