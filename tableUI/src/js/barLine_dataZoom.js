ycharts._ui.barLine = {
	mixins: ['setOption'],
	init: function () {
		this.defaults = {
			color: ['#78a1ff', '#a883fd', '#00d9bf'],
			xAxis_axisLine_lineStyle_color: '#ffbcbe'
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
        return {
            grid: {
	            top: '20%',
	            left: '1%',
	            right: '1%',
				bottom: '13%',
				containLabel: true
	        },
			color: this.defaults.color,
			title: {
				show: true,
				text: this.defaults.data.title_text,
				left: 'center',
				top: '5%',
				textStyle: {
					fontWeight: 'normal',
					fontSize: 14
				}
				
			},
		    tooltip: {
		        trigger: 'axis',
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
		        data: this.defaults.data.legend_data
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
							color: this.defaults.xAxis_axisLine_lineSyle_color
						}
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: this.defaults.xAxis_axisLine_lineSyle_color
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ['#f6f6f6']
						}
					},
		            data: this.defaults.data.xAxis_data
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
		            max: 200,
		            interval: 30,
		            axisLabel: {
		                formatter: '{value}',
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
		            min: 0.00,
		            max: 150.00,
		            interval: 25,
		            axisLabel: {
		                formatter: '{value}%',
						show: true,
		                textStyle: {
		                    color: '#999'
		                }
		            }
		        }
		    ],
		    series: [
        {
            name:'蒸发量',
            type:'bar',
			itemStyle: {
                normal: {
                    barBorderRadius: 2
                }
            },
			barWidth: 12,
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            name:'降水量',
            type:'bar',
			itemStyle: {
                normal: {
                    barBorderRadius: 2
                }
            },
			barWidth: 12,
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
            name:'平均温度',
			smooth: true,
            type:'line',
            yAxisIndex: 1,
            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
		};
	}
};



