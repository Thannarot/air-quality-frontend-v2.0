

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Dsk6Y6dS.js","_app/immutable/chunks/vendor.CUpO6_gn.js","_app/immutable/chunks/charts.LQfde5yM.js"];
export const stylesheets = ["_app/immutable/assets/vendor.PQhGu0kT.css"];
export const fonts = [];
