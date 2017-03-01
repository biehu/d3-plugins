var instrumentBoard = {};
instrumentBoard.response = {
	data: [{
			num: 300,
			label: '较差',
			color: '#fb3737'
		}, {
			num: 383,
			label: '较差',
			color: '#fb3737'
		}, {
			num: 466,
			label: '中等',
			color: '#fb8f37'
		}, {
			num: 513,
			label: '中等',
			color: '#fb8f37'
		}, {
			num: 560,
			label: '良好',
			color: '#7c7cfc'
		}, {
			num: 600,
			label: '良好',
			color: '#7c7cfc'
		}, {
			num: 640,
			label: '优秀',
			color: '#46b3ff'
		}, {
			num: 680,
			label: '优秀',
			color: '#46b3ff'
		}, {
			num: 720,
			label: '极好',
			color: '#2db99a'
		}, {
			num: 760,
			label: '极好',
			color: '#2db99a'
		}, {
			num: 800,
			label: '极好',
			color: '#2db99a'
		}
	],
	current: 600
};

instrumentBoard.init = function (current) {
	if (!current) throw new Error('没有设置当前值！');
	
	instrumentBoard.response.current = current;
	
	var data = instrumentBoard.response.data;
	var current = instrumentBoard.response.current;
		
	var el = d3.select('.instrumentBoard');
	var w = 330;
	var h = 300;
	var r = 140;
	var pi = Math.PI;	
	
	var svg = el.select('svg')
		.attr({width: w, height: h})
		.append('g')
		.attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');
		
	var arc = d3.svg
		.arc()
		.innerRadius(r * 0.8 - 10)
		.outerRadius(r * 0.8)
		.cornerRadius(10)
	    .startAngle(-125 * pi / 180)
		.endAngle(125 * pi / 180);
	
	svg.append('path')
		.attr('d', arc)
		.attr('class', 'pie');
		
	var minutedomain = d3.range(60);
	var minuteangle = d3.scale
		.linear()
		.domain([0,59])
		.range([-210, 30])
	var minutemarks = svg.selectAll(".minute.axis")
	    .data(minutedomain)
	 	.enter()
		.append("g")
	    .attr("class", "minute")
	    .attr("transform", function(d) { 
			return "rotate(" + minuteangle(d) + ")"; 
		})
		.append("line")
		.attr("x1", r * 0.8)
		.attr("x2", r * 0.8 + 5)
		.attr("y1", 0)
		.attr("y2", 0);
		
	var hourdomain = d3.range(data.length);
	var hourangle = d3.scale.linear()
		.domain([0, data.length - 1])
		.range([-210, 30]);
	
	var labelValArr = data.map(function (d) {
		return d.num;
	});
	var labelValColorObj = {};
	data.forEach(function (d) {
		labelValColorObj[d.color] = d.label;
	});
	
	var labelVal = [d3.min(labelValArr), d3.max(labelValArr)];
	
	var ordinalVal = d3.scale.linear()
		.domain(labelVal)
		.range([-210, 30]);
	var ordinal = d3.scale.ordinal()
        .domain(hourdomain)
        .range(data.map(function (d, i) {
			if (i % 2 !== 0) {
				return d.label;
			}
			return d.num;
		}));
		
	var ordinalColorAndText = function (num) {
		if (num < labelVal[0] || num > labelVal[1]) {
			throw new Error('超出范围！');
		}
		var color = '';
		var text = '';
		var isBreak = false;
		data.forEach(function (d) {
			if (num < d.num && !isBreak) {
				color = d.color;
				text = d.label;
				isBreak = true;
			}
		});
		return {
			color: color,
			text: text
		}
	};
	
	d3.scale.ordinal()
		.domain(labelValArr)
		.range(data.map(function (d) {
			return d.color;
		}));

	var hourmarks = svg.selectAll(".hour.axis")
	    .data(hourdomain)
	    .enter()
		.append("g")
	    .attr("class", "hour")
	    .attr("transform", function(d) { 
			return "rotate(" + hourangle(d) + ")"; 
		})
	    .append("text")
	    .attr("x", (r * 0.8 - 22))
		.attr("y", 0)
	    .attr("transform", function(d) {
			return "rotate(90, " + (r * 0.8 - 22) + ", 0)";
	    })
	    .text(function (d) {
			return ordinal(d);
		});
		
	var arcLine=d3.svg.arc()
        .innerRadius(r * 0.8 + 15)
        .outerRadius(r * 0.8 + 18)
        .startAngle(-120 * pi / 180)
		.endAngle(120 * pi / 180);
		
	svg.append('path')
		.attr('class', 'line')
        .attr({
            d: arcLine
        });
		
	function draw() {
		var num = current;
		var info = ordinalColorAndText(num);
		
		svg.append('foreignObject')
            .attr('x', -55)
            .attr('y', -8)
            .attr('width', 300)
            .attr('height', 50) 
			.style('color', '#fff')
            .html([
				'<p class="intro">', info.text, '</p>'
            ]
			.join("")); 
			
		var image = svg.append('svg:image')
			.attr("xlink:href", "arrow.png")
			.attr('width', 13)
			.attr('height', 24)
			.attr("transform", function(d) {
				return "rotate(-210)";
		    })
			.attr("x", (r * 0.8 + 10))
			.attr("y", 0);
			
		var display = svg.append('text')
			.attr('class', 'text')
			.text(labelVal[0])
			.style('text-anchor', 'middle')
			.style('font-size', '60px');
		
		display.datum(num)
			.transition()
			.duration(1000)
			.tween("text", function(d) {
				var i = d3.interpolate(this.textContent, d)
				return function(t) {
					var val = i(t);
					this.textContent = Math.round(val);
					image.attr('transform', 'rotate(' + ordinalVal(val) + ')');
				};
			});
			
		d3.selectAll('.pie, .line, .text')
			.style('fill', info.color);
		d3.selectAll('.intro')
			.style('background', info.color);
		d3.selectAll('.minute line')
			.style('stroke', info.color);
		
	}	
		
	function legend(){
		var legendData = labelValColorObj;
		var lD = Object.keys(legendData);
            
        var legend = svg.append('foreignObject')
			.attr('x', - w / 2)
			.attr('y', r * 0.7)
			.attr('width', w)
        	.attr('height', 20)
			.attr('class','legend')
			
		var htmlStr = [];
		
		lD.forEach(function (d) {
			htmlStr.push(
				'<td><i style="background:', d , '"></i>',
					legendData[d], 
				'</td>'
			);
		});
			
		legend.html([
			'<table><tr>',
				htmlStr.join(''),
			'</tr></table>'
		].join(''));
    }
	
	legend();
	draw();

};