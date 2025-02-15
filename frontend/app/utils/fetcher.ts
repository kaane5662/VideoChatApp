export const fetcher = (url: string) => fetch(url, {
    credentials: 'include', // This is important for cookies
    
  }).then(res => res.json())