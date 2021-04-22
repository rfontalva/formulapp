const urlEncoding = (str, breakLine) => {
  let replaced = str.replace(/\\/g, '\\\\');
  replaced = replaced.replace(/\+/g, '%2b');
  if (breakLine) { replaced = replaced.replace(/<br\s*[/]?>/gi, '\n'); }
  return replaced;
};

const goToUrl = (ext) => {
  window.location.href = `http://localhost:3000/${ext}`;
};

const utils = {
  urlEncoding,
  goToUrl,
};

export default utils;
