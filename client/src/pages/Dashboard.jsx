import React, { useState } from "react";
import AddUserModal from "../components/AddUserModal";
import { Ellipsis } from "lucide-react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  React.useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/allusers", {
          method: "GET",
          headers: {
            "Content-Type": "application",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 401) {
          window.location.href = "/";
          return;
        }
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dob.includes(searchTerm)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "dob") {
      // Ensure proper date format before sorting
      return (
        new Date(a.dob.split("/").reverse().join("-")) -
        new Date(b.dob.split("/").reverse().join("-"))
      );
    }
    return 0;
  });

  return (
    <div className="p-4">
      <div className="flex flex-row-reverse justify-between mb-4">
        <div className="flex flex-row-reverse items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <AddUserModal />
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="dob">Sort by DOB (Oldest First)</option>
        </select>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-b">
            <tr className="grid grid-cols-5">
              <th className="px-6 py-3 col-span-1">Name</th>
              <th className="px-6 py-3 text-end col-span-1">DOB</th>
              <th className="px-6 py-3 text-end col-span-2">Profile Picture</th>
              <th className="px-6 py-3 text-center col-span-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-300 text-black grid grid-cols-5">
                <td className="px-6 py-4 font-medium col-span-1">{user.name}</td>
                <td className="px-6 py-4 text-end col-span-1">{user.dob}</td>
                <td className="px-6 py-4 flex justify-end col-span-2">
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-[200px] h-[150px] object-cover rounded-lg shadow-md border border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 col-span-1 flex justify-center items-center"><div><Ellipsis /></div></td>
              </tr>
            ))}
            {sortedUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
