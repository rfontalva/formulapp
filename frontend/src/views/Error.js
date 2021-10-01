import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Error = () => (
  <div id="error-page">
    <h1 id="error-title">Ups... acá no hay nada que ver...</h1>
    <Link id="error-link" to="/" className="btn">
      Back Home
    </Link>
  </div>
);

export default Error;
