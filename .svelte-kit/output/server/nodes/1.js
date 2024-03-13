

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Dnc5fZ8h.js","_app/immutable/chunks/vendor.C3i2tAgf.js"];
export const stylesheets = ["_app/immutable/assets/vendor.aG4qna1O.css"];
export const fonts = [];
