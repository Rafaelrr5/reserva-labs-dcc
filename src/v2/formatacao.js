import { LABORATORIOS, HORARIOS, DIAS } from '../dados/laboratorios.js';

export function nomeDoLaboratorio(id) {
  return LABORATORIOS.find((l) => l.id === id)?.nome ?? id;
}

export function formatarDia(iso) {
  return iso.split('-').reverse().join('/');
}

export { LABORATORIOS, HORARIOS, DIAS };
