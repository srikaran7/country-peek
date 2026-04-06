import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

function Home() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setCountries([]);
      setStatus('idle');
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setStatus('loading');
      setError(null);

      fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('No matching countries found.');
          }
          return response.json();
        })
        .then((data) => {
          setCountries(data);
          setStatus('success');
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          setCountries([]);
          setError(err.message);
          setStatus('error');
        });
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const showPlaceholder = !query.trim() && status === 'idle';

  return (
    <div className="home">
      <SearchBar query={query} onQueryChange={setQuery} />

      {showPlaceholder && (
        <p className="home__placeholder">
          Start searching to explore countries.
        </p>
      )}

      {status === 'loading' && <p className="home__status">Searching...</p>}
      {status === 'error' && <p className="home__error">Error: {error}</p>}

      {status === 'success' && countries.length === 0 && (
        <p className="home__status">No matching countries found.</p>
      )}

      {countries.length > 0 && (
        <div className="country-list">
          {countries.map((country) => (
            <article
              key={country.ccn3 || country.cca3 || country.cca2}
              className="country-card"
            >
              <img
                className="country-card__flag"
                src={country.flags?.png || country.flags?.svg}
                alt={`Flag of ${country.name.common}`}
              />
              <div className="country-card__info">
                <h3>{country.name.common}</h3>
                <p>{country.region}</p>
                <p>{country.population.toLocaleString()} people</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;