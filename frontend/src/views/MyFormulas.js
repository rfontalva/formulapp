import React from 'react';
// import PropTypes from 'prop-types';
import dbUtils from '../utils/dbUtils';
import userUtils from '../utils/userUtils';
import {
  Paginator, Formula,
} from '../components/index';
import ErrorComp from './Error';
import UserContext from '../context/UserContext';

const MyFormulas = React.forwardRef((_, ref) => {
  const pageLength = 12;
  const { user } = React.useContext(UserContext);
  const [formulas, setFormulas] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const getFormulas = async () => {
    const query = `SELECT f.* from Formula f JOIN User using (id_user)
      WHERE username='${user}'`;
    try {
      const results = await dbUtils.getRows(query);
      setFormulas(results);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getFormulas();
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
    getFormulas();
  };

  return (
    <>
      {userUtils.isLoggedIn(user) ? (
        <>
          <h1 className="footer-title">Mis fórmulas</h1>
          <div ref={ref} className="formulas-container">
            {formulas.slice(page * pageLength, page * pageLength + pageLength).map((
              {
                id_formula, title, equation, txt, state,
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
                  txt={txt}
                  state={state}
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
      ) : (<ErrorComp />)}
      {(userUtils.isLoggedIn(user) && !formulas.length) && (
        <div className="side-box">
          <h1>Parece que aún no has creado fórmulas</h1>
          <h3>
            Puedes empezar haciendo click en
            {' '}
            <a href="/add" className="no-decoration underline">Agregar</a>
          </h3>
        </div>
      )}
    </>
  );
});

export default MyFormulas;
