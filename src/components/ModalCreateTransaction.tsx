import * as Dialog from "@radix-ui/react-dialog";
import { ArrowFatDown, ArrowFatUp, X } from "phosphor-react";
import { FormEvent, useContext, useState } from "react";
import { ValueContext } from "../Context/ValueContext";
import { api } from "../services/api";



interface ModalCreateTransactionProps {
  handleModal:() => void;
}

export function ModalCreateTransaction({handleModal}:ModalCreateTransactionProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("income");

  const {callRefresh} = useContext(ValueContext);

  async function handleNewTransaction(e: FormEvent) {
    e.preventDefault();

    await api.post("transactions", {
      title: title,
      amount: amount,
      category: category,
      type: transactionType,
    });
    setTitle("");
    setCategory("");
    setAmount(0);
    setTransactionType("income");
    handleModal();
    callRefresh();
  }
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed bg-black/50 inset-0" />

      <Dialog.Content
      onEscapeKeyDown={handleModal}
      onInteractOutside={handleModal}
      className="fixed bg-zinc-200 p-5 rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Dialog.Title className="text-xl mb-5 font-bold text-zinc-500">
          Cadastrar transação
        </Dialog.Title>

        <form className="flex flex-col gap-3 w-80">
          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-300 p-2 rounded"
          />

          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-zinc-300 p-2 rounded"
          />

          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setTransactionType("income");
              }}
              className={`${
                transactionType === "income" &&
                "bg-green-600/50 text-green-700 font-bold"
              } bg-zinc-300 p-2 w-full transition-all rounded flex justify-center items-center gap-2`}
            >
              <ArrowFatUp
                weight="fill"
                className={`${
                  transactionType === "income" && "text-green-700"
                }`}
              />
              Entrada
            </button>

            <button
              type="button"
              onClick={() => {
                setTransactionType("outcome");
              }}
              className={`${
                transactionType === "outcome" &&
                "bg-red-600/50 text-red-700 font-bold"
              } bg-zinc-300 transition-all p-2 w-full rounded flex justify-center items-center gap-2`}
            >
              <ArrowFatDown
                weight="fill"
                className={`${transactionType === "outcome" && "text-red-700"}`}
              />
              Saída
            </button>
          </div>

          <input
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-300 p-2 rounded"
          />

          <Dialog.Close onClick={handleNewTransaction}>Cadastrar</Dialog.Close>
        </form>

        <Dialog.Close
        onClick={handleModal}
        className="absolute top-2 right-2">
          <X className="text-zinc-500 hover:text-zinc-700"/>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
