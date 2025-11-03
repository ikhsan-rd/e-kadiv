const TOKEN_EXPIRATION_TIME = 120 * 60 * 1000; // 120 minutes

/**
 * Menyimpan token dan waktu kadaluarsa ke sessionStorage.
 * @param {string} token - Token yang akan disimpan.
 */
export const setToken = (token) =>
{
    const expiresAt = new Date().getTime() + TOKEN_EXPIRATION_TIME;
    sessionStorage.setItem("token",token);
    sessionStorage.setItem("expires_at",expiresAt.toString());
};

/**
 * Mengambil token dari sessionStorage dan memeriksa apakah kadaluarsa.
 * @param {Function} handleLogout - Fungsi untuk menangani logout jika token kadaluarsa.
 * @returns {string|null} Token jika masih berlaku, atau null jika kadaluarsa.
 */
export const getToken = (handleLogout) =>
{
    const expiresAt = sessionStorage.getItem("expires_at");
    if (expiresAt && new Date().getTime() > parseInt(expiresAt))
    {
        handleLogout(); // Logout jika token kadaluarsa
        return null;
    }
    return sessionStorage.getItem("token");
};

/**
 * Menghapus token dan waktu kadaluarsa dari sessionStorage.
 */
export const clearToken = () =>
{
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expires_at");
};
