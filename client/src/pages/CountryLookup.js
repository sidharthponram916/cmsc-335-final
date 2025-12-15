import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CountryLookup() {
  const { country } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            country
          )}?fullText=true`
        );

        if (!res.ok) {
          throw new Error("Country not found");
        }

        const json = await res.json();
        setData(json[0]); // REST Countries returns an array
      } catch (err) {
        setError(err.message || "Failed to load country data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [country]);

  if (loading) {
    return <div className="text-center mt-10">Loading country data...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const {
    name,
    flags,
    capital,
    region,
    subregion,
    population,
    languages,
    currencies,
  } = data;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-1/2 bg-slate-500/50 rounded p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={flags?.png}
            alt={flags?.alt || `${name.common} flag`}
            className="w-16 h-auto rounded"
          />
          <h1 className="text-2xl font-semibold">{name.common}</h1>
        </div>

        <div className="space-y-2 text-sm">
          <div><strong>Capital:</strong> {capital?.[0] || "N/A"}</div>
          <div><strong>Region:</strong> {region}</div>
          <div><strong>Subregion:</strong> {subregion || "N/A"}</div>
          <div><strong>Population:</strong> {population.toLocaleString()}</div>
          <div>
            <strong>Languages:</strong>{" "}
            {languages ? Object.values(languages).join(", ") : "N/A"}
          </div>
          <div>
            <strong>Currencies:</strong>{" "}
            {currencies
              ? Object.values(currencies)
                  .map((c) => `${c.name} (${c.symbol || ""})`)
                  .join(", ")
              : "N/A"}
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CountryLookup;
