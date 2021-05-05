import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Formula from './Formula';
import dbUtils from '../utils/dbUtils';

const Home = ({ search }) => {
  const isSearch = search;
  let searchTitle = '';
  if (isSearch) {
    searchTitle = useParams().searchTitle;
  }
  const [formulas, setFormulas] = React.useState([]);
  const getFormulas = () => {
    if (isSearch) {
      const query = `select * from formulapp.equation where title like '%${searchTitle}%'`;
      dbUtils.getRows(query)
        .then((results) => setFormulas(results))
        .catch((err) => console.error(err));
    } else {
      fetch(window.backend)
        .then((response) => response.json())
        .then((response) => setFormulas(response))
        .catch((err) => console.error(err));
    }
  };

  React.useEffect(() => {
    getFormulas();
  }, []);

  const handleRemove = (id) => {
    fetch(`${window.backend}remove?id=${id}`)
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

Home.propTypes = {
  search: PropTypes.bool,
};

Home.defaultProps = {
  search: false,
};

export default Home;
