/*
 * 比例圆环
 * 
 * var defaults = {
        data: {
            h1: 99,// 第一条文字数据值，后缀在css中（%）
            h2: '全国租赁业务总体完成率',// 第二条文字
            h3: '2016-09-25'// 第三条文字
        }
    };
 * 
 * 
 */
YXCharts.scalePie = function (dom) {
	var w = 220;
	var h = 220;
	var margin = 20;
	var outerRadius = 90;
	var innerRadius = 70;
	
	var defaults = {
	    data: {}
	};
	 
	var scale = d3.scale.linear()
	    .domain([0, 100])
	    .range([-150 * Math.PI / 180, 150 * Math.PI / 180]);
	 
	var arc = d3.svg.arc()
	    .innerRadius(innerRadius)
	    .outerRadius(outerRadius)
	    .cornerRadius(20)
	    .startAngle(scale(0));
	
	var svg = d3.select(dom)
        .append("svg")
        .attr('class', 'scale-pie')
        .attr("preserveAspectRatio", "xMaxYMax meet")
        .attr("viewBox", "0 0 " + w + " " + h)
        .append('g')
        .attr({transform:'translate('+w/2+','+h/2+')'});
	 
	var pathBackground = svg.append('path')
	    .datum({endAngle: scale(100)})
	    .attr({d: arc, class: 'bg'});
	 
	var pathForeground=svg.append('path')
	    .datum({endAngle: scale(0)})
	    .attr({d: arc, class: 'front'});
		
	var render = function () {
		var h1Html = '';
	    for (var i = 0; i < (+defaults.data.h1 + 1); i++) {
	        h1Html += '<span>' + i + '</span>';
	    }
	    
	    var textWidth = 2 * innerRadius - 40;
	    var middleCount=svg.append('foreignObject')
	        .attr('class', 'h1')
	        .attr('width', textWidth)
	        .attr('x', -textWidth / 2)
	        .attr('y', -20)
	        .append('xhtml:h1')
	        .html(h1Html);
	    var bottomCount=svg.append('foreignObject')
	        .attr('class', 'h2')
	        .attr('width', textWidth)
	        .attr('x', -textWidth / 2)
	        .html('<h2>' + defaults.data.h2 + '</h2>');
	    var bottomText=svg.append('foreignObject')
	        .attr('class', 'h3')
	        .attr('width', textWidth)
	        .attr('x', -textWidth / 2)
	        .html('<h3>' + defaults.data.h3 + '</h3>');
	    
	    var arcTween = function (transition, newAngle) { 
	        transition.attrTween("d", function (d) {
	            var interpolate = d3.interpolate(d.endAngle, scale(newAngle));
	            var interpolateVal = d3.interpolate(0, newAngle);
	            return function (t) {
	                d.endAngle = interpolate(t);
	                middleCount.select('h1 span').style('margin-top', interpolateVal(t) * -40 + 'px');
	                return arc(d);
	            }
	        });
	    };
	    
	    pathForeground.transition()
	       .duration(750)
	       .call(arcTween, defaults.data.h1);
		
	};
	
   return {
        clear: function () {
            svg.remove();
            return this;
        },
        getOption: function () {
            return YXCharts.util.extend(true, {}, defaults);
        },
        setOption: function (options) {
            defaults = YXCharts.util.extend(true, {}, defaults, options);
            render(); 
            return this;
        }
    };
};
