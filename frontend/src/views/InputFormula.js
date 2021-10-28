import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MathJax from '@innodoc/react-mathjax-node';
import Equation from '../utils/equationUtils';
import dbUtils from '../utils/dbUtils';
import urlUtils from '../utils/urlUtils';
import userUtils from '../utils/userUtils';
import UserContext from '../context/UserContext';
import '../index.css';

const InputFormula = () => {
  const { id } = useParams();
  const { user } = React.useContext(UserContext);
  let isNew = true;
  if (id) isNew = false;
  const [item, setItem] = React.useState({
    title: '', equation: '', txt: '', topic: '', category: '', rawLatex: false,
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

  const getFormula = async () => {
    const query = `select * from eq_search where id_formula=${parseInt(id, 10)}`;
    const results = await dbUtils.getRows(query);
    const {
      title, equation, description, category, topic, rawLatex,
    } = await results[0];
    setIsChecked(item.rawLatex);
    if (rawLatex) {
      setItem({
        title, txt: description, equation, category, topic, rawLatex,
      });
      setLatex({ latex: equation });
      return;
    }
    const isLatex = true;
    const expr = new Equation(equation, isLatex).latex;
    setItem({
      title, txt: description, equation: expr, category, topic, rawLatex,
    });
    setLatex(new Equation(expr));
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
      title, txt, topic, category, equation,
    } = item;
    title = urlUtils.urlEncoding(title);
    category = urlUtils.urlEncoding(category);
    topic = urlUtils.urlEncoding(topic);
    if (!isChecked) {
      equation = urlUtils.urlEncoding(new Equation(equation).latex);
    } else {
      equation = urlUtils.urlEncoding(equation);
    }
    txt = encodeURIComponent(txt);
    try {
      const responseAdd = await fetch(`/api/add?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}&category=${category}&topic=${topic}&rawLatex=${isChecked}`);
      const responseModerate = await fetch(`/api/moderate?id=${id}&username=${user}`, { method: 'POST' });
      if (responseAdd.ok && responseModerate.ok) { return responseAdd.status; }
      return 401;
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
      console.log(isChecked);
      equation = urlUtils.urlEncoding(latexParser.latex);
      console.log(equation);
    } else {
      equation = urlUtils.urlEncoding(equation);
    }
    txt = encodeURIComponent(txt);
    try {
      const response = await fetch(`/api/edit?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}&category=${category}&topic=${topic}&rawLatex=${isChecked}`);
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

  const getCategories = async () => {
    const query = 'select * from Category';
    try {
      const results = await dbUtils.getRows(query);
      setCategories(results);
    } catch (err) {
      console.error(err);
    }
  };

  const getTopics = async () => {
    const query = `select * from Topic where id_category=
    (select id_category from Category where txt='${item.category}')`;
    try {
      const results = await dbUtils.getRows(query);
      setTopics(results);
    } catch (err) {
      console.error(err);
    }
  };

  // The SetLatex order is inverted to bypass state always being one step behind
  // the Equation object should be displayed when !isChecked
  const changeCheckbox = () => {
    setIsChecked(!isChecked);
    if (isChecked) {
      setLatex(new Equation(item.equation));
      return;
    }
    setLatex({ latex: item.equation });
  };

  useEffect(() => {
    getCategories();
    if (!isNew) getFormula();
  }, []);

  useEffect(() => {
    getTopics();
  }, [item.category]);

  // show error message for 3 seconds
  useEffect(() => {
    if (failed) {
      setTimeout(() => { setFailed(false); }, 3000);
    }
  }, [failed]);

  // force rerender for checkbox state, after get formula ends
  useEffect(() => {
    if (item.rawLatex) {
      setIsChecked(item.rawLatex);
    }
  }, [item.rawLatex]);

  useEffect(() => {
    console.log('latex');
  }, [latexParser]);

  return (
    <>
      {userUtils.isLoggedIn(user) || (
      <div className="blur-2nd-level not-logged">
        <div id="not-logged-msg">
          <div className="box">
            <h3>Para agregar o editar una fórmula debes estar iniciar sesión!</h3>
            <a href="/">Volver al inicio</a>
          </div>
        </div>
      </div>
      )}
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
              <input type="checkbox" id="useLatex" onChange={changeCheckbox} checked={isChecked} />
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
    </>
  );
};

export default InputFormula;
