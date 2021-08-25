// snap to margin
var margin = 0.10; // 10%

// returns true if the specified value is within margin of target
function within(value, margin /*[0,1]*/, target) {
	var low = (target * (1 - margin));
	var high = (target * (1 + margin));
	return (value >= low && value <= high);
}

chrome.browserAction.onClicked.addListener(function(tab) {
	var sizes = [
		// 4:3 ratio
		// { width: 640,  height: 480  },
		// { width: 800,  height: 600  },
		// { width: 1024, height: 768  },
		{ width: 1280, height: 960  },
		{ width: 1600, height: 1200 },
		{ width: 2048, height: 1536 },
	];
	// current size ?
	var i = sizes.findIndex(s => within(tab.width, margin, s.width) && within(tab.height, margin, s.height));
	// next size ?
	var next;
	if (i === -1 || i === sizes.length - 1) {
		// default size
		next = sizes[0];
	} else {
		// next size up
		next = sizes[i + 1];
	}
	// resize
	chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, { width: next.width, height: next.height });
});
