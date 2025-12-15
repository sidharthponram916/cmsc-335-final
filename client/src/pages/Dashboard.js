import { useEffect, useMemo, useState } from "react";

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("countries");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/entries");
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load entries.");
        setEntries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const normalize = (s) => (s || "").trim();

  const { countriesList, statesList, countriesCount, statesCount } =
    useMemo(() => {
      const countriesSet = new Set();
      const statesSet = new Set();

      for (const e of entries) {
        const type = (e.locationType || "").toLowerCase().trim();
        const name = normalize(e.name);

        if (!name) continue;

        if (type === "country" || type === "countries") countriesSet.add(name);
        if (
          type === "state" ||
          type === "states" ||
          type === "u.s. state" ||
          type === "us state"
        )
          statesSet.add(name);
      }

      const countriesList = Array.from(countriesSet).sort((a, b) =>
        a.localeCompare(b)
      );
      const statesList = Array.from(statesSet).sort((a, b) =>
        a.localeCompare(b)
      );

      return {
        countriesList,
        statesList,
        countriesCount: countriesList.length,
        statesCount: statesList.length,
      };
    }, [entries]);

  const shownList = activeTab === "countries" ? countriesList : statesList;
  const emptyText =
    activeTab === "countries"
      ? "no countries visited :("
      : "no states visited :(";

  return (
    <>
      <div>
        <div className="flex w-full">
          <div className="w-1/2 bg-slate-500/50 m-auto mt-5 rounded-[5px]">
            <div className="text-center mt-5 mb-5">where i've been</div>

            <div className="flex m-auto items-center justify-center text-center">
              <button
                type="button"
                onClick={() => setActiveTab("countries")}
                className={`p-4 w-1/4 rounded cursor-pointer ${
                  activeTab === "countries" ? "bg-slate-700/50" : ""
                }`}
                title="Show countries"
              >
                <div>
                  <span className="text-5xl">
                    {loading ? "—" : countriesCount}
                  </span>
                  /196
                </div>
                <div>Countries</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("states")}
                className={`p-4 w-1/4 rounded cursor-pointer ${
                  activeTab === "states" ? "bg-slate-700/50" : ""
                }`}
                title="Show states"
              >
                <div>
                  <span className="text-5xl">
                    {loading ? "—" : statesCount}
                  </span>
                  /50
                </div>
                <div>U.S. States</div>
              </button>
            </div>

            <div className="px-6 pb-4">
              {error ? (
                <div className="text-red-200 text-sm text-center mt-2">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="text-center mt-4 text-sm opacity-80">
                  loading...
                </div>
              ) : shownList.length === 0 ? (
                <div className="text-center mt-4 text-sm opacity-80">
                  {emptyText}
                </div>
              ) : (
                <div className="mt-4 max-h-56 overflow-auto rounded bg-slate-900/20 p-3">
                  <ul className="flex flex-wrap">
                    {shownList.map((item) => {
                      const pill = (
                        <li
                          key={item}
                          className={`bg-slate-950 p-1 m-1 text-sm rounded ${
                            activeTab === "countries"
                              ? "cursor-pointer hover:bg-slate-800"
                              : ""
                          }`}
                        >
                          {item}
                        </li>
                      );

                      return activeTab === "countries" ? (
                        <a
                          key={item}
                          href={`/country-lookup/${encodeURIComponent(item)}`}
                        >
                          {pill}
                        </a>
                      ) : (
                        pill
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <a href="/add-entry">
              <div className="text-center bg-green-600 p-2 w-1/2 m-auto mb-5 rounded cursor-pointer">
                Add an Entry
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
