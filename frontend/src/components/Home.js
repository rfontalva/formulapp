import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Formula from './Formula';
import dbUtils from '../utils/dbUtils';
import Paginator from './Paginator';

const Home = React.forwardRef(({ search }, ref) => {
  const isSearch = search;
  let searchTitle = '';
  if (isSearch) {
    searchTitle = useParams().searchTitle;
  }
  const [formulas, setFormulas] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const getFormulas = () => {
    if (isSearch) {
      const query = `select * from formulapp.equation where title like '%${searchTitle}%'`;
      dbUtils.getRows(query)
        .then((results) => setFormulas(results))
        .catch((err) => console.error(err));
    } else {
      fetch('/api')
        .then((response) => response.json())
        .then((response) => {
          setFormulas(response);
        })
        .catch((err) => console.error(err));
    }
  };

  React.useEffect(() => {
    getFormulas();
  }, []);

  const paginate = (increment) => {
    setPage(page + increment);
  };

  const handleRemove = (id) => {
    fetch(`/api/remove?id=${id}`)
      .then((response) => response.json())
      .catch((err) => console.error(err));
    getFormulas();
  };

  return (
    <>
      <div ref={ref} className="formulas-container">
        {formulas.slice(page * 9, page * 9 + 9).map((
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
            buttons
          />
        ))}
      </div>
      <Paginator
        paginate={paginate}
        page={page}
        length={formulas.length}
      />
    </>
  );
});

Home.propTypes = {
  search: PropTypes.bool,
};

Home.defaultProps = {
  search: false,
};

export default Home;
