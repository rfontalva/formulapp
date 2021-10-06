import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import dbUtils from '../utils/dbUtils';
import { Formula } from '../components/index';
import userUtils from '../utils/userUtils';

const PdfGenerator = () => {
  const [csTitle, setCSTitle] = React.useState('');
  const [formulasHeader, setHeader] = React.useState(localStorage.ids);
  const [formulas, setFormulas] = React.useState([]);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const createPdf = async () => {
    setIsDownloading(true);
    await fetch(`/api/pdf?${formulasHeader}header=${csTitle}`, { method: 'POST' });
    const res = await axios.get(`/api/pdf?header=${csTitle}`, { responseType: 'blob' });
    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    saveAs(pdfBlob, `${csTitle}.pdf`);
    setIsDownloading(false);
    await fetch(`/api/pdf?header=${csTitle}`, { method: 'DELETE' });
  };

  const submitHandler = () => {
    if (csTitle !== '' && formulasHeader) {
      createPdf();
      localStorage.removeItem('ids');
    } else {
      if (csTitle === '') {
        // eslint-disable-next-line no-alert
        alert('Title can\'t be left empty');
      }
      if (!formulasHeader) {
        // eslint-disable-next-line no-alert
        alert('No formulas were selected');
      }
    }
  };

  const getFormulas = () => {
    let removedText = formulasHeader.replace(/\D+/g, ', ');
    removedText = removedText.substr(2, removedText.length - 2);
    const idArray = removedText.split(',').map((x) => +x);
    const query = `select * from Formula where id_formula in (${idArray})`;
    dbUtils.getRows(query)
      .then((results) => setFormulas(results))
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    if (formulasHeader) { getFormulas(); }
  }, []);

  const handleRemove = (id) => {
    const replaced = formulasHeader.replace(`ids=${id}&`, '');
    setHeader(replaced);
    getFormulas();
  };

  const saveSheet = () => {
    console.log('WIP');
  };

  return (
    <div className="cheatsheet">
      <article className="grid-side">
        <div className="inputs-box side-box">
          <form onSubmit={submitHandler}>
            <label htmlFor="cheatSheetTitle">
              Title
              <input type="text" id="cheatSheetTitle" name="title" onChange={(e) => setCSTitle(e.target.value)} value={csTitle} />
            </label>
          </form>
          {!isDownloading && <button type="button" onClick={submitHandler}>Descargar</button>}
          {isDownloading && <p>Descargando...</p>}
          {userUtils.isLoggedIn() && <button type="button" onClick={saveSheet}>Guardar</button>}
        </div>
      </article>
      {csTitle && <h1>{csTitle}</h1>}
      <div className="formulas-container">
        {formulas.map((
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
  );
};

export default PdfGenerator;
