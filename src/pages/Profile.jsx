import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userLogged } from "../services/user";
import logo from "../assets/logo.png";
import { BiArrowBack } from "react-icons/bi";

import Cookies from "js-cookie";

import ErrorInput from "../components/ErrorInput";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [apiErrors, setApiErrors] = useState("");

  function validateToken() {
    const token = Cookies.get("token");
    if (!token) navigate("/signin");
  }

  async function getUserLogged() {
    try {
      const userResponse = await userLogged();
      setUser(userResponse.data);
    } catch (error) {
      console.log(error);
      setApiErrors(error.message);
    }
  }

  useEffect(() => {
    validateToken();
    getUserLogged();
  }, []);
  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 w-[35rem] h-[35rem] relative">
      <Link to="/">
        <BiArrowBack className="text-white absolute top-3 left-3 text-2xl hover:text-sky-600" />
      </Link>

      <img src={logo} alt="" className="w-44" />
      {apiErrors && <ErrorInput text={apiErrors} />}

      <div className="flex flex-col w-full text-white gap-4">
        <div>
          <span>Nome: </span>
          <h1 className="text-2xl leading-none">{user.name}</h1>
        </div>

        <div>
          <span>Email: </span>
          <h1 className="text-2xl leading-none">{user.email}</h1>
        </div>
      </div>
    </div>
  );
}
