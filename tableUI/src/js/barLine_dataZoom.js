ycharts._ui.barLine_dataZoom = {
	mixins: ['echarts', 'barLine', 'dataZoom'],
	_defaults: {
		dataZoom_start: 0,// dataZoom 开始位置
		dataZoom_end: 100,// dataZoom 结束位置
		dataZoom_dataBackground_areaStyle_color: '#ffe1f0',// 内部颜色块背景色
		dataZoom_handleStyle_color: '#ff78c0',// 滑块、边框、过滤颜色
		legend_itemGap: 20,// legend类目间距
		legend_formatter: function (name) {// legend类目内容格式化
			return name;
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
//		            stack: '',// 可选，第二条柱形是否堆叠，这个值相同堆叠
//		            detailName_data: [],// 可选，堆叠浮层显示类目不同
//		            data:[]// 图例名称2对应数据
//		        },
//				{
//		            name:'',// 图例名称3
//		            stack: '',// 可选，第二条柱形是否堆叠，这个值相同堆叠
//		            detailName_data: [],// 可选，堆叠浮层显示类目不同
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
	init: function () {
		this.defaults = {};
		this.echarts = echarts.init(this.dom);
		var _this = this;
		this.echarts.on('datazoom', function () {
			_this.defaults.dataZoom_start = this.getOption().dataZoom[0].start;
			_this.defaults.dataZoom_end = this.getOption().dataZoom[0].end;
		});
		return this;
	},
	getOption_barLine_dataZoom: function () {
        return {
            grid: {
	            top: '20%',
	            left: '1%',
	            right: '1%',
				containLabel: true
	        },
			title: {
				show: true,
				left: 'center',
				top: '2%',
				textStyle: {
					fontWeight: 'normal',
					fontSize: 14
				}
			},
		    legend: {
				top: '8%',
				itemGap: this.defaults.legend_itemGap,
				itemWidth: 10,
				itemHeight: 10,
				formatter: this.defaults.legend_formatter,
				textStyle: {
					color: '#999'
				}
		    },
			dataZoom: [
		        {
					type: 'slider',
					show: true,
					start: this.defaults.dataZoom_start,
					end: this.defaults.dataZoom_end,
					backgroundColor: '#fff',
					dataBackground: {
						lineStyle: {
							color: this.defaults.dataZoom_dataBackground_areaStyle_color
						},
						areaStyle: {
							color: this.defaults.dataZoom_dataBackground_areaStyle_color,
							opacity: 1
						}
					},
					fillerColor: this.colorRgb(this.defaults.dataZoom_handleStyle_color, .4),
					borderColor: this.defaults.dataZoom_handleStyle_color,
					handleIcon: 'M10 10 H 22 V 62 H 10 L 10 10',
					handleStyle: {
						color: this.defaults.dataZoom_handleStyle_color
					},
					textStyle: {
						color: this.defaults.dataZoom_handleStyle_color
					}
				}
			]
		};
	}
};



