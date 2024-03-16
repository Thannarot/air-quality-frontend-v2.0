import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BTgR_qfG.js","_app/immutable/chunks/vendor.BQQJiCKj.js"];
export const stylesheets = ["_app/immutable/assets/0.B9cpfkw5.css","_app/immutable/assets/vendor.aG4qna1O.css"];
export const fonts = [];
