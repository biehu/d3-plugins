ycharts._ui.scalePie = {
	mixins: ['d3'],
	_defaults: {
        margin: 20,
		circleBgColor: '#eee',// 圆环背景色
		circleFrontColor: '#00d9bf',// 圆环前景色
		fontSize: 10,// 基础文字大小
		outerRadius: 0.35,// 外环半径
        title_text: '',// 标题文字
		title_subtext: '',// 子标题文字
        data: {
			series: {
//				name: '',// 数值下方文字描述
//				value: 0,// 中间数值，会自动加上%带翻页效果
//				nameInfo: ''// 底部圆弧缺口位置文字
			}
		}
	},
	draw: function () {
	    var outerRadius = this.defaults.width * this.defaults.outerRadius;
	    var innerRadius = this.defaults.width * (this.defaults.outerRadius -0.08);
		var _this = this;
			
		var renderTitle = function (title, subTitle) {
			var wrap = _this.svg.select('g').append('g').attr(
				{transform:'translate('+ _this.defaults.width / 2 +',0)'}
			);
			var text = wrap.attr('class', 'title-wrap').append('text');
			
			text.append('tspan')
				.attr('x', 0)
				.attr('class', 'title')
				.text(title);
			if (subTitle) {
				text.append('tspan')
				    .attr('x', 0)
					.attr('dy', 1.6 * _this.defaults.fontSize)
					.attr('class', 'sub-title')
					.text(subTitle);
			}
		};
		
		renderTitle(this.defaults.title_text, this.defaults.title_subtext);// title
		
	    var circle = this.wrap.append('g');
		circle.attr({transform:'translate('+
			(this.defaults.width / 2)+','+ 
			(this.defaults.height - this.defaults.height * this.defaults.outerRadius) +
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
	    for (var i = 0; i < (+this.defaults.data.series.value + 1); i++) {
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
	    var bottomCount=circle.append('foreignObject')
	        .attr('class', 'middle-val-desc')
	        .attr('width', textWidth)
			.attr('height', textWidth)
	        .attr('x', -textWidth / 2)
	        .html(
				'<div class="h2" style="padding-top:' + (innerRadius - this.defaults.fontSize / 2 - 2.5 * this.defaults.fontSize)  + 'px">' + 
				this.defaults.data.series.name + 
				'</div>'
			);
	    var bottomText=circle.append('foreignObject')
	        .attr('class', 'bottom-text')
	        .attr('width', textWidth)
			.attr('height', textWidth)
	        .attr('x', -textWidth / 2)
	        .html(
				'<div class="h3" style="padding-top:' + (innerRadius - this.defaults.fontSize / 2)  + 'px">' + 
				this.defaults.data.series.nameInfo + 
				'</div>'
			);
	    
	    var arcTween = function (transition, newAngle) { 
	        transition.attrTween("d", function (d) {
	            var interpolate = d3.interpolate(d.endAngle, scale(newAngle));
	            var interpolateVal = d3.interpolate(0, newAngle);
	            return function (t) {
	                d.endAngle = interpolate(t);
	                middleCount.select('.middle-val span').style('margin-top', interpolateVal(t) * -_this.defaults.fontSize * 4 + 'px');
	                return arc(d);
	            }
	        });
	    };
	    
	    pathForeground.transition()
	       .duration(750)
	       .call(arcTween, this.defaults.data.series.value);
	}
};
