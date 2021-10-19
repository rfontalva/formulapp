import React from 'react';
import dbUtils from '../utils/dbUtils';
import {
  Formula,
} from '../components/index';
import '../index.css';
import Equation from '../utils/equationUtils';

const Lookup = () => {
  const [search, setSearch] = React.useState({
    title: '', description: '', equation: '', topic: '', category: '',
  });
  const CheatsheetContext = React.createContext();
  const [formulas, setFormulas] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [selectedCheatsheet, setSelectedCheatsheet] = React.useState('');

  const getFormulas = async () => {
    const equation = new Equation(search.equation).latex;
    const query = `select * from eq_search where title like '%${search.title}%'
    and description like '%${search.description}%' and equation like '%${equation}%' and
    category like '%${search.category}%' and topic like '%${search.topic}%'`;
    try {
      const results = await dbUtils.getRows(query);
      setFormulas(results);
    } catch (err) {
      console.error(err);
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
        (select id_category from Category where txt='${search.category}')`;
    try {
      const results = await dbUtils.getRows(query);
      setTopics(results);
    } catch (err) {
      console.error(err);
    }
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
    <CheatsheetContext.Provider values={{ selectedCheatsheet, setSelectedCheatsheet }}>
      <article className="grid-side">
        <div className="inputs-box side-box">
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
            <label htmlFor="searchEquation">
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
            id_formula, title, equation, description,
          },
        ) => (
          <Formula
            key={id_formula}
            id={id_formula}
            title={title}
            equation={equation}
            txt={description}
            buttons
          />
        ))}
      </div>
    </CheatsheetContext.Provider>
  );
};

export default Lookup;
