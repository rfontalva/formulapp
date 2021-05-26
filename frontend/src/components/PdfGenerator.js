import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import dbUtils from '../utils/dbUtils';
// import urlUtils from '../utils/urlUtils';
import Formula from './Formula';

const PdfGenerator = () => {
  const [csTitle, setCSTitle] = React.useState('');
  const [formulas, setFormulas] = React.useState([]);

  const submitHandler = () => {
    if (csTitle !== '' && localStorage.ids) {
      fetch(`/api/create-pdf?${localStorage.ids}header=${csTitle}`, { method: 'POST' })
        .then(() => axios.get(`${window.backend}fetch-pdf?header=${csTitle}`, { responseType: 'blob' }))
        .then((res) => {
          const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
          saveAs(pdfBlob, `${csTitle}.pdf`);
        })
        .then(() => fetch(`/api/delete-pdf?header=${csTitle}`, { method: 'DELETE' }));
      localStorage.removeItem('ids');
      // urlUtils.goHome();
    } else {
      if (csTitle === '') {
        // eslint-disable-next-line no-alert
        alert('Title can\'t be left empty');
      }
      if (!localStorage.ids) {
        // eslint-disable-next-line no-alert
        alert('No formulas were selected');
      }
    }
  };

  const getFormulas = () => {
    let removedText = localStorage.ids.replace(/\D+/g, ', ');
    removedText = removedText.substr(2, removedText.length - 2);
    const idArray = removedText.split(',').map((x) => +x);
    const query = `select * from formulapp.equation where id_equation in (${idArray})`;
    dbUtils.getRows(query)
      .then((results) => setFormulas(results))
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    if (localStorage.ids) { getFormulas(); }
  }, []);

  const handleRemove = (id) => {
    const replaced = localStorage.ids.replace(`ids=${id}&`, '');
    localStorage.ids = replaced;
    getFormulas();
  };

  return (
    <div className="cheatsheet">
      <article className="grid-side">
        <div className="inputs-box">
          <form onSubmit={submitHandler}>
            <label htmlFor="cheatSheetTitle">
              Title
              <input type="text" id="cheatSheetTitle" name="title" onChange={(e) => setCSTitle(e.target.value)} value={csTitle} />
            </label>
          </form>
          <button type="button" onClick={submitHandler}>Descargar</button>
        </div>
      </article>
      {csTitle && <h1>{csTitle}</h1>}
      <div className="formulas-container">
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
    </div>
  );
};

export default PdfGenerator;
