import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MathJax from '@innodoc/react-mathjax-node';
import utils from '../utils/urlUtils';
import Equation from '../utils/equationUtils';
import '../index.css';

const InputFormula = () => {
  const { id } = useParams();
  let isNew = true;
  if (id) isNew = false;
  const [item, setItem] = React.useState({});
  const [latexParser, setLatex] = React.useState(new Equation(''));
  const getFormula = async () => {
    const defaultItem = { title: '', equation: '', txt: '' };
    if (id) {
      const query = `select * from formulapp.equation where id_equation=${parseInt(id, 10)}`;
      const response = await fetch(`http://localhost:4000/query?query=${query}`);
      const results = await response.json();
      if (results.results) { setItem(results.results[0]); }
    } else {
      setItem(defaultItem);
    }
  };

  const addFormula = () => {
    let { title, txt } = item;
    const breakLine = true;
    title = utils.urlEncoding(title);
    const equation = utils.urlEncoding(latexParser.latex);
    txt = utils.urlEncoding(txt, breakLine);
    fetch(`http://localhost:4000/add?title=${title}&equation=${equation}&txt=${txt}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const editFormula = () => {
    let { title, equation, txt } = item;
    const breakLine = true;
    title = utils.urlEncoding(title);
    equation = utils.urlEncoding(equation);
    txt = utils.urlEncoding(txt, breakLine);
    fetch(`http://localhost:4000/edit?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
    utils.goToUrl('');
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    if (name === 'equation') {
      setLatex(new Equation(value));
      console.log(latexParser.terms);
    }
    setItem({ ...item, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isNew) {
      addFormula();
      setItem({});
    } else {
      editFormula();
    }
  };

  useEffect(() => {
    if (!isNew) getFormula(id, setItem);
  }, []);

  return (
    <article className="grid">
      <div className="input-formula">
        <form onSubmit={submitHandler}>
          <label htmlFor="formulaTitle">
            Title
            <input type="text" id="formulaTitle" name="title" onChange={changeHandler} value={item.title} />
          </label>
          <label htmlFor="formulaEquation">
            Equation
            <input type="text" id="formulaEquation" name="equation" onChange={changeHandler} value={item.equation} />
          </label>
          <label htmlFor="formulaTxt">
            Description
            <textarea id="formulaTxt" name="txt" onChange={changeHandler} value={item.txt} />
          </label>
        </form>
        <MathJax.Provider>
          <MathJax.MathJaxNode displayType="inline" texCode={latexParser.latex} />
        </MathJax.Provider>
        <button type="submit" onClick={submitHandler}>Enviar</button>
      </div>
    </article>
  );
};

export default InputFormula;
