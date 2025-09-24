import React, { useState } from "react";

function FilterPopup({ filters, setFilters, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const resetFilters = () => {
    setLocalFilters({ firstName: "", lastName: "", email: "", department: "" });
    setFilters({ firstName: "", lastName: "", email: "", department: "" });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Filter Users</h3>
        <input
          name="firstName"
          placeholder="First Name"
          value={localFilters.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={localFilters.lastName}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={localFilters.email}
          onChange={handleChange}
        />
        <input
          name="department"
          placeholder="Department"
          value={localFilters.department}
          onChange={handleChange}
        />
        <div className="popup-actions">
          <button onClick={applyFilters}>Apply</button>
          <button onClick={resetFilters}>Reset</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default FilterPopup;
