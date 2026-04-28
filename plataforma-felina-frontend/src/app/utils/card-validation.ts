export function luhnValid(numero: string): boolean {
  const digits = numero.replace(/\D/g, '').split('').reverse().map(Number);
  if (digits.length < 13 || digits.length > 19) return false;
  const sum = digits.reduce(
    (acc, d, i) => acc + (i % 2 ? (d * 2 > 9 ? d * 2 - 9 : d * 2) : d),
    0
  );
  return sum % 10 === 0;
}

export function expValida(mmYY: string): boolean {
  const m = mmYY.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mes = parseInt(m[1], 10);
  const anio = 2000 + parseInt(m[2], 10);
  if (mes < 1 || mes > 12) return false;
  const ahora = new Date();
  const expiracion = new Date(anio, mes, 0, 23, 59, 59);
  return expiracion >= ahora;
}

export function cvvValido(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

export function formatearNumeroTarjeta(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatearExp(valor: string): string {
  const limpio = valor.replace(/\D/g, '').slice(0, 4);
  if (limpio.length < 3) return limpio;
  return `${limpio.slice(0, 2)}/${limpio.slice(2)}`;
}
