

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BG4A8z84.js","_app/immutable/chunks/vendor.BXmirdyd.js"];
export const stylesheets = ["_app/immutable/assets/vendor.aG4qna1O.css"];
export const fonts = [];
