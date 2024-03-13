import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.qA5JeBoX.js","_app/immutable/chunks/vendor.C3i2tAgf.js"];
export const stylesheets = ["_app/immutable/assets/2.C3l14tm1.css","_app/immutable/assets/vendor.aG4qna1O.css"];
export const fonts = [];
