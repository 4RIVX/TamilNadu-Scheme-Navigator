import schemesData from '../data/schemes.json';
import type { Scheme } from '../types/scheme';

export const schemes: Scheme[] = schemesData.schemes as Scheme[];

export function getSchemeById(id: string): Scheme | undefined {
  return schemes.find((s) => s.id === id);
}

export function getAllSchemes(): Scheme[] {
  return schemes;
}
