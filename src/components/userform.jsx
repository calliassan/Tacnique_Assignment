import React, { useState } from "react";

function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState(user);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const field = e.target.name;
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.department) {
      setError("All fields are required");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Invalid email");
      return;
    }
    setError("");
    onSave(formData);
  };

  return (
    <div className="form-container">
      <h3>{formData.id ? "Edit User" : "Add User"}</h3>
      {error && <p className="error">{error}</p>}
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
      <div className="form-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default UserForm;
