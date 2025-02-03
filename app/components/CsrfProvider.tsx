'use client';

import { useEffect, useState } from 'react';

export default function CsrfProvider({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    // Get CSRF token from cookie
    const cookies = document.cookie.split(';');
    const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    if (xsrfCookie) {
      const token = decodeURIComponent(xsrfCookie.split('=')[1]);
      setCsrfToken(token);
      
      // Add meta tag dynamically
      let metaTag = document.querySelector('meta[name="csrf-token"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'csrf-token');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', token);
    }
  }, []);

  return children;
} 