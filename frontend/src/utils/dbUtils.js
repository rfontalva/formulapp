async function getRows(query) {
  const encoded = encodeURIComponent(query);
  const response = await fetch(`/api/query?query=${encoded}`);
  const results = await response.json();
  return results;
}

async function simpleQuery(query) {
  const encoded = encodeURIComponent(query);
  const response = await fetch(`http://localhost:4000/api/query?query=${encoded}`);
  const results = await response.json();
  return results[0];
}

const dbUtils = { getRows, simpleQuery };

export default dbUtils;
