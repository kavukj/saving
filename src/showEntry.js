import { useState, useEffect } from "react";

export default function ShowEntry() {
    const [entries, setEntries] = useState([]);
    const [filterType, setFilterType] = useState(""); // Filter by Type
    const [name, setName] = useState(""); // Filter by Name
    const [sortOrder, setSortOrder] = useState("asc"); // Sorting Order
    const [hideCashedEntries, setHideCashedEntries] = useState(false); // Toggle cashed-out entries

    // Fetch Data from JSON Server
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kavukj/saving/master/data.json")
            .then((res) => res.json())
            .then((data) => setEntries(data))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    // Convert date format to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
    };

    // Calculate Maturity Date (Start Date + Time Period in Months)
    const calculateMaturityDate = (startDate, timePeriod) => {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + Number(timePeriod));
        return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    // Handle Cashed Out Date Update
    const handleCashedOutDate = (id, date) => {
        fetch(`http://localhost:5001/entries/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cashedOutDate: date }),
        })
            .then((res) => res.json())
            .then((updatedEntry) => {
                setEntries((prevEntries) =>
                    prevEntries.map((entry) =>
                        entry.id === id ? { ...entry, cashedOutDate: date } : entry
                    )
                );
            })
            .catch((err) => console.error("Error updating data:", err));
    };

    // Handle Delete Entry
    const handleDeleteEntry = (id) => {
        fetch(`http://localhost:5001/entries/${id}`, { method: "DELETE" })
            .then(() => {
                setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
            })
            .catch((err) => console.error("Error deleting entry:", err));
    };

    // Check if maturity date is within the next 30 days
    const isMaturitySoon = (maturityDate) => {
        const today = new Date();
        const maturity = new Date(maturityDate);
        const diffInDays = Math.ceil((maturity - today) / (1000 * 60 * 60 * 24));
        return diffInDays <= 30;
    };

    // Filter & Sort Data
    const filteredEntries = entries
        .filter((entry) => (filterType ? entry.type === filterType : true)) // Filter by type
        .filter((entry) => !hideCashedEntries || !entry.cashedOutDate) // Hide cashed entries if checked
        .filter((entry) => name ? entry.name === name :  true ) 
        .map((entry) => {
            const maturityDate = entry?.date && entry?.timePeriod ? calculateMaturityDate(entry.date, entry.timePeriod) : '';
            const isNearMaturity = entry?.date && entry?.timePeriod && !entry.cashedOutDate ? isMaturitySoon(maturityDate) : false;

            return {
                ...entry,
                maturityDate,
                isNearMaturity,
            };
        })
        .sort((a, b) => {
            // 1️⃣ Cashed-out entries should always be at the bottom
            if (a.cashedOutDate && !b.cashedOutDate) return 1;
            if (!a.cashedOutDate && b.cashedOutDate) return -1;

            // 2️⃣ Near-maturity entries should be at the top
            if (a.isNearMaturity && !b.isNearMaturity) return -1;
            if (!a.isNearMaturity && b.isNearMaturity) return 1;

            // 3️⃣ Sort remaining entries by date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

    return (
        <div className="w-full max-w-5xl mx-auto mt-6 bg-gray-700 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">Entries Table</h2>

            {/* Filters */}
            <div className="flex justify-between mb-4">
                {/* Dropdown to filter by type */}
                <select
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2 border rounded-md focus:ring-1 bg-black text-white focus:ring-white outline-none"
                >
                    <option value="">All Types</option>
                    <option value="FD">FD</option>
                    <option value="TD">TD</option>
                    <option value="NSC">NSC</option>
                    <option value="RD">RD</option>
                    <option value="MIS">MIS</option>
                    <option value="SB">SB</option>
                    <option value="KVP">KVP</option>
                </select>

                <select
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded-md focus:ring-1 bg-black text-white focus:ring-white outline-none"
                >
                    <option value="">All</option>
                    <option value="Kavya Jain">Kavya Jain</option>
                    <option value="Arhant Jain">Arhant Jain</option>
                    <option value="Arpita Jain">Arpita Jain</option>
                    <option value="Archana Jain">Archana Jain</option>
                </select>

                {/* Sort button */}
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
                </button>

                {/* Checkbox to hide cashed-out entries */}
                <label className="flex items-center space-x-2 text-white">
                    <input
                        type="checkbox"
                        checked={hideCashedEntries}
                        onChange={() => setHideCashedEntries(!hideCashedEntries)}
                    />
                    <span>Hide Cashed On Entries</span>
                </label>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="border p-2">Sr No</th>
                            <th className="border p-2">Number</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">Maturity Date</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Cashed On</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.length > 0 ? (
                            filteredEntries.map((entry, index) => {
                                const dangerClass = entry.isNearMaturity && !entry.cashedOutDate ? "bg-red-400" : "";
                                const successClass = entry.cashedOutDate ? "bg-green-700" : "";

                                return (
                                    <tr key={entry.id} className={`text-center text-sm text-white ${dangerClass} ${successClass}`}>
                                        <td className="border p-1">{index + 1}</td>
                                        <td className="border p-1">{entry.number}</td>
                                        <td className="border p-1">{entry.type}</td>
                                        <td className="border p-1">{entry.name}</td>
                                        <td className="border p-1">{formatDate(entry.date)}</td>
                                        <td className="border p-1">{formatDate(entry.maturityDate)}</td>
                                        <td className="border p-1">₹{entry.amount}</td>
                                        <td className="border p-1">{entry.location}</td>
                                        <td className="border p-1">
                                            <input type="date" value={entry.cashedOutDate || ""} onChange={(e) => handleCashedOutDate(entry.id, e.target.value)} className="p-1 border rounded-md text-black" />
                                        </td>
                                        <td className="border p-1">
                                            <button onClick={() => handleDeleteEntry(entry.id)} className="text-black bg-white p-1 rounded-md">Delete</button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="10" className="border p-2 text-center text-white">No data available.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
