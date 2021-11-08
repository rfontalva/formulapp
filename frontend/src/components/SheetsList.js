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
      console.log(results);
      setCheatsheets(results);
    } catch (err) {
      throw new Error(err);
    }
  };

  React.useEffect(() => {
    getCheatsheets();
  }, [user]);
  return (
    <div className="inputs-box side-box">
      <a style={{ textDecoration: 'none', color: 'inherit' }} href="/sheets">
        <h3>
          Mis hojas de fórmulas
        </h3>
      </a>
      {Array.isArray(cheatsheets) && (
      <div>
        {cheatsheets.map(({ id_cheatsheet, title }) => (
          <>
            <a
              key={id_cheatsheet}
              href={`/cheatsheet/${id_cheatsheet}`}
            >
              {title}
            </a>
            <br />
          </>
        ))}
      </div>
      )}
    </div>
  );
};

export default SheetList;
