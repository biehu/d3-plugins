/*
 * yixin charts 
 * 配置标准化  
 * 
 * echarts类型库依赖 jQuery 和 echarts
 * YXChart.ui下面为自定义组件库依赖d3
 * 
 * @params dom {Element|String} dom对象或者dom元素id
 * @params type {String} 默认defaults类型
 * @params data {Object} 后端返回数据
 * @params params {Object} 默认defaults差异化配置
 * 
 */
var YXCharts = function (dom, defaults) {
	this.dom = typeof dom === 'string' ? document.getElementById(dom) : dom;
	this.defaults = defaults;
	this.ui = YXCharts[this.defaults.type];
	this.uiObj = null;
	this.init();
};

YXCharts.prototype.sendAjax = function () {
	var _this = this;
	YXChart.util.ajax(YXCharts.util.extend(this.defaults.ajax, {
		success: function (data) {
			_this.defaults.data = data;
			_this.wrap();
		}
	}));
};

YXCharts.prototype.wrap = function () {
    var defaults = YXCharts.util.extend(true, {}, this.ui.defaults, this.defaults.defaults);
    if (this.ui.defaultHandles) defaults = this.ui.defaultHandles.init(defaults);
    this.setOption(defaults);
    if (this.ui.helps) this.ui.helps.init(this.dom, this.uiObj);
};

YXCharts.prototype.init = function () {
	this.uiObj = this.ui(this.dom);
	this.defaults.ajax ? this.sendAjax() : this.wrap();
};

['getOption', 'setOption', 'clear'].forEach(function (method) {
	YXCharts.prototype[method] = function () {
		return this.uiObj[method].apply(this.uiObj, arguments);
	};
});

// 工具
YXCharts.util = {
	extend: $.extend,
	ajax: $.ajax
};

// YXCharts.config 为配置项
// 以下针对所有图表公共配置
// 每个图表配置建立一个新的config的属性然后根据需要配置以下三项
// 例如 YXCharts.config.XXX = {}; YXCharts.config.XXX = {defaults: {}, dataHandles: {}, helps: {}};

// defaults 前端默认配置 参考 echarts
// defaultHandles 处理defaults，格式{init: function (defaults) {}, ...}
// helps 处理界面，格式{init: function (dom, echarts) {}, ...}
YXCharts.defaults = {};
YXCharts.defaultHandles = {};
YXCharts.helps = {};

YXCharts.defaultHandles.lineToBorder = {
    init: function (data) {
        data.xAxis[0]['data'] = YXCharts.defaultHandles.lineToBorder.changeX(data.xAxis[0]['data']);
        data.series[0]['data'] = YXCharts.defaultHandles.lineToBorder.changeY(data.series[0]['data']);
		return data;
    },
	
	changeX: function (data) {
        var arrX = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].length == 10) {
                arrX[i] = data[i].substr(5, 10);
            } else {
                arrX[i] = data[i];
            }
        }
        arrX.unshift('a');
        arrX.push('a');
        return arrX;
    },
    
    changeY: function (data) {
        var arr = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i] != 0) {
                
                arr[i] = data[i].substr(0,data[i].length-1);
            } else {
                arr[i] = data[i];
            }
        }

        arr.unshift(arr[0]);
        arr.push(arr[arr.length-1]);
        return arr;
    }
};

YXCharts.helps.diyX = {
	init: function (dom, echarts) {
		var conversionRateLineOption = echarts.getOption();
		var arrX = conversionRateLineOption.xAxis[0]['data']; 
		var wrap = $(dom);
		
		var config = {
	        color: 'color:#2ad9fd;',
	        hover: 'color: #266bcb;background: #00eaff;'
	    };
		
		//线图横坐标
	    var d='<div id="m_div" style="font-size: 9px;text-align: center;margin-left: -10px;margin-top: -18px;"></div>';
		wrap.append(d);
		var dStyle = '<style>' +
		  '#m_div{' + config.color + '}' +
		  '.act_x{' + config.hover + '}' +
		  '</style>';
		wrap.append(dStyle);
	    var w=$('body').width()+20;
	    $('#m_div').width(w);
	    $('#m_div').html('');
	    var tmp='';
	    var wid=w/(arrX.length-1);
	    for(var i=1;i<arrX.length-1;i++){
	        tmp+='<div style="display:inline-block;width:'+wid+'px;text-align:center;"><span style="border-radius:10px;padding:1px 5px">'+arrX[i]+'</span></div>'
	    }
	    $('#m_div').append(tmp);
	    
	    var dv=$('#m_div').find('div span');
	                                        
        wrap.click(function (e) {
            event.stopPropagation();
            if (e.offsetY < conversionRateLineOption.grid.y ||
                this.offsetHeight - e.offsetY < conversionRateLineOption.grid.y2) {
                dv.removeClass('act_x');
            }
        });
	},
	
	onClick: function (d) {
		var dv=$('#m_div').find('div span');
        dv.removeClass('act_x');
        
        var dd=dv.eq(d[0].dataIndex-1);
        if(d[0].dataIndex>0 && d[0].dataIndex<=dv.length){
            dd.addClass('act_x');
        }else{
            dv.removeClass('act_x');
        }
	}
};


