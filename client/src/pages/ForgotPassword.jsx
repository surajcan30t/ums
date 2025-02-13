import React from "react";
import { Loader } from "lucide-react";

export default function ForgotPassword() {
  const [value, setValue] = React.useState({
    email: "",
  });
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("")
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isValidEmail(value.email));
    if (!isValidEmail(value.email)) {
      setMessage("Invalid email address");
      return;
    }
    if (value.password === "") {
      setMessage("Password cannot be empty");
      return;
    }
    try {
      setProcessing(true);
      setSuccessMessage("")
      setMessage("")
      const response = await fetch("http://localhost:8000/api/send-reset-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        credentials: "include",
      });
      setProcessing(false);
      if (response.status === 400) {
        setMessage("This email does not exist");
        return;
      }
      if (response.status !== 201) {
        setMessage("Something went wrong");
        return;
      } else {
        setSuccessMessage("Check you mail to reset your password");
        return;
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
      setProcessing(false)
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={value.email}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {processing ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Send reset link"
                )}
              </button>
            </div>
            {message && <p className="text-red-500 text-center">{message}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
