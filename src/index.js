require("regenerator-runtime/runtime");
require("styles.scss");
// import "styles.scss";
class FourCorners {

	constructor(img, provenance, opts) {
		// this.elems = {
		// 	wrap: wrap
		// };
		// this.opts = opts;
		// const data = parseData(this);
		// this.strings = {};
		// this.onImgLoad = new Event("onImgLoad");
		// this.onImgFail = new Event("onImgFail");
		// this.initModule();
		this.provenance = provenance;

		this.c2paData = this.getC2paData();
		this.data = this.parseData();
		// console.log(this.data);
		


		// this.lang = data && data.lang ? data.lang : "en";
		this.strings = STRINGS[`en`];
		// this.photo = getPhoto(this, data);
		this.opts = Object.assign(DEFAULT_OPTS, opts);
		// this.opts = data ? Object.assign(this.opts, data.opts) : {};
		// this.content = {
		// 	authorship: data ? data.authorship : {},
		// 	backstory: data ? data.backstory : {},
		// 	imagery: data ? data.imagery : {},
		// 	links: data ? data.links : {},
		// };
		this.elems = {};
		this.elems.img = img;
		this.elems.wrap = this.addWrap();
		this.elems.panels = this.addPanels();
		this.elems.corners = this.addCorners();
		// this.elems.media = this.wrapMedia();
		// this.elems.cutline = this.addCutline();

		// const self = this;
		// Object.keys(this.elems.corners).forEach(function(cornerKey, i) {
		// 	let cornerElem = this.elems.corners[cornerKey];
		// 	if(this.opts.static || cornerElem.classList.contains("fc-interactive")) {
		// 		return;
		// 	}
		// 	cornerElem.addEventListener("mouseenter", this.hoverCorner.bind(self) );
		// 	cornerElem.addEventListener("mouseleave", this.unhoverCorner.bind(self) );
		// 	cornerElem.addEventListener("click", this.clickCorner.bind(self) );
		// 	cornerElem.classList.add("fc-interactive");
		// });

		CORNER_KEYS.forEach(key => {
			const panel = this.getPanel(key);
			panel.querySelector(".fc-expand").addEventListener("click", () => {
				this.toggleExpandPanel();
			});

			panel.querySelector(".fc-close").addEventListener("click", () => {
				this.closePanel(key);
				this.elems.wrap.classList.remove("fc-full");
			});
		});

	}

	getValue(key) {
		let value;
		const searchKeys = (obj, key) => {
			if(typeof obj !== "object") return;
			Object.keys(obj).forEach(k => {
				if(k === key) {
					return value = obj[k];
				}
				if(typeof obj[k] === "object") {
					return searchKeys(obj[k], key);
				}
			});
	 	}
	 	searchKeys(this.c2paData, key);
	 	return value;
	}

	getC2paData() {
		let c2paData;
		if(this.provenance) {
			this.provenance.claims.forEach((claim, key) => {
				c2paData = claim.assertions.get("org.fourcorners.context").data;
			});
		}
		return c2paData;
	}

	parseData() {

		const parseArray = (arr) => {
			if(arr) {
				arr = arr.map((obj) => {
					const newObj = {};
					const keys = Object.keys(obj).map((k, i) => {
						const splitArr = k.replace("fourcorners:","").split(/(?=[A-Z])/);
						const newKey = splitArr[splitArr.length - 1].toLowerCase();
						newObj[newKey] = obj[k];
					});
					return newObj;
				});
			}
			return arr;
		};

		const data = {
			"authorship": {
				"caption": this.getValue("fourcorners:authorshipCaption"),
				"credit": this.getValue("fourcorners:authorshipCredit"),
				"license": {
					"type": this.getValue("fourcorners:authorshipLicenseType"),
					"year": this.getValue("fourcorners:authorshipLicenseYear"),
					"holder": this.getValue("fourcorners:authorshipLicenseHolder"),
					"label": this.getValue("fourcorners:authorshipLicenseLabel"),
					"desc": this.getValue("fourcorners:authorshipLicenseDesc"),
					"url": this.getValue("fourcorners:authorshipLicenseUrl"),
				},
				"ethics": {
					"label": this.getValue("fourcorners:authorshipEthicsLabel"),
					"description": this.getValue("fourcorners:authorshipEthicsDescription"),
				},
				"bio": this.getValue("fourcorners:authorshipBio"),
				"website": this.getValue("fourcorners:authorshipWebsite"),
				"contactInfo": this.getValue("fourcorners:authorshipContactInfo"),
				"contactRights": this.getValue("fourcorners:authorshipContactRights"),
			},
			"backstory": {
				"text": this.getValue("fourcorners:backstoryText"),
				"media": parseArray(this.getValue("fourcorners:backstoryMedia")),
			},
			"imagery": {
				"media": parseArray(this.getValue("fourcorners:imageryMedia")),
			},
			"links": {
				"links": parseArray(this.getValue("fourcorners:linksLinks")),
			}
		};

		return data;

		// // const loopKeys = (obj, newData) => {
		// // 	let arr = [];
		// // 	if(typeof obj === "object") {
		// // 		arr = Object.keys(obj);
		// // 	} else if(typeof obj === "array") {
		// // 		arr = obj;
		// // 	} else {
		// // 		return;
		// // 	}
			
		// // 	arr.forEach(k => {
		// // 		if(k.includes("fourcorners")) {
		// // 			const keys = k.replace("fourcorners:","").split(/(?=[A-Z])/);
		// // 			console.log(keys);
		// // 			keys.forEach(k2 => {
		// // 				k2 = k2.charAt(0).toLowerCase() + k2.slice(1);
		// // 				if(!newData.hasOwnProperty(keys[0])) {
		// // 					newData[k2] = obj[k];
		// // 					console.log(obj[k], newData);
		// // 					// loopKeys(obj[k], newData);
		// // 				}
		// // 			});
					
		// // 			// if(k) {
		// // 			// 	return value = obj[k];
		// // 			// }
		// // 			// if(typeof obj[k] === "object") {
		// // 			// 	return loopKeys(obj[k], newData);
		// // 			// }
		// // 		} else {
		// // 			return newData;
		// // 		}
		// // 	});
		// // 	return newData;
		// // 	console.log(newData);
	 // 	}
	}

	addWrap() {
		const wrap = document.createElement("div");
		this.elems.img.parentNode.insertBefore(wrap, this.elems.img);
		wrap.appendChild(this.elems.img);
		wrap.classList.add("fc-embed");
		return wrap;
	}

	// setUpData(data) {
	

	// 	return this;
	// }


	// initModule() {
	// 	const self = this,
	// 				wrap = this.elems.wrap;
	// 	wrap.classList.add("fc-init");
	// 	if(this.opts.dark) {
	// 		wrap.classList.add("fc-dark");
	// 	}
	// 	if(this.opts.static) {
	// 		wrap.classList.add("fc-static");
	// 	} else {
	// 		wrap.addEventListener("click", function(e) {
	// 			const onPanels = isChildOf(e.target, this.getPanel());
	// 			const onCorners = isChildOf(e.target, this.elems.corners);
	// 			const inCreator = isChildOf(e.target, Array.from(document.querySelectorAll("#creator")));
	// 			if(!onPanels && !onCorners && !inCreator) {
	// 				this.closePanel();
	// 				this.elems.wrap.classList.remove("fc-full");
	// 			}
	// 		});
	// 	}
	// 	wrap.lang = this.lang;
	// 	if(["ar"].includes(this.lang)) {
	// 		wrap.dir = "rtl";
	// 	} else {
	// 		wrap.dir = "ltr";
	// 	}

	// 	window.addEventListener("resize", this.resizeModule.bind(this));
	// 	this.resizeModule();
	// }

	// updateModule(data) {
	// 	if(!data) {
	// 		const data = parseData(this);
	// 	}
	// 	this.setUpData(data);
	// 	this.initModule();
	// 	return this;
	// }

	getPanel(cornerKey) {
		return this.elems.wrap.querySelector(`.fc-panel[data-fc-key="${cornerKey}"]`);
	}

	openPanel(cornerKey) {
		const { elems } = this,
					{ wrap, corners, panels } = elems,
					corner = elems.corners[cornerKey],
					panel = this.getPanel(cornerKey);
		
		wrap.classList.remove("fc-full");
		wrap.classList.add("fc-active");
		wrap.setAttribute("data-fc-active", cornerKey);
		corner.classList.add("fc-active");
		panel.classList.add("fc-active");
		CORNER_KEYS.forEach(key => {
			if(key !== cornerKey) this.closePanel(key);
		});
	}

	closePanel(cornerKey) {
		const { elems } = this,
					{ wrap, corners, panels } = elems,
					corner = corners[cornerKey],
					panel = this.getPanel(cornerKey);
		
		wrap.classList.remove("fc-full", "fc-active");
		wrap.setAttribute("data-fc-active", "");
		corner.classList.remove("fc-active");
		panel.classList.remove("fc-active");
	}

	toggleExpandPanel() {
		this.elems.wrap.classList.toggle("fc-full");
	}

	hoverCorner(e) {
		let cornerElem = e.target;
		cornerElem.classList.add("fc-hover");
	}

	unhoverCorner(e) {
		let cornerElem = e.target;
		cornerElem.classList.remove("fc-hover");
	}

	clickCorner(e) {
		const cornerElem = e.target,
					cornerKey = cornerElem.getAttribute("data-fc-key"),
					activeKey = this.elems.wrap.getAttribute("data-fc-active");

		if(cornerKey === activeKey) {
			this.closePanel(cornerKey);	
		} else {
			this.openPanel(cornerKey);
		}	
	}

	addCorners() {
		const corners = {},
					{ data, strings, elems } = this,
					{ wrap } = elems;

		CORNER_KEYS.forEach(cornerKey => {
			const cornerTitle = strings[cornerKey] || null,
						cornerElem = document.createElement("div");

			cornerElem.setAttribute("data-fc-key", cornerKey);
			cornerElem.title = `View ${cornerTitle}`;
			cornerElem.classList.add("fc-corner", `fc-${cornerKey}`);

			const cornerIsEmpty = function() {
				if(data.hasOwnProperty(cornerKey)) {
					if(Object.keys(data[cornerKey]).length) return false;	
					return true;
				}	else {
					return true;
				}
			}();

			if(cornerIsEmpty) {
				cornerElem.classList.add("fc-empty");
			}

			wrap.appendChild(cornerElem);
			cornerElem.addEventListener("mouseenter", this.hoverCorner.bind(this) );
			cornerElem.addEventListener("mouseleave", this.unhoverCorner.bind(this) );
			cornerElem.addEventListener("click", this.clickCorner.bind(this) );
			cornerElem.classList.add("fc-interactive");

			corners[cornerKey] = cornerElem;
		});

		return corners;
	}

	addPanels() {	
		const { data, strings, elems } = this,
					{ wrap } = elems,
					panels = {};

		CORNER_KEYS.forEach(cornerKey => {
			const cornerTitle = strings[cornerKey] || null,
						panelData = data[cornerKey];

			let panelInner = "";

			switch(cornerKey) {
				case "authorship":
					panelInner = this.buildAuthorship();
					break;
				case "backstory":
					panelInner = this.buildBackstory();
					break;
				case "imagery":
					panelInner = this.buildImagery();
					break;
				case "links":
					panelInner = this.buildLinks();
					break;
			}
			const panelTile = strings[cornerKey];
			let panelClass = `fc-panel fc-${cornerKey}`;
		
			const panelHTML =
				`<div data-fc-key="${cornerKey}" class="${panelClass}">
					<div class="fc-panel-title">
						<span>${panelTile}</span>
						<div class="fc-icon fc-expand" title="Expand this panel"></div>
						<div class="fc-icon fc-close" title="Close this panel"></div>
					</div>
					<div class="fc-panel-title fc-pseudo">
						<span>${CORNER_KEYS.indexOf(cornerKey)}</span>
					</div>
					${panelInner ?
						`<div class="fc-scroll">
							<div class="fc-inner">
								${panelInner}
							</div>
						</div>`
					: ""}
				</div>`;
			elems.wrap.innerHTML += panelHTML;
			panels[cornerKey] = this.getPanel(cornerKey);
		});
		return panels;
	}

	buildAuthorship() {
		const { data } = this,
					panelData = data.authorship;

		let html, innerHtml = "";
		innerHtml +=
			panelData.caption ? 
			`<div class="fc-field">
				<em>${panelData.caption}</em>
			</div>` : "";

		const creditHtml = [];
		const hasCopyright = panelData.license.type === "copyright";

		if(panelData.licenseYear) {
			creditHtml.push(`<span>${panelData.license.year}</span>`);
		}

		if(panelData.credit) {
			creditHtml.push(`<span>${panelData.credit}${panelData.license.holder ? `/${panelData.license.holder}` : ""}</span>`);
		}

		innerHtml +=
			hasCopyright || panelData.credit ?
				`<div class="fc-field" data-fc-field="credit">
					<div class="fc-content">
						${hasCopyright ?
							`<div class="fc-copyright">
								${creditHtml.join("")}
							</div>`
						: `<div>${panelData.credit}</div>`}
					</div>
				</div>` : "";

		innerHtml +=
			panelData.license &&
			panelData.license.label &&
			panelData.license.type === "commons" ?
				`<div class="fc-field" data-fc-field="license">
					<span class="fc-label">${this.strings.license}</span>
					<span class="fc-content">
						${panelData.license.url ?
						`<a href="${panelData.license.url}" target="_blank">
							${panelData.license.label ? panelData.license.label : ""}
						</a>`
						: panelData.license.label ? panelData.license.label : ""}
					</span>
				</div>` : "";
				
		innerHtml +=
			panelData.ethics &&
			panelData.ethics.desc ?
				`<div class="fc-field" data-fc-field="ethics">
					<span class="fc-label">${this.strings.coe}</span>
					<span class="fc-content">${panelData.ethics.desc}</span>
				</div>` : "";
		
		innerHtml +=
			panelData.bio ?
			`<div class="fc-field">
				<span class="fc-label">${this.strings.bio}</span>
				${panelData.bio}
			</div>` : "";


		innerHtml +=
			panelData.website || panelData.contact.info || panelData.contact.rights ?
			`<div class="fc-field fc-contact">

				${panelData.website ?
				`<div class="fc-field fc-card">
					<div class="fc-label">${this.strings.website}</div>
					${this.createLink(panelData.website)}
				</div>`: ""}

				${panelData.contactInfo ?
				`<div class="fc-field fc-card">
					<div class="fc-label">${this.strings.info}</div>
					${this.createLink(panelData.contactInfo)}
				</div>`: ""}

				${panelData.contactRights ?
				`<div class="fc-field fc-card">
					<div class="fc-label">${this.strings.rights}</div>
					${this.createLink(panelData.contactRights)}
				</div>` : ""}

			</div>` : "";

		if(innerHtml.length) {
			html = `<div class="fc-row">${innerHtml}</div>`;
		}
		return html;
	}

	buildBackstory() {
		const { data } = this,
					panelData = data.backstory;

		let html = 
			`${panelData.text ?
			`<div class="fc-row">
				${this.wrapParagraphs(panelData.text)}
			</div>`: ""}
			${panelData.media && panelData.media.map((obj, i) => {
				this.wrapExternal(this, obj, "backstory", i);
				return (
					`<div class="fc-row">
						<div class="fc-media" data-fc-source="${obj.source}"></div>
						${obj.caption ? `<div class="fc-sub-caption">${obj.caption}</div>` : ""}
						${obj.credit ? `<div class="fc-sub-credit">${obj.credit}</div>` : ""}
					</div>`
				)
			}).join("")}`;

		return html;
	}

	buildImagery() {
		const { data, elems } = this,
					{ wrap } = elems,
					panelData = data.imagery;

		let html = 
			`${panelData.media && panelData.media.map((obj, index) => {
				const isExternal = ["selfagram", "youtube", "vimeo"].includes(obj.source);
				return (
					`<div class="fc-row">
						<div class="fc-media" data-fc-source="${obj.source}" data-fc-index="${index}">
							${this.buildMedia(obj, index)}
						</div>
						${obj.caption ? `<div class="fc-sub-caption">${obj.caption}</div>` : ""}
						${obj.credit ? `<div class="fc-sub-credit">${obj.credit}</div>` : ""}
						${isExternal ?
							`<div class="fc-sub-credit">
								${isExternal && obj.url ?
									`<a href="${obj.url}" target="_blank">
										View on ${this.extractRootDomain(obj.url)}
									</a>`
								: ""}
								${isExternal && !obj.url ?
									`View on ${this.extractRootDomain(obj.url)}`
								: ""}
							</div>`
						: ""}
					</div>`
				)
			}).join("")}`;
		return html;
	}

	buildLinks() {
		const { data, elems } = this,
					{ wrap } = elems,
					panelData = data.links;

		const html = 
			`${panelData.links &&
				panelData.links.filter(obj => obj.url).map((obj, index) => {
					const rootUrl = this.extractRootDomain(obj.url);
					const text = `${obj.title ? obj.title : rootUrl}<div class="fc-sub-url">${rootUrl}</div>`;
					return (
						`<div class="fc-row">
							${this.createLink(obj.url, text, ["fc-card"])}
						</div>`
					)
			}).join("")}`;

		return html;
	}

	buildMedia(obj, index) {
		const {source, url} = obj;
		if(source === "image") {
		  return `<img src="${url}" />`;
		  this.loadMedia(obj);
		}
	}

	// addPhoto() {
	// 	let photo, img,
	// 			self = this,
	// 			wrap = this.elems.wrap,
	// 			width = this.photo ? this.photo.width : "",
	// 			height = this.photo ? this.photo.height : "",
	// 			ratio = width/height,
	// 			imgSelector = ".fc-img";

	// 	wrap.style.paddingBottom = 100/ratio+"%";
	// 	img = wrap.querySelector(imgSelector);
	// 	if(!img) {
	// 		wrap.classList.add("fc-empty");
	// 	}

	// 	let pseudoImg = new Image;
	// 	wrap.classList.add("fc-loading");

	// 	pseudoImg.onload = (e) => {
	// 		wrap.style.paddingBottom = "";
	// 		wrap.classList.remove("fc-loading");
	// 		wrap.dispatchEvent(this.onImgLoad);
	// 	}
	// 	pseudoImg.onerror = (e) => {
	// 		wrap.classList.remove("fc-loading");
	// 		wrap.classList.add("fc-empty");
	// 		wrap.dispatchEvent(this.onImgFail);
	// 	}
	// 	pseudoImg.src = img ? img.src : "";

	// 	return img;
	// }

	// addCutline() {
	// 	const content = this.content.authorship;
	// 	if(!content&&!this.opts.caption&&!this.opts.credit&&!this.opts.logo) {return}
	// 	const data = this.content["authorship"];
	// 	if(!data) {return}
	// 	const wrap = this.elems.wrap;
	// 	const caption = this.opts.caption && content.caption ? `<span class="fc-caption">${content.caption}</span>`: "";
	// 	const credit = this.opts.credit && (content.credit||content.license.holder) ?
	// 		`<div class="fc-credit">
	// 			${(content.credit ? `<span>${content.credit}</span>` : "")+(content.license.holder ? `<span>${content.license.holder}</span>` : "")}
	// 		</div>`
	// 	: "";
	// 	const logo = this.opts.logo ? `<a href="https://fourcornersproject.org" target="_blank" class="fc-logo" title="This is a Four Corners photo"></a>`: "";
	// 	const cutline =
	// 		`<div class="fc-cutline">
	// 			${caption+credit+logo}
	// 		</div>`;
	// 	wrap.insertAdjacentHTML("afterend", cutline);
	// 	return cutline;
	// }

	// wrapMedia() {
	// 	const self = this,
	// 				imageryContent = this.content.imagery;
	// 	if(!imageryContent) {return}
	// 	const media = imageryContent.media;
	// 	if(!media) {return}
	// 	const mediaKeys = Object.keys(media);
	// 	mediaKeys.forEach(function(key, i) {
	// 		const obj = media[key];
	// 		if(obj.source == "image" || !obj.source) {
	// 			wrapImage(self, obj, "imagery", i);
	// 		} else {
	// 			wrapExternal(self, obj, "imagery", i);
	// 		}
	// 	});
	// }

	// resizeModule(e) {
	// 	const panels = this.getPanel();
	// 	if(!panels){return}
	// 	Object.keys(panels).forEach(function(cornerKey, i) {
	// 		resizePanel(panels[cornerKey]);
	// 	});
	// }


	// const getPhoto = (self, data) => {
	// 	if(data && data.photo && data.photo.src) {
	// 		return data.photo;
	// 	}
	// 	const img = this.elems.wrap ? this.elems.wrap.querySelector("img") : "",
	// 				imgSrc = img ? img.src : "";
	// 	return {
	// 		src: imgSrc
	// 	}
	// }

	// const resizePanel = (panel) => {
	// 	if(typeof panel.querySelector!=="function"){return}
	// 	const panelScroll = panel.querySelector(".fc-scroll");
	// 	if(!panelScroll){return}
	// 	if( panelScroll.scrollHeight > panelScroll.clientHeight ) {
	// 		panel.classList.add("fc-overflow");
	// 	} else {
	// 		panel.classList.remove("fc-overflow");
	// 	}
	// }

	// const createRow = (data, obj, includeLabel) => {
	// 	const label = includeLabel ? `<div class="fc-label">${obj.label}</div>` : "";
	// 	const content = data[obj.prop];
	// 	return data[obj.prop] ?
	// 		`<div class="fc-row">
	// 			${label}
	// 			${content}
	// 		</div>` : "";
	// }



	

	


	// const wrapImage = (self, obj, panelKey, index) => {
	// 	if(!obj.url){ return }
	// 	const pseudoImg = new Image();
	// 	pseudoImg.onload = (e) => {
	// 		const img = `<img src="${obj.url}"/>`;
	// 		const panel = this.elems.panels[panelKey];
	// 		let media = panel.querySelectorAll(".fc-media")[index];
	// 		media.innerHTML += img;
	// 	}
	// 	pseudoImg.src = obj.url;
	// 	return;
	// }

	wrapExternal(self, obj, panelKey, index) {
		//requests third party APIs to retrieve wrap data
		let req = "";
		switch(obj.source) {
			case "youtube":
				req = "https://nowrap.com/wrap?url="+obj.url;
				break;
			case "vimeo":
				req = "https://vimeo.com/api/owrap.json?url="+obj.url;
				break;
			case "soundcloud":
				req = "https://soundcloud.com/owrap?format=json&url="+obj.url;
				break;
			case "selfagram":
				req = "https://api.selfagram.com/owrap/?url="+obj.url;
				break;
			default:
				return false;
				break;
		}
		const headers = new Headers();
		fetch(req, {
				method: "GET",
				headers: headers
			})
			.then(res => {
				if (!res.ok) {throw Error(res.statusText)}
				return res.json();
			})
			.then(res => {
				const panel = this.elems.panels[panelKey];
				let subMedia = panel.querySelectorAll(".fc-media")[index],
						html = "";
				if(obj.source == "selfagram") {
					html = `<img src="${res.thumbnail_url}"/>`;
				} else {
					html = res.html;
				}

				if(Number.isInteger(res.width, res.height)) {
					const ratio = res.height/res.width;
					subMedia.classList.add("fc-responsive")
					subMedia.style.paddingBottom = (ratio*100)+"%";
				}
				subMedia.innerHTML = html;
			})
			.catch(function(err) {
				console.warn("Four Corners cannot load this media source: "+obj.url, err);
			});
	}

	// const parseData = (self) => {
	// 	if(!this.elems||!this.elems.wrap) {return}
	// 	const wrap = this.elems.wrap,
	// 				scriptTag = wrap.querySelector("script");
	// 	let stringData;
	// 	if(scriptTag) {
	// 		//If wrap JSON is stored in child script tag (NEW)
	// 		stringData = scriptTag.innerHTML;
	// 		scriptTag.remove();
	// 	} else if(wrap.hasAttribute("data-fc")) {
	// 		//If wrap JSON is stored in data-fc attributte (OLD)
	// 		stringData = wrap.dataset.fc;
	// 		delete wrap.dataset.fc;
	// 	}
	// 	if(!stringData){
	// 		return
	// 	}
	// 	return JSON.parse(stringData);
	// }

	// const isChildOf = (target, ref) => {
	// 	let answer = false;
	// 	Object.entries(ref).forEach(([key, elem]) => {
	// 		if(elem&&elem.contains&&elem.contains(target)) {
	// 			answer = true;
	// 		}
	// 	});
	// 	return answer;
	// }

	wrapParagraphs(val) {
		let array = val.split(/\n/g);
		let text = [];
		let html = 
			array ?
			`${array.map((str,i) => {
				return str ? `<p>${str}</p>` : `<br/>`
			}).join("")}`
			: "";
		return html;
	}

	createLink(href, text, classes = []) {
		if(!text) {
			text = this.extractRootDomain(href);
		}
		//Needs better validatoor 
		if(href.indexOf("@") > -1) {
			href = `mailto:${href}`;
		}
		return `<a href="${href}" target="_blank" class="${classes.join(" ")}">${text}</a>`;
	}

	extractHostname(url) {
		let hostname;
		if(!url) return null;
		if(url.indexOf("//") > -1) {
			hostname = url.split("/")[2];
		} else {
			hostname = url.split("/")[0];
		}
		hostname = hostname.split(":")[0];
		hostname = hostname.split("?")[0];
		return hostname;
	}

	extractRootDomain(url) {
		if(!url) return null;
		let domain = this.extractHostname(url);
		let splitArr = domain.split(".");
		let arrLen = splitArr.length;
		if (arrLen > 2) {
			domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
			if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
				domain = splitArr[arrLen - 3] + "." + domain;
			}
		}
		return domain;
	}

	// const hasField = (data, fieldKey, subFieldKey) => {
	// 	if(!data){return false}
	// 	if(!data[fieldKey]){return false}
	// 	if(typeof data[fieldKey] == "object") {
	// 		if(!Object.keys(data[fieldKey]).length){return false}	
	// 	} else {
	// 		if(!data[fieldKey].length){return false}	
	// 	}
	// 	if(!subFieldKey||!data[fieldKey][subFieldKey]){return false}
	// 	if(typeof data[fieldKey][subFieldKey] == "object") {
	// 		if(!Object.keys(data[fieldKey][subFieldKey]).length){return false}	
	// 	} else {
	// 		if(!data[fieldKey][subFieldKey].length){return false}	
	// 	}
	// 	return true;
	// }
}

const CORNER_KEYS = [
	"authorship",
	"backstory",
	"imagery",
	"links"
];

const STRINGS = {
	en: {
		authorship: "Authorship",
		backstory: "Backstory",
		imagery: "Related Imagery",
		links: "Links",
		license: "License",
		coe: "Code of ethics",
		bio: "Bio",
		website: "Website",
		info: "For more info",
		rights: "For reproduction rights",
	},
	ar: {
		authorship: "التأليف",
		backstory: "القصة وراء الصورة ",
		imagery: "الصور ذات الصلة",
		links: "الروابط",
		license: "الترخيص",
		coe: "ميثاق أخلاقيات",
		bio: "السيرة الذاتية",
		website: "الموقع الكتروني",
		info: "لمزيد من المعلومات",
		rights: "للحصول على حقوق النسخ",
	}
}

const DEFAULT_OPTS = {
	selector: "img",
	static: false,
	caption: false,
	credit: false,
	logo: false,
	active: "",
};

module.exports = FourCorners;