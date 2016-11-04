/*
 * 比例圆环
 */
ycharts._ui.scalePie = {
	mixins: ['setOption', 'renderTitle'],
    init: function () {
		this.defaults = {
			width: 220,
	        height: 220,
	        margin: {left: 20, right: 20, top: 20, bottom: 20},
			circleBgColor: '#eee',
			circleFrontColor: '#00d9bf',
	        data: {},
	        title: {
				show: true,
				data: []
			}
	    };
        this.svg = d3.select(this.dom).append("svg");
		return this;
    },
	clear: function () {
        this.svg.selectAll('g').remove();
    },
    _setOption: function () {
	    var outerRadius = 90;
	    var innerRadius = 70;
	    
	    this.svg.attr('class', 'scale-pie')
	        .append('g')
			.attr({transform:'translate('+ this.defaults.margin.left +','+ this.defaults.margin.top +')'});

		if (this.defaults.title.show) {
			this.defaults.height = 300;
			this.renderTitle.apply(this, this.defaults.title.data);// title
		}
		
		this.svg.attr("preserveAspectRatio", "xMaxYMax meet")
	        .attr("viewBox", "0 0 " + this.defaults.width + " " + this.defaults.height);
		
	    var circle = this.svg.select('g').append('g');
		circle.attr({transform:'translate('+
			(this.defaults.width / 2 - this.defaults.margin.left)+','+ 
			(this.defaults.height / 2 - this.defaults.margin.top) +
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
	        h1Html += '<span>' + i + '</span>';
	    }
	    
	    var textWidth = 2 * innerRadius - 40;
		var middleCountColor = this.defaults.circleFrontColor;
	    var middleCount=circle.append('foreignObject')
	        .attr('class', 'middle-val')
	        .attr('width', textWidth)
	        .attr('x', -textWidth / 2)
	        .attr('y', -20)
	        .html('<div class="h1" style="color:' + middleCountColor + '">' + h1Html + '</div>');
		var middleValDescTop = this.defaults.data.middleValDesc.length > 6 ? 20 : 35;
	    var bottomCount=circle.append('foreignObject')
	        .attr('class', 'middle-val-desc')
	        .attr('width', textWidth)
	        .attr('x', -textWidth / 2)
	        .html(
				'<div class="h2" style="padding-top:' + middleValDescTop  + 'px">' + 
				this.defaults.data.middleValDesc + 
				'</div>'
			);
	    var bottomText=circle.append('foreignObject')
	        .attr('class', 'bottom-text')
	        .attr('width', textWidth)
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
