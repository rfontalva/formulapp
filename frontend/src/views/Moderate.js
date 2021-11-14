import React, { useState } from 'react';
import { Formula } from '../components';
import UserContext from '../context/UserContext';
import dbUtils from '../utils/dbUtils';

const Moderate = () => {
  const [formulas, setFormulas] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [formulaModerated, setFormulaModerated] = useState({});
  const [index, setIndex] = useState(0);
  const { user } = React.useContext(UserContext);

  const getFormulas = async () => {
    const query = `SELECT * from Opinion o
            JOIN Moderation m on o.id_moderation=m.id_moderation
            JOIN Formula f on m.id_formula=f.id_formula
            JOIN User u on u.id_user=o.id_user 
            WHERE  m.state='started' and username not in('${user}')`;
    try {
      const res = await dbUtils.getRows(query);
      if (Array.isArray(res)) {
        setFormulas(res);
        setFormulaModerated(formulas[index]);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleOpinion = async (opinion) => {
    if (opinion !== '') {
      try {
        await fetch(`/api/opinion?opinion=${opinion}`, { method: 'POST' });
        // eslint-disable-next-line
        next();
      } catch (err) {
        throw new Error(err);
      }
    }
  };

  const createButtons = () => {
    const newButtons = [
      {
        state: 'approve',
        user,
        id: formulaModerated.id_formula,
        handleClick: () => handleOpinion('positive'),
      },
      {
        state: 'NA',
        user,
        handleClick: () => handleOpinion(''),
      },
      {
        state: 'reject',
        user,
        id: formulaModerated.id_formula,
        handleClick: () => handleOpinion('negative'),
      },
    ];
    setButtons(newButtons);
  };

  const next = () => {
    setIndex(index + 1);
    if (index >= formulas.length) {
      setFormulaModerated(formulas[index]);
      createButtons();
    }
  };

  React.useEffect(() => {
    getFormulas();
    createButtons();
  }, [user]);

  return (
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
  );
};

export default Moderate;
