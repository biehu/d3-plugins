ycharts._ui.rateLine = {
	mixins: ['setOption'],
	init: function () {
		this.defaults = {
			tip_textStyle: '#dd0'
		};
		this.echarts = echarts.init(this.dom);
		this.options = {};
		return this;
	},
	_setOption: function () {
		this.options = ycharts.util.extend(true, {}, this.getFormatDefaults(), this.getLineToBorderDefaults());
		this.echarts.setOption(this.options);
		this.diyX();
	},
	getFormatDefaults: function () {
        return {
            tooltip : {
                show:true,
                showContent:false,
                trigger: 'axis',
                backgroundColor:'#17ffe6',
        
                textStyle: {
                    color: '#111f30',
                    },
                    formatter: this.diyXonClick,
                axisPointer:{
                    type:'none'
                }
            },
            grid: { // 控制图的大小，调整下面这些值就可以，
                y: 20,
                y2:30,
                x2:-10,
                x:-10,
                borderWidth:0
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine : {
                        show: true,
                        lineStyle:{
                            color:'#3476d2',
                            width:1
                        }
                    },
                    axisLabel : {
                        show: false,
                        formatter:function(data){
                            if(data=='a'){
                                return ''
                            }else{
                                return data
                            }
                        },
                        margin:15,
                        textStyle:{
                            color:'#2ad9fd',
                            fontStyle:'normal',
                            fontSize: 9
                        }
                    },  
                    axisTick:{
                        show:true,
                        length: 6,
                        onGap: null,
                        lineStyle:{
                            color:'#3476d2',
                        }
                    },
                    splitLine:{
                        show:false
                    },
                    boundaryGap : false,
        //              clickable:false,
                    data : []
                }
            ],
            yAxis : [
                 {
                    type : 'value',
                    axisLine : {show: false},
                    axisLabel : {
                        show:true,
                        margin:-50,
                        formatter: function(data){
                            if(data!=0){
                                return data+'%'
                            }else{
                                return ''
                            }
                        },
                        textStyle:{
                            color:'#000',
                            fontSize: 9,
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    
        //              clickable:false,
                    splitNumber:2
                }
            ],
            
            
            series : [
                {
                    name:'',
                    type:'line',
                    
                    symbol:'circle',
                    symbolSize:5,
                    
                    itemStyle: {
                        normal: {
                            color: '#6dfaff',
                            borderColor: '#3a7ad5',
                            borderWidth: 2,
                            areaStyle:{
                                color:'#266bcb'
                            },
                            lineStyle:{
                                width:2
                            },
                        },
                        emphasis: {
                            color: '#3a7ad5',
                            borderColor: '#6dfaff',
                            borderWidth: 2,
                            label:{
                                show:true,
                                /*position:'top',*/
                                formatter: function(data){
                                    if(data.name=='a'){
                                        return ''
                                    }else{
                                        return data.value+'%'
                                    }
                                },
                                textStyle: {
                                    color: '#2ad9fd',
                                    fontSize: 12,
                                    baseline: 'middle',
                                },
                            }
                            
                        },
                    },
                    
                    smooth:true,
                   
                   /* clickable:false,*/
                    data:[]
                }
            ],
            noDataLoadingOption: {
                text: '暂无数据',
                effect: 'spin',
                effectOption: {
                    backgroundColor:'rgba(0,0,0,0)'
                }
             }
           
        };
    }
	
};



