

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CH_laB3q.js","_app/immutable/chunks/vendor.C3i2tAgf.js"];
export const stylesheets = ["_app/immutable/assets/0.BwNxoGW8.css","_app/immutable/assets/vendor.aG4qna1O.css"];
export const fonts = [];
