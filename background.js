// list of common resolutions
// https://en.wikipedia.org/wiki/List_of_common_resolutions#/media/File:Vector_Video_Standards.svg
const resolutions = [
	// 4:3 ratios
	{ width: 640,  height: 480  },
	{ width: 800,  height: 600  },
	{ width: 1024, height: 768  },
	{ width: 1280, height: 960  },
	{ width: 1600, height: 1200 },
	{ width: 2048, height: 1536 },
];

// default resolution
const default_resolution = 1;

// snap to margin
const margin = 0.10; // 10%

// returns true if the specified value is within margin of target
function within(value, margin /*[0,1]*/, target) {
	const low = (target * (1 - margin));
	const high = (target * (1 + margin));
	return (value >= low && value <= high);
}

// find this Chrome window's closest resolution from the array of resolutions, and returns the array index
function get_closest_resolution(window) {
	return resolutions.findIndex((s) => within(window.width, margin, s.width));
}

// deep copy the specified object
function deep_copy(o) {
	return JSON.parse(JSON.stringify(o));
}

// resize this Chrome window in the specified direction, up or down
function resize(command) {
	chrome.windows.getCurrent(window => {
		// current resolution?
		const i = get_closest_resolution(window);
		// next resolution?
		let resolution;
		if (i === -1) {
			// default
			resolution = deep_copy({...resolutions[default_resolution]});
		} else {
			if (command === "resize_smaller") {
				if (i === 0) {
					// rollover
					resolution = deep_copy(resolutions[resolutions.length - 1]);
				} else {
					// smaller
					resolution = resolutions[i - 1];
				}
			} else if (command === "resize_bigger") {
				if (i === resolutions.length - 1) {
					// rollover
					resolution = resolutions[0];
				} else {
					// bigger
					resolution = resolutions[i + 1];
				}
			} else if (command === "resize_higher") {
				resolution = resolutions[i];
				resolution.height += 50;
			} else if (command === "resize_shorter") {
				resolution = resolutions[i];
				resolution.height -= 50;
			}
		}
		// resize
		chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, { width: resolution.width, height: resolution.height });
	});
}

chrome.commands.onCommand.addListener((command) => {
	resize(command);
});