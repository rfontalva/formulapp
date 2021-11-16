import React, { useState } from 'react';
import { Formula } from '../components';
import UserContext from '../context/UserContext';
import dbUtils from '../utils/dbUtils';

const Moderate = () => {
  const [formulas, setFormulas] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [formulaModerated, setFormulaModerated] = useState({
    id_formula: -1, title: '', equation: '', txt: '', state: '',
  });
  const [index, setIndex] = useState(0);
  const { user } = React.useContext(UserContext);

  const getFormulas = async () => {
    const query = `SELECT * from Moderation m
      JOIN Formula f on m.id_formula=f.id_formula
      WHERE  m.state='started' and id_moderation not in 
      (SELECT id_moderation from Opinion join User using (id_user) where username='${user}')`;
    try {
      const res = await dbUtils.getRows(query);
      if (Array.isArray(res)) {
        setFormulas(res);
        setFormulaModerated(res[0]);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleOpinion = (id, opinion, username) => {
    if (id === -1) {
      setFormulaModerated(formulas[index]);
    } if (opinion !== '') {
      fetch(`/api/opinion?opinion=${opinion}&id=${id}&username=${username}`, { method: 'POST' })
        .then(setIndex(index + 1)).catch((err) => { throw new Error(err); });
    }
  };

  const createButtons = () => {
    const newButtons = [
      {
        state: 'approve',
        user,
        id: formulaModerated.id_formula,
        handleClick: () => handleOpinion(formulaModerated.id_formula, 'positive', user),
      },
      {
        state: 'NA',
        user,
        handleClick: () => handleOpinion(),
      },
      {
        state: 'reject',
        user,
        id: formulaModerated.id_formula,
        handleClick: () => handleOpinion(formulaModerated.id_formula, 'negative', user),
      },
    ];
    setButtons(newButtons);
  };

  React.useEffect(() => {
    getFormulas();
    createButtons();
  }, [user]);

  React.useEffect(() => {
    if (index <= formulas.length && index !== 0) {
      setFormulaModerated(formulas[index]);
      console.log(formulaModerated);
    }
  }, [formulas, index]);

  React.useEffect(() => {
    if (typeof (formulaModerated) !== 'undefined') { createButtons(); }
  }, [formulaModerated]);

  return (
    <>
      {formulaModerated !== undefined && (
        <div className="moderation">
          <Formula
            key={formulaModerated.id_formula}
            id={formulaModerated.id_formula}
            title={formulaModerated.title}
            equation={formulaModerated.equation}
            txt={formulaModerated.txt}
            state={formulaModerated.state}
            buttons={buttons}
          />
        </div>
      )}
      {index >= formulas.length && (
        <div className="oops">
          <div className="wrapper">
            <h2>
              No hay más fórmulas que moderar por el momento
            </h2>
            <a href="/" className="underline no-decoration">
              Volver al inicio
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Moderate;
