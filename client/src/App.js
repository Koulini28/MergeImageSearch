import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);

  // ✅ Check if user is logged in
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // ✅ Fetch top searches
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/top-searches")
      .then((res) => setTopSearches(res.data))
      .catch(() => {});
  }, []);

  // ✅ Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/search",
        { term: query, userId: user?._id },
        { withCredentials: true }
      );
      setImages(res.data.results || []);
      setSelected([]);
      fetchHistory();
    } catch (err) {
      alert("You must be logged in to search or Unsplash API failed.");
    }
  };

  // ✅ Fetch search history
  const fetchHistory = () => {
    if (!user?._id) return;
    axios
      .get(`http://localhost:5000/api/history?userId=${user._id}`, {
        withCredentials: true,
      })
      .then((res) => setHistory(res.data))
      .catch(() => {});
  };

  // ✅ Handle image selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Logout
  const handleLogout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <h1 style={{ color: "#333", padding: "20px 0", margin: 0 }}>
        🖼️ Image Search App
      </h1>

      {/* ✅ Top Searches Banner */}
      <div
        style={{
          background: "#fff",
          padding: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <strong>🔥 Top Searches:</strong>{" "}
        {topSearches.length > 0 ? (
          topSearches.map((t, i) => (
            <span
              key={i}
              style={{
                background: "#e0f7fa",
                margin: "5px",
                padding: "5px 10px",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              {t._id} ({t.count})
            </span>
          ))
        ) : (
          <span>No top searches yet</span>
        )}
      </div>

      {/* ✅ Login Section */}
      {!user ? (
        <div style={{ marginTop: "60px" }}>
          <h2>Login with Google to Start Searching</h2>
          <a href="http://localhost:5000/auth/google">
            <button
              style={{
                backgroundColor: "#4285F4",
                color: "white",
                padding: "12px 25px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "20px",
              }}
            >
              Continue with Google
            </button>
          </a>
        </div>
      ) : (
        <>
          <p style={{ marginTop: "20px" }}>
            Welcome, <b>{user.name}</b>!
          </p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "crimson",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>

          {/* ✅ Search Section */}
          <form onSubmit={handleSearch} style={{ marginTop: "40px" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images..."
              style={{
                width: "60%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Search
            </button>
          </form>

          {/* ✅ Search Info */}
          {images.length > 0 && (
            <p style={{ marginTop: "15px", fontSize: "16px" }}>
              You searched for <b>{query}</b> — {images.length} results.
            </p>
          )}

          {/* ✅ Multi-select counter */}
          {images.length > 0 && (
            <p style={{ marginTop: "10px" }}>
              Selected: <b>{selected.length}</b> images
            </p>
          )}

          {/* ✅ Image Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "15px",
              marginTop: "20px",
              padding: "0 40px",
            }}
          >
            {images.map((img) => (
              <div key={img.id} style={{ position: "relative" }}>
                <img
                  src={img.urls.small}
                  alt={img.alt_description}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <input
                  type="checkbox"
                  checked={selected.includes(img.id)}
                  onChange={() => toggleSelect(img.id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "20px",
                    height: "20px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* ✅ Search History */}
          <div style={{ marginTop: "40px" }}>
            <h3>🕒 Your Search History</h3>
            {history.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {history.map((h, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>
                    <b>{h.term}</b> — {new Date(h.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No search history yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
