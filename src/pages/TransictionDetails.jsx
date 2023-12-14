/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { findAllTransaction } from "../services/transactions";
import dayjs from "dayjs";
import ErrorInput from "../components/ErrorInput";

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

  return (
    <main className="relative flex flex-col items-center justify-center bg-zinc-900 rounded p-8 w-[60rem] h-[14rem] text-2xl gap-4">
      {apiErrors && <ErrorInput text={apiErrors} />}

      <header>
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
              {transactions.map((transaction, index) => (
                <div key={index} className="grid grid-cols-4 w-full">
                  <span>{dayjs(transaction.created_at).format("DD/MM")}</span>

                  <span>{transaction.description}</span>

                  <span className="capitalize text-center">
                    {transaction.type}
                  </span>

                  <span
                    className={`text-end ${
                      transaction.type === "input"
                        ? "text-green-700"
                        : "text-red-700"
                    }
                  `}
                  >
                    {transaction.type === "output" && "-"}
                    {formatCurrency(transaction.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>There are no check-in or check-out details</p>
        )}
      </section>
    </main>
  );
}
