ycharts._ui.moreRowInfoPie = {
	mixins: ['d3'],
	_defaults: {
		width: 700,
		height: 710,
		margin: 30,
		radius: 120,
		color: ['#d96bfd', '#7c6eff', '#a887fa', '#ff6fdf'],
		title_text: '',
		fontSize: 30,
		lineText_formatter: function (d) {
			return [
				d.name, d.value
			];
		},
		legendText_formatter: function (d) {
			return d.name;
		},
		data: []
	},
    draw: function () {
		var _this = this;
		var defaults = this.defaults;
		var data = this.defaults.data;
		var width = this.defaults.width;
		var height = this.defaults.height;
		var margin = this.defaults.margin;
		
		var radius = defaults.radius;
		var imgWidth,imgHeight;
		var fontSize = imgWidth = imgHeight = defaults.fontSize;
		var barMarginBottom = 20;
		
		var textMargin = 15;
		var imgMargin = 10;
		
		this.svg.attr('class', 'moreRowInfoPie')
			.style('font-size', this.defaults.fontSize);
		
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
                .duration('1000')
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
			var endPointX = width / 2 - margin;
			var midPoint = breakArc.centroid(d);
			var x;
			if (midAngle(d) < Math.PI) {
				x = endPointX;
			} else {
				x = -endPointX;
			}
			return [x, midPoint[1]];
		};
		
		var drawTitle = function () {
			var title = defaults.title_text;
			var fontSize = defaults.fontSize * 1.17;
			
			var rows = title.split('|');
			var text = _this.wrap.append('text')
				.style('font-size', fontSize)
				.style('text-anchor', 'middle')
			
			for (var i = 0; i < rows.length; i++) {
				text.append('tspan')
					.text(rows[i])
					.attr('x', defaults.width / 2 - defaults.margin)
					.attr('dy', fontSize * i + 10)
			}
			
		};	
		
		drawTitle();
		
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
				.attr('r', 4)
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
		        .duration(1000)		
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
				.duration(1000)
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
				.attr('rx', 5)
				.attr('ry', 5)
				.style('fill', function (d, i) {
					return _this.getDataColor(i);
				});
			bar.append('text')
				.style('dominant-baseline', 'text-before-edge')
				.style('font-size', fontSize)
				.style('fill', '#a1a1a1')
				.text(function (d) {
					return _this.defaults.legendText_formatter(d);
				})
				.attr('transform', 'translate(' + [imgWidth + imgMargin, -1] + ')');
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
		
		var bar = this.wrap.append('g')
			.attr(
				'transform', 
				'translate(' + [0, height - (barMarginBottom + imgHeight) * data.length / 2] + ')'
			)
			.selectAll('.bar')
			.data(data, function (d) {
				return d.name;
			});
			
	    bar.enter()
			.append('g')
			.attr('class', 'bar');
			
		drawBar(bar);
		
        bar.exit().remove();				
		
		var slice = this.wrap.append('g')
			.attr('class', 'slices')
			.attr('transform', 'translate(' + [width / 2, width / 2] + ')')
		    .selectAll('.slice')
			.data(pie(data), function (d) {
                return d.data.name;
            });
			
		slice.enter()
			.append('g')
			.attr('class', 'slice');
			
		drawPie(slice);
		
		slice.exit().remove();
    }
};
