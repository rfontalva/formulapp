import React from 'react';
import dbUtils from '../utils/dbUtils';
import Formula from './Formula';
import '../index.css';

const Lookup = () => {
  const [search, setSearch] = React.useState({
    title: '', description: '', equation: '', topic: '', category: '',
  });
  const [formulas, setFormulas] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [topics, setTopics] = React.useState([]);
  const getFormulas = () => {
    const query = `select * from formulapp.eq_search where title like '%${search.title}%'
    and description like '%${search.description}%' and equation like '%${search.equation}%' and
    category like '%${search.category}%' and topic like '%${search.topic}%'`;
    dbUtils.getRows(query)
      .then((results) => setFormulas(results))
      .catch((err) => console.error(err));
  };

  const getCategories = () => {
    const query = 'select * from formulapp.category';
    dbUtils.getRows(query)
      .then((results) => setCategories(results))
      .catch((err) => console.error(err));
  };

  const getTopics = () => {
    const query = `select * from formulapp.topic where id_category=
        (select id_category from formulapp.category where txt='${search.category}')`;
    dbUtils.getRows(query)
      .then((results) => setTopics(results))
      .catch((err) => console.error(err));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    getFormulas();
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  React.useEffect(() => {
    getTopics();
  }, [search.category]);

  return (
    <>
      <article className="grid-side">
        <div className="inputs-box">
          <form onSubmit={submitHandler}>
            <label htmlFor="searchTitle">
              Title
              <input type="text" id="searchTitle" name="title" onChange={changeHandler} value={search.title} />
            </label>
            <label htmlFor="searchCategory">
              Categoría
              <select id="searchCategory" name="category" onChange={changeHandler}>
                <option aria-label="void" value="" />
                {categories.map((val) => (
                  <option
                    id={val.id_category}
                    value={val.txt}
                  >
                    {val.txt}
                  </option>
                ))}
              </select>
            </label>
            {search.category && (
            <label htmlFor="searchTopic">
              Tópico
              <select id="searchTopic" name="topic" onChange={changeHandler}>
                <option aria-label="void" value="" />
                {topics.map((val) => (
                  <option
                    id={val.id_topic}
                    value={val.txt}
                  >
                    {val.txt}
                  </option>
                ))}
              </select>
            </label>
            )}
            <label htmlFor="searchDescription">
              Description
              <textarea id="searchDescription" name="description" onChange={changeHandler} value={search.description} />
            </label>
            <label htmlFor="searchECategoryquation">
              Equation
              <input type="text" id="searchEquation" name="equation" onChange={changeHandler} value={search.equation} />
            </label>
          </form>
          <button type="submit" onClick={submitHandler}>Enviar</button>
        </div>
      </article>
      <div className="formulas-container" style={{ marginTop: '1.6rem' }}>
        {formulas.map((
          {
            id_equation, title, equation, description,
          },
        ) => (
          <Formula
            key={id_equation}
            id={id_equation}
            title={title}
            equation={equation}
            txt={description}
            buttons
          />
        ))}
      </div>
    </>
  );
};

export default Lookup;
