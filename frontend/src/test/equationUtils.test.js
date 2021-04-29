import Equation from '../utils/equationUtils';

describe('Equation utils', () => {
  test('+ split latex', () => {
    const eq = new Equation('x+y');
    expect(eq.latex).toBe('x+y');
  });
  test('+ split terms', () => {
    const eq = new Equation('x+y');
    expect(eq.terms).toStrictEqual(['x', '+', 'y']);
  });
  test('= split latex', () => {
    const eq = new Equation('x=y');
    expect(eq.latex).toBe('x=y');
  });
  test('= split terms', () => {
    const eq = new Equation('x=y');
    expect(eq.terms).toStrictEqual(['x', '=', 'y']);
  });
  test('- split latex', () => {
    const eq = new Equation('x-y');
    expect(eq.latex).toBe('x-y');
  });
  test('- split terms', () => {
    const eq = new Equation('x-y');
    expect(eq.terms).toStrictEqual(['x', '-', 'y']);
  });
  test('mixed operators split latex', () => {
    const eq = new Equation('x+y-1=2');
    expect(eq.latex).toBe('x+y-1=2');
  });
  test('mixed operators split terms', () => {
    const eq = new Equation('x+y-1=2');
    expect(eq.terms).toStrictEqual(['x', '+', 'y', '-', '1', '=', '2']);
  });
  test('division to latex', () => {
    const eq = new Equation('x/y');
    expect(eq.latex).toBe('\\dfrac{x}{y}');
  });
  test('division 2', () => {
    const eq = new Equation('x/y+4');
    expect(eq.latex).toBe('\\dfrac{x}{y}+4');
  });
  test('division w/()', () => {
    const eq = new Equation('x/(y+4)');
    expect(eq.latex).toBe('\\dfrac{x}{(y+4)}');
  });
  test('division w/() 2', () => {
    const eq = new Equation('(x+y)/4=1');
    expect(eq.latex).toBe('\\dfrac{(x+y)}{4}=1');
  });
  test('division w/() 3', () => {
    const eq = new Equation('2*(x+y)/4');
    expect(eq.latex).toBe('\\dfrac{2*(x+y)}{4}');
  });
  test('division w/() 4', () => {
    const eq = new Equation('2*(x+y)/4');
    expect(eq.latex).toBe('\\dfrac{2*(x+y)}{4}');
  });
  test('division w/() 5', () => {
    const eq = new Equation('(x+y)/4*2');
    expect(eq.latex).toBe('\\dfrac{(x+y)}{4*2}');
  });
  test('division w/() 6', () => {
    const eq = new Equation('(x+y)/(2*4+1)');
    expect(eq.latex).toBe('\\dfrac{(x+y)}{(2*4+1)}');
  });
  test('division w/() 7', () => {
    const eq = new Equation('(x+y)/(2*4)+1');
    expect(eq.latex).toBe('\\dfrac{(x+y)}{(2*4)}+1');
  });
});
