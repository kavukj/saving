import { useState, useEffect } from "react";

export default function AddEntry() {
    const [formData, setFormData] = useState({
        number: "",
        type: "FD",
        name: "",
        date: "",
        timePeriod: "",
        amount: "",
    });

    const [entries, setEntries] = useState([]);

    // Fetch existing entries from JSON Server
    useEffect(() => {
        fetch("http://localhost:5001/entries")
            .then((res) => res.json())
            .then((data) => setEntries(data))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save new entry to JSON Server
        fetch("http://localhost:5001/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((newEntry) => {
                setEntries([...entries, newEntry]); // Update UI with new data
                setFormData({
                    number: "",
                    type: "FD",
                    name: "",
                    date: "",
                    timePeriod: "",
                    amount: "",
                });
            })
            .catch((err) => console.error("Error saving data:", err));
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-700 p-4">
            <div className="w-full max-w-md bg-black p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">Simple Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-white font-medium mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        >
                            <option value="FD">FD</option>
                            <option value="TD">TD</option>
                            <option value="NSC">NSC</option>
                            <option value="RD">RD</option>
                            <option value="MIS">MIS</option>
                            <option value="SB">SB</option>
                            <option value="KVP">KVP</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-1">Alphanumeric Number</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.alphaNumeric}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter alphanumeric number"
                            pattern="[A-Za-z0-9]+"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-1">Start Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-1">Time Period (Months)</label>
                        <input
                            type="number"
                            name="timePeriod"
                            value={formData.timePeriod}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter time period in months"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter amount"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-1">Location</label>
                        <select
                            name="type"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value=""></option>
                            <option value="Jawahar Nagar">Jawahar Nagar</option>
                            <option value="Jareeb Chowki">Jareeb Chowki</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="UCO Bank">UCO Bank</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
