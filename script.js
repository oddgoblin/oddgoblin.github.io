var scrollIntervalID = undefined;

function init() {
	var anchorLinks = document.getElementsByClassName("anchor-link");
	for (var link of anchorLinks) {
		link.addEventListener("click", navHandler.bind(null, link));
	}
	document.addEventListener("scroll", onScroll);
	document.addEventListener("wheel", onWheel);
	document.getElementById("menu-button").addEventListener("click", function() {
		document.body.classList.toggle("menu-open");
	});
	onScroll(null);
}

function navHandler(navItem, event) {
	var position = document.getElementById(navItem.hash.substr(1)).offsetTop;
	scrollTo(position);
	document.body.classList.remove("menu-open");
	event.preventDefault();
}

function onScroll(event) {
	var current = null;
	var center = window.scrollY + window.innerHeight / 2;
	var pages = document.getElementsByClassName("page");
	for (var page of pages) {
		var navItem = document.getElementById("nav-" + page.id);
		if (current === null && center <= page.offsetTop + page.offsetHeight) {
			navItem.classList.add("current");
			current = page;
		} else {
			navItem.classList.remove("current");
		}
	}
	if (current.classList.contains("dark-page")) {
		document.body.classList.add("on-dark-page");
	} else {
		document.body.classList.remove("on-dark-page");
	}
	if (location.hash !== "#" + current.id) {
		history.pushState(null, "", "#" + current.id);
	}
}

function onWheel(event) {
	if (scrollIntervalID !== undefined) {
		event.preventDefault();
		return;
	}
	var pages = document.getElementsByClassName("page");
	var top = window.scrollY;
	var bottom = top + window.innerHeight;
	if (event.deltaY < 0) {
		for (var page of pages) {
			// -1 is to account for rounding errors due to zoom in browsers.
			if (top - 1 <= page.offsetTop && page.offsetTop < bottom - 1) {
				var prev = page.previousElementSibling;
				console.log(prev, "prev");
				if (prev) {
					scrollTo(prev.offsetTop + prev.offsetHeight - window.innerHeight);
					event.preventDefault();
				}
				return;
			}
		}
	} else if (event.deltaY > 0) {
		for (var page of pages) {
			if (top + 1 < page.offsetTop && page.offsetTop <= bottom + 1) {
				var next = page.nextElementSibling;
				console.log(next, "next");
				if (page) {
					scrollTo(page.offsetTop);
					event.preventDefault();
				}
				return;
			}
		}
	}
}

function scrollTo(position) {
	scrollIntervalID = setInterval(smoothScroll, 1000/60,
		Date.now(), 400, window.scrollY, position);
}

function smoothScroll(startTime, duration, start, end) {
	var t = Date.now() - startTime;
	if (t >= duration) {
		clearInterval(scrollIntervalID);
		scrollIntervalID = undefined;
		window.scroll(window.scrollX, end);
	} else {
		var p = (Date.now() - startTime) / duration;
		//  newPos = start + { distance  } * {1-1-0-0 Bezier curve}
		var newPos = start + (end - start) * (p*p*p + 3*p*p*(1-p));
		window.scroll(window.scrollX, newPos);
	}
}

document.addEventListener("DOMContentLoaded", init);
