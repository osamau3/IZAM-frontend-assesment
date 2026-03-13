import { memo } from 'react';
import './TypeBadge.css';

/**
 * Color mapping for Pokémon types.
 *
 * Why a manual map vs API: The PokéAPI doesn't provide colors for types.
 * These are the canonical colors used across official Pokémon media,
 * ensuring visual consistency with what users expect.
 */
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

interface TypeBadgeProps {
  typeName: string;
}

/**
 * Why React.memo: TypeBadge receives a single string prop. Memoizing
 * prevents re-renders when the parent detail page re-renders but
 * the type hasn't changed.
 */
function TypeBadgeInner({ typeName }: TypeBadgeProps) {
  const color = TYPE_COLORS[typeName] || '#777';

  return (
    <span
      className="type-badge"
      style={{ backgroundColor: color }}
      id={`type-badge-${typeName}`}
    >
      {typeName}
    </span>
  );
}

export const TypeBadge = memo(TypeBadgeInner);
