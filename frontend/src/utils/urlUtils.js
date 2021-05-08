const urlEncoding = (str, breakLine) => {
  let replaced = str.replace(/\\/g, '\\\\');
  replaced = replaced.replace(/\+/g, '%2b');
  replaced = replaced.replace(/'/g, '%27');
  if (breakLine) { replaced = replaced.replace(/<br\s*[/]?>/gi, '\\n'); }
  return replaced;
};

const goToUrl = (ext) => {
  window.location.href = `${window.frontend}${ext}`;
};

const goHome = () => {
  window.location.href = `${window.frontend}`;
};

const utils = {
  urlEncoding,
  goToUrl,
  goHome,
};

export default utils;
