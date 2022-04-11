import React from "react";
import rupiahFormat from "rupiah-format";
import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <Link to={`/product/` + item.id} style={{ textDecoration: "none", maxWidth: "24%" }}>
      <div className="card mt-3">
        <img src={item.image} className="img-fluid img-rounded" alt={item.name} />
        <div className="card-body p-2">
          <p className="card-title text-red fw-9">{item.name}</p>
          <p className="card-text text-brown">{rupiahFormat.convert(item.price)}</p>
        </div>
      </div>
    </Link>
  );
}
