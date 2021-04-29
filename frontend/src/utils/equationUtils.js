function nthIndex(str, pat, n) {
  let asArrayI = n + 1;
  const L = str.length; let
    i = -1;
  while (asArrayI-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

function divisionToLatex(terms) {
  let aux = '';
  const newTerms = terms.map((val) => val.expression);
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i].expression;
    if (term.includes('/')) {
      const index = term.search('/');
      aux = `\\dfrac{${term.substr(0, index)}}{${term.substr(index + 1)}}`;
      newTerms[i] = aux;
    } else newTerms[i] = term;
  }
  return newTerms;
}

function divisionToEquation(expression) {
  const pattern = '\\dfrac{';
  let expr = expression;
  let save = '';
  while (expr.includes(pattern)) {
    if (expr.indexOf(pattern)) {
      save = expr.substr(0, expr.indexOf(pattern));
      expr = expr.substr(expr.indexOf(pattern));
    }
    let startIndex = expr.indexOf(pattern) + pattern.length;
    let endIndex = expr.indexOf('}');
    let aux = expr.substr(startIndex, endIndex - startIndex);
    expr = expr.substr(endIndex + 1);
    startIndex = 1;
    endIndex = expr.indexOf('}');
    aux += `/${expr.substr(startIndex, endIndex - startIndex)}`;
    expr = expr.substr(endIndex + 1);
    expr = save + aux + expr;
  }
  return expr;
}

class Equation {
  constructor(expression, isLatex) {
    if (isLatex) {
      this.transformFromLatex(expression);
      this.terms = this.separateInTerms(this.latex);
    } else {
      this.terms = this.separateInTerms(expression);
      this.transformToLatex();
    }
  }

  separateInTerms(expression) {
    let lastTermIndex = 0;
    let lastBracketIndex = 0;
    let foundBrackets = 0;
    const terms = [];
    const termStructure = { hasSubterm: false, expression: '', subterms: {} };
    for (let i = 0; i < expression.length; i++) {
      const symbol = expression[i];
      if (symbol === '(') {
        termStructure.hasSubterm = true;
        const closeBracket = nthIndex(expression, ')', foundBrackets);
        if (closeBracket !== -1) {
          foundBrackets++;
          termStructure.expression = expression.substr(lastBracketIndex, closeBracket + 1);
          termStructure.subterms = this.separateInTerms(
            expression.substr(i + 1, closeBracket - i - 1),
          );
          lastBracketIndex = closeBracket;
          i = lastBracketIndex;
        }
      }
      if (symbol === '+' || symbol === '-' || symbol === '=') {
        termStructure.expression = expression.substr(lastTermIndex, i - lastTermIndex);
        lastTermIndex = i + 1;
        let clone = { ...termStructure };
        terms.push(clone);
        termStructure.expression = expression.substr(i, 1);
        clone = { ...termStructure };
        terms.push(clone);
        termStructure.hasSubterm = false;
        termStructure.subterm = {};
      }
    }
    termStructure.expression = expression.substr(lastTermIndex);
    terms.push(termStructure);
    return terms;
  }

  transformToLatex() {
    this.terms = divisionToLatex(this.terms);
    this.latex = this.terms.join('');
  }

  transformFromLatex(expression) {
    this.latex = divisionToEquation(expression);
  }
}

export default Equation;
