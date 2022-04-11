import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router";
import rupiahFormat from "rupiah-format";

import NavbarAdmin from "../components/NavbarAdmin";
import DeleteData from "../components/modal/DeleteData";

import imgEmpty from "../assets/empty.svg";

import { API } from "../config/api";

export default function CategoryAdmin() {
  const { t } = useTranslation();
  let history = useHistory();

  const title = "Toppings";
  document.title = "DumbMerch | " + title;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCategories = async () => {
    try {
      const response = await API.get("/toppings");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const dataPerPage = 2;
  const numberOfRecordsVisited = page * dataPerPage;
  const totalPages = Math.ceil(products.length / dataPerPage);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const addCategory = () => {
    history.push("/add-topping");
  };

  const handleUpdate = (id) => {
    history.push(`update-topping/${id}`);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = async (id) => {
    try {
      await API.delete(`/topping/${id}`);
      getCategories();
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
      <NavbarAdmin />
      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="h1 mb-4 fw-9 text-red">Topping List</div>
          </Col>
          <Col xs="6" className="text-end">
            <Button onClick={addCategory} className="btn-success" style={{ width: "200px" }}>
              {t('add_topping')}
            </Button>
          </Col>
          <Col xs="12">
            {products.length !== 0 ? (
              <>
                <Table bordered hover size="lg">
                  <thead>
                    <tr>
                      <th width="2%" className="align-middle text-center">
                        No.
                      </th>
                      <th className="align-middle text-center">{t('image')}</th>
                      <th className="align-middle text-center">{t('top_name')}</th>
                      <th className="align-middle text-center">{t('price')}</th>
                      <th className="align-middle text-center">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .slice(
                        numberOfRecordsVisited,
                        numberOfRecordsVisited + dataPerPage
                      )
                      .map((item, index) => (
                        <tr key={index}>
                          <td className="align-middle text-center">{(index + 1) + (dataPerPage * (page))}.</td>
                          <td className="align-middle text-center">
                            <img
                              src={item.image}
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "10px"
                              }}
                              alt="preview"
                            />
                          </td>
                          <td className="align-middle text-center">{item.name}</td>
                          <td className="align-middle text-center">{rupiahFormat.convert(item.price)}</td>
                          <td className="align-middle text-center">
                            <Button
                              onClick={() => {
                                handleUpdate(item.id);
                              }}
                              className="btn-sm btn-success me-2"
                              style={{ width: "135px" }}
                            >
                              {t('update')}
                            </Button>
                            <Button
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                              className="btn-sm btn-danger"
                              style={{ width: "135px" }}
                            >
                              {t('delete')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <ReactPaginate previousLabel={"«"} nextLabel={"»"} pageCount={totalPages} onPageChange={changePage} containerClassName={"pagination"} pageClassName={"page-item"} pageLinkClassName={"page-link"} previousLinkClassName={"page-link"} nextLinkClassName={"page-link"} disabledClassName={"disabled"} activeClassName={"active"} />
              </>
            ) : (
              <div className="text-center pt-5">
                <img src={imgEmpty} className="img-fluid" style={{ width: "40%" }} alt="empty" />
                <div className="mt-3">{t('no_data')}</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <DeleteData setConfirmDelete={setConfirmDelete} show={show} handleClose={handleClose} />
    </>
  );
}
