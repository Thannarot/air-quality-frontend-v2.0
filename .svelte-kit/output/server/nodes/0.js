

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.wRPA3OPE.js","_app/immutable/chunks/scheduler.z29CB46i.js","_app/immutable/chunks/index.3qLXtoSo.js"];
export const stylesheets = ["_app/immutable/assets/0.BwNxoGW8.css"];
export const fonts = [];
