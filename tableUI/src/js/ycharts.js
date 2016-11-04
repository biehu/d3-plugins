var ycharts = {};
ycharts.ui = {};
ycharts._ui = {};

ycharts.util = {
	extend: $.extend,
    ajax: $.ajax
};

ycharts._create = function (dom, type) {
	this.dom = dom;
    this.type = type;
	this.init();
};

ycharts._mix = function (mixins) {
	if (!mixins) return;
	var self = {}; 
	for (var i = 0; i < mixins.length; i++) {
		if (ycharts.common[mixins[i]]) self[mixins[i]] = ycharts.common[mixins[i]];
	}
	return self;
};

ycharts.init = function (dom, type) {
	if (!ycharts.ui[type]) {
		ycharts.ui[type] = function () {
			ycharts._create.apply(this, arguments);
		};
	    ycharts.util.extend(
		    ycharts.ui[type].prototype, 
		    ycharts._mix(ycharts._ui[type].mixins),
		    ycharts._ui[type]
	    );
    }
	return new ycharts.ui[type](dom, type);
};

ycharts.common = {
	setOption: function (defaults) {
        var _this = this;
		this.defaults = ycharts.util.extend(true, {}, this.defaults, defaults);
        if (defaults.ajaxParams) {
			defaults.ajaxParams.success = function (d) {
				_this.defaults.data = d;
                _this._setOption();
			};
            this.ajax(defaults.ajaxParams);
        } else {
            this._setOption();
        }
		return this;
    },
    getLineToBorderDefaults: function () {
		var changeX = function (data) {
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
	    };
	    var changeY = function (data) {
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
	    };
		var data = ycharts.util.extend(true, {}, this.defaults.data);
        data.xAxis[0]['data'] = changeX(data.xAxis[0]['data']);
        data.series[0]['data'] = changeY(data.series[0]['data']);
		return data;
    },
	diyX: function () {
		var defaults = this.options;
		
        var arrX = defaults.xAxis[0]['data']; 
        var wrap = $(this.dom);
        
        var config = {
            color: 'color:#2ad9fd;',
            hover: 'color: #266bcb;background: #00eaff;'
        };
        
        //线图横坐标
	   if (wrap.find('#m_div').length > 0) wrap.find('#m_div').remove();
		
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
    diyXonClick: function (d) {
        var m_div = $(this.dom).find('#m_div');
        var dv=$(this.dom).find('div span');
        dv.removeClass('act_x');
        
        var dd=dv.eq(d[0].dataIndex-1);
        if(d[0].dataIndex>0 && d[0].dataIndex<=dv.length){
            dd.addClass('act_x');
        }else{
            dv.removeClass('act_x');
        }
    },
	renderTitle: function (title, subTitle) {
		var wrap = this.svg.select('g').append('g').attr(
			{transform:'translate('+(this.defaults.width / 2 - this.defaults.margin.left)+',0)'}
		);
		var text = wrap.attr('class', 'title-wrap').append('text');
		
		text.append('tspan')
			.attr('x', 0)
			.attr('class', 'title')
			.text(title);
		if (subTitle) {
			text.append('tspan')
			    .attr('x', 0)
				.attr('dy', 16)
				.attr('class', 'sub-title')
				.text(subTitle);
		}
	}
};
