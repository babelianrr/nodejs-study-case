import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import ShowMoreText from "react-show-more-text";
import dateFormat from "dateformat";
import rupiahFormat from "rupiah-format";
import NavbarAdmin from "../components/NavbarAdmin";
import ApproveOrder from "../components/modal/ApproveOrder";
import DeclineOrder from "../components/modal/DeclineOrder";
import imgEmpty from "../assets/empty.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { API } from "../config/api";

const checkIcon = <FontAwesomeIcon icon={faCheckCircle} />
const uncheckIcon = <FontAwesomeIcon icon={faTimesCircle} />

export default function TransactionAdmin() {
  const { t } = useTranslation();
  const title = "Transactions";
  document.title = "WaysBucks | " + title;

  const [trx, setTrx] = useState([]);
  const [page, setPage] = useState(0);

  const [idApprove, setIdApprove] = useState(null);
  const [approveOrder, setApproveOrder] = useState(null);
  const [showApprove, setShowApprove] = useState(false);
  const handleShowApprove = () => setShowApprove(true);
  const handleCloseApprove = () => setShowApprove(false);

  const [idDecline, setIdDecline] = useState(null);
  const [declineOrder, setDeclineOrder] = useState(null);
  const [showDecline, setShowDecline] = useState(false);
  const handleShowDecline = () => setShowDecline(true);
  const handleCloseDecline = () => setShowDecline(false);

  const getTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTrx(response.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const dataPerPage = 6;
  const numberOfRecordsVisited = page * dataPerPage;
  const totalPages = Math.ceil(trx.length / dataPerPage);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleApprove = (id) => {
    setIdApprove(id);
    handleShowApprove();
  };

  const approveById = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = {
        status: "Delivering"
      }
      const body = JSON.stringify(data);
      await API.patch(`/transaction/${id}`, body, config);
      getTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (approveOrder) {
      handleCloseApprove();
      approveById(idApprove);
      setApproveOrder(null);
    }
  }, [approveOrder]);

  const handleDecline = (id) => {
    setIdDecline(id);
    handleShowDecline();
  };

  const declineById = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const data = {
        status: "Declined"
      }
      const body = JSON.stringify(data);
      await API.patch(`/transaction/${id}`, body, config);
      getTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (declineOrder) {
      handleCloseDecline();
      declineById(idDecline);
      setDeclineOrder(null);
    }
  }, [declineOrder]);

  const ActionComp = (props) => {

    return (
      <div>
        {
          (() => {
            if (props.status == "Waiting") {
              return (
                <>
                  <button onClick={() => { handleApprove(props.id) }} className="btn btn-sm btn-success me-1">
                    {t('approve')}
                  </button>
                  <button onClick={() => { handleDecline(props.id) }} className="btn btn-sm btn-danger ms-1">
                    {t('decline')}
                  </button>
                </>
              )
            } else if (props.status == "Delivering") {
              return (
                <>
                  <span className="text-red fw-9">-</span>
                </>
              )
            } else if (props.status == "Completed") {
              return (
                <>
                  <span className="text-success">{checkIcon}</span>
                </>
              )
            } else {
              return (
                <>
                  <span className="text-danger">{uncheckIcon}</span>
                </>
              )
            }
          })()
        }
      </div>
    )
  };

  const StatusComp = (props) => {
    return (
      <div>
        {
          (() => {
            if (props.status == "Waiting") {
              return (
                <>
                  <span className="text-warning fw-9">{t('waiting')}</span>
                </>
              )
            } else if (props.status == "Delivering") {
              return (
                <>
                  <span className="text-info fw-9">{t('delivering')}</span>
                </>
              )
            } else if (props.status == "Completed") {
              return (
                <>
                  <span className="text-success fw-9">{t('completed')}</span>
                </>
              )
            } else if (props.status == "Declined") {
              return (
                <>
                  <span className="text-danger fw-9">{t('declined')}</span>
                </>
              )
            } else {
              return (
                <>
                  <span className="text-danger fw-9">{t('canceled')}</span>
                </>
              )
            }
          })()
        }
      </div>
    )
  };

  return (
    <>
      <NavbarAdmin />
      <Container className="py-5">
        <Row>
          <Col xs="6">
            <div className="h2 mb-4 fw-9 text-red">{t('cust_trx')}</div>
          </Col>
          <Col xs="12">
            {trx.length !== 0 ? (
              <>
                <Table bordered hover size="lg">
                  <thead>
                    <tr>
                      <th width="1%" className="align-middle text-center">
                        No.
                      </th>
                      <th scope="col" className="align-middle text-center">{t('cust_name')}</th>
                      <th scope="col" className="align-middle text-center">{t('delivery_address')}</th>
                      <th scope="col" className="align-middle text-center">{t('order_date')}</th>
                      <th scope="col" className="align-middle text-center">{t('order_amount')}</th>
                      <th scope="col" className="align-middle text-center">Status</th>
                      <th scope="col" className="align-middle text-center">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trx
                      .slice(
                        numberOfRecordsVisited,
                        numberOfRecordsVisited + dataPerPage
                      )
                      .map((item, index) => (
                        <tr key={index}>
                          <td className="align-middle text-center">{(index + 1) + (dataPerPage * (page))}.</td>
                          <td className="align-middle text-center">{item.name}</td>
                          <td className="align-middle text-center">
                            <ShowMoreText lines={2} more="show" less="hide" className="content-css" anchorClass="my-anchor-css-class" expanded={false} width={280}>
                              {item.address} {item.postal}
                            </ShowMoreText>
                          </td>
                          <td className="align-middle text-center">{dateFormat(item.createdAt, "dd/mm/yyyy HH:MM")}</td>
                          <td className="align-middle text-center">{rupiahFormat.convert(item.price)}</td>
                          <td className="align-middle text-center">
                            <StatusComp status={item.status} />
                          </td>
                          <td className="align-middle text-center">
                            <ActionComp status={item.status} id={item.id} />
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
                <div className="mt-3">{t('no_trx')}</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <ApproveOrder setApproveOrder={setApproveOrder} showApprove={showApprove} handleCloseApprove={handleCloseApprove} />
      <DeclineOrder setDeclineOrder={setDeclineOrder} showDecline={showDecline} handleCloseDecline={handleCloseDecline} />
    </>
  );
}
