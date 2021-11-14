import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../context/UserContext';
import RefContext from '../context/RefContext';
import dbUtils from '../utils/dbUtils';
import { DeleteCheatsheetPopUp, ShareCheatsheetPopUp } from './PopUps';

const SheetList = ({ isView }) => {
  const [cheatsheets, setCheatsheets] = useState([]);
  const [btnClass, setBtnClass] = useState('collapsed');
  const [cheatsheetName, setCheatsheetName] = useState('');
  const { user } = React.useContext(UserContext);
  const { blurBoxRef, setChild } = React.useContext(RefContext);

  const getCheatsheets = async () => {
    const query = `select id_cheatsheet, title from Cheatsheet
        JOIN Permission using (id_cheatsheet) join User using (id_user)
        where username='${user}';`;
    try {
      const results = await dbUtils.getRows(query);
      setCheatsheets(results);
    } catch (err) {
      throw new Error(err);
    }
  };

  const newCheatsheet = async () => {
    if (cheatsheetName === '') {
      return;
    }
    try {
      const results = await fetch(`/api/cheatsheet?title=${cheatsheetName}&username=${user}`,
        { method: 'PUT' });
      if (results.status !== 200) {
        console.log('something went wrong');
        return;
      }
      setCheatsheetName('');
      getCheatsheets();
    } catch (err) {
      throw new Error(err);
    }
  };

  const NamingHandler = (e) => {
    const { value } = e.target;
    setCheatsheetName(value);
  };

  const submitKeyDown = (e) => {
    if (e.keyCode === 13) {
      newCheatsheet();
    }
  };

  const changeClass = () => {
    if (btnClass === 'open') {
      setBtnClass('collapsed');
      return;
    }
    setBtnClass('open');
  };

  const hideBlurBox = () => {
    blurBoxRef.current.style.display = 'none';
  };

  const generateHtml = (mode, id_cheatsheet) => {
    if (mode === 'delete') {
      return (
        <DeleteCheatsheetPopUp
          id_cheatsheet={id_cheatsheet}
          hideBlurBox={hideBlurBox}
          getCheatsheets={getCheatsheets}
        />
      );
    }
    return (
      <ShareCheatsheetPopUp
        id_cheatsheet={id_cheatsheet}
        hideBlurBox={hideBlurBox}
      />
    );
  };

  const openBlurBox = (html) => {
    blurBoxRef.current.style.display = 'flex';
    setChild(html);
  };

  const handleDelete = (id_cheatsheet) => {
    const html = generateHtml('delete', id_cheatsheet);
    openBlurBox(html);
  };

  const handleShare = (id_cheatsheet) => {
    const html = generateHtml('share', id_cheatsheet);
    openBlurBox(html);
  };

  React.useEffect(() => {
    if (isView) setBtnClass('open');
    getCheatsheets();
  }, [user, blurBoxRef]);

  return (
    <div className={`inputs-box side-box accordion ${btnClass}`}>
      {isView || (
      <button type="button" className={`accordion-button ${btnClass}`} onClick={changeClass}>
        <i className="fa fa-angle-down fa-2x" />
      </button>
      )}
      {!isView ? (
        <a style={{ textDecoration: 'none', color: 'inherit' }} href="/sheets">
          <h1 id="my-sheets">
            Mis hojas de fórmulas
          </h1>
        </a>
      ) : (
        <h1 id="my-sheets">
          Mis hojas de fórmulas
        </h1>
      )}
      {Array.isArray(cheatsheets) && (
      <div className="cheatsheets">
        <div className="add-cheatsheet">
          <input
            type="text"
            placeholder="Nueva hoja de fórmulas"
            onChange={NamingHandler}
            onKeyDown={submitKeyDown}
            value={cheatsheetName}
          />
          <button type="button" className="new-button" onClick={newCheatsheet}>
            <i className="fa fa-check" />
          </button>
        </div>
        <ul>
          {cheatsheets.map(({ id_cheatsheet, title }) => (
            <li>
              <a
                className="underline no-decoration"
                key={id_cheatsheet}
                href={`/cheatsheet/${id_cheatsheet}`}
              >
                {title}
              </a>
              <button
                type="button"
                title="Eliminar hoja"
                onClick={() => handleDelete(id_cheatsheet)}
              >
                <i className="fa fa-trash" />
              </button>
              <button
                type="button"
                title="Compartir hoja"
                onClick={() => handleShare(id_cheatsheet)}
              >
                <i className="fa fa-share-alt" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
};

SheetList.propTypes = {
  isView: PropTypes.bool,
};

SheetList.defaultProps = {
  isView: false,
};

export default SheetList;
