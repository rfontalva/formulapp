const api = require('./api');

async function getRow(query) {
  const response = await api.getSelect(query);
  const result = await response.json();
  return result.results[0];
}

function createCheatSheet(ids, title) {
  const idsArray = [1, 2];
  let content = `
  <!doctype html>
  <html>
     <head>
          <meta charset="utf-8">
          <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
          <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
          <title>${title}</title>
        <style>
            h1 {
                color: green;
            }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
  `;
  content += idsArray.map((id) => {
    const query = `select * from formulapp.equation where id_equation = ${id}`;
    const row = getRow(query);
    return `
      <article>
      <h3>${row.title}</h3>
      <math display="block">${row.equation}</math>
      <p>${row.txt}</p>
      </article>
      `;
  });
  content += `
    </body>
    </html>
  `;
  return content;
}

module.exports = { createCheatSheet };

//   const q = api.getSelect(`select * from formulapp.equation where id_equation = ${id}`);
//   content += `
//     <article>
//       <h3>${q.title}</h3>
//       <math display="block">${q.equation}</math>
//       <p>${q.txt}</p>
//     </article>
//   `;
