import React from "react";
import rupiahFormat from "rupiah-format";

export default function ToppingCard({ item }) {
  return (
    <div className="text-center mb-2" style={{ width: "22%" }}>
      <img className="img-fluid" src={item.image} alt={item.name} />
      <div className="p-2">
        <div className="text-red fs-12 fw-9">{item.name}</div>
        <div className="text-brown fs-11">{rupiahFormat.convert(item.price)}</div>
      </div>
    </div>
  );
}
