import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import dbUtils from '../utils/dbUtils';
import { Formula } from '../components/index';
import ErrorComp from './Error';
import userUtils from '../utils/userUtils';
import UserContext from '../context/UserContext';

const Cheatsheet = () => {
  const [csTitle, setCSTitle] = useState('');
  const [formulasDisplay, setFormulas] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [permission, setPermission] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { idCheatsheet } = useParams();
  const { user } = React.useContext(UserContext);
  console.log(permission);
  // eslint-disable-next-line no-unused-vars
  const [isReadOnly, _setIsReadOnly] = useState(permission === 'r');

  const getCheatsheetDetails = async () => {
    try {
      const results = await fetch(`http://localhost:4000/api/cheatsheet?id=${idCheatsheet}`);
      const { formulas, title } = await results.json();
      setCSTitle(title);
      setFormulas(formulas);
    } catch (err) {
      throw new Error(err);
    }
  };

  const createPdf = async () => {
    setIsDownloading(true);
    await fetch(`/api/makeCheatsheet?id=${idCheatsheet}`, { method: 'POST' });
    const res = await axios.get(`/api/pdf?header=${csTitle}`, { responseType: 'blob' });
    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    saveAs(pdfBlob, `${csTitle}.pdf`);
    setIsDownloading(false);
    await fetch(`/api/pdf?header=${csTitle}`, { method: 'DELETE' });
  };

  const submitHandler = () => {
    if (csTitle !== '') {
      createPdf();
      return;
    }
    // eslint-disable-next-line no-alert
    alert('Title can\'t be left empty');
  };

  const getFormulas = async () => {
    const query = `select f.* from Formula f inner join CheatsheetContent using (id_formula) 
      inner join Cheatsheet using (id_cheatsheet) where id_cheatsheet=${idCheatsheet})`;
    try {
      const results = await dbUtils.getRows(query);
      setFormulas(results);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(async () => {
    const hasAccess = await userUtils.hasAccess(user, idCheatsheet);
    setPermission(hasAccess.permission);
    setHasPermission(hasAccess.hasPermission);
    getCheatsheetDetails();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`api/cheatsheetContent?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        getFormulas();
        return;
      }
      console.log('hubo un error');
    } catch (err) {
      throw new ErrorComp(err);
    }
  };

  const saveSheet = () => {
    console.log('WIP');
  };

  return (
    <>
      {hasPermission && (
        <div className="cheatsheet">
          <article className="grid-side" id="create-box">
            <div className="inputs-box side-box">
              <form onSubmit={submitHandler}>
                <label htmlFor="cheatSheetTitle">
                  Título
                  <input
                    type="text"
                    id="cheatSheetTitle"
                    name="title"
                    onChange={(e) => setCSTitle(e.target.value)}
                    value={csTitle}
                    disabled={isReadOnly}
                  />
                </label>
              </form>
              {!isDownloading && <button type="button" onClick={submitHandler}>Descargar</button>}
              {isDownloading && <p>Descargando...</p>}
              {!isReadOnly && <button type="button" onClick={saveSheet}>Guardar</button>}
            </div>
          </article>
          {csTitle && <h1>{csTitle}</h1>}
          <div className="formulas-container">
            {formulasDisplay.map((
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
              />
            ))}
          </div>
        </div>
      )}
      {!hasPermission && (
        <ErrorComp />
      )}
    </>
  );
};

export default Cheatsheet;
