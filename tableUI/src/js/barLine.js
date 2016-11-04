ycharts._ui.barLine = {
	mixins: ['setOption'],
	init: function () {
		this.defaults = {
			color: ['#78a1ff', '#a883fd', '#00d9bf'],
			xAxis_axisLine_lineStyle_color: '#ffbcbe',
			yAxis_1_axisLabel_formatter_suffix: '',
			yAxis_2_axisLabel_formatter_suffix: ''
		};
		this.echarts = echarts.init(this.dom);
		return this;
	},
	clear: function () {
		this.echarts.clear();
	},
	_setOption: function () {
		this.echarts.setOption(this.getFormatDefaults());
	},
	getFormatDefaults: function () {
		var defaults = this.defaults;
        return {
            grid: {
	            top: '20%',
	            left: '1%',
	            right: '1%',
				bottom: '13%',
				containLabel: true
	        },
			color: defaults.color,
			title: {
				show: true,
				text: defaults.data.title_text,
				left: 'center',
				top: '5%',
				textStyle: {
					fontWeight: 'normal',
					fontSize: 14
				}
				
			},
		    tooltip: {
		        trigger: 'axis',
				formatter: function (p) {
					var htmlStr = '';
					var getItem = function (v) {
						var val = i === p.length - 1  ? 
							v.value + defaults.yAxis_2_axisLabel_formatter_suffix : 
							v.value + defaults.yAxis_1_axisLabel_formatter_suffix;
						
						return '<span style="background:' + v.color + ';border-radius: 50%;width: 10px; height: 10px; display: inline-block;margin-right: 5px;"></span>' + v.seriesName + '：' + val + '<br/>';
					};
					for (var i = 0; i < p.length; i++) {
						var v = p[i];
						if (i === 0) {
							htmlStr += v.name + '<br/>' + getItem(v);
						} else  {
							htmlStr += getItem(v);
						}
					};
					return htmlStr;
					
				},
				axisPointer: {
					type: 'line',
					lineStyle: {
						width: 0
					}
				}
		    },
		    legend: {
				itemGap: 20,
				itemWidth: 10,
				itemHeight: 10,
				bottom: '1%',
				textStyle: {
					color: '#999'
				},
		        data: defaults.data.legend_data
		    },
		    xAxis: [
		        {
		            type: 'category',
					axisLabel: {
						show: true,
						textStyle: {
							color: '#666'
						}
					},
					axisTick: {
						show: true,
						lineStyle: {
							color: defaults.xAxis_axisLine_lineStyle_color
						}
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: defaults.xAxis_axisLine_lineStyle_color
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ['#f6f6f6']
						}
					},
		            data: defaults.data.xAxis_data
		        }
		    ],
		    yAxis: [
		        {
					splitLine: {
		                show: true,
		                lineStyle: {
		                    color: ['#f6f6f6']
		                }
		            },
		            axisLine: {
		                show: true,
		                lineStyle: {
		                    color: '#f6f6f6'
		                }
		            },
		            axisTick: {
		                show: false
		            },
		            splitArea: {
		                show: true,
		                areaStyle: {
		                    color: ['#fff', '#f9f9f9']
		                }
		            },
		            type: 'value',
		            splitNumber: 4,
		            axisLabel: {
		                formatter: '{value}' + defaults.yAxis_1_axisLabel_formatter_suffix,
						show: true,
		                textStyle: {
		                    color: '#999'
		                }
		            }
		        },
		        {
					splitLine: {
		                show: true,
		                lineStyle: {
		                    color: ['#f6f6f6']
		                }
		            },
					axisLine: {
		                show: true,
		                lineStyle: {
		                    color: '#f6f6f6'
		                }
		            },
					axisTick: {
		                show: false
		            },
		            splitArea: {
		                show: true,
						areaStyle: {
							color: [ '#f9f9f9', '#fff']
						}
		            },
		            type: 'value',
		            splitNumber: 4,
		            axisLabel: {
		                formatter: '{value}' + defaults.yAxis_2_axisLabel_formatter_suffix,
						show: true,
		                textStyle: {
		                    color: '#999'
		                }
		            }
		        }
		    ],
		    series: (function (seriesArr) {
				var arr = [];
				for (var i = 0; i < seriesArr.length - 1; i++) {
					seriesArr[i].type = 'bar';
					seriesArr[i].itemStyle = {
						normal: {
		                    barBorderRadius: 2
		                }
					};
					arr.push(seriesArr[i]);
				}
				seriesArr[seriesArr.length - 1].type = 'line';
				seriesArr[seriesArr.length - 1].smooth = true;
				seriesArr[seriesArr.length - 1].yAxisIndex = 1;
				arr.push(seriesArr[seriesArr.length - 1]);
				
				return arr;
			})(defaults.data.series)
		};
	}
};



