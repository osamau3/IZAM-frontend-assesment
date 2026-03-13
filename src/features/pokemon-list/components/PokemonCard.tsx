import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSpriteUrl, formatPokemonId } from '../../../services/pokemonApi';
import './PokemonCard.css';

interface PokemonCardProps {
  id: number;
  name: string;
}

/**
 * Individual Pokémon card for the grid view.
 *
 * Why React.memo: Prevents unnecessary re-renders when the parent
 * (PokemonListPage) re-renders due to state changes (e.g., toggling
 * view mode). Since `id` and `name` are primitives, the shallow
 * comparison is sufficient for memoization.
 */
function PokemonCardInner({ id, name }: PokemonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(id % 20, 19) * 0.03 }}
    >
      <Link
        to={`/pokemon/${id}`}
        className="pokemon-card"
        id={`pokemon-card-${id}`}
        aria-label={`View details for ${name}`}
      >
        <div className="pokemon-card__sprite-container">
          <img
            className="pokemon-card__sprite"
            src={getSpriteUrl(id)}
            alt={name}
            loading="lazy"
            width="120"
            height="120"
          />
        </div>
        <h3 className="pokemon-card__name">{name}</h3>
        <span className="pokemon-card__id">{formatPokemonId(id)}</span>
      </Link>
    </motion.div>
  );
}

export const PokemonCard = memo(PokemonCardInner);
