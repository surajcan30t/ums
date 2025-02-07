import React from "react";
import { Loader } from "lucide-react";

function LoginForm() {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
  });
  const [ processing, setProcessing ] = React.useState(false);
  const [ message, setMessage ] = React.useState("");
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isValidEmail(value.email));
    if(!isValidEmail(value.email)){
      setMessage("Invalid email address");
      return;
    }
    if(value.password === ""){
      setMessage("Password cannot be empty");
      return;
    }
    try {
      setProcessing(true);
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        credentials: "include",
      });
      setProcessing(false);
      if(response.status !== 200){
        setMessage("Invalid username or password");
        return;
      }
      else{
        window.location.replace("/dashboard");
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
    }
  };
  return (
    <>
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {processing ? <Loader className="animate-spin" /> : "Sign in"}
          </button>
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </>
  );
}

function SignupForm(setToggleLoginOrSignup) {
  const [value, setValue] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [ processing, setProcessing ] = React.useState(false);
  const [ message, setMessage ] = React.useState("");
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(value.name === ""){
      setMessage("Name cannot be empty");
      return;
    }
    if(!isValidEmail(value.email)){
      setMessage("Invalid email address");
      return;
    }
    if(value.password === ""){
      setMessage("Password cannot be empty");
      return;
    }
    try {
      setProcessing(true);
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        credentials: "include",
      });
      setProcessing(false);
      if(response.status !== 201){
        const data = await response.json();
        setMessage(data.error || "User registration failed");
        return;
      }
      else{
        setToggleLoginOrSignup(true);
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
    }
  };
  return (
    <>
      <form className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              type="string"
              name="name"
              id="name"
              onChange={handleChange}
              value={value.name}
              autoComplete="name"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {processing ? <Loader className="animate-spin" /> : "Sign Up"}
          </button>
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </>
  );
}

const AuthenticationForm = () => {
  const [toggleLoginOrSignup, setToggleLoginOrSignup] = React.useState(true);
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {toggleLoginOrSignup
              ? "Sign in to your account"
              : "Create an account"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {toggleLoginOrSignup ? <LoginForm /> : <SignupForm setToggleLoginOrSignup={setToggleLoginOrSignup} />}

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {toggleLoginOrSignup
              ? " Do not have an account?"
              : "Already have an account?"}
            <button
              onClick={() => setToggleLoginOrSignup(!toggleLoginOrSignup)}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              &nbsp;Sign {toggleLoginOrSignup ? "up" : "in"} here
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthenticationForm;
