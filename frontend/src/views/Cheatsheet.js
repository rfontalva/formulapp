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
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [permission, setPermission] = useState(false);
  const [removed, setRemoved] = useState(1);
  const [hasPermission, setHasPermission] = useState(false);
  const { idCheatsheet } = useParams();
  const { user } = React.useContext(UserContext);
  const [isReadOnly, setIsReadOnly] = useState(permission === 'r');

  const getCheatsheetDetails = async () => {
    try {
      const results = await fetch(`/api/cheatsheet?id=${idCheatsheet}`);
      const { formulas, title } = await results.json();
      setCSTitle(title);
      setFormulas(formulas);
    } catch (err) {
      throw new Error(err);
    }
  };

  const createPdf = async () => {
    setDownloadError(false);
    setIsDownloading(true);
    const makeResponse = await fetch(`/api/makeCheatsheet?id=${idCheatsheet}`, { method: 'POST' });
    if (makeResponse.ok) {
      const res = await axios.get(`/api/pdf?header=${csTitle}`, { responseType: 'blob' });
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      saveAs(pdfBlob, `${csTitle}.pdf`);
      setIsDownloading(false);
      await fetch(`/api/pdf?header=${csTitle}`, { method: 'DELETE' });
    } else {
      setIsDownloading(false);
      setDownloadError(true);
    }
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
  }, [user]);

  React.useEffect(() => {
    setIsReadOnly(permission === 'r');
  }, [permission]);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/cheatsheetContent?idFormula=${id}&idCheatsheet=${idCheatsheet}`, { method: 'DELETE' });
      if (res.ok) {
        await getFormulas();
        setRemoved(removed + 1);
        return;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const saveSheet = async () => {
    await fetch(`/api/saveCheatsheet?title=${csTitle}&id=${idCheatsheet}`, { method: 'PATCH' });
    setIsSaved(true);
  };

  React.useEffect(() => {
  }, [removed]);

  return (
    <>
      {hasPermission && (
        <div className="cheatsheet">
          <article className="grid-side" id="create-box">
            <div className="inputs-box side-box">
              <form onSubmit={submitHandler}>
                <label htmlFor="cheatSheetTitle">
                  T??tulo
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
              {!isReadOnly && !isSaved && <button type="button" onClick={saveSheet}>Guardar</button>}
              {downloadError && <p className="error-msg">Hubo un error, intente de nuevo</p>}
            </div>
          </article>
          {csTitle && <h1>{csTitle}</h1>}
          <div className="formulas-container">
            {formulasDisplay.map((
              {
                id_formula, title, equation, txt,
              },
            ) => {
              const buttons = [
                {
                  state: 'remove',
                  handleClick: handleRemove,
                  id: id_formula,
                  user,
                },
              ];
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
        </div>
      )}
      {!hasPermission && (
        <ErrorComp />
      )}
    </>
  );
};

export default Cheatsheet;
