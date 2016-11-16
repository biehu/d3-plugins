ycharts._ui.scalePie = {
	mixins: ['d3'],
	_defaults: {
		width: 220,
        height: 300,
        margin: 20,
		circleBgColor: '#eee',
		circleFrontColor: '#00d9bf',
		fontSize: 12,
        data: {},
        title_text: '',
		title_subtext: ''
	},
	draw: function () {
	    var outerRadius = 90;
	    var innerRadius = 70;
		var _this = this;
	    
	    this.svg
			.attr('class', 'scalePie')
			.style('font-size', this.defaults.fontSize);
			
		var renderTitle = function (title, subTitle) {
			var wrap = _this.svg.select('g').append('g').attr(
				{transform:'translate('+(_this.defaults.width / 2 - _this.defaults.margin)+',0)'}
			);
			var text = wrap.attr('class', 'title-wrap').append('text');
			
			text.append('tspan')
				.attr('x', 0)
				.attr('class', 'title')
				.text(title);
			if (subTitle) {
				text.append('tspan')
				    .attr('x', 0)
					.attr('dy', 16)
					.attr('class', 'sub-title')
					.text(subTitle);
			}
		};
		
		renderTitle(this.defaults.title_text, this.defaults.title_subtext);// title
		
	    var circle = this.svg.select('g').append('g');
		circle.attr({transform:'translate('+
			(this.defaults.width / 2 - this.defaults.margin)+','+ 
			(this.defaults.height / 2 - this.defaults.margin) +
		')'});
		
	    
	    var scale = d3.scale.linear()
	        .domain([0, 100])
	        .range([-150 * Math.PI / 180, 150 * Math.PI / 180]);
	     
	    var arc = d3.svg.arc()
	        .innerRadius(innerRadius)
	        .outerRadius(outerRadius)
	        .cornerRadius(20)
	        .startAngle(scale(0));
			
	    
	    var pathBackground = circle.append('path')
	        .datum({endAngle: scale(100)})
	        .attr({d: arc, class: 'bg'})
			.style('fill', this.defaults.circleBgColor);
	 
	    var pathForeground=circle.append('path')
	        .datum({endAngle: scale(0)})
	        .attr({d: arc, class: 'front'})
			.style('fill', this.defaults.circleFrontColor);
	    
	    var h1Html = '';
	    for (var i = 0; i < (+this.defaults.data.middleVal + 1); i++) {
	        h1Html += '<span>' + i + '<sub>%</sub></span>';
	    }
	    
	    var textWidth = 2 * innerRadius - 40;
		var middleCountColor = this.defaults.circleFrontColor;
	    var middleCount=circle.append('foreignObject')
	        .attr('class', 'middle-val')
	        .attr('width', textWidth)
	        .attr('height', textWidth)
	        .attr('x', -textWidth / 2)
	        .attr('y', -20)
	        .html('<div class="h1" style="color:' + middleCountColor + '">' + h1Html + '</div>');
		var middleValDescTop = this.defaults.data.middleValDesc.length > 6 ? 20 : 35;
	    var bottomCount=circle.append('foreignObject')
	        .attr('class', 'middle-val-desc')
	        .attr('width', textWidth)
			.attr('height', textWidth)
	        .attr('x', -textWidth / 2)
	        .html(
				'<div class="h2" style="padding-top:' + middleValDescTop  + 'px">' + 
				this.defaults.data.middleValDesc + 
				'</div>'
			);
	    var bottomText=circle.append('foreignObject')
	        .attr('class', 'bottom-text')
	        .attr('width', textWidth)
			.attr('height', textWidth)
	        .attr('x', -textWidth / 2)
	        .html('<div class="h3">' + this.defaults.data.bottomText + '</div>');
	    
	    var arcTween = function (transition, newAngle) { 
	        transition.attrTween("d", function (d) {
	            var interpolate = d3.interpolate(d.endAngle, scale(newAngle));
	            var interpolateVal = d3.interpolate(0, newAngle);
	            return function (t) {
	                d.endAngle = interpolate(t);
	                middleCount.select('.middle-val span').style('margin-top', interpolateVal(t) * -40 + 'px');
	                return arc(d);
	            }
	        });
	    };
	    
	    pathForeground.transition()
	       .duration(750)
	       .call(arcTween, this.defaults.data.middleVal);
	}
};
