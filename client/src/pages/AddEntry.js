import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddEntry() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    locationType: "country",
    name: "",
    lastVisited: "", // yyyy-mm-dd
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const US_STATES = useMemo(
    () => [
      "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
      "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
      "Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana",
      "Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina",
      "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
      "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
      "Wisconsin","Wyoming",
    ],
    []
  );

  const COUNTRIES = useMemo(
    () => [
      "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Australia","Austria",
      "Bahamas","Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia","Costa Rica",
      "Croatia","Cuba","Czechia","Denmark","Dominican Republic","Egypt","Estonia","Finland","France",
      "Germany","Greece","Hungary","Iceland","India","Indonesia","Ireland","Israel","Italy","Jamaica",
      "Japan","Kenya","Luxembourg","Malaysia","Mexico","Netherlands","New Zealand","Norway","Peru",
      "Philippines","Poland","Portugal","Romania","Singapore","South Africa","South Korea","Spain",
      "Sweden","Switzerland","Thailand","Turkey","Ukraine","United Kingdom","United States","Vietnam",
      // (trimmed for readability – your full list still works here)
    ],
    []
  );

  const inputClass =
    "rounded px-3 py-2 bg-white text-black focus:outline-none focus:ring-0 border border-gray-300";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "locationType") {
        return { ...prev, locationType: value, name: "" };
      }
      return { ...prev, [name]: value };
    });

    setStatus((prev) => ({ ...prev, error: "", success: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.locationType || !form.name || !form.lastVisited) {
      setStatus({ loading: false, error: "Please fill out all fields.", success: "" });
      return;
    }

    try {
      setStatus({ loading: true, error: "", success: "" });

      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationType: form.locationType,
          name: form.name,
          lastVisited: new Date(form.lastVisited), // send real Date
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add entry.");

      setStatus({ loading: false, error: "", success: "Entry added!" });
      setForm({ locationType: "country", name: "", lastVisited: "" });
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  const options = form.locationType === "state" ? US_STATES : COUNTRIES;

  return (
    <>
      <div>
        <div className="flex w-full">
          <div className="w-1/2 bg-slate-500/50 m-auto mt-5 rounded-[5px] p-5">
            <h2 className="text-xl font-semibold mb-4">Add Entry</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Location Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm">Location Type</label>
                <select
                  name="locationType"
                  value={form.locationType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="country">Country</option>
                  <option value="state">U.S. State</option>
                </select>
              </div>

              {/* Country / State */}
              <div className="flex flex-col gap-1">
                <label className="text-sm">
                  {form.locationType === "state" ? "U.S. State" : "Country"}
                </label>
                <select
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    {form.locationType === "state"
                      ? "Select a state"
                      : "Select a country"}
                  </option>
                  {options.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm">Last Visited</label>
                <input
                  type="date"
                  name="lastVisited"
                  value={form.lastVisited}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {status.error && <p className="text-red-200 text-sm">{status.error}</p>}
              {status.success && <p className="text-green-200 text-sm">{status.success}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 rounded px-4 py-2"
                >
                  {status.loading ? "Adding..." : "Add Entry"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 rounded px-4 py-2"
                >
                  Back to Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEntry;
