function transformDivision(terms) {
  let aux = '';
  const newTerms = terms.map((val) => val.expression);
  console.log(newTerms);
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

class Equation {
  constructor(equation) {
    this.parsers = ['+', '-', '='];
    this.operators = ['/', '^'];
    this.terms = this.separateInTerms(equation);
    this.latex = this.transformToLatex();
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
    this.terms = transformDivision(this.terms);
    return this.terms.join('');
  }
}

export default Equation;
