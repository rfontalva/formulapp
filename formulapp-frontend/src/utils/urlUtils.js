const urlEncoding = (str, breakLine) => {
  let replaced = str.replace(/\\/g, '\\\\');
  replaced = replaced.replace(/\+/g, '%2b');
  if (breakLine) { replaced = replaced.replace(/<br\s*[/]?>/gi, '\n'); }
  return replaced;
};

export default urlEncoding;
