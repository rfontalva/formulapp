import React from 'react';
import dbUtils from '../utils/dbUtils';
import {
  Formula,
} from '../components/index';
import '../index.css';
import Equation from '../utils/equationUtils';
import userUtils from '../utils/userUtils';
import UserContext from '../context/UserContext';

const Lookup = () => {
  const [search, setSearch] = React.useState({
    title: '', description: '', equation: '', topic: '', category: '',
  });
  const [formulas, setFormulas] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const { user } = React.useContext(UserContext);

  const getFormulas = async () => {
    const equation = new Equation(search.equation).latex;
    const query = `select * from eq_search where title like '%${search.title}%'
    and equation like '%${equation}%' and
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

  const handleRemove = async (id) => {
    try {
      if (userUtils.isLoggedIn(user)) {
        await fetch(`/api/moderate?id=${id}&username=${user}&report=true`, { method: 'POST' });
      }
    } catch (err) {
      console.error(err);
    }
    getFormulas();
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  React.useEffect(() => {
    getTopics();
  }, [search.category]);

  return (
    <>
      <article className="grid-top-center">
        <div id="lookup-box" className="inputs-box">
          <form id="lookup-form" onSubmit={submitHandler}>
            <label htmlFor="searchTitle">
              T??tulo
              <input type="text" id="searchTitle" name="title" onChange={changeHandler} value={search.title} />
            </label>
            <label htmlFor="searchCategory">
              Categor??a
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
            <label htmlFor="searchEquation">
              Ecuaci??n
              <input type="text" id="searchEquation" name="equation" onChange={changeHandler} value={search.equation} />
            </label>
            {search.category && (
            <label htmlFor="searchTopic">
              T??pico
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
          </form>
          <button type="submit" onClick={submitHandler}>Enviar</button>
        </div>
      </article>
      <div className="formulas-container" style={{ marginTop: '1.6rem' }}>
        {formulas.map((
          {
            id_formula, title, equation, description,
          },
        ) => {
          const buttons = [{
            state: 'report',
            handleClick: () => handleRemove(),
            user,
            id: id_formula,
          },
          {
            state: 'edit',
            user,
            id: id_formula,
          },
          {
            state: 'add',
            user,
            id: id_formula,
          },
          ];
          return (
            <Formula
              key={id_formula}
              id={id_formula}
              title={title}
              equation={equation}
              txt={description}
              buttons={buttons}
            />
          );
        })}
      </div>
    </>
  );
};

export default Lookup;
