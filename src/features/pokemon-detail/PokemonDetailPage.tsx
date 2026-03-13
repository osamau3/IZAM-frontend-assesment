import { useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePokemonDetail } from './hooks/usePokemonDetail';
import { getSpriteUrl, formatPokemonId } from '../../services/pokemonApi';
import { TypeBadge } from './components/TypeBadge';
import { StatBar } from './components/StatBar';
import { DetailSkeleton } from './components/DetailSkeleton';
import { ErrorState } from '../../components/ErrorState';
import type { PokemonType, PokemonStat, PokemonAbility } from '../../types/pokemon';
import './PokemonDetailPage.css';

/**
 * Dedicated detail page for a single Pokémon (separate route).
 *
 * Why a full page vs modal: The assessment explicitly requires a
 * "separate route" and "not a modal, drawer, or inline expansion."
 * This also enables deep-linking and browser back navigation.
 */
export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(id!);

  /** useCallback: Stabilized retry handler for ErrorState */
  const handleRetry = useCallback(() => refetch(), [refetch]);

  /**
   * useMemo: Compute formatted height/weight once.
   * Avoids toFixed() recalculation on every render.
   */
  const physicalData = useMemo(() => {
    if (!pokemon) return null;
    return {
      height: (pokemon.height / 10).toFixed(1),
      weight: (pokemon.weight / 10).toFixed(1),
      spriteUrl: getSpriteUrl(pokemon.id),
      formattedId: formatPokemonId(pokemon.id),
    };
  }, [pokemon]);

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <div className="detail-page" id="pokemon-detail-page">
        <div className="detail-page__back-bar">
          <Link to="/" className="detail-page__back-link" id="back-to-list">
            ← Back to List
          </Link>
        </div>
        <ErrorState
          message={error?.message || 'Failed to load Pokémon details.'}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (!pokemon || !physicalData) return null;

  return (
    <motion.div
      className="detail-page"
      id="pokemon-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back navigation */}
      <div className="detail-page__back-bar">
        <Link to="/" className="detail-page__back-link" id="back-to-list">
          ← Back to List
        </Link>
      </div>

      {/* Gradient header */}
      <header className="detail-page__header" id="detail-header">
        <h1 className="detail-page__name">✨ {pokemon.name}</h1>
        <span className="detail-page__id">{physicalData.formattedId}</span>
      </header>

      {/* Content grid */}
      <div className="detail-page__content">
        {/* Left column: Sprite + Types + Physical */}
        <motion.div
          className="detail-page__left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="detail-page__sprite-container">
            <img
              className="detail-page__sprite"
              src={physicalData.spriteUrl}
              alt={pokemon.name}
              width="220"
              height="220"
            />
          </div>

          {/* Type badges */}
          <div className="detail-page__types" id="pokemon-types">
            {pokemon.types.map((t: PokemonType) => (
              <TypeBadge key={t.type.name} typeName={t.type.name} />
            ))}
          </div>

          {/* Height & Weight */}
          <div className="detail-page__physical" id="pokemon-physical">
            <div className="detail-page__physical-item">
              <span className="detail-page__physical-icon">📏</span>
              <div>
                <span className="detail-page__physical-label">Height</span>
                <span className="detail-page__physical-value">
                  {physicalData.height} m
                </span>
              </div>
            </div>
            <div className="detail-page__physical-item">
              <span className="detail-page__physical-icon">⚖️</span>
              <div>
                <span className="detail-page__physical-label">Weight</span>
                <span className="detail-page__physical-value">
                  {physicalData.weight} kg
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right column: Stats + Abilities */}
        <motion.div
          className="detail-page__right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Base Stats */}
          <section className="detail-page__stats" id="pokemon-stats">
            <h2 className="detail-page__section-title">Base Stats</h2>
            {pokemon.stats.map((stat: PokemonStat) => (
              <StatBar
                key={stat.stat.name}
                label={stat.stat.name}
                value={stat.base_stat}
              />
            ))}
          </section>

          {/* Abilities */}
          <section className="detail-page__abilities" id="pokemon-abilities">
            <h2 className="detail-page__section-title">Abilities</h2>
            <ul className="detail-page__ability-list">
              {pokemon.abilities.map((a: PokemonAbility) => (
                <li key={a.ability.name} className="detail-page__ability-item">
                  <span className="detail-page__ability-name">
                    {a.ability.name.replace('-', ' ')}
                  </span>
                  {a.is_hidden && (
                    <span className="detail-page__ability-hidden">Hidden</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Base Experience */}
          <section className="detail-page__experience" id="pokemon-experience">
            <h2 className="detail-page__section-title">Base Experience</h2>
            <span className="detail-page__xp-value">
              {pokemon.base_experience} XP
            </span>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
}
