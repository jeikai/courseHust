import axios from "axios";

// Global response interceptor: on any 401/403 caused by an expired access
// token, silently refresh it via the stored refresh token and retry the
// original request once. Every page makes API calls through the same
// default `axios` instance, so registering this here covers all of them,
// not just the initial auth check on app boot.
//
// If refreshing fails (refresh token missing/invalid/expired), the user is
// signed out so they can log in again - there is no further fallback.

let refreshPromise = null;

const REFRESH_EXEMPT_PATHS = ["/api/auth/refresh", "/api/user/login"];

function isExemptRequest(config) {
  if (!config?.url) return true;
  return REFRESH_EXEMPT_PATHS.some((path) => config.url.includes(path));
}

function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available"));
  }

  refreshPromise = axios
    .post("/api/auth/refresh", { refreshToken })
    .then((res) => {
      const newToken = res.data.authenticated;
      const cachedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (cachedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...cachedUser, authenticated: newToken })
        );
      }
      axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
      return newToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function signOutAndRedirect() {
  localStorage.clear();
  window.location = "/login";
}

export function setupAxiosInterceptor() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const isAuthExpiry = status === 401 || status === 403;

      if (
        !isAuthExpiry ||
        isExemptRequest(originalRequest) ||
        originalRequest._retriedAfterRefresh
      ) {
        return Promise.reject(error);
      }

      originalRequest._retriedAfterRefresh = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return axios(originalRequest);
      } catch (refreshError) {
        signOutAndRedirect();
        return Promise.reject(refreshError);
      }
    }
  );
}
