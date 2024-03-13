import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.BK0BFYmX.js","_app/immutable/chunks/vendor.CUpO6_gn.js","_app/immutable/chunks/charts.LQfde5yM.js"];
export const stylesheets = ["_app/immutable/assets/2.C0igZa6i.css","_app/immutable/assets/vendor.PQhGu0kT.css"];
export const fonts = [];
