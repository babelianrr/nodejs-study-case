import React, { useState } from "react";
import { useAlert } from "react-alert";
import { API } from "../../config/api";

export default function Register() {
  const alert = useAlert();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const body = JSON.stringify(form);
      const response = await API.post("/register", body, config);
      if (response.data.status === 200) {
        return alert.info("Account already exist!");
      } else if (response.data.status === 201) {
        alert.success("Account registered. Please verify");
        setForm({
          name: "",
          email: "",
          password: "",
        });
      } else {
        alert.error("Account already exist");
      }
    } catch (error) {
      alert.error("An error occurred!");
      console.log(error);
    }
  };

  return (
    <div>
      <div className="container">
        <h1 className="mb-4 fw-9">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4" controlid="name">
            <input
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3" controlid="email">
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3" controlid="password">
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <button className="form-control btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
