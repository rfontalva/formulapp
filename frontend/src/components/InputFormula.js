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
  const [categories, setCategories] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [latexParser, setLatex] = React.useState(new Equation(''));
  let tempName = '';

  const getFormula = () => {
    const query = `select e.id_equation, e.title, e.txt, e.equation,
    c.txt as "category", tp.txt as "topic"
    from formulapp.equation e
      left join formulapp.tag tg using (id_equation)
      left join formulapp.category c on c.id_category=tg.id_category
      left join formulapp.topic tp on tp.id_topic=tg.id_topic
    where id_equation=${parseInt(id, 10)}`;
    dbUtils.getRows(query).then((results) => {
      const {
        title, equation, txt, category, topic,
      } = results[0];
      const isLatex = true;
      const expr = new Equation(equation, isLatex).latex;
      setItem({
        title, txt, equation: expr, category, topic,
      });
      setLatex(new Equation(expr));
    });
  };

  const addFormula = () => {
    let {
      title, txt, topic, category,
    } = item;
    title = urlUtils.urlEncoding(title);
    category = urlUtils.urlEncoding(category);
    topic = urlUtils.urlEncoding(topic);
    const equation = urlUtils.urlEncoding(latexParser.latex);
    txt = encodeURIComponent(txt);
    fetch(`/api/add?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}&category=${category}&topic=${topic}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const editFormula = async () => {
    let {
      title, txt, topic, category,
    } = item;
    title = urlUtils.urlEncoding(title);
    category = urlUtils.urlEncoding(category);
    topic = urlUtils.urlEncoding(topic);
    const equation = urlUtils.urlEncoding(latexParser.latex);
    txt = encodeURIComponent(txt);
    try {
      await fetch(`/api/edit?id=${parseInt(id, 10)}&title=${title}&equation=${equation}&txt=${txt}&category=${category}&topic=${topic}`);
      urlUtils.goHome();
    } catch (err) {
      console.error(err);
    }
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
      tempName = item.title;
      const x = document.getElementById('snackbar');
      x.className = 'show';
      setTimeout(() => { x.className = x.className.replace('show', ''); }, 3000);
      setItem({
        title: '', equation: '', txt: '', category: '', topic: '',
      });
      setLatex(new Equation(''));
    } else {
      editFormula();
    }
  };

  const getCategories = () => {
    const query = 'select * from formulapp.category';
    dbUtils.getRows(query)
      .then((results) => setCategories(results))
      .catch((err) => console.error(err));
  };

  const getTopics = () => {
    const query = `select * from formulapp.topic where id_category=
    (select id_category from formulapp.category where txt='${item.category}')`;
    dbUtils.getRows(query)
      .then((results) => setTopics(results))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getCategories();
    if (!isNew) getFormula();
  }, []);

  useEffect(() => {
    getTopics();
  }, [item.category]);

  return (
    <article className="grid">
      <div className="inputs-box">
        <form onSubmit={submitHandler}>
          <label htmlFor="formulaTitle">
            Título
            <input type="text" id="formulaTitle" name="title" onChange={changeHandler} value={item.title} />
          </label>
          <label htmlFor="formulaCategory">
            Categoría
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
          <label htmlFor="formulaTopic">
            Tópico
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
          <label htmlFor="formulaTxt">
            Descripción
            <textarea id="formulaTxt" name="txt" onChange={changeHandler} value={item.txt} />
          </label>
          <label htmlFor="formulaEquation">
            Ecuación
            <input type="text" id="formulaEquation" name="equation" onChange={changeHandler} value={item.equation} />
          </label>
        </form>
        <MathJax.Provider>
          <MathJax.MathJaxNode displayType="inline" texCode={latexParser.latex} />
        </MathJax.Provider>
        <button type="submit" onClick={submitHandler}>Enviar</button>
      </div>
      {isNew && (
      <div id="snackbar">
        {`Se agrego ${tempName}`}
      </div>
      )}
    </article>
  );
};

export default InputFormula;
