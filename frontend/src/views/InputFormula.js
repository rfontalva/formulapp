import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MathJax from '@innodoc/react-mathjax-node';
import Equation from '../utils/equationUtils';
import dbUtils from '../utils/dbUtils';
import urlUtils from '../utils/urlUtils';
import '../index.css';

const InputFormula = () => {
  const { id } = useParams();
  let isNew = true;
  if (id) isNew = false;
  const [item, setItem] = React.useState({
    title: '', equation: '', txt: '', topic: '', category: '',
  });
  const [errorMessages, setErrorMessages] = React.useState({
    title: false, equation: false, txt: false, topic: false, category: false,
  });
  const [failed, setFailed] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [latexParser, setLatex] = React.useState(new Equation(''));
  let tempName = '';

  const getFormula = () => {
    const query = `select * from eq_search where id_formula=${parseInt(id, 10)}`;
    dbUtils.getRows(query).then((results) => {
      const {
        title, equation, description, category, topic,
      } = results[0];
      const isLatex = true;
      const expr = new Equation(equation, isLatex).latex;
      setItem({
        title, txt: description, equation: expr, category, topic,
      });
      setLatex(new Equation(expr));
    });
  };

  const validate = () => {
    let isValid = true;
    let category; let topic; let title; let
      equation = false;
    if (item.category === '') {
      isValid = false;
      category = true;
    }
    if (item.topic === '') {
      isValid = false;
      topic = true;
    }
    if (item.title === '') {
      isValid = false;
      title = true;
    }
    if (item.equation === '') {
      isValid = false;
      equation = true;
    }
    setErrorMessages({
      category, topic, title, equation,
    });
    return isValid;
  };

  const addFormula = async () => {
    let {
      title, txt, topic, category,
    } = item;
    title = urlUtils.urlEncoding(title);
    category = urlUtils.urlEncoding(category);
    topic = urlUtils.urlEncoding(topic);
    const equation = urlUtils.urlEncoding(latexParser.latex);
    txt = encodeURIComponent(txt);
    try {
      const response = await fetch(`/api/add?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}&category=${category}&topic=${topic}`);
      return response.status;
    } catch (err) {
      setFailed(true);
      return 400;
    }
  };

  const editFormula = async () => {
    let {
      title, txt, topic, category, equation,
    } = item;
    title = urlUtils.urlEncoding(title);
    category = urlUtils.urlEncoding(category);
    topic = urlUtils.urlEncoding(topic);
    if (!isChecked) {
      equation = urlUtils.urlEncoding(latexParser.latex);
    } else {
      equation = urlUtils.urlEncoding(equation);
    }
    txt = encodeURIComponent(txt);
    try {
      const response = await fetch(`/api/edit?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}&category=${category}&topic=${topic}`);
      if (response.status !== 200) {
        setFailed(true);
        return;
      }
      urlUtils.goHome();
    } catch (err) {
      setFailed(true);
    }
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    console.log(value);
    if (name === 'equation') {
      if (!isChecked) {
        setLatex(new Equation(value));
      } else setLatex({ latex: value });
    }
    if (errorMessages[name]) {
      setErrorMessages({
        ...errorMessages, [name]: false,
      });
    }
    setItem({ ...item, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) { return; }
    if (isNew) {
      const status = await addFormula();
      if (status === 400) { return; }
      tempName = item.title;
      const x = document.getElementById('snackbar');
      x.className += ' show';
      setTimeout(() => { x.className = x.className.replace(' show', ''); }, 3000);
      setItem({
        title: '', equation: '', txt: '', category: '', topic: '',
      });
      setLatex(new Equation(''));
    } else {
      editFormula();
    }
  };

  const getCategories = () => {
    const query = 'select * from Category';
    dbUtils.getRows(query)
      .then((results) => setCategories(results))
      .catch((err) => console.error(err));
  };

  const getTopics = () => {
    const query = `select * from Topic where id_category=
    (select id_category from Category where txt='${item.category}')`;
    dbUtils.getRows(query)
      .then((results) => setTopics(results))
      .catch((err) => console.error(err));
  };

  const changeCheckbox = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    getCategories();
    if (!isNew) getFormula();
  }, []);

  useEffect(() => {
    getTopics();
  }, [item.category]);

  useEffect(() => {
    if (failed) {
      setTimeout(() => { setFailed(false); }, 3000);
    }
  }, [failed]);

  return (
    <article className="grid">
      <div className="inputs-box">
        <form onSubmit={submitHandler}>
          <label htmlFor="formulaTitle">
            Título*
            <input type="text" id="formulaTitle" name="title" onChange={changeHandler} value={item.title} />
          </label>
          {errorMessages.title && <p className="error-text">El campo Título no puede quedar vacío</p>}
          <label htmlFor="formulaCategory">
            Categoría*
            <input type="text" id="formulaCategory" name="category" onChange={changeHandler} value={item.category} list="categories" />
            <datalist id="categories">
              <option aria-label="void" value="" />
              {categories.map((val) => (
                <option
                  id={val.id_category}
                  value={val.txt}
                >
                  {val.txt}
                </option>
              ))}
            </datalist>
          </label>
          {errorMessages.category && <p className="error-text">El campo Categoría no puede quedar vacío</p>}
          <label htmlFor="formulaTopic">
            Tópico*
            <input type="text" id="formulaTopic" name="topic" onChange={changeHandler} value={item.topic} list="topics" />
            <datalist id="topics">
              <option aria-label="void" value="" />
              {topics.map((val) => (
                <option
                  id={val.id_topic}
                  value={val.txt}
                >
                  {val.txt}
                </option>
              ))}
            </datalist>
          </label>
          {errorMessages.topic && <p className="error-text">El campo Tópico no puede quedar vacío</p>}
          <label htmlFor="formulaTxt">
            Descripción
            <textarea id="formulaTxt" name="txt" onChange={changeHandler} value={item.txt} />
          </label>
          <label htmlFor="formulaEquation">
            Ecuación*
            <input type="text" id="formulaEquation" name="equation" onChange={changeHandler} value={item.equation} />
          </label>
          <label htmlFor="useLatex" id="checkbox-label">
            Usar Latex
            <input type="checkbox" id="useLatex" onChange={changeCheckbox} />
          </label>
          {errorMessages.equation && <p className="error-text">El campo Ecuación no puede quedar vacío</p>}
        </form>
        <MathJax.Provider>
          <MathJax.MathJaxNode displayType="inline" texCode={latexParser.latex} />
        </MathJax.Provider>
        <button type="submit" onClick={submitHandler}>Enviar</button>
        {failed && (
        <p className="error-text">
          Hubo un error, intente de nuevo
        </p>
        )}
      </div>
      {isNew && (
      <div id="snackbar" className="snackbar">
        {`Se agrego ${tempName}`}
      </div>
      )}
    </article>
  );
};

export default InputFormula;
