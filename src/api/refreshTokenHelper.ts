// src/api/refreshTokenHelper.ts
// Helper dùng chung cho userApi, postApi... để refresh token và cập nhật localStorage

export async function refreshAccessToken(localStorageKey = "adminAuth") {
  try {
    const res = await fetch(
      import.meta.env.VITE_API_URL + "/api/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Refresh token failed");
    const data = await res.json();
    if (data?.data) {
      // Giữ lại toàn bộ thông tin cũ, chỉ cập nhật token mới
      const oldAuth = localStorage.getItem(localStorageKey);
      let oldData = {};
      if (oldAuth) {
        oldData = JSON.parse(oldAuth);
      }
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ ...oldData, token: data.data })
      );
      return data.data;
    }
    throw new Error("No token in refresh response");
  } catch (err) {
    localStorage.removeItem(localStorageKey);
    return null;
  }
}
