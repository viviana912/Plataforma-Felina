import {
  cvvValido,
  expValida,
  formatearExp,
  formatearNumeroTarjeta,
  luhnValid
} from './card-validation';

describe('luhnValid', () => {
  it('acepta una tarjeta de prueba conocida (4242 4242 4242 4242)', () => {
    expect(luhnValid('4242424242424242')).toBe(true);
  });

  it('rechaza un número que no pasa Luhn', () => {
    expect(luhnValid('1234567890123456')).toBe(false);
  });

  it('rechaza números demasiado cortos o demasiado largos', () => {
    expect(luhnValid('4242')).toBe(false);
    expect(luhnValid('42424242424242424242')).toBe(false);
  });
});

describe('expValida', () => {
  it('rechaza formatos inválidos', () => {
    expect(expValida('')).toBe(false);
    expect(expValida('1/25')).toBe(false);
    expect(expValida('13/25')).toBe(false);
  });

  it('rechaza fechas pasadas', () => {
    expect(expValida('01/20')).toBe(false);
  });

  it('acepta una fecha futura razonable', () => {
    const futuro = new Date();
    futuro.setFullYear(futuro.getFullYear() + 2);
    const mm = String(futuro.getMonth() + 1).padStart(2, '0');
    const yy = String(futuro.getFullYear() % 100).padStart(2, '0');
    expect(expValida(`${mm}/${yy}`)).toBe(true);
  });
});

describe('cvvValido', () => {
  it('acepta 3 o 4 dígitos', () => {
    expect(cvvValido('123')).toBe(true);
    expect(cvvValido('1234')).toBe(true);
  });

  it('rechaza no-dígitos o longitud incorrecta', () => {
    expect(cvvValido('12')).toBe(false);
    expect(cvvValido('12345')).toBe(false);
    expect(cvvValido('12a')).toBe(false);
  });
});

describe('formatearNumeroTarjeta', () => {
  it('agrupa los dígitos de 4 en 4 separados por espacios', () => {
    expect(formatearNumeroTarjeta('4242424242424242')).toBe('4242 4242 4242 4242');
  });

  it('descarta caracteres no numéricos', () => {
    expect(formatearNumeroTarjeta('4242-4242-abcd')).toBe('4242 4242');
  });
});

describe('formatearExp', () => {
  it('inserta la barra entre mes y año', () => {
    expect(formatearExp('1228')).toBe('12/28');
  });

  it('no inserta barra si solo hay 2 dígitos', () => {
    expect(formatearExp('12')).toBe('12');
  });
});
