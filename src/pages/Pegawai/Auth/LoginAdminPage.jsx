import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const loginAdmin = async (credentials) => {
  let res = null;

  await axios
    .post("/login/admin", credentials, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      res = response;
    })
    .catch((error) => {
      res = error.response;
    });

  return res;
};

function LoginAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();
  const [load, setLoad] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoad(true);
    const response = await loginAdmin({
      email,
      password,
    });
    setLoad(false);
    if (response.data.status === "T" && response.data.data.user.id_role) {
      toast.success(response.data.message);
      localStorage.setItem("apiKeyAdmin", response.data.data.authorization.token);
      localStorage.setItem("idPgw", response.data.data.user.id);
      navigation("/admin/dashboard");
    } else {
      //   setValidation(response.data.message);
      toast.error(response.data.message);
      // refreshPage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/admin/lupaPassword"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Lupa Password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {load? "Tunggu Sebentar..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginAdminPage;
