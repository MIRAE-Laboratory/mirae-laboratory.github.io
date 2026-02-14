import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center p-5">
    <Spinner animation="border" variant="primary" role="status" aria-label="Loading" />
  </div>
);

export default Loading;
