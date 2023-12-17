/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  deleteTransiction,
  findAllTransaction,
} from "../services/transactions";
import dayjs from "dayjs";
import ErrorInput from "../components/ErrorInput";
import { PiNotePencilBold } from "react-icons/pi";
import { RiDeleteBin2Line } from "react-icons/ri";

import { formatCurrency } from "../utils/formatCurrency";

export default function TransictionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactions, setTrasactions] = useState([]);
  const [apiErrors, setApiErrors] = useState("");

  function validateToken() {
    const token = Cookies.get("token");
    if (!token) navigate("/signin");
  }

  async function getAllTrasactions() {
    try {
      const response = await findAllTransaction();
      const transaction = response.data.filter(
        (transaction) => transaction._id === id
      );

      setTrasactions(transaction);
    } catch (error) {
      console.log(error);
      setApiErrors(error.message);
    }
  }

  useEffect(() => {
    validateToken();
    getAllTrasactions();
  }, []);

  async function onDeleteTransiction() {
    try {
      await deleteTransiction(id);
      navigate("/");
    } catch (error) {
      setApiErrors(error.message);
      console.log(error);
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center bg-zinc-900 rounded p-8 w-[60rem] h-[16.5rem] text-2xl">
      {apiErrors && <ErrorInput text={apiErrors} />}

      <header className="pb-4">
        <Link to="/">
          <BiArrowBack className="text-white absolute top-8 left-8 text-2xl" />
        </Link>
        <h1 className="text-white font-bold text-2xl">Details</h1>
      </header>

      <section className="bg-zinc-300 p-4 w-full h-full rounded flex items-center justify-center ">
        {transactions.length ? (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="overflow-auto p-3">
              <div className="grid grid-cols-4 text-base text-zinc-500">
                <span>Date</span>
                <span>Description</span>
                <span className="text-center">Type</span>
                <span className="text-center">Value</span>
              </div>
              
                <div className="grid grid-cols-4 w-full">
                  <span>{dayjs(transactions[0]?.created_at).format("DD/MM")}</span>

                  <span>{transactions[0]?.description}</span>

                  <span className="capitalize text-center">
                    {transactions[0]?.type}
                  </span>

                  <span
                    className={`text-end ${
                      transactions[0]?.type === "input"
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  `}
                  >
                    {transactions[0]?.type === "output" && "-"}
                    {formatCurrency(transactions[0]?.value)}
                  </span>
                </div>
            
            </div>
          </div>
        ) : (
          <p>There are no check-in or check-out details</p>
        )}
      </section>
      <footer className="w-full pt-2 flex gap-2 text-white text-lg font-bold">
        <button
          type="button"
          onClick={() => navigate(`/transaction/edit/${id}`)}
          className="px-4 py-2 rounded w-full font-bold text-white text-2xl bg-zinc-500 hover:bg-slate-600 flex items-center justify-center gap-2"
        >
          <PiNotePencilBold />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDeleteTransiction()}
          className="px-4 py-2 rounded w-full font-bold text-white text-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2"
        >
          <RiDeleteBin2Line />
          Delete
        </button>
      </footer>
    </main>
  );
}
