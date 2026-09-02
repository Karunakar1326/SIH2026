import type { District } from './types';

export const districts: District[] = [
  { id: 'ganjam', name: 'Ganjam', state: 'Odisha', coordinates: { lat: 19.38, lng: 84.98 }, zoom: 9 },
  { id: 'puri', name: 'Puri', state: 'Odisha', coordinates: { lat: 19.81, lng: 85.83 }, zoom: 9 },
  { id: 'jagatsinghpur', name: 'Jagatsinghpur', state: 'Odisha', coordinates: { lat: 20.25, lng: 86.17 }, zoom: 9 },
  { id: 'kendrapara', name: 'Kendrapara', state: 'Odisha', coordinates: { lat: 20.50, lng: 86.42 }, zoom: 9 },
  { id: 'balasore', name: 'Balasore', state: 'Odisha', coordinates: { lat: 21.49, lng: 86.93 }, zoom: 9 },
];

export const getDistricts = async (): Promise<District[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(districts), 200));
};
