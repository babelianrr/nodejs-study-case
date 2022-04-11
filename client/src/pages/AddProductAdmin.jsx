import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import NavbarAdmin from "../components/NavbarAdmin";

import { API } from "../config/api";

export default function AddProductAdmin() {
  console.clear();
  const { t } = useTranslation();
  const title = "Add Product";
  document.title = "WaysBucks | " + title;

  let history = useHistory();

  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    image: "",
    name: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("name", form.name);
      formData.set("price", form.price);

      const response = await API.post("/beverage", formData, config);
      console.log(response);

      history.push("/product-admin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push("/product-admin");
  };

  return (
    <>
      <NavbarAdmin />
      <Container className="py-5">
        <Row>
          <Col xs="1"></Col>
          <Col xs="6">
            <form onSubmit={handleSubmit}>
              <h3 className="text-red fw-9">{t('add_product')}</h3>
              <div className="form-group my-4 form-red" controlid="formGroupName">
                <input className="form-control" type="text" placeholder={t('prod_name')} name="name" onChange={handleChange} />
              </div>
              <div className="form-group input-group my-4 form-red" controlid="formGroupPrice">
                <span class="input-group-text">Rp</span>
                <input
                  type="number" placeholder={t('price')} name="price" onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group my-4 form-red" controlid="formGroupFile">
                <input type="file" id="upload" name="image" onChange={handleChange} className="form-control" />
              </div>
              <div className="d-grid gap-2 mt-4">
                <Button type="submit" className="form-control btn btn-red" size="md">
                  {t('save')}
                </Button>
              </div>
            </form>
            <div className="mt-4">
              <Button variant="secondary" className="form-control btn" size="sm" onClick={handleCancel}>
                {t('cancel')}
              </Button>
            </div>
          </Col>
          <Col xs="4">
            {preview && (
              <div>
                <img src={preview} alt="preview" className="img-fluid card w-100" />
              </div>
            )}
          </Col>
          <Col xs="1"></Col>
        </Row>
      </Container>
    </>
  );
}
