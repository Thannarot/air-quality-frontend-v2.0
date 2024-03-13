import * as d3 from 'd3';
export function getLegend(colorPalettes, trickValues, valueRange, parentId) {
		let colorScale = d3
			.scaleLinear()
			.domain(trickValues)
			.range(colorPalettes);

		// append a defs (for definition) element to your SVG
		let svgLegend = d3.select(parentId).append('svg').attr('width', 270);
		let defs = svgLegend.append('defs');

		// append a linearGradient element to the defs and give it a unique id
		let linearGradient = defs.append('linearGradient').attr('id', 'linear-gradient');

		// horizontal gradient
		linearGradient.attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');

		// append multiple color stops by using D3's data/enter step
		linearGradient
			.selectAll('stop')
			.data([
				{ offset: '0%', color: colorPalettes[0] },
				{ offset: '10%', color: colorPalettes[1] },
				{ offset: '20%', color: colorPalettes[2] },
				{ offset: '30%', color: colorPalettes[3] },
				{ offset: '40%', color: colorPalettes[4] },
				{ offset: '50%', color: colorPalettes[5] },
				{ offset: '60%', color: colorPalettes[6] },
				{ offset: '70%', color: colorPalettes[7] },
				{ offset: '80%', color: colorPalettes[8] },
				{ offset: '90%', color: colorPalettes[9] },
				{ offset: '100%', color: colorPalettes[10] },
			])
			.enter()
			.append('stop')
			.attr('offset', function (d) {
				return d.offset;
			})
			.attr('stop-color', function (d) {
				return d.color;
			});

		// draw the rectangle and fill with gradient
		svgLegend
			.append('rect')
			.attr('x', 10)
			.attr('y', 10)
			.attr('width', 250)
			.attr('height', 10)
			.style('fill', 'url(#linear-gradient)');
		//create tick marks
		let xLeg = d3.scaleLinear().domain(valueRange).range([10, 250]);

		let axisLeg = d3.axisBottom(xLeg).tickValues(colorScale.domain());

		svgLegend.attr('class', 'axis').append('g').attr('transform', 'translate(0, 15)').call(axisLeg);
};