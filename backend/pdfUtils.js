const puppeteer = require('puppeteer');
const fs = require('fs');

const generateCheatsheet = (formulas, header) => {
  const mapp = formulas.map(((val) => (
    `<article class="formula">
          <h3 class="formula-title">${val.title}</h3>
          <div />
          <p>$$${val.equation}$$</p>
          <p class="txt">${val.txt}</p>
        </article>`
  ))).join('');
  return (
    `
    <!doctype html>
    <html>
        <head>
        <meta charset="utf-8">
        <script type="text/javascript" id="MathJax-script" async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
        </script>
        <title>${header}</title>
        <style>
          :root {
            --spacing: 0.1rem;
            --radius: 0.25rem;
          }
          .margin-top {
            margin-top: 50px;
          }
          .justify-center {
            text-align: center;
          }
          .container {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          .formula {
            border-style: solid;
            border-radius: var(--radius);
            border-width: 1px;
            padding-left: 1rem;
            background-color: white;
          }
          .formula .txt {
            margin-top: 2rem;
            max-width: 95%;
            white-space: pre-line;
          }
          .formula-title {
            float: left;
            max-width: 10rem;
          }
          .formula {
            clear: both;
          }
        </style>
        </head>
        <body>
        <h1>${header}</h1>
        <div class="container">
            ${mapp}
        </div>
        </body>
    </html>
    `
  );
};

const printPdf = async (formulas, header) => {
  const html = generateCheatsheet(formulas, header);
  const path = `${__dirname}/generic.html`;
  fs.writeFileSync(path, html);
  const url = `file:///${path}`;
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.pdf({ path: `${header}.pdf`, format: 'A4' });
  await browser.close();
};

module.exports = printPdf;
