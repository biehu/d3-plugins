/*
 * yixin charts 
 * 配置标准化  
 * 
 * echarts类型库依赖 jQuery 和 echarts
 * YXChart.ui下面为自定义组件库依赖d3
 * 
 */
var YXCharts = {};

YXCharts._create = function (dom, options) {
	this.dom = typeof dom === 'string' ? document.getElementById(dom) : dom;
	this.ui = this.options = null;
	if (options) this.setOption(options);
};

YXCharts._create.prototype.sendAjax = function () {
	var _this = this;
	YXChart.util.ajax(YXCharts.util.extend(this.options.ajax, {
		success: function (data) {
			_this.options.defaults.data = data;
			_this.wrap();
		}
	}));
};

YXCharts._create.prototype.wrap = function () {
	var defaults = YXCharts.util.extend(true, {}, this.ui.defaults, this.options.defaults);
    if (this.ui.defaultHandles) defaults = this.ui.defaultHandles.init(this.dom, defaults);
    var uiDefaults = this.ui.init(this.dom, defaults);
    if (this.ui.helps) this.ui.helps.init(this.dom, uiDefaults);
};

YXCharts._create.prototype.setOption = function (options) {
	this.options = options;
	this.ui = YXCharts[this.options.type];
	this.options.ajax ? this.sendAjax() : this.wrap();
};

YXCharts.init = function (dom, options) {
	return new YXCharts._create(dom, options);
};

// 工具
YXCharts.util = {
	extend: $.extend,
	ajax: $.ajax
};

// defaults 前端默认配置 参考 echarts
// defaultHandles 处理defaults，格式{init: function (defaults) {}, ...}
// helps 处理界面，格式{init: function (dom, echarts) {}, ...}
YXCharts.defaults = {};
YXCharts.defaultHandles = {};
YXCharts.helps = {};

YXCharts.defaultHandles.lineToBorder = {
    init: function (dom, defaults) {
		var data = defaults.data;
        data.xAxis[0]['data'] = this.changeX(data.xAxis[0]['data']);
        data.series[0]['data'] = this.changeY(data.series[0]['data']);
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
	init: function (dom, defaults) {
		var arrX = defaults.xAxis[0]['data']; 
		var wrap = $(dom);
		
		var config = {
	        color: 'color:#2ad9fd;',
	        hover: 'color: #266bcb;background: #00eaff;'
	    };
		
		//线图横坐标
	    var d=$('<div id="m_div" style="font-size: 9px;text-align: center;margin-left: -10px;margin-top: -18px;"></div>');
		wrap.append(d);
		var dStyle = '<style>' +
		  '#m_div{' + config.color + '}' +
		  '.act_x{' + config.hover + '}' +
		  '</style>';
		wrap.append(dStyle);
	    var w=wrap.width() + 20;
	    d.width(w);
	    d.html('');
	    var tmp='';
	    var wid=w/(arrX.length-1);
	    for(var i=1;i<arrX.length-1;i++){
	        tmp+='<div style="display:inline-block;width:'+wid+'px;text-align:center;"><span style="border-radius:10px;padding:1px 5px">'+arrX[i]+'</span></div>'
	    }
	    d.append(tmp);
	    
	    var dv=d.find('div span');
	                                        
        wrap.click(function (e) {
            event.stopPropagation();
            if (e.offsetY < defaults.grid.y ||
                this.offsetHeight - e.offsetY < defaults.grid.y2) {
                dv.removeClass('act_x');
            }
        });
	},
	
	onClick: function (dom) {
		return function (d) {
			var m_div = $(dom).find('#m_div');
			var dv=$(dom).find('div span');
	        dv.removeClass('act_x');
	        
	        var dd=dv.eq(d[0].dataIndex-1);
	        if(d[0].dataIndex>0 && d[0].dataIndex<=dv.length){
	            dd.addClass('act_x');
	        }else{
	            dv.removeClass('act_x');
	        }
		};
	}
};


