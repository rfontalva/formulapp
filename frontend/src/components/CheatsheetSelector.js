import React, { useState } from 'react';
import RefContext from '../context/RefContext';
import dbUtils from '../utils/dbUtils';

const CheatsheetSelector = () => {
  const [cheatsheets, setCheatsheets] = useState([]);
  const [cheatsheetsFiltered, setCheatsheetsFiltered] = useState([]);
  const [cheatsheetName, setCheatsheetName] = useState('');
  const [cheatsheetSearch, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [rerender, setRerender] = useState(false);
  const { user } = React.useContext(RefContext);

  const getCheatsheets = async () => {
    const query = `select id_cheatsheet, title from Cheatsheet join Permission using (id_cheatsheet) join User using (id_user) where username='${user}'`;
    try {
      const results = await dbUtils.getRows(query);
      if (Array.isArray(results)) {
        setCheatsheets(results);
        setCheatsheetsFiltered(results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const newCheatsheet = async () => {
    console.log('hola');
    try {
      const results = await fetch(`/api/cheatsheet?title=${cheatsheetName}&username=${user}`, { method: 'PUT' });
      if (results.status !== 200) {
        console.log('something went wrong');
        return;
      }
      setShow(false);
      setRerender(!rerender);
    } catch (err) {
      console.log(err);
    }
  };

  const SearchHandler = (e) => {
    const { value } = e.target;
    setSearch(value);
    setCheatsheetsFiltered(cheatsheets.filter(({ title }) => title.includes(cheatsheetSearch)));
  };

  const NamingHandler = (e) => {
    const { value } = e.target;
    setCheatsheetName(value);
    if (e.keyCode === 13) {
      newCheatsheet();
    }
  };

  const cleanUp = () => {
    setSearch('');
    setCheatsheetName('');
    setShow(false);
    setCheatsheetsFiltered(cheatsheets);
  };

  React.useEffect(() => {
    getCheatsheets();
  }, [rerender]);

  return (
    <>
      <div className="selector" onMouseLeave={cleanUp}>
        <div className="dropdown-selector">
          <input type="text" placeholder="Buscar..." onChange={SearchHandler} value={cheatsheetSearch} />
          <ul>
            {cheatsheetsFiltered.map(({ id_cheatsheet, title }) => (
              <li key={id_cheatsheet} href="/">{title}</li>
            ))}
          </ul>
          {show || <button type="button" className="button" onClick={() => setShow(true)}>Crear hoja nueva</button>}
          {show && (
          <div className="add-cheatsheet">
            <input type="text" placeholder="Titulo" onChange={NamingHandler} value={cheatsheetName} />
            <button type="button" onClick={newCheatsheet}>
              <i className="fa fa-check" />
            </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheatsheetSelector;
