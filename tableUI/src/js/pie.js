ycharts._ui.pie = {
	mixins: ['echarts'],
	_defaults: {
		color: ['#78a1ff', '#a883fd', '#00d9bf', '#ff6fdf'],
		title_text:'',
		series_radius: ['15%', '35%'],
		data: {
			legend_data: [],
			series_data: []
		}
	},
	getOption_pie: function () {
		var defaults = this.defaults;
		
        return {
			color: defaults.color,
            title : {
		        text: defaults.title_text,
		        x:'center',
				textStyle: {
					fontSize: 14,
					fontWeight: 'normal'
				}
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c}"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'center',
				itemGap: 15,
				itemWidth: 10,
				itemHeight: 10,
				bottom: '1%',
				orient: 'horizontal',
		        data: defaults.data.legend_data
		    },
		    series: [
		        {
		            name: '访问来源',
		            type: 'pie',
					radius: defaults.series_radius,
		            center: ['50%', '45%'],
		            data: defaults.data.series_data
		        }
		    ]
		};
	}
};



