import * as d3 from "d3";

/**
 * Simple HTML List
 *
 */
export default function() {
	// HTML List Element (Populated by 'my' function)
	let listEl;

	// Default Options (Configurable via setters)
	let classed = "htmlList";

	// Dispatch (Custom events)
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Constructor
	 */
	function my(selection) {
		selection.each(function(data) {
			// Create HTML List 'ul' element (if it does not exist already)
			if (!listEl) {
				listEl = d3.select(this)
					.append("ul")
					.classed("d3ez", true)
					.classed(classed, true);
			} else {
				listEl.selectAll("*")
					.remove();
			}

			listEl.selectAll("li")
				.data(data)
				.enter()
				.append("li")
				.text(function(d) {
					return d.key;
				})
				.on("click", expand);

			function expand(d) {
				d3.event.stopPropagation();
				dispatch.call("customValueMouseOver", this, d);

				if (typeof d.values === "undefined") {
					return 0;
				}

				let ul = d3.select(this)
					.on("click", collapse)
					.append("ul");

				let li = ul.selectAll("li")
					.data(d.values)
					.enter()
					.append("li")
					.text(function(d) {
						if (typeof d.value !== "undefined") {
							return d.key + " : " + d.value;
						} else {
							return d.key;
						}
					})
					.on("click", expand);
			}

			function collapse() {
				d3.event.stopPropagation();
				d3.select(this)
					.on("click", expand)
					.selectAll("*")
					.remove();
			}

		});
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.classed = function(_) {
		if (!arguments.length) return classed;
		classed = _;
		return this;
	};

	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
