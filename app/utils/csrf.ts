export function getCsrfToken(): string | null {
  // Get from meta tag first (most up-to-date)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    return metaTag.getAttribute('content');
  }

  // Fallback to cookie
  const cookies = document.cookie.split(';');
  const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
  if (xsrfCookie) {
    return decodeURIComponent(xsrfCookie.split('=')[1]);
  }

  return null;
}

export async function fetchWithCsrf(url: string, options: RequestInit = {}) {
  const token = getCsrfToken();
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('X-XSRF-TOKEN', token);
  }

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
} 