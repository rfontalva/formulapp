import React from 'react';
import dbUtils from '../utils/dbUtils';
import Formula from './Formula';
import '../index.css';

const Lookup = () => {
  const [search, setSearch] = React.useState({ title: '', txt: '', equation: '' });
  const [formulas, setFormulas] = React.useState([]);
  const getFormulas = () => {
    const query = `select * from formulapp.equation where title like '%${search.title}%' and txt like '%${search.txt}%' and equation like '%${search.equation}%'`;
    dbUtils.getRows(query)
      .then((results) => setFormulas(results))
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

  return (
    <>
      <article className="grid-side">
        <div className="input-formula">
          <form onSubmit={submitHandler}>
            <label htmlFor="searchTitle">
              Title
              <input type="text" id="searchTitle" name="title" onChange={changeHandler} value={search.title} />
            </label>
            <label htmlFor="searchCategory">
              Description
              <textarea id="searchCategory" name="txt" onChange={changeHandler} value={search.txt} />
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
            id_equation, title, equation, txt,
          },
        ) => (
          <Formula
            key={id_equation}
            id={id_equation}
            title={title}
            equation={equation}
            txt={txt}
          />
        ))}
      </div>
    </>
  );
};

export default Lookup;
