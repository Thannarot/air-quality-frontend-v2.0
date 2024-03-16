export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","assets/.DS_Store","assets/img/.DS_Store","assets/img/bg/satellite-inside.png","assets/img/button/btn-control-decrease-active.svg","assets/img/button/btn-control-decrease-hover.svg","assets/img/button/btn-control-decrease.svg","assets/img/button/btn-control-increase-active.svg","assets/img/button/btn-control-increase-hover.svg","assets/img/button/btn-control-increase.svg","assets/img/button/btn-next-active.svg","assets/img/button/btn-next-hover.svg","assets/img/button/btn-next.svg","assets/img/button/btn-prev-active.svg","assets/img/button/btn-prev-hover.svg","assets/img/button/btn-prev.svg","assets/img/classic-basemap.png","assets/img/dark-basemap.png","assets/img/exam/color.jpg","assets/img/exam/map.jpg","assets/img/exam/thumb-map-1.png","assets/img/exam/thumb-map-2.png","assets/img/exam/thumb-map-3.png","assets/img/exam/thumb-map-4.png","assets/img/icon/arrow__down.svg","assets/img/icon/base-map.svg","assets/img/icon/circle__black.svg","assets/img/icon/circle__green.svg","assets/img/icon/circle__white.svg","assets/img/icon/close.svg","assets/img/icon/head-air-quality.svg","assets/img/icon/head-analysis.svg","assets/img/icon/head-fire-product.svg","assets/img/icon/head-graph.svg","assets/img/icon/head-ground-station.svg","assets/img/icon/head-information.svg","assets/img/icon/head-statistics-map.svg","assets/img/icon/icon-analysis.svg","assets/img/icon/icon-home.svg","assets/img/icon/icon-minus.svg","assets/img/icon/icon-plus.svg","assets/img/icon/icon-tool-1.svg","assets/img/icon/icon-tool-2.svg","assets/img/icon/icon-tool-3.svg","assets/img/icon/icon-tool-4.svg","assets/img/icon/icon-tool-5.svg","assets/img/icon/icon-ugm-1.svg","assets/img/icon/icon-ugm-2.svg","assets/img/icon/icon-ugm-3.svg","assets/img/icon/lang-en.png","assets/img/icon/lang-en.svg","assets/img/icon/lang-th.png","assets/img/icon/lang-th.svg","assets/img/icon/logo__adpc.png","assets/img/icon/logo__nasa.png","assets/img/icon/logo__servir-mekong.png","assets/img/icon/logo__usaid.png","assets/img/icon/radio-active.svg","assets/img/icon/radio-hover.svg","assets/img/icon/radio.svg","assets/img/icon/th.svg","assets/img/light-basemap.png","assets/img/wind-basemap.png","assets/js/caleran-date-range-picker/caleran-date-range-picker.scss","assets/js/caleran-date-range-picker/caleran.js","assets/js/caleran-date-range-picker/caleran.min.js","assets/js/caleran-date-range-picker/jquery.hammer.js","assets/js/caleran-date-range-picker/moment.min.js","assets/js/common.js","assets/js/jquery-3.7.1.min.js","assets/js/jquery.accordion.js","assets/js/nice-select2.js","assets/js/select2/css/select2.css","assets/js/select2/css/select2.min.css","assets/js/select2/js/i18n/af.js","assets/js/select2/js/i18n/ar.js","assets/js/select2/js/i18n/az.js","assets/js/select2/js/i18n/bg.js","assets/js/select2/js/i18n/bs.js","assets/js/select2/js/i18n/ca.js","assets/js/select2/js/i18n/cs.js","assets/js/select2/js/i18n/da.js","assets/js/select2/js/i18n/de.js","assets/js/select2/js/i18n/dsb.js","assets/js/select2/js/i18n/el.js","assets/js/select2/js/i18n/en.js","assets/js/select2/js/i18n/es.js","assets/js/select2/js/i18n/et.js","assets/js/select2/js/i18n/eu.js","assets/js/select2/js/i18n/fa.js","assets/js/select2/js/i18n/fi.js","assets/js/select2/js/i18n/fr.js","assets/js/select2/js/i18n/gl.js","assets/js/select2/js/i18n/he.js","assets/js/select2/js/i18n/hi.js","assets/js/select2/js/i18n/hr.js","assets/js/select2/js/i18n/hsb.js","assets/js/select2/js/i18n/hu.js","assets/js/select2/js/i18n/hy.js","assets/js/select2/js/i18n/id.js","assets/js/select2/js/i18n/is.js","assets/js/select2/js/i18n/it.js","assets/js/select2/js/i18n/ja.js","assets/js/select2/js/i18n/km.js","assets/js/select2/js/i18n/ko.js","assets/js/select2/js/i18n/lt.js","assets/js/select2/js/i18n/lv.js","assets/js/select2/js/i18n/mk.js","assets/js/select2/js/i18n/ms.js","assets/js/select2/js/i18n/nb.js","assets/js/select2/js/i18n/nl.js","assets/js/select2/js/i18n/pl.js","assets/js/select2/js/i18n/ps.js","assets/js/select2/js/i18n/pt-BR.js","assets/js/select2/js/i18n/pt.js","assets/js/select2/js/i18n/ro.js","assets/js/select2/js/i18n/ru.js","assets/js/select2/js/i18n/sk.js","assets/js/select2/js/i18n/sl.js","assets/js/select2/js/i18n/sr-Cyrl.js","assets/js/select2/js/i18n/sr.js","assets/js/select2/js/i18n/sv.js","assets/js/select2/js/i18n/th.js","assets/js/select2/js/i18n/tk.js","assets/js/select2/js/i18n/tr.js","assets/js/select2/js/i18n/uk.js","assets/js/select2/js/i18n/vi.js","assets/js/select2/js/i18n/zh-CN.js","assets/js/select2/js/i18n/zh-TW.js","assets/js/select2/js/select2.full.js","assets/js/select2/js/select2.full.min.js","assets/js/select2/js/select2.js","assets/js/select2/js/select2.min.js","assets/js/slick/ajax-loader.gif","assets/js/slick/config.rb","assets/js/slick/fonts/slick.eot","assets/js/slick/fonts/slick.svg","assets/js/slick/fonts/slick.ttf","assets/js/slick/fonts/slick.woff","assets/js/slick/slick-theme.css","assets/js/slick/slick-theme.less","assets/js/slick/slick-theme.scss","assets/js/slick/slick.css","assets/js/slick/slick.js","assets/js/slick/slick.less","assets/js/slick/slick.min.js","assets/js/slick/slick.scss","assets/js/time-slde.js","assets/js/windy.js","assets/scss/_mixins.scss","assets/scss/_root.scss","assets/scss/_variables.scss","assets/scss/button.scss","assets/scss/color.scss","assets/scss/fix-bootstrap.scss","assets/scss/fix-select2.scss","assets/scss/fix-slick.scss","assets/scss/font.scss","assets/scss/form.scss","assets/scss/general.scss","assets/scss/layout.scss","assets/scss/popup.scss","assets/scss/style.scss","assets/scss/template.scss","assets/styles/bower_component.css","assets/styles/button.css","assets/styles/button.css.map","assets/styles/color.css","assets/styles/color.css.map","assets/styles/fix-bootstrap.css","assets/styles/fix-select2.css","assets/styles/fix-select2.css.map","assets/styles/fix-slick.css","assets/styles/fix-slick.css.map","assets/styles/font.css","assets/styles/font.css.map","assets/styles/form.css","assets/styles/form.css.map","assets/styles/general.css","assets/styles/general.css.map","assets/styles/index.css","assets/styles/layout.css","assets/styles/layout.css.map","assets/styles/nice-select2.css","assets/styles/popup.css","assets/styles/popup.css.map","assets/styles/style.css","assets/styles/style.css.map","assets/styles/tailwind.css","assets/styles/template.css","assets/styles/template.css.map","assets/var_info.txt","assets/vendor/@fortawesome/fontawesome-free/css/all.min.css","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-brands-400.eot","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-brands-400.svg","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-regular-400.eot","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-regular-400.svg","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-solid-900.eot","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-solid-900.svg","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff","assets/vendor/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2","build/bundle.js","build/bundle.js.map","favicon.png","logo/adpc.png","logo/nasa.png","logo/satellite-inside.png","logo/servir-sea.png","logo/usaid.png"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".jpg":"image/jpeg",".js":"text/javascript",".css":"text/css",".gif":"image/gif",".ttf":"font/ttf",".woff":"font/woff",".less":"text/less",".map":"application/json",".txt":"text/plain",".woff2":"font/woff2"},
	_: {
		client: {"start":"_app/immutable/entry/start.CU1p7EBU.js","app":"_app/immutable/entry/app.DEgJg8ia.js","imports":["_app/immutable/entry/start.CU1p7EBU.js","_app/immutable/chunks/vendor.BQQJiCKj.js","_app/immutable/entry/app.DEgJg8ia.js","_app/immutable/chunks/vendor.BQQJiCKj.js"],"stylesheets":["_app/immutable/assets/vendor.aG4qna1O.css","_app/immutable/assets/vendor.aG4qna1O.css"],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			{
				id: "/svelte-api/get_chart_data",
				pattern: /^\/svelte-api\/get_chart_data\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/svelte-api/get_chart_data/_server.js'))
			},
			{
				id: "/svelte-api/get_station",
				pattern: /^\/svelte-api\/get_station\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/svelte-api/get_station/_server.js'))
			},
			{
				id: "/svelte-api/latest_date",
				pattern: /^\/svelte-api\/latest_date\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/svelte-api/latest_date/_server.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
