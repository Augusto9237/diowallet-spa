import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import { Link, useNavigate, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../schemas/TransactionSchema";
import Input from "../components/Input";
import ErrorInput from "../components/ErrorInput";
import Button from "../components/Button";
import {
  findAllTransaction,
  updateTransaction,
} from "../services/transactions";

export default function EditTransaction() {
  const { id } = useParams();
  const [transactions, setTrasactions] = useState([]);
  const navigate = useNavigate();
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    values: {
      value: transactions[0]?.value,
      description: transactions[0]?.description,
    },
  });

  async function onSubmitForm(data) {
    try {
      const body = { ...data, type: transactions[0]?.type };
      await updateTransaction(id, body);
      navigate("/");
    } catch (error) {
      setApiErrors(error.message);
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-around bg-zinc-900 rounded p-8 gap-7 relative">
      <header>
        <Link to="/">
          <BiArrowBack className="text-white absolute top-3 left-3 text-2xl" />
        </Link>
        <h1 className="text-white font-bold text-5xl">Edit</h1>
      </header>

      {apiErrors && <ErrorInput text={apiErrors} />}

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col justify-center gap-4 w-full text-2xl"
      >
        <Input
          type="number"
          placeholder="Value"
          register={register}
          name="value"
        />
        {errors.value && <ErrorInput text={errors.value.message} />}
        <Input
          type="text"
          placeholder="Description"
          register={register}
          name="description"
        />
        {errors.description && <ErrorInput text={errors.description.message} />}
        <Button type="submit" text="SAVE" />
      </form>
    </div>
  );
}
