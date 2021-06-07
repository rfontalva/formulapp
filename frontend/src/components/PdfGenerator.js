import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import dbUtils from '../utils/dbUtils';
import Formula from './Formula';

const PdfGenerator = () => {
  const [csTitle, setCSTitle] = React.useState('');
  const [formulasHeader, setHeader] = React.useState(localStorage.ids);
  const [formulas, setFormulas] = React.useState([]);

  const createPdf = async () => {
    await fetch(`/api/pdf?${formulasHeader}header=${csTitle}`, { method: 'POST' });
    const res = await axios.get(`/api/pdf?header=${csTitle}`, { responseType: 'blob' });
    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    saveAs(pdfBlob, `${csTitle}.pdf`);
    await fetch(`/api/pdf?header=${csTitle}`, { method: 'DELETE' });
  };

  const submitHandler = () => {
    if (csTitle !== '' && formulasHeader) {
      createPdf();
      console.log('se creo');
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
    const query = `select * from formulapp.equation where id_equation in (${idArray})`;
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
