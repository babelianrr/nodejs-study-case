import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import dateFormat from "dateformat";
import rupiahFormat from "rupiah-format";

import NavbarAdmin from "../components/NavbarAdmin";
import CompleteOrder from "../components/modal/CompleteOrder"

import imgWaysBucks from "../assets/waysbucks.png";

import imgBlank from "../assets/blank-profile.png";

import { API } from "../config/api";

export default function Profile() {
  let history = useHistory();

  const title = "Admin Dashboard";
  document.title = "DumbMerch | " + title;

  const [userCount, setUserCount] = useState(0);
  const [trxCount, setTrxCount] = useState(0);
  const [trxSum, setTrxSum] = useState(0);

  const getUserCount = async () => {
    try {
      const response = await API.get("/count-users");
      setUserCount(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const getTrxCount = async () => {
    try {
      const response = await API.get("/count-trxs");
      setTrxCount(response.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  const getTrxSum = async () => {
    try {
      const response = await API.get("/sum-trxs");
      setTrxSum(response.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserCount();
    getTrxCount();
    getTrxSum();
  }, []);

  return (
    <>
      <NavbarAdmin />
      <Container className="my-5">
        <div className="h1 mb-4 text-red fw-9">Dashboard</div>
        <Row className="mb-4">
          <Col md="6">
            <div className="text-brown fs-21 fw-9">Users Count: {userCount}</div>
            <div className="card bg-secondary" style={{ width: "400px", height: "200px" }}></div>
          </Col>
          <Col md="6">
            <div className="text-brown fs-21 fw-9">Transactions Count: {trxCount}</div>
            <div className="card bg-secondary" style={{ width: "400px", height: "200px" }}></div>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <div className="text-brown fs-21 fw-9">
              Total Income: {trxSum === null ? rupiahFormat.convert(0) : rupiahFormat.convert(trxSum)}
            </div>
            <div className="card bg-secondary" style={{ width: "400px", height: "200px" }}></div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
