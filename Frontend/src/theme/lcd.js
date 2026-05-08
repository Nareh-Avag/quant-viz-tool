export const lcd = {
  bg:     '#D8DEC3',
  screen: '#CACED8',
  mid:    '#B7BEA5',
  dark:   '#8E9775',
  text:   '#5F684D',
  deep:   '#2E3323',
  shadow: '#161A12',
  device: '#181B12',
  phosphor: '#0D1209',
};

export function lcdAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
