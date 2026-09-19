// The small OWOX mark stamped into the bottom-right corner of every exported
// image. Shared by both SVG exporters (and, through the vector one, by PNG).

// OWOX logo paths, drawn in a 512-unit box.
const LOGO_P0 = "M421.311 119.85C435.258 133.807 440.996 157.327 440.996 157.327C440.996 157.327 449.53 204.69 449.53 268.995C449.53 177.972 418.65 162.348 311.314 162.348H212.327C157.38 162.348 161.097 217.57 157.38 243.85L152.865 283.556C150.697 325.33 157.951 351.215 200.811 351.215C111.444 351.215 61.806 365.847 61.8062 239.866C61.8061 182.846 70.4043 157.327 70.4043 157.327C70.4043 157.327 76.1419 133.807 90.1183 119.85C104.095 105.877 124.809 104.475 124.809 104.475C124.809 104.475 167.579 98.0374 252.066 98.0374C336.554 98.0374 384.285 104.475 384.285 104.475C384.285 104.475 407.321 105.877 421.311 119.85Z";
const LOGO_P1 = "M449.515 271.888C449.52 273.026 449.523 274.174 449.523 275.333C449.523 329.946 441.393 351.201 441.393 351.201C441.393 351.201 435.03 376.952 424.167 388.075C406.929 405.725 388.495 406.71 388.495 406.71C388.495 406.71 348.836 413.061 263.502 413.061C181.632 413.061 127.111 406.749 127.111 406.749C127.111 406.749 104.091 405.337 90.1144 391.377C76.1379 377.394 70.4004 351.201 70.4004 351.201C70.4004 351.201 61.8062 297.401 61.8062 238.506C61.806 352.055 102.131 351.374 175.525 350.133C183.56 349.998 191.992 349.855 200.811 349.855H299.787C343.122 349.855 352.906 318.315 354.792 282.196L359.32 227.093C360.526 204.443 357.608 188.362 350.507 178.012C342.765 166.722 329.575 160.987 311.314 160.987C424.974 160.987 448.73 176.216 449.515 271.888Z";

export const WATERMARK_SIZE = 24;
export const WATERMARK_MARGIN = 14;

/** The logo as an SVG `<g>` of WATERMARK_SIZE², with its top-left at (x, y). */
export function watermarkGroup(x: number, y: number): string {
  const scale = WATERMARK_SIZE / 512;
  return (
    `<g transform="translate(${x},${y})" opacity="0.92">` +
    `<defs>` +
    `<linearGradient id="wmg0" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#05D2FF"/><stop offset=".4" stop-color="#1E88E5"/><stop offset="1" stop-color="#182FFF"/></linearGradient>` +
    `<linearGradient id="wmg1" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#24D8FF"/><stop offset=".4" stop-color="#1E88E5"/><stop offset="1" stop-color="#0046F9"/></linearGradient>` +
    `</defs>` +
    `<g transform="scale(${scale})"><path d="${LOGO_P0}" fill="url(#wmg0)"/><path d="${LOGO_P1}" fill="url(#wmg1)"/></g>` +
    `</g>`
  );
}

/** Bottom-right placement inside a width × height canvas. */
export function watermarkAt(width: number, height: number): string {
  return watermarkGroup(
    width - WATERMARK_SIZE - WATERMARK_MARGIN,
    height - WATERMARK_SIZE - WATERMARK_MARGIN,
  );
}
