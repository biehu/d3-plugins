var ycharts = {};
ycharts.ui = {};
ycharts._ui = {};

ycharts.util = {
	extend: $.extend,
    ajax: $.ajax
};

ycharts._mix = function (uiPrototype, _ui) {
	var _uis = [];
	for (var i = 0; i < _ui.mixins.length; i++) {
		_uis.push(ycharts._ui[_ui.mixins[i]]);
	}
	_uis.push(_ui);
	ycharts.util.extend.apply(null, [true, uiPrototype, ycharts.common].concat(_uis));
};

ycharts.init = function (dom, type) {
	if (!ycharts.ui[type]) {
		if (!ycharts._ui[type]) throw new Error('ycharts._ui.' + type + ' is not defined');
		ycharts.ui[type] = function (dom, type) {
			this.dom = dom;
			this.type = type;
		};
		ycharts._mix(ycharts.ui[type].prototype, ycharts._ui[type]);
    }
	return new ycharts.ui[type](dom, type).init();
};

ycharts.common = {
	setOption: function (defaults) {
        var _this = this;
		var args = arguments;
		
        if (defaults.ajaxParams) {
			defaults.ajaxParams.success = function (d) {
				_this.defaults.data = d;
                _this._setOption.apply(_this, args);
			};
            ycharts.util.ajax(defaults.ajaxParams);
        } else {
            this._setOption.apply(_this, args);
        }
		return this;
    },
	getOption: function () {
		return this.defaults;
	}
};

ycharts._ui.d3 = {
	mixins: [],
	_defaults: {},
	init: function () {
		this.defaults = {};
        this.svg = d3.select(this.dom).append("svg").attr('class', this.type);
		this.wrap = null;
		return this;
    },
	_setOption: function (defaults) {
		this.defaults = ycharts.util.extend({}, this._defaults, this.defaults, defaults);
		
		this.defaults.width = $(this.dom).width() - 2 * this.defaults.margin;
		this.defaults.height = $(this.dom).height() - 2 * this.defaults.margin;
		
		this.svg
			.attr({
				width: $(this.dom).width(),
				height: $(this.dom).height()
			})
			.style('font-size', this.defaults.fontSize)
		
		this.wrap = this.svg.append('g')
			.attr('transform', 'translate(' + [this.defaults.margin, this.defaults.margin] + ')');
		this.draw();
    },
	draw: function () {
	},
	clear: function () {
        this.svg.selectAll('g').remove();
		return this;
    },
	destory: function () {
		this.svg.remove();
		return this;
	},
	
	// common
	getDataColor: function (i) {
		return this.defaults.color[i % this.defaults.color.length];
	}
};

ycharts._ui.echarts = {
	mixins: [],
	_defaults: {},
	init: function () {
		this.defaults = {};
		this.echarts = echarts.init(this.dom);
		return this;
	},
	_getOption: function () {
		var optionsArr = [];
		for (var i = 0; i < this.mixins.length; i++) {
			if (this['getOption_' + this.mixins[i]]) {
				optionsArr.push(this['getOption_' + this.mixins[i]]());
			}
		}
		optionsArr.push(this['getOption_' + this.type]());
		return ycharts.util.extend.apply(null, [true, {}].concat(optionsArr))
	},
	_setOption: function (defaults) {
		this.defaults = ycharts.util.extend(true, {}, this._defaults, this.defaults, defaults);
		this.echarts.setOption(this._getOption());
	},
	destory: function () {
		this.echarts.dispose();
	},
	
	// common
	splitYAxis: function () {
		var max = this.defaults.data.series_max;
		var itemScale1, itemScale2;
		if (max.length === 1) {
			vitemScale1 = Math.ceil(max[0] / 5);
			return {max: itemScale * 5, interval: itemScale};
		} else {
			itemScale1 = Math.ceil(max[0] / 5);
			itemScale2 = Math.ceil(max[1] / 5);
			return [
				{max: itemScale1 * 5, interval: itemScale1},
				{max: itemScale2 * 5, interval: itemScale2}
			]
		}
	},
	colorRgb: function(s, o){  
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
	    var sColor = s.toLowerCase();  
	    if(sColor && reg.test(sColor)){  
	        if(sColor.length === 4){  
	            var sColorNew = "#";  
	            for(var i=1; i<4; i+=1){  
	                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
	            }  
	            sColor = sColorNew;  
	        }  
	        //处理六位的颜色值
	        var sColorChange = [];  
	        for(var i=1; i<7; i+=2){  
	            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
	        }  
	        return "rgba(" + sColorChange.join(",") + "," + (o ? o : 1) + ")";  
	    }else{  
	        return sColor;    
	    }  
	}
};
['on', 'off', 'clear', 'dispatchAction'].forEach(function (key) {
	ycharts._ui.echarts[key] = function () {
		this.echarts[key].apply(this.echarts, arguments);
		return this;
	};
});
