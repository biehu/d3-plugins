/*
 * 三圆互换位置动效
 * 
 * @params {Object}
 * {
	    data: [
	        {
	            type: 'top', // 初始位置标示
	            value: 100, // 中央百分比数值
	            sendUrl: function, // 圆圈点击跳转
	            headerText: '金融项目线索优化', // 圆圈头部标题
	            val1: 232234, // 提报量
	            val2: 232244, // 成交量
	            btnText: '4月' // 底部btn文字
	        }，
	        ...
	    ]
		circleGradualColor,// 大圆颜色
		circleColor// 小圆颜色
   }
 * 
 * 
 * 
 */
ycharts._ui.threeCircles = {
	_defaults: {
        circleGradualColor: ['#ff6000', '#f3ff30'],
        circleColor: '#34f8d1',
        data: []
    },
	clear: function () {
		this.svg.remove();
	},
	init: function () {
		this.svg = d3.select(this.dom).append("svg");
	},
    _setOption: function () {
		var defaults = this.defaults;
		var svg = this.svg;
		
		var width = 750;
		var height = 750;
	    var marginTop = 44;
	    var marginLeft = 80;
	    var radius = 220;
	    var lineLength = 40;
	    
	    var textMargin = 20;
	    var smallScale = 0.5;
		
	    var lineDuration = 600;
		
	    var drawBg = function (g, type) {
	        var circleBg;
	            
	        if (type !== 'top') {
	            circleBg = 'transparent';
	        } else {
	            circleBg = 'url(#radialGradient)';
	        }
	        
	        g.select('circle').transition().duration(lineDuration).attr('fill', circleBg);
	    };
	    
	    var drawText = function (g) {
	        var textRadius = radius - lineLength - textMargin;
	        var g = g.append('g').attr('class', 'table-text');
	        
	        var valuePointAfterNum, value;
	        if (g.datum().value) {
	            var valueNum = g.datum().value.toString().length;
	            if (valueNum < 4) {
	                valuePointAfterNum = 2;
	            } else if (valueNum === 4)  {
	                valuePointAfterNum = 1;
	            } else {
	                valuePointAfterNum = 0;
	            }
	            
	            value = new Number(g.datum().value).toFixed(valuePointAfterNum) + '<sub>%</sub>';
	        } else {
	            value = '无数据';
	        }
	        
	        g.append('foreignObject')
	            .attr('class', 'table-text-0')
	            
	            .attr('x', -textRadius)
	            .attr('y', -textRadius)
	            .attr('width', textRadius  * 2)
	            .attr('height', textRadius * 2.5) 
	            
	            .html([
	              '   <p class="table-text-top">' +  g.datum().headerText + '</p>',
	              '   <p class="table-text-val">' +  value + '</p>',
	              '   <div class="table-num-wrap">',
	              '   <p class="table-num">' +  g.datum().val1 + '<span>提报量</span></p>',
	              '   <p class="table-num">' +  g.datum().val2 + '<span>成交量</span></p>',
	              '   </div>',
	              '   <p class="table-btn">',
	              '       <i><span>' +  g.datum().btnText + '</span></i>',
	              '   </p>'
	            ].join(""));
	            
	        g.append('foreignObject')
	            .attr('class', 'table-text-1')
	            
	            .attr('x', -textRadius)
	            .attr('y', -textRadius)
	            .attr('width', textRadius  * 2)
	            .attr('height', textRadius * 2.5)
	            
	            .html([
	              '   <p class="table-text-val">' +  value + '</p>',
	              '   <p class="table-btn">',
	              '       <i><span>' +  g.datum().btnText + '</span></i>',
	              '   </p>'
	            ].join(""));
	    };
	    
	    var drawCircle = function (g, isTop) {
	        var lineScale = d3.scale.linear()
	            .domain([0, 59])
	            .range([45, 315]);
	        var lines = g.append('g').selectAll('line').data(d3.range(0, 60)).enter()
	            .append('line')
	            .attr('class', 'circle-line')
	            .style('stroke', '#fff')
	            .style('stroke-width', 2)
	            .attr('x1', 0)
	            .attr('y1', radius)
	            .attr('x2', 0)
	            .attr('y2', radius - lineLength)
	            .attr('transform', function (d) {
	                return 'rotate(' + lineScale(d) + ')';
	            });
	            
	        var circle = g.append('circle')
	            .attr('x', 0)
	            .attr('y', 0)
	            .attr('r', radius)
	            .attr('fill', 'transparent');
	        var moreBg = g.append('defs').append('radialGradient')
	            .attr('id', 'radialGradient')
	            .attr('r', '50%')
	            .attr('spreadMethod', 'pad');
	            
	        moreBg.append('stop')
	            .attr('offset', '0%')
	            .attr('stop-opacity', '.1')
	            .attr('stop-color', '#fff');
	        moreBg.append('stop')
	            .attr('offset', '50%')
	            .attr('stop-opacity', '.05')
	            .attr('stop-color', '#fff');
	        moreBg.append('stop')
	           .attr('offset', '90%')
	           .attr('stop-opacity', '0')
	           .attr('stop-color', '#fff');
	    };
	    
	    var smallCircleTransform = function (xPos) {
	        return ['translate(', xPos, ',', (1.5 * radius), ')',
	            'scale(', smallScale, ')'].join('');
	           
	    };  
	    
	    var clearLineColor = function (g) {
	        g.selectAll('line').style('stroke', '#fff')
	            .style('stroke-width', 2);
	    };
	    
	    var drawLineColor = function (g, val, type, isInit) { 
	        var isTop = type === 'top';
	        var lines = g.selectAll('line');
	        var valScale = d3.scale.linear().domain([0, 100]).range([0, 60]);
	        
	        clearLineColor(g);
	        
	        var hoverLines = lines.filter(function (d) {
	           return d <  valScale(val); 
	        });
	        
	        var n = hoverLines.size();
	        var setStroke = function (selection) {
				var colorScale = d3.scale.linear().domain([0, 60]).range(defaults.circleGradualColor);
	            selection
	              .style('stroke', function (d) {
	                return isTop ? colorScale(d) : defaults.circleColor;
	              })
	              .style('stroke-width', 3);
	        };
	        
	        if (isInit) {
	            hoverLines.transition().delay(function (d, i) {
	                return i / n * lineDuration;
	            })
	            .call(setStroke);
	        } else {
	            setStroke(hoverLines.interrupt().transition().duration(lineDuration));
	        }
	    };
	    
	    var drawCirclePos = function (g, type, isInit) {
	        var transform;
	        if (type === 'top') {
	           transform = 'translate(' + width / 2 + ', 0)';
	        } else if (type === 'left') {
	           transform = smallCircleTransform(smallScale * radius + marginLeft);
	        } else {
	           transform = smallCircleTransform(width - marginLeft - smallScale * radius);
	        }
	        
	        if (isInit) {
	            g.attr('transform', transform);
	        } else {
	            g.transition().duration(lineDuration).attr('transform', transform);
	        }
	    };
	    
	    var drawTextChange = function (g, type, isInit) {
	        var gt;
	        
	        if (isInit) {
	            gt = g.select('.table-text');
	        } else {
	            gt = g.select('.table-text').transition().duration(lineDuration)
	        }
	        if (type === 'top') {
	            gt.select('.table-text-0')
	              .attr('transform', 'scale(1)');
	              
	            gt.select('.table-text-1')
	              .attr('transform', 'scale(0)');
	        } else {
	            gt.select('.table-text-0')
	              .attr('transform', 'scale(0)');
	              
	            gt.select('.table-text-1')
	              .attr('transform', 'scale(1)');
	        }
	    };
		
		var render = function (selection) {
			selection.each(function (d) {
	            var g = d3.select(this);
	            var color1, color2;
	            
	            drawCircle(g);
	            drawText(g);
	            
	            drawTextChange(g, d.type, true);
	            drawCirclePos(g, d.type, true);
	            drawLineColor(g, d.value, d.type, true);
	            drawBg(g, d.type);
	       })
	       .on('touchstart', function (d) {
	           if (!d.value) return;
	           
	           var g = d3.select(this);
	           var gClass = g.attr('class');
	           var topG = d3.select('.top-circle');
	           var type = gClass === 'left-circle' ? 'left' : 'right';
	           
	           if (gClass === 'top-circle' && d.sendUrl && typeof d.sendUrl === 'function') {
	               d.sendUrl();
	           } else {
	               drawCirclePos(g, 'top', false);
	//                   drawLineColor(g, d.value, 'top', false);
	               drawBg(g, 'top');
	               drawTextChange(g, 'top', false);
	               g.attr('class', 'top-circle', false);
	               
	               drawCirclePos(topG, type, false);
	//                   drawLineColor(topG, topG.datum().value, type, false);
	               drawBg(topG, type);
	               drawTextChange(topG, type, false);
	               topG.attr('class', gClass);
	           }
	       });
		};
		
		svg.attr('class', 'circle-group')
            .attr("preserveAspectRatio", "xMaxYMax meet")
            .attr("viewBox", "0 0 " + width + " " + height);
	    
        var gs = svg.append("g")
            .attr('transform', 'translate(0,' + (radius + marginTop) + ')')
            .selectAll('g')
            .data(this.defaults.data, function (d) { 
			    return d.type; 
			});
           
        gs.enter()
           .append('g')
           .attr('class', function (d) { 
		         return d.type + '-circle'; 
			})
           .attr('pos-type', function (d) { 
		         return d.type; 
		    });
       
       render(gs);
	   
	   gs.exit().remove(); 
	               
	}
};
