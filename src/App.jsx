import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import SearchBar from "./components/searchbar";
import UserTable from "./components/usertable";
import FilterPopup from "./components/filter";
import UserForm from "./components/userform";

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        const userList = res.data.map((user) => {
          const [firstName, ...lastNameParts] = user.name.split(" ");
          return {
            id: user.id,
            firstName,
            lastName: lastNameParts.join(" "),
            name: user.name,
            email: user.email,
            department: user.company ? user.company.name : "",
          };
        });
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
          const [firstName, ...lastNameParts] = user.name.split(" ");
          user.firstName = firstName;
          user.lastName = lastNameParts.join(" ");
          setUsers([...users, user]);
          setShowForm(false);
          setErrorMessage("");
        })
        .catch(() => setErrorMessage("Failed to add user"));
    }
  };

  let filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.department.toLowerCase().includes(searchText.toLowerCase())
  );

  filteredUsers = filteredUsers.filter((user) => {
    return (
      (!filters.firstName ||
        user.firstName
          .toLowerCase()
          .includes(filters.firstName.toLowerCase())) &&
      (!filters.lastName ||
        user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) &&
      (!filters.email ||
        user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.department ||
        user.department
          .toLowerCase()
          .includes(filters.department.toLowerCase()))
    );
  });

  if (sortConfig.key) {
    filteredUsers.sort((a, b) => {
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

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
        onFilter={() => setShowFilter(true)}
      />

      <UserTable
        users={paginatedUsers}
        page={page}
        setPage={setPage}
        total={filteredUsers.length}
        perPage={perPage}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onSort={setSortConfig}
        sortConfig={sortConfig}
      />

      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showFilter && (
        <FilterPopup
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}

export default App;
