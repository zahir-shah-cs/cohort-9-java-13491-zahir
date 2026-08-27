import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT to every request
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
Api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 Unauthorized
    if (
      error.response?.status === 401 &&
      originalRequest
    ) {
      // Get current retry count
      originalRequest._retryCount =
        originalRequest._retryCount || 0;

      // Retry maximum 2 times
      if (originalRequest._retryCount < 2) {
        originalRequest._retryCount++;

        console.log(
          `Unauthorized. Retrying request (${originalRequest._retryCount}/2)...`
        );

        return Api(originalRequest);
      }

      // 3 total attempts failed
      console.log(
        "Authentication failed after retries. Logging out..."
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default Api;