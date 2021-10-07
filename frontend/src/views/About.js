import React from 'react';
import '../index.css';

const About = () => (
  <div className="inputs-box side-box">
    <h1>Sobre Formulapp</h1>
    <p className="about-text">
      Formulapp es un catálogo de ecuaciones y fórmulas útiles sobre distintas áreas de la ciencia.
      Los usuarios pueden utilizar el catálogo para consultar una fórmula en concreto,
      pero el objetivo de la aplicación es permitir la creación de hojas de fórmulas en formato PDF.
      <br />
      Creando una cuenta, los usuarios pueden guardar y compartirse hojas de fórmulas ya creadas y
      aportar a la comunidad con nuevas fórmulas, ya sea agregandolas o moderando si las fórmulas
      agregadas o eliminadas por otros usuarios son correctas.
      <br />
    </p>
  </div>
);

export default About;
