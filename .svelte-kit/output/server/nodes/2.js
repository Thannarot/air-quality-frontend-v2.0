import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.DpqJbJIr.js","_app/immutable/chunks/vendor.BXmirdyd.js"];
export const stylesheets = ["_app/immutable/assets/2.D2IJNc6H.css","_app/immutable/assets/vendor.aG4qna1O.css"];
export const fonts = [];
