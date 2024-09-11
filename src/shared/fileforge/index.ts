import { FileforgeClient } from '@fileforge/client';

const ff = new FileforgeClient({
  apiKey: () => import.meta.env.VITE_FILEFORGE_API_KEY,
});

export { ff };
