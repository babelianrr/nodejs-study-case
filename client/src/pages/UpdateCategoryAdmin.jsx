import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { useAlert } from "react-alert";
import NavbarAdmin from "../components/NavbarAdmin";
import { API } from "../config/api";

export default function UpdateCategoryAdmin() {
  const alert = useAlert();
  const { t } = useTranslation();
  const title = "Update Topping";
  document.title = "WaysBucks | " + title;

  let history = useHistory();
  const { id } = useParams();
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState({});
  const [form, setForm] = useState({
    image: "",
    name: "",
    price: "",
  });

  const getCategory = async (id) => {
    try {
      const response = await API.get("/topping/" + id);
      setPreview(response.data.product.image);
      setForm({
        ...form,
        name: response.data.product.name,
        price: response.data.product.price,
        image: response.data.product.image
      });
      setCategory(response.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
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
      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }
      formData.set("name", form.name);
      formData.set("price", form.price);

      const response = await API.patch("/topping/" + category.id, formData, config);
      console.log(response.data);

      history.push("/topping-admin");
    } catch (error) {
      alert.error("An error occurred!")
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push("/topping-admin");
  };

  useEffect(() => {
    getCategory(id);
  }, []);

  return (
    <>
      <NavbarAdmin />
      <Container className="py-5">
        <Row>
          <Col xs="1"></Col>
          <Col xs="6">
            <form onSubmit={handleSubmit}>
              <h3 className="text-red fw-9">{t('update_product')}</h3>
              <div className="form-group my-4 form-red" controlid="formGroupName">
                <input className="form-control" type="text" placeholder={t('prod_name')} name="name" onChange={handleChange} value={form.name} />
              </div>
              <div className="form-group input-group my-4 form-red" controlid="formGroupPrice">
                <span class="input-group-text">Rp</span>
                <input
                  type="number" placeholder={t('price')} name="price" onChange={handleChange} className="form-control" value={form.price} />
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
