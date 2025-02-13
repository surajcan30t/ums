import React from "react";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

function SignupForm() {
  const { resetToken } = useParams();
  const [value, setValue] = React.useState({
    resetToken: resetToken,
    password: "",
    confirmPassword: "",
  });
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.password === "") {
      setMessage("Password cannot be empty");
      return;
    }
    if (value.password !== value.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      setProcessing(true);
      console.log(value);
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        credentials: "include",
      });
      setProcessing(false);
      if (response.status !== 201) {
        const data = await response.json();
        setMessage(data.error || "Something went wrong");
        return;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
    }
  };
  return (
    <>
      <form className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={value.password}
              autoComplete="current-password"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm Password
            </label>
          </div>
          <div className="mt-2">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              onChange={handleChange}
              value={value.confirmPassword}
              autoComplete="current-password"
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
              "Reset Password"
            )}
          </button>
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </>
  );
}

const ResetPassword = () => {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Reset Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <SignupForm />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
