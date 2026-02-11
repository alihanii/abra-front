/**
 * Cookie Utility Functions
 * Simple cookie management for client-side
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options (days, path, domain, secure, sameSite)
 */
export const setCookie = (name, value, options = {}) => {
  if (typeof window === "undefined") return;

  const {
    days = 7,
    path = "/",
    domain = "",
    secure = false,
    sameSite = "Lax"
  } = options;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}`;

  if (domain) {
    cookieString += `;domain=${domain}`;
  }

  if (secure) {
    cookieString += ";secure";
  }

  if (sameSite) {
    cookieString += `;sameSite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof window === "undefined") return null;

  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options (path, domain)
 */
export const removeCookie = (name, options = {}) => {
  if (typeof window === "undefined") return;

  const { path = "/", domain = "" } = options;

  let cookieString = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`;

  if (domain) {
    cookieString += `;domain=${domain}`;
  }

  document.cookie = cookieString;
};

