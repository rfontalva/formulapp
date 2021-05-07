async function getRows(query) {
  const encoded = encodeURIComponent(query);
  const response = await fetch(`${window.backend}query?query=${encoded}`);
  const results = await response.json();
  return results;
}

const dbUtils = { getRows };

export default dbUtils;
