"use client";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpcomingTripSection from "./UpcomingTripSection";
import { useState } from "react";

export default function UpcomingTripMain({ tripsWithcount }) {
  const [byCategory, setByCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // console.log("tripsWithcount", tripsWithcount);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="row tripogram-trip-browser">
      {/* Sidebar */}
      <div className="col-xxl-3 col-lg-4">
        <aside className="sidebar-area d-none d-lg-block tripogram-filter-panel">
          {/* Search Widget */}
          <div className="widget widget_search">
            <div className="search-form asdadsad" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingRight: searchQuery ? "80px" : "50px" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                  style={{
                    position: "absolute",
                    right: "44px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#0598cc",
                    padding: "0 6px",
                    fontSize: "14px",
                    lineHeight: "1",
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
              <button type="button">
                <i>
                  <FontAwesomeIcon icon={faSearch} />
                </i>
              </button>
            </div>


          </div>

          <div className="widget widget_categories">
            <h3 className="widget_title">BOOK YOUR NEXT TRIP</h3>
            <ul>
              <li
                className={`${byCategory == "all" ? "active" : ""}`}
                onClick={() => setByCategory("all")}
              >
                <a>All</a>
              </li>
              {tripsWithcount.map((item) => (
                <li
                  className={`${byCategory == item.slug ? "active" : ""}`}
                  key={item.id}
                  onClick={() => setByCategory(item.slug)}
                >
                  <a>{item.heading}</a>
                  <span>{item.active_packages_count}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="col-xxl-9 col-lg-8">
        <UpcomingTripSection byCategory={byCategory === "all" ? "" : byCategory} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
