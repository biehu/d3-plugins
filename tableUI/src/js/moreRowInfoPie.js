ycharts._ui.moreRowInfoPie = {
	mixins: ['d3'],
	_defaults: {
		margin: 5,
		radius: 0.2,
		color: ['#d96bfd', '#7c6eff', '#a887fa', '#ff6fdf'],// 数据颜色，不够了循环
		title_text: '',// 标题文字
		fontSize: 10,// 基础文字大小
		lineText_formatter: function (d) {// 标注文字格式化
			return [d.name, d.value];
		},
		legendText_formatter: function (n) {// 图例文字格式化
			return n;
		},
		data: {
//			legend_data:[],// 图例
//			series:[// 图形数据
//                {value:0, name:''},
//                ...
//            ]
		}
	},
    draw: function () {
		var _this = this;
		var defaults = this.defaults;
		var data = this.defaults.data.series;
		var width = this.defaults.width;
		var height = this.defaults.height;
		var margin = this.defaults.margin;
		
		var radius = this.defaults.width * this.defaults.radius;
		var imgWidth,imgHeight;
		var fontSize = imgWidth = imgHeight = defaults.fontSize * 1.2;
		
		var barMarginBottom = 10;
		var textMargin = 6;
		
		var changeData = function (data) {
			var all = d3.sum(data, function (d) {
				return d.value;
			});
			data.map(function (d) {
				return d.scale = d.value / all;
			});
		};
		
		var pie = d3.layout.pie()
			.sort(null)
			.value(function (d) {
				return d.scale;
			});
		
		var getImgIconPos = function (d) {
			return innerArc.centroid(d).map(function (d) {
				return d - imgWidth / 2;
			});
		};
		var drawPie = function (slice) {
			var pie = slice.append('g')
				.attr('class', 'slice-pie')
				.on('click', handleClickPie);
			
			pie.append('path')
				.attr('d', arc)
				.style('fill', function (d, i) {
					return _this.getDataColor(i);
				})
				.each(function() {
                  this._current = {startAngle: 0, endAngle: 0}; 
                })
				.transition()
                .duration(500)
                .attrTween('d', function(d) {
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    
                    return function(t){
                        return arc(interpolate(t));
                    };
                })
				.each('end', function (d, i) {
					if (i === slice.size() - 1) drawLine(slice);
				});
				
		};
		
		var midAngle = function (d) {
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		};
		var getTextAlign = function (d) {
			if (midAngle(d) < Math.PI) {
				return 'end';
			} else {
				return 'start';
			}
		};
		var getEndPoint = function (d) {
			var endPointX = width / 2;
			var midPoint = breakArc.centroid(d);
			var x;
			if (midAngle(d) < Math.PI) {
				x = endPointX;
			} else {
				x = -endPointX;
			}
			return [x, midPoint[1]];
		};
		
		var drawLine = function (slice) {
			var endPoint, endDirection;	
			var sign = slice.append('g')
				.attr('class', 'slice-sign')
				.style('opacity', function (d, i) {
					var currentTextWrap = d3.select(this);
					var opacity; 
					if (!endPoint ||
						endDirection !== getTextAlign(d) ||
						endPoint &&
						Math.abs(getEndPoint(d)[1] - endPoint[1]) > 2 * textMargin + 2 * fontSize) {
						opacity = 1;
						currentTextWrap.attr('data-hide', 'end');
					} else {
						opacity = .2;
						currentTextWrap.attr('data-hide', 'start');
					}
					
					endDirection = getTextAlign(d);
					endPoint = getEndPoint(d);
					return opacity;
				});
				
			sign.append('circle')
				.attr('r', 2)
				.attr('transform', function (d) {
					return 'translate(' + outerArc.centroid(d) + ')';
				})
				.style('fill', function (d, i) {
					return _this.getDataColor(i);
				});
				
			sign.append('path')
				.style('stroke', function (d, i) {
					return _this.getDataColor(i)
				})
				.style('fill', 'none')
				.attr('d', function (d, i) {
					return 'M' + [outerArc.centroid(d), breakArc.centroid(d), getEndPoint(d)];
				})
		        .attr('stroke-dasharray', 2000)
		        .attr('stroke-dashoffset', 3000)
		        .transition()		
		        .duration(200)		
		        .ease('linear')
		        .attr('stroke-dashoffset', 0)
				.each('end', function (d, i) {
					if (i === slice.size() - 1) drawText(sign);
				});
				
		};
		
		var drawText = function (sign) {
			var textWrap = sign.append('g').attr('class', 'slice-text');
			
			var textStyle = function (selection) {
				selection
					.style('font-size', fontSize)
					.style('text-anchor', function (d) {
						return getTextAlign(d);
					});
			};
			
			textWrap.append('text')
				.attr('transform', function (d) {
					var point = getEndPoint(d);
					return 'translate(' + [point[0], point[1] - textMargin] + ')';
				})
				.text(function (d) {
					return defaults.lineText_formatter(d.data)[0];
				})
				.style('fill', function (d, i) {
					return _this.getDataColor(i);
				})
				.call(textStyle)
				.append('tspan')
				.text(function (d) {
					return;
				});
				
			textWrap.append('text')
				.attr('transform', function (d) {
					var point = getEndPoint(d);
					return 'translate(' + [point[0], point[1] + textMargin] + ')';
				})
				.text(function (d) {
					return defaults.lineText_formatter(d.data)[1];
				})
				.call(textStyle)
				.style('dominant-baseline', 'hanging')
				.style('fill', function (d, i) {
					return _this.getDataColor(i);
				});
			
			textWrap
				.style('fill-opacity', 0)
				.transition()
				.duration(500)
				.style('fill-opacity', 1);
		};
		
		var getPathByI = function (className) {
			var path = d3.selectAll('.' + className);
			return function (i) {
				return path.filter(function (d, j) {
					return j === i;
				});
			}; 
		}; 
		
		var handleClickPie = function (d, i) {
			d3.event.stopPropagation();
			
			var getSignByI = getPathByI('slice-sign');
			var getPieByI = getPathByI('slice-pie');
			var text = getSignByI(i);
			var pies = d3.selectAll('.slice-pie');
			var pie = getPieByI(i);
			var hideOpacity = 0.2;
			var clickPieOpacity = 0.7;
			var i1, i2;
			
			i1 = i2 = i;
			
			var prev = text;
			while (prev.size() && prev.attr('data-hide') !== 'end') {
				i1--;
				prev.style('opacity', hideOpacity);
				prev = getSignByI(i1);
			}
			prev.style('opacity', hideOpacity);
			
			var next = getSignByI(++i2);
			while (next.size() && next.attr('data-hide') !== 'end') {
				i2++;
				next.style('opacity', hideOpacity);
				next = getSignByI(i2);
			}
			
			text.style('opacity', 1);
			
			var isHover = pie.style('opacity') == clickPieOpacity;
			
			pies.style('opacity', 1);
			pies.select('path')
				.transition()
				.attr('d', arc);
			
			if (!isHover) {
				pie.style('opacity', clickPieOpacity);
				pie.select('path')
					.transition()
					.attr('d', hoverArc);
			}
			
		};
		
		var drawBar = function (bar) {
			bar.attr('transform', function (d, i) {
				return 'translate(' + 
					[i % 2 ? 0 : width / 2,  
					Math.floor(i / 2) * (fontSize + barMarginBottom)] + ')';
			})
			.on('click', handleClickPie);
			
			bar.append('rect')
				.attr('width', imgWidth)
				.attr('height', imgWidth)
				.attr('rx', 2)
				.attr('ry', 2)
				.style('fill', function (d, i) {
					return _this.getDataColor(i);
				});
			bar.append('text')
				.style('dominant-baseline', 'text-before-edge')
				.style('font-size', fontSize)
				.style('fill', '#a1a1a1')
				.text(function (d, i) {
					return _this.defaults.legendText_formatter(
						_this.defaults.data.legend_data[i]
					);
				})
				.attr('transform', 'translate(' + [imgWidth + 5, 0] + ')');
		};
		
		changeData(data);
		
        var arc = d3.svg.arc()
            .innerRadius(radius * 0.45)
            .outerRadius(radius);
			
		var hoverArc = d3.svg.arc()
            .innerRadius(radius * 0.45)
            .outerRadius(radius * 1.2);
        
        var innerArc = d3.svg.arc()
            .innerRadius(radius * (0.45 + (1 - 0.45) / 2))          
            .outerRadius(radius * (0.45 + (1 - 0.45) / 2));
        
        var outerArc = d3.svg.arc()
            .innerRadius(radius * 1.1)          
            .outerRadius(radius * 1.1);
        
        var breakArc = d3.svg.arc()
            .innerRadius(radius * 1.3)          
            .outerRadius(radius * 1.3);
		
		// 标题
		var drawTitle = function () {
			var title = defaults.title_text;
			var fontSize = defaults.fontSize * 1.4;
			
			var rows = title.split('|');
			var text = _this.wrap.append('text')
				.attr('class', 'title')
				.style('font-size', fontSize)
				.style('dominant-baseline', 'text-before-edge')
				.style('text-anchor', 'middle')
			
			for (var i = 0; i < rows.length; i++) {
				var row = text.append('tspan')
				row.text(rows[i]).attr('x', defaults.width / 2)
				if (i > 0)	row.attr('dy', fontSize * i + 5)
			}
		};	
			
		drawTitle();
		
		
		// 图例
		var bar = this.wrap.append('g')
			.attr('class', 'legend')
			.attr(
				'transform', 
				'translate(' + [0, height - (barMarginBottom + imgHeight) * data.length / 2 + barMarginBottom] + ')'
			)
			.selectAll('.bar')
			.data(data, function (d) {
				return d.name;
			});
			
	    bar.enter().append('g').attr('class', 'bar');
			
		drawBar(bar);
		
        bar.exit().remove();		
		
		// 图示
		var slice = this.wrap.append('g')
			.attr('class', 'slices')
			.attr('transform', 'translate(' + [width / 2, height / 2] + ')')
		    .selectAll('.slice')
			.data(pie(data), function (d) {
                return d.data.name;
            });
			
		slice.enter().append('g').attr('class', 'slice');
			
		drawPie(slice);
		
		slice.exit().remove();
    }
};
