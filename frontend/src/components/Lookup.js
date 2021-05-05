import React from 'react';

const Lookup = () => {
  const [search, setSearch] = React.useState({ title: '', category: '', topic: '' });
  const submitHandler = (e) => {
    e.preventDefault();
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  return (
    <article className="grid">
      <div className="lookup-box">
        <form onSubmit={submitHandler}>
          <label htmlFor="searchTitle">
            Title
            <input type="text" id="searchTitle" name="title" onChange={changeHandler} value={search.title} />
          </label>
          <label htmlFor="formulaTxt">
            Description
            <textarea id="searchCategory" name="category" onChange={changeHandler} value={search.txt} />
          </label>
          <label htmlFor="formulaEquation">
            Equation
            <input type="text" id="searchTopic" name="topic" onChange={changeHandler} value={search.topic} />
          </label>
        </form>
        <button type="submit" onClick={submitHandler}>Enviar</button>
      </div>
    </article>
  );
};

export default Lookup;
