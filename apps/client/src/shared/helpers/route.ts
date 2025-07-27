export const msToTime = (ms: number) => {
  const seconds = ms / 1000;

  if (seconds === 0) return '0';

  if (seconds < 60) return `${Math.round(seconds)}\u00A0s`;

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) return `${minutes}\u00A0min`;

  return `${Math.round(minutes / 60)}\u00A0:\u00A0${minutes % 60}\u00A0h`;
};

export const metresToKm = (m: number) =>
  m === 0 ? '0' : `${(m / 1000).toFixed(2)}\u00A0km`;

export const ascDescToFixed = (m?: number) =>
  m ? `${m.toFixed(2)}\u00A0m` : '0';
