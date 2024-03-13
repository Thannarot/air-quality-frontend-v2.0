import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.B1TctD2z.js","_app/immutable/chunks/scheduler.z29CB46i.js","_app/immutable/chunks/index.3qLXtoSo.js","_app/immutable/chunks/index.Bz_6iSah.js"];
export const stylesheets = ["_app/immutable/assets/2.xf1e7-6p.css"];
export const fonts = [];
