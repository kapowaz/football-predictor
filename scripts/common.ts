export const API_BASE = 'https://api.football-data.org/v4';
export const COMPETITION_CODE = 'ELC';
export const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

export const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = new URL(endpoint, API_BASE);
  const response = await fetch(url.toString(), {
    headers: {
      'X-Auth-Token': API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
