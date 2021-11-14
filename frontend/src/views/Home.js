import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import dbUtils from '../utils/dbUtils';
import userUtils from '../utils/userUtils';
import {
  Paginator, Formula,
} from '../components/index';
import UserContext from '../context/UserContext';

const Home = React.forwardRef(({ search }, ref) => {
  const isSearch = search;
  const pageLength = 12;
  const { user } = React.useContext(UserContext);
  let searchTitle = '';
  if (isSearch) {
    searchTitle = useParams().searchTitle;
  }

  const [formulas, setFormulas] = React.useState([]);
  const [whichModerated, setWhichModerated] = React.useState([]);
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

  const getWhichModerated = async () => {
    const res = await userUtils.getWhichModerated(user);
    setWhichModerated(res);
  };

  React.useEffect(() => {
    getFormulas();
  }, []);

  React.useEffect(() => {
    getWhichModerated();
  }, [user]);

  const paginate = (increment) => {
    setPage(page + increment);
  };

  const handleRemove = async (id) => {
    try {
      if (userUtils.isLoggedIn(user)) {
        await fetch(`/api/moderate?id=${id}&username=${user}&report=true`, { method: 'POST' });
      }
    } catch (err) {
      console.error(err);
    }
    // getFormulas();
  };

  return (
    <>
      <div ref={ref} className="formulas-container">
        {formulas.slice(page * pageLength, page * pageLength + pageLength).map((
          {
            id_formula, title, equation, txt,
          },
        ) => {
          const buttons = [
            {
              state: 'report',
              handleClick: () => handleRemove(id_formula),
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
          if (userUtils.isLoggedIn(user)) {
            const hasModerated = whichModerated.includes(id_formula);
            if (hasModerated) {
              buttons.shift();
            }
          }
          return (
            <Formula
              key={id_formula}
              id={id_formula}
              title={title}
              equation={equation}
              txt={txt}
              buttons={buttons}
            />
          );
        })}
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
