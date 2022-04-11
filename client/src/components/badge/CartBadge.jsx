import { useState, useEffect } from "react";
import { API } from "../../config/api";

export default function CartBadge() {
  const [trx, setTrx] = useState([]);

  const getTransactions = async () => {
    try {
      const response = await API.get("/transactionx");
      setTrx(response.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <>
      {trx.length !== 0 ? (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-red">
          !
          <span class="visually-hidden">selected</span>
        </span>
      ) : (
        <span></span>
      )}
    </>
  )
}