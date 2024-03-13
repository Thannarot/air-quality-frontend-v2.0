import { S as SvelteComponent, i as init, s as safe_not_equal, c as create_slot, e as element, a as space, b as claim_element, d as children, g as get_svelte_dataset, f as claim_space, h as detach, j as attr, k as insert_hydration, l as append_hydration, m as listen, u as update_slot_base, n as get_all_dirty_from_scope, o as get_slot_changes, t as transition_in, p as transition_out } from "../chunks/vendor.CUpO6_gn.js";
function create_fragment(ctx) {
  let div15;
  let div7;
  let textContent = `<div class="row no-gutters align-items-center justify-content-between"><div class="col-auto"><div class="row no-gutters align-items-center"><div class="col-auto"><a href="#"><img class="d-block usaid" src="assets/img/icon/logo__usaid.png" alt=""/></a></div> <div class="col-auto"><a href="#"><img class="d-block nasa" src="assets/img/icon/logo__nasa.png" alt=""/></a></div> <div class="col-auto"><a href="#"><img class="d-block adpc" src="assets/img/icon/logo__adpc.png" alt=""/></a></div></div></div> <div class="col-auto"><a href="#"><img class="d-block servir-mekong" src="assets/img/icon/logo__servir-mekong.png" alt=""/></a></div></div>`;
  let t3;
  let div14;
  let p0;
  let textContent_1 = "MEKONG AIR QUALITY EXPLORER";
  let t5;
  let div13;
  let div9;
  let textContent_2 = `<div id="nav__main"><ul class="list"><li><a href="https://servir.adpc.net/tools/mekong-air-quality-explorer">Home</a></li></ul></div>`;
  let t7;
  let div12;
  let div11;
  let textContent_3 = `<a id="lang-btn" class="btn-toggle d-flex"><p class="text white text-xs font-light rounded-pill mb-0 px-15">LANGUAGE</p> <p class="flag d-flex align-items-center justify-content-center rounded-pill mb-0"><img src="assets/img/icon/lang-en.png" alt=""/> <img style="display: none;" src="assets/img/icon/lang-th.png" alt=""/></p></a> <div id="lang-options" class="info py-15 px-1"><a href="#" class="d-block text-xs px-15 rounded-pill w-100 link mb-1 active">ENGLISH <img src="assets/img/icon/lang-en.png" alt=""/></a> <a href="#" class="d-block text-xs px-15 rounded-pill w-100 link">THAI <img src="assets/img/icon/lang-th.png" alt=""/></a></div>`;
  let t15;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[1].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    null
  );
  return {
    c() {
      div15 = element("div");
      div7 = element("div");
      div7.innerHTML = textContent;
      t3 = space();
      div14 = element("div");
      p0 = element("p");
      p0.textContent = textContent_1;
      t5 = space();
      div13 = element("div");
      div9 = element("div");
      div9.innerHTML = textContent_2;
      t7 = space();
      div12 = element("div");
      div11 = element("div");
      div11.innerHTML = textContent_3;
      t15 = space();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div15 = claim_element(nodes, "DIV", { id: true });
      var div15_nodes = children(div15);
      div7 = claim_element(div15_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div7) !== "svelte-h2xnh8")
        div7.innerHTML = textContent;
      t3 = claim_space(div15_nodes);
      div14 = claim_element(div15_nodes, "DIV", { class: true });
      var div14_nodes = children(div14);
      p0 = claim_element(div14_nodes, "P", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(p0) !== "svelte-1coygzk")
        p0.textContent = textContent_1;
      t5 = claim_space(div14_nodes);
      div13 = claim_element(div14_nodes, "DIV", { class: true });
      var div13_nodes = children(div13);
      div9 = claim_element(div13_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div9) !== "svelte-1sfe169")
        div9.innerHTML = textContent_2;
      t7 = claim_space(div13_nodes);
      div12 = claim_element(div13_nodes, "DIV", { class: true });
      var div12_nodes = children(div12);
      div11 = claim_element(div12_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div11) !== "svelte-1dcpx0m")
        div11.innerHTML = textContent_3;
      div12_nodes.forEach(detach);
      div13_nodes.forEach(detach);
      div14_nodes.forEach(detach);
      div15_nodes.forEach(detach);
      t15 = claim_space(nodes);
      if (default_slot)
        default_slot.l(nodes);
      this.h();
    },
    h() {
      attr(div7, "class", "banner-container");
      attr(p0, "class", "title-page");
      attr(div9, "class", "col-auto");
      attr(div11, "class", "box__language");
      attr(div12, "class", "col-auto");
      attr(div13, "class", "row no-gutters align-items-center justify-content-between h-100");
      attr(div14, "class", "nav-container");
      attr(div15, "id", "header");
    },
    m(target, anchor) {
      insert_hydration(target, div15, anchor);
      append_hydration(div15, div7);
      append_hydration(div15, t3);
      append_hydration(div15, div14);
      append_hydration(div14, p0);
      append_hydration(div14, t5);
      append_hydration(div14, div13);
      append_hydration(div13, div9);
      append_hydration(div13, t7);
      append_hydration(div13, div12);
      append_hydration(div12, div11);
      insert_hydration(target, t15, anchor);
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
      if (!mounted) {
        dispose = listen(div11, "click", showLanguageOptions);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div15);
        detach(t15);
      }
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function showLanguageOptions() {
  document.querySelectorAll("#lang-btn").forEach((el) => el.classList.add("active"));
  document.querySelectorAll("#lang-options").forEach((el) => el.style.display = "block");
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(0, $$scope = $$props2.$$scope);
  };
  return [$$scope, slots];
}
class Layout extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Layout as component
};
