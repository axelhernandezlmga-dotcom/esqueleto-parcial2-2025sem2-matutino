import { useEffect, useState } from 'react';

export default function Home() {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetch(new URL('/api/countries/URY', window.location)).then((req) => {
      if (req.ok) {
        req.json().then(setCountry);
      }
    });
  }, []);

  return (
    <div>
      <h1>{country?.name?.common ?? 'Cargando...'}</h1>
      {country && (
        <div>
          {country.flag?.svg ? (
            <img
              src={new URL(country.flag.svg, window.location)}
              alt={country.flag.alt ?? `Flag of ${country.name?.common}`}
              style={{ width: 160, height: 110 }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

