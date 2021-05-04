import urlUtils from './urlUtils';

async function getRows(query) {
  const encoded = urlUtils.urlEncoding(query);
  console.log(encoded, query);
  const response = await fetch(`${window.backend}query?query=${encoded}`);
  const results = await response.json();
  return results;
}

const dbUtils = { getRows };

export default dbUtils;
