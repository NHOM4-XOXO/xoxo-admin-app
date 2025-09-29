// src/api/refreshTokenHelper.ts
// Helper dùng chung cho userApi, postApi... để refresh token và cập nhật localStorage

export async function refreshAccessToken(localStorageKey = "adminAuth") {
  try {
    const localAuth = localStorage.getItem(localStorageKey);
    const sessionAuth = sessionStorage.getItem(localStorageKey);
    const authData = localAuth || sessionAuth;

    if (!authData) {
      console.log("No auth data found for refresh");
      return null;
    }

    const { token: currentToken } = JSON.parse(authData);
    if (!currentToken) {
      console.log("No current token found for refresh");
      return null;
    }
    const res = await fetch(
      import.meta.env.VITE_API_URL + "/api/auth/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          token: currentToken,
        }),
      }
    );
    if (!res.ok) {
      console.log("Refresh failed with status:", res.status);
      throw new Error("Refresh token failed");
    }

    const data = await res.json();
    console.log("RefreshTokenHelper response:", data);

    if (data?.data) {
      let oldData = {};
      let targetStorage;

      if (localAuth) {
        oldData = JSON.parse(localAuth);
        targetStorage = localStorage;
      } else if (sessionAuth) {
        oldData = JSON.parse(sessionAuth);
        targetStorage = sessionStorage;
      } else {
        throw new Error("No auth data found");
      }

      targetStorage.setItem(
        localStorageKey,
        JSON.stringify({ ...oldData, token: data.data })
      );

      return data.data;
    }

    throw new Error("No token in refresh response");
  } catch (err) {
    console.error("Refresh token error:", err);
    localStorage.removeItem(localStorageKey);
    sessionStorage.removeItem(localStorageKey);
    return null;
  }
}
