import { useState } from "react";
import AddEntry from "./addEntry";
import ShowEntry from "./showEntry";

function App() {
  const [showForm, setShowForm] = useState(false); // Toggle state

  return (
    <div className="bg-black min-h-screen flex flex-col items-center p-4">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-gray-900 p-4 rounded-md shadow-lg">
        <h1 className="text-white text-2xl font-semibold">Financial Entries</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? "View Entries" : "Add Entry"}
        </button>
      </div>

      {/* Show Table or Add Entry Form */}
      <div className="w-full max-w-4xl mt-4">
        {showForm ? <AddEntry /> : <ShowEntry />}
      </div>
    </div>
  );
}

export default App;
