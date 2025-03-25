// are we yellowing?
let yellowing = false;

// how much to compact?
let compact_factor = 0;

// polyfill or error `$x is not defined`
// https://codereview.stackexchange.com/a/237631
function xpath(expression, context) {
	var result = document.evaluate(expression, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	return Array.from({ length: result.snapshotLength }, (_, i) => result.snapshotItem(i));
}

// compact the web page for screenshots
function compact() {
	console.log('compact_factor', compact_factor);
	if (compact_factor >= 0) {
		document.body.style.overflow = 'visible';
	}
	if (compact_factor >= 1) {
		document.body.style.setProperty('overflow', 'visible', 'important');
	}
	if (compact_factor >= 2) {
		xpath('//br', document).forEach((e) => e.remove());
	}
	if (compact_factor >= 3) {
		xpath('//img', document).forEach((e) => e.width /= 2);
		[...document.querySelectorAll('svg')].forEach((e) => {
			// e.style.transform = `scale(${1 / 2**(compact_factor - 2)})`;
			e.style.width = e.getBoundingClientRect().width / 2 + "px";
			e.style.height = e.getBoundingClientRect().height / 2 + "px";
		});
	}
	[...document.querySelectorAll('*')].forEach((e) => {
		if (compact_factor >= 0) {
			e.style.marginTop = '0px';
			e.style.marginBottom = '0px';
			e.style.paddingTop = '0px';
			e.style.paddingBottom = '0px';
		}
		if (compact_factor >= 1) {
			e.style.lineHeight = '1em'; // PENDING: or empty string ""
			e.style.fontSize = '1em';
			e.style.justifyContent = 'normal';
			e.style.height = 'fit-content'; // or min-content
		}
		if (compact_factor >= 2) {
			e.style.setProperty('margin-top', '0px', 'important');
			e.style.setProperty('margin-bottom', '0px', 'important');
			e.style.setProperty('padding-top', '0px', 'important');
			e.style.setProperty('padding-bottom', '0px', 'important');
			e.style.setProperty('line-height', '1em', 'important');
			e.style.setProperty('font-size', '1em', 'important');
			e.style.setProperty('justify-content', 'normal', 'important');
			e.style.setProperty('height', 'fit-content', 'important');
		}
	});
	compact_factor++;
}

// KeyboardEvent handler
function onKeyUp(event) {
	if (event.altKey === true && event.code === 'KeyC') {
		compact();
	}
	if (event.altKey === true && event.code === 'KeyY') {
		yellowing = !yellowing; // toggle yellowing
	}
	if (event.altKey === true && event.code === 'KeyG') {
		// grayscale the last clicked element (remember to click the element)
		if (lastMouseClick) {
			grayscale_all_but(lastMouseClick);
		}
	}
}

// highlight the specified element yellow
// press ALT+Y to start highlighting elements on mouse over to find the desired element, press ALT+Y again to stop
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

// grayscale the entire page except the specified element
// solution by ChatGPT
function grayscale_all_but(element) {
	// Apply grayscale filter to all elements
	Array.from(document.querySelectorAll('body *')).forEach((e) => {
		e.style.filter = 'grayscale(100%)';
	});
	// Function to remove filter from an element
	function removeFilter(e) {
		e.style.filter = 'none';
	}
	// Remove filter from the specified element
	removeFilter(element);
	// Remove filter from all descendants of the specified element
	Array.from(element.querySelectorAll('*')).forEach(removeFilter);
	// Remove filter from all ancestors of the specified element
	let parent = element.parentElement;
	while (parent != null) {
		removeFilter(parent);
		parent = parent.parentElement;
	}
}

// MouseEvent handler
function onMouseOver(event) {
	if (yellowing) {
		highlight(event.target);
	}
}

// PointerEvent handler
let lastMouseClick;
function onMousedown(event) {
	lastMouseClick = event.target;
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
	window.addEventListener('mousedown', onMousedown, false);
}
