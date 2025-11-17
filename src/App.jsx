import React, { useEffect, useState } from 'react';
import './Pokedex.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [error, setError] = useState(null);

  const fetchPokemon = async (identifier) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);

      if (!res.ok) throw new Error('Not found');

      const data = await res.json();
      return data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadPokemon = async (identifier) => {
    const data = await fetchPokemon(identifier);
    
    if (data) {
      setPokemon(data);
      setCurrentId(data.id);
      setQuery('');
    } else {
      setPokemon(null);
      setError('Not found :c');
    }
  };

  useEffect(() => {
    loadPokemon(currentId);
  }, []);

  const chooseSprite = (data) => {
    try {
      const animated =
        data.sprites.versions['generation-v']['black-white'].animated.front_default;
      if (animated) return animated;
    } catch {}

    if (data.sprites.front_default) return data.sprites.front_default;

    try {
      return data.sprites.other['official-artwork'].front_default;
    } catch {
      return null;
    }
  };

  return (
    <main className="container">
      <div className="pokedex-box">
        <img src="/images/pokedex.png" alt="pokedex" className="pokedex-bg" />

        <div className="overlay">

          <div className="pokemon-img-area">
            {loading ? (
              <p>Loading...</p>
            ) : (
              pokemon && (
                <img
                  src={chooseSprite(pokemon)}
                  alt={pokemon.name}
                  className="pokemon-img"
                />
              )
            )}
          </div>

          <h1 className="pokemon-info">
            <span>{pokemon ? `#${pokemon.id}` : ''}</span> -
            <span className="name">
              {pokemon ? pokemon.name : error ? 'Not found :c' : ''}
            </span>
          </h1>

          <form className="search-form" onSubmit={(e) => { e.preventDefault(); loadPokemon(query); }}>
            <input
              type="search"
              className="search-input"
              placeholder="Name or Number"
              value={query}
              required
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="buttons">
            <button
              className="btn"
              onClick={() => currentId > 1 && loadPokemon(currentId - 1)}
            >
              Prev &lt;
            </button>

            <button
              className="btn"
              onClick={() => loadPokemon(currentId + 1)}
            >
              Next &gt;
            </button>
          </div>

          <div className="error">{error}</div>
        </div>
      </div>
    </main>
  );
}
