import { fetchWithCsrf } from '@/app/utils/csrf';

// Example usage in API route
export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetchWithCsrf('http://localhost:8080/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // Rest of your code...
} 