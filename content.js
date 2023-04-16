// are we yellowing?
let yellowing = false;

// compact the web page for screenshots
function compact() {
	[...document.querySelectorAll('*')].forEach((e) => {
		e.style.marginTop = "0px";
		e.style.marginBottom = "0px";
		e.style.paddingTop = "0px";
		e.style.paddingBottom = "0px";
		e.style.lineHeight = "";
		// PENDING: scrollbar, remove !important
	});
}

// KeyboardEvent handler
function onKeyUp(event) {
	if (event.altKey === true && event.code === 'KeyC') {
		compact();
	}
	if (event.altKey === true && event.code === 'KeyY') {
		yellowing = !yellowing; // toggle yellowing
	}
}

function highlight(element) {
	// highlight this element yellow
	const originalBackgroundColor = element.style.backgroundColor;
	element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	window.setTimeout(function () {
		element.style.backgroundColor = originalBackgroundColor;
	}, 100);
	// highlight the children elements yellow
	[...element.children].forEach((child) => highlight(child));
}

// MouseEvent handler
function onMouseOver(event) {
	if (yellowing) {
		highlight(event.target);
	}
}

// PointerEvent handler
function onClick(event) {
	if (yellowing) {
		if (event.target.style.backgroundColor === 'yellow') {
			event.target.style.backgroundColor = '';
		} else {
			event.target.style.backgroundColor = 'yellow';
		}
	}
}

if (window === top) {
	window.addEventListener('keyup', onKeyUp, false);
	window.addEventListener('mouseover', onMouseOver, false);
	window.addEventListener('click', onClick, false);
}
