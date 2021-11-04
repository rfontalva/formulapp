import React, { useState } from 'react';
import UserContext from '../context/UserContext';
import dbUtils from '../utils/dbUtils';

const SheetList = () => {
  const [cheatsheets, setCheatsheets] = useState([]);
  const { user } = React.useContext(UserContext);

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

  React.useEffect(() => {
    getCheatsheets();
  }, []);
  return (
    <>
      {Array.isArray(cheatsheets) && (
      <div>
        {cheatsheets.map(({ id_cheatsheet, title }) => (
          <p
            key={id_cheatsheet}
          >
            {title}
          </p>
        ))}
      </div>
      )}
    </>
  );
};

export default SheetList;
