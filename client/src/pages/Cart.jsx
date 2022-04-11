import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";
import rupiahFormat from "rupiah-format";
import { UserContext } from "../context/userContext";
import trash from '../assets/trash.svg';
import bill from '../assets/bill.svg';
import imgEmpty from "../assets/empty.svg";
import Navbar from "../components/Navbar";
import DeleteData from "../components/modal/DeleteData";
import { API } from "../config/api";

export default function Cart() {
  const { t } = useTranslation();
  const title = "Cart";
  document.title = "WaysBucks | " + title;

  let history = useHistory();
  const [state] = useContext(UserContext);
  const [transactions, setTransactions] = useState([
    {
      address: "",
      beverageId: null,
      beverages: {
        id: null,
        image: "",
        name: "",
        price: null
      },
      id: null,
      name: "",
      phone: "",
      postal: "",
      price: null,
      qty: null,
      status: "",
      toppingId: null,
      toppings: {
        id: null,
        name: "",
        price: null
      },
      userOrder: {
        email: "",
        id: null,
        name: "",
        role: ""
      }
    }
  ]);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getTransactions = async () => {
    try {
      const response = await API.get("/transaction/" + state.user.id);
      setTransactions(response.data.transactions);
      setForm({
        ...form,
        userId: transactions.userId,
        beverageId: transactions.beverageId,
        toppingId: transactions.toppingId,
        price: transactions.price
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  let trx = {
    address: "",
    beverageId: null,
    beverages: {
      id: null,
      image: "",
      name: "",
      price: null
    },
    id: null,
    name: "",
    phone: "",
    postal: "",
    price: null,
    qty: null,
    status: "",
    toppingId: null,
    toppings: {
      id: null,
      name: "",
      price: null
    },
    userOrder: {
      email: "",
      id: null,
      name: "",
      role: ""
    }
  };
  const lastIndex = transactions.length - 1;
  trx = transactions[lastIndex];
  const [form, setForm] = useState({
    userId: null,
    name: "",
    phone: "",
    address: "",
    postal: "",
    beverageId: null,
    qty: null,
    status: "",
    toppingId: null,
    price: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const totalPrice = (qty, price) => {
    return qty * price;
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const status = "Waiting";
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data = {
        userId: state.user.id,
        name: state.user.name,
        phone: form.phone,
        address: form.address,
        postal: form.postal,
        beverageId: trx.beverageId,
        qty: form.qty,
        status: status,
        toppingId: trx.toppingId,
        price: totalPrice(form.qty, trx.price),
      }

      const body = JSON.stringify(data);

      await API.patch("/transaction/" + trx.id, body, config);

      history.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push("/");
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = async (id) => {
    try {
      await API.delete(`/transaction/${id}`);
      getTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          {trx.status === "Incomplete" ? (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-1"></div>
                <div className="col-7">
                  <h3 className="text-red fw-9">{t('checkout')}</h3>
                  <p className="text-red fs-18 mt-3">{t('please_review')}</p>
                  <hr className="hr-brown" />
                  <div className="row my-4">
                    <div className="col-3">
                      <img src={trx.beverages.image} alt="image" className="img-fluid" />
                    </div>
                    <div className="col-6 py-3">
                      <p className="text-red fs-24 fw-9">{trx.beverages.name}</p>
                      <p className="text-red fs-14"><strong>Topping:</strong> {trx.toppings.name}</p>
                    </div>
                    <div className="col-3 py-3 text-end">
                      <p className="text-red fw-9"><strong>{t('order_date')}:</strong>{rupiahFormat.convert(trx.price)}</p>
                      <button className="btn btn-sm btn-light" onClick={() => { handleDelete(trx.id); }}>
                        <img src={trash} alt="trash" />
                      </button>
                    </div>
                  </div>
                  <hr className="hr-brown" />
                  <div className="row my-5">
                    <div className="col-6">
                      <hr className="hr-brown" />
                      <div className="row">
                        <div className="col-7">
                          <p className="text-red fs-14">Subtotal</p>
                          <p className="text-red fs-14">Qty</p>
                        </div>
                        <div className="col-5">
                          <p className="text-red fs-14 text-end">{rupiahFormat.convert(trx.price)}</p>
                          <input type="number" name="qty" className="form-control text-end" min={1} max={10} onChange={handleChange} />
                        </div>
                      </div>
                      <hr className="hr-brown" />
                      <div className="row">
                        <div className="col-7">
                          <p className="text-red fw-9 fs-14">Total</p>
                        </div>
                        <div className="col-5">
                          <p className="text-red fw-9 fs-14 text-end">{rupiahFormat.convert(totalPrice(form.qty, trx.price))}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-5 p-3">
                      <div className="bill">
                        <img src={bill} alt="" className="img-fluid mb-2" />
                        <p className="text-red fs-14">{t('attachment')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="row my-5"></div>
                  <div>
                    <input type="hidden" name="userId" onChange={handleChange} value={state.user.id} />
                    <input type="hidden" name="beverageId" onChange={handleChange} value={trx.beverageId} />
                    <input type="hidden" name="toppingId" onChange={handleChange} value={trx.toppingId} />
                    <input type="hidden" name="price" onChange={handleChange} value={totalPrice(form.qty, trx.price)} />
                    <div className="form-group mb-3 form-red form-floating">
                      <input className="form-control" type="text" name="name" onChange={handleChange} value={state.user.name} id="formGroupName" />
                      <label htmlFor="formGroupName">{t('name')}</label>
                    </div>
                    <div className="form-group mb-3 form-red form-floating">
                      <input className="form-control" type="email" name="email" onChange={handleChange} value={state.user.email} id="formGroupEmail" />
                      <label htmlFor="formGroupEmail">{t('email')}</label>
                    </div>
                    <div className="form-group mb-3 form-red form-floating" >
                      <input className="form-control" type="text" name="phone" onChange={handleChange} id="formGroupPhoneNumber" />
                      <label htmlFor="formGroupPhoneNumber">{t('phone')}</label>
                    </div>
                    <div className="form-group mb-3 form-red form-floating" >
                      <textarea className="form-control form-textarea" name="address" onChange={handleChange} id="formGroupTextarea"></textarea>
                      <label htmlFor="formGroupTextarea">{t('address')}</label>
                    </div>
                    <div className="form-group mb-3 form-red form-floating">
                      <input className="form-control" type="text" name="postal" onChange={handleChange} id="formGroupPostalCode" />
                      <label htmlFor="formGroupPostalCode">{t('postal_code')}</label>
                    </div>
                    <div className="form-group mb-3">
                      <button className="form-control btn btn-red" type="submit">{t('place_order')}</button>
                    </div>
                    <div className="mt-1">
                      <Button variant="secondary" className="form-control btn" size="sm" onClick={handleCancel}>
                        {t('cancel')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className="col-1"></div>
              <div className="col-10">
                <h3 className="text-red fw-9">{t('checkout')}</h3>
                <p className="text-red fs-18 mt-3">{t('please_review')}</p>
                <hr className="hr-brown" />
                <div className="text-center pt-5">
                  <img src={imgEmpty} className="img-fluid" style={{ width: "40%" }} alt="empty" />
                  <div className="mt-3">{t('no_trx')}</div>
                </div>
              </div>
              <div className="col-1"></div>
            </>
          )}
        </div>
      </div>
      <DeleteData setConfirmDelete={setConfirmDelete} show={show} handleClose={handleClose} />
    </>
  );
}
