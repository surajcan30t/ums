import PropTypes from "prop-types";
import React, { useRef } from "react";

DeleteUser.propTypes = {
  data: PropTypes.func.isRequired,
};
function DeleteUser({ data }) {
  const dialogRef = useRef(null);
  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  const [message, setMessage] = React.useState("");

  async function handleDelete(id) {
    try {
      setMessage("")
      const response = await fetch(`http://localhost:8000/api/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      if (response.status !== 200) {
        const data = await response.json();
        setMessage(data.error || "User deletion failed");
        return;
      } else {
        window.location.reload();
        return;
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later.`);
      // throw new Error(error);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={openDialog}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] p-6 border rounded-md min-w-[350px] bg-white"
      >
        <div>
          Are you sure want to delete the user?
        </div>
        <div className="flex justify-between items-center mt-5">
          <button onClick={closeDialog} className="px-4 py-1 bg-gray-300 rounded-lg ">Cancel</button>
          <button onClick={()=>handleDelete(data.id)} className="px-4 py-1 bg-red-500 rounded-lg text-white">Confirm</button>
        </div>
        <div>
          {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
      </dialog>
    </div>
  );
}

export default DeleteUser;
