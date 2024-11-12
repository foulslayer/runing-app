//const apiUrl = "http://localhost:3000/"; // Include http://
const apiUrl = "http://192.168.0.31:3000";
//const apiUrl = "http://10.71.106.177:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"; // Add other methods as needed

const fetchApi = async (
  method: HttpMethod,
  path: string,
  options: {
    body?: any;
    authToken?: string;
  } = {}
) => {
  const { body, authToken } = options;

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("API Fetch Error:", error);
    console.log("API URL:", `${apiUrl}${path}`);
    throw error;
  }
};

export default fetchApi;
