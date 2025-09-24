import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import UserForm from "./components/userform";
import UserTable from "./components/usertable";
import SearchBar from "./components/searchbar";

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        const userList = res.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.company ? user.company.name : "",
        }));
        setUsers(userList);
      })
      .catch(() => setErrorMessage("Failed to fetch users"));
  }, []);

  const handleAddUser = () => {
    setSelectedUser({ name: "", email: "", department: "" });
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => setUsers(users.filter((user) => user.id !== id)))
      .catch(() => setErrorMessage("Failed to delete user"));
  };

  const handleSaveUser = (user) => {
    if (user.id) {
      axios
        .put(`https://jsonplaceholder.typicode.com/users/${user.id}`, user)
        .then(() => {
          setUsers(users.map((u) => (u.id === user.id ? user : u)));
          setShowForm(false);
          setErrorMessage("");
        })
        .catch(() => setErrorMessage("Failed to update user"));
    } else {
      axios
        .post("https://jsonplaceholder.typicode.com/users", user)
        .then((res) => {
          user.id = res.data.id || users.length + 1;
          setUsers([...users, user]);
          setShowForm(false);
          setErrorMessage("");
        })
        .catch(() => setErrorMessage("Failed to add user"));
    }
  };

  // Filter users based on search text
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.department.toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginate users
  const startIndex = (page - 1) * perPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + perPage);

  return (
    <div className="container">
      <h2>User Management</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        perPage={perPage}
        setPerPage={setPerPage}
        onAdd={handleAddUser}
      />

      <UserTable
        users={paginatedUsers}
        page={page}
        setPage={setPage}
        total={filteredUsers.length}
        perPage={perPage}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;
