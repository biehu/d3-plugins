ycharts._ui.barLine = {
	mixins: ['echarts'],
	_defaults: {
		color: ['#78a1ff', '#a883fd', '#00d9bf'],
		series_barMaxWidth: 12,
		title_text:'',
		xAxis_axisLine_lineStyle_color: '#ffbcbe',
		yAxis_1_axisLabel_formatter_suffix: '',
		yAxis_2_axisLabel_formatter_suffix: '',
		grid_bottom: '13%',
		xAxis_axisLabel_textStyle_color: function (n) {
			return '#666';
		},
		data: {
//			legend_data: [],// 图例
//			xAxis_data: [],// 横坐标
//			series_max: [],// 柱形和线形数据的两个最大值，如果是堆叠，堆叠数据相加算一个值比较
//            series: [
//                {
//		            name:'',// 图例名称1
//		            data:[]// 图例名称1对应数据
//		        },
//		        {
//		            name:'',// 图例名称2
//		            stack: ''// 可选，第二条柱形是否堆叠，这个值相同堆叠
//		            data:[]// 图例名称2对应数据
//		        },
//				{
//		            name:'',// 图例名称3
//		            stack: ''// 可选，第二条柱形是否堆叠，这个值相同堆叠
//		            data:[]// 图例名称3对应数据
//		        },
//		        ...
//				{
//		            name:'',// 图例名称last(对应线形数据)
//		            data:[]// 图例名称last对应数据
//		        }
//            ]
		}
	},
	getSeries: function () {
		var seriesArr = this.defaults.data.series;
		var arr = [];
		for (var i = 0; i < seriesArr.length - 1; i++) {
			seriesArr[i].type = 'bar';
			seriesArr[i].barMaxWidth = this.defaults.series_barMaxWidth;
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
	},
	tooltip_formatter: function (p) {
		var htmlStr = '';
		var _this = this;
		var getItem = function (v, i) {
			var val = i === p.length - 1  ? 
				v.value + _this.defaults.yAxis_2_axisLabel_formatter_suffix : 
				v.value + _this.defaults.yAxis_1_axisLabel_formatter_suffix;
			
			return '<span style="background:' + v.color + ';border-radius: 50%;width: 10px; height: 10px; display: inline-block;margin-right: 5px;"></span>' + v.seriesName + '：' + val + '<br/>';
		};
		for (var i = 0; i < p.length; i++) {
			var v = p[i];
			if (i === 0) {
				htmlStr += v.name + '<br/>' + getItem(v, i);
			} else  {
				htmlStr += getItem(v, i);
			}
		};
		return htmlStr;
	},
	getOption_barLine: function () {
		var defaults = this.defaults;
		var splitYAxis = this.splitYAxis();
		var _this = this;
		
        return {
            grid: {
	            top: '20%',
	            left: '1%',
	            right: '1%',
				bottom: defaults.grid_bottom,
				containLabel: true
	        },
			color: defaults.color,
			title: {
				show: true,
				text: defaults.title_text,
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
					return _this.tooltip_formatter.call(_this, p);
				},
				axisPointer: {
					type: 'line',
					lineStyle: {
						width: 0
					}
				}
		    },
		    legend: {
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
							color: defaults.xAxis_axisLabel_textStyle_color
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
		            min: 0,
			        max: splitYAxis[0].max,
			        interval: splitYAxis[0].interval,
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
					min: 0,
		            max: splitYAxis[1].max,
			        interval: splitYAxis[1].interval,
		            axisLabel: {
		                formatter: '{value}' + defaults.yAxis_2_axisLabel_formatter_suffix,
						show: true,
		                textStyle: {
		                    color: '#999'
		                }
		            }
		        }
		    ],
		    series: this.getSeries()
		};
	}
};



