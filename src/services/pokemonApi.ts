import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a paginated list of Pokémon.
 *
 * Why we wrap fetch: Centralizing HTTP logic enables consistent error
 * handling, response validation, and makes endpoint changes a single
 * point of update rather than scattered across components.
 */
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches detailed data for a single Pokémon by ID or name.
 *
 * Why we use ID over name: IDs are guaranteed to be unique and don't
 * require URL-encoding, reducing potential errors.
 */
export async function fetchPokemonDetail(
  idOrName: string | number
): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon #${idOrName}: ${response.status}`);
  }

  return response.json();
}

/**
 * Extracts the Pokémon ID from a PokéAPI URL.
 * Example: "https://pokeapi.co/api/v2/pokemon/25/" → 25
 *
 * Why: The list endpoint only returns name + URL, so we need to parse
 * the ID from the URL for routing and display purposes.
 */
export function extractIdFromUrl(url: string): number {
  const segments = url.replace(/\/$/, '').split('/');
  return parseInt(segments[segments.length - 1], 10);
}

/**
 * Returns the optimal sprite URL for a given Pokémon ID.
 * Prefers the official artwork, falls back to the default front sprite.
 */
export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Formats a Pokémon ID as a 3-digit string (e.g., 1 → "#001").
 */
export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}
