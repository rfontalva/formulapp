function divisionToLatex(terms) {
  let aux = '';
  const newTerms = terms.map((val) => val.expression);
  for (let i = 0; i < terms.length; i += 1) {
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
    let lastParse = 0;
    const terms = [];
    let termStructure = { hasSubterm: false, expression: '', terms: {} };
    for (let i = 0; i < expression.length; i += 1) {
      const symbol = expression[i];
      if (symbol === '(') {
        termStructure.hasSubterm = true;
        const closeBracket = expression.search(/\)/);
        termStructure.expression = expression.substr(lastParse, closeBracket + 1);
        termStructure.terms = this.separateInTerms(
          expression.substr(i + 1, closeBracket - i - 1),
        );
        const clone = { ...termStructure };
        terms.push(clone);
        lastParse = closeBracket + 1;
        i = lastParse;
        termStructure = {
          expression: expression.substr(i, 1),
          hasSubterm: false,
          terms: {},
        };
        terms.push(termStructure);
      }
      if (symbol === '+' || symbol === '-' || symbol === '=') {
        termStructure.expression = expression.substr(lastParse, i - lastParse);
        lastParse = i + 1;
        const clone = { ...termStructure };
        terms.push(clone);
        termStructure.expression = expression.substr(i, 1);
        terms.push(termStructure);
      }
      termStructure = {
        hasSubterm: false,
        expression: '',
        terms: {},
      };
    }
    termStructure.expression = expression.substr(lastParse);
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
