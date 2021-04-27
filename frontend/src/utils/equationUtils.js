function transformDivision(terms) {
  let aux = '';
  const newTerms = terms;
  for (let i = 0; i < terms.length; i += 1) {
    const term = terms[i];
    if (term.includes('/')) {
      const index = term.search('/');
      aux = `\\dfrac{${term.substr(0, index)}}{${term.substr(index + 1)}}`;
      newTerms[i] = aux;
    }
  }
  return newTerms;
}

class Equation {
  constructor(equation) {
    this.parsers = ['+', '-', '='];
    this.operators = ['/', '^'];
    this.terms = [];
    this.separateInTerms(equation);
    this.latex = this.transformToLatex();
  }

  separateInTerms(expression) {
    let lastParse = 0;
    const termStructure = {};
    for (let i = 0; i < expression.length; i += 1) {
      const symbol = expression[i];
      if (symbol === '(') {
        termStructure.hasSubterm = true;
        termStructure.subterm = this.separateInTerms(expression.substr(i, expression.search(')')));
      } else if (symbol === '+' || symbol === '-' || symbol === '=') {
        const term = expression.substr(lastParse, i - lastParse);
        termStructure.term = term;
        this.terms.push(term);
        this.terms.push(expression.substr(i, 1));
        lastParse = i + 1;
      }
    }
    this.terms.push(expression.substr(lastParse));
  }

  transformToLatex() {
    this.terms = transformDivision(this.terms);
    return this.terms.join('');
  }
}

export default Equation;
