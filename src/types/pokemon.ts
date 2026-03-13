/**
 * Shared TypeScript interfaces for the PokéAPI data structures.
 *
 * Why separate file: Decoupling data shapes from API calls ensures
 * components can be tested independently with mock data, and avoids
 * circular imports between service and UI layers.
 */

/** Single item in the paginated list endpoint */
export interface PokemonListItem {
  name: string;
  url: string;
}

/** Response shape from GET /api/v2/pokemon?limit=N&offset=N */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

/** Individual base stat (HP, Attack, etc.) */
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

/** Type slot (e.g., Fire, Water) */
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

/** Ability slot */
export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

/** Sprites — we only use the official-artwork front_default */
export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

/** Full response from GET /api/v2/pokemon/{id} */
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  stats: PokemonStat[];
  types: PokemonType[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
}
