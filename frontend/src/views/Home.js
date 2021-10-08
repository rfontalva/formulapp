import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import dbUtils from '../utils/dbUtils';
import {
  Paginator, Formula,
} from '../components/index';

const Home = React.forwardRef(({ search }, ref) => {
  const isSearch = search;
  const pageLength = 12;
  let searchTitle = '';
  if (isSearch) {
    searchTitle = useParams().searchTitle;
  }
  const [formulas, setFormulas] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const getFormulas = async () => {
    if (isSearch) {
      const query = `select * from Formula where title like '%${searchTitle}%'`;
      try {
        const results = await dbUtils.getRows(query);
        setFormulas(results);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response = await fetch('/api');
        const res = await response.json();
        setFormulas(res);
      } catch (err) {
        console.error(err);
      }
    }
  };

  React.useEffect(() => {
    getFormulas();
  }, []);

  const paginate = (increment) => {
    setPage(page + increment);
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/remove?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    getFormulas();
  };

  return (
    <>
      <div ref={ref} className="formulas-container">
        {formulas.slice(page * pageLength, page * pageLength + pageLength).map((
          {
            id_formula, title, equation, txt,
          },
        ) => (
          <Formula
            key={id_formula}
            id={id_formula}
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
