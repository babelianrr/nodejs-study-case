import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import { UserContext } from "../context/userContext";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import ToppingCard from "../components/card/ToppingCard";

import { API } from "../config/api";

export default function DetailProduct() {
  const { t } = useTranslation();
  let history = useHistory();
  let { id } = useParams();

  const title = "Product Detail";
  document.title = "WaysBucks | " + title;

  const [state] = useContext(UserContext);
  const [product, setProduct] = useState({});
  const [toppings, setToppings] = useState([
    {
      id: null,
      name: "",
      price: null,
      image: ""
    }
  ]);
  const [toppingId, setToppingId] = useState();

  const getProduct = async (id) => {
    try {
      const response = await API.get("/beverage/" + id);
      setProduct(response.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct(id);
  }, []);


  const getToppings = async (id) => {
    try {
      const response = await API.get("/toppings");
      setToppings(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToppings();
  }, []);

  const handleChangeToppingId = (e) => {
    const target = e.target
    if (target.checked) {
      setToppingId(target.value)
    }
  }

  let price = product.price;
  if (toppingId == undefined) {
    let toppingPrice = 0
    price += toppingPrice
  } else {
    let toppingPrice = toppings[toppingId - 1].price;
    price += toppingPrice
  }

  const [form, setForm] = useState({
    userId: "",
    beverageId: "",
    toppingId: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data = {
        userId: state.user.id,
        beverageId: product.id,
        toppingId: toppingId,
        price: price,
      }

      const body = JSON.stringify(data)
      console.log(body);

      const response = await API.post("/transaction", body, config);
      console.log(response);

      history.push("/cart");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push("/");
  };

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        <Row>
          <Col md="1"></Col>
          <Col md="4">
            <img src={product.image} className="img-fluid w-100" alt={product.name} />
          </Col>
          <Col md="6">
            <h2 className="text-red fw-9">{product.name}</h2>
            <p className="text-brown fs-18">{rupiahFormat.convert(product.price)}</p>
            <hr className="hr-brown" />
            <form onSubmit={handleSubmit}>
              <h4 className="text-brown fs-9">{t('select_topping')}</h4>
              <input type="hidden" name="userId" value={state.user.id} onChange={handleChange} />
              <input type="hidden" name="beverageId" value={product.id} onChange={handleChange} />
              <input type="hidden" name="price" value={price} onChange={handleChange} />
              <input type="hidden" name="toppingId" value={toppingId} onChange={handleChange} />
              <div className="d-flex flex-row flex-wrap mt-4">
                {toppings.length !== 0 ? (
                  toppings?.map((item, index) => (
                    <>
                      <ToppingCard item={item} key={index} /><input type="radio" name="toppingId" className="form-check-input" value={item.id} checked={toppingId == item.id} onChange={handleChangeToppingId} />
                    </>
                  ))
                ) : (
                  <Col>
                    <div className="text-center pt-5">
                      <div className="mt-3">{t('no_data')}</div>
                    </div>
                  </Col>
                )}
              </div>
              <div className="row">
                <div className="col text-brown fs-18 fw-9">Subtotal</div>
                <div className="col text-brown fs-18 fw-9 text-end">{rupiahFormat.convert(price)}</div>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-red">
                  {t('buy')}
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  {t('cancel')}
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}