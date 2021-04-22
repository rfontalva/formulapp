import React from 'react';
import Formula from './Formula';

const Home = () => {
  const [formulas, setFormulas] = React.useState([]);
  const getFormulas = () => {
    fetch('http://localhost:4000/')
      .then((response) => response.json())
      .then((response) => setFormulas(response))
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    getFormulas();
  }, []);

  const handleRemove = (id) => {
    fetch(`http://localhost:4000/remove?id=${id}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
    getFormulas();
  };

  return (
    <>
      <div className="container">
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
            handleRemove={handleRemove}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
