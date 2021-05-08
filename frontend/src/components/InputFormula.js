import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MathJax from '@innodoc/react-mathjax-node';
import urlUtils from '../utils/urlUtils';
import Equation from '../utils/equationUtils';
import dbUtils from '../utils/dbUtils';
import '../index.css';

const InputFormula = () => {
  const { id } = useParams();
  let isNew = true;
  if (id) isNew = false;
  const [item, setItem] = React.useState({ title: '', equation: '', txt: '' });
  const [latexParser, setLatex] = React.useState(new Equation(''));

  const getFormula = () => {
    const query = `select * from formulapp.equation where id_equation=${parseInt(id, 10)}`;
    dbUtils.getRows(query).then((results) => {
      const { title, equation, txt } = results[0];
      const isLatex = true;
      const expr = new Equation(equation, isLatex).latex;
      setItem({ title, txt, equation: expr });
      setLatex(new Equation(expr));
    });
  };

  const addFormula = () => {
    let { title, txt } = item;
    const breakLine = true;
    title = urlUtils.urlEncoding(title);
    const equation = urlUtils.urlEncoding(latexParser.latex);
    txt = urlUtils.urlEncoding(txt, breakLine);
    fetch(`${window.backend}add?title=${title}&equation=${equation}&txt=${txt}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const editFormula = () => {
    let { title, txt } = item;
    const breakLine = true;
    title = urlUtils.urlEncoding(title);
    const equation = encodeURIComponent(latexParser.latex);
    txt = urlUtils.urlEncoding(txt, breakLine);
    fetch(`${window.backend}edit?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
    urlUtils.goHome();
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    if (name === 'equation') {
      setLatex(new Equation(value));
    }
    setItem({ ...item, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isNew) {
      addFormula();
      const x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(() => { x.className = x.className.replace('show', ''); }, 3000);
      // setItem({ title: '', equation: '', txt: '' });
      setLatex(new Equation(''));
    } else {
      editFormula();
    }
  };

  useEffect(() => {
    if (!isNew) getFormula();
  }, []);

  return (
    <article className="grid">
      <div className="input-formula">
        <form onSubmit={submitHandler}>
          <label htmlFor="formulaTitle">
            Title
            <input type="text" id="formulaTitle" name="title" onChange={changeHandler} value={item.title} />
          </label>
          <label htmlFor="formulaTxt">
            Description
            <textarea id="formulaTxt" name="txt" onChange={changeHandler} value={item.txt} />
          </label>
          <label htmlFor="formulaEquation">
            Equation
            <input type="text" id="formulaEquation" name="equation" onChange={changeHandler} value={item.equation} />
          </label>
        </form>
        <MathJax.Provider>
          <MathJax.MathJaxNode displayType="inline" texCode={latexParser.latex} />
        </MathJax.Provider>
        <button type="submit" onClick={submitHandler}>Enviar</button>
      </div>
      <div id="snackbar">
        {`Se agrego ${item.title}`}
      </div>
    </article>
  );
};

export default InputFormula;
