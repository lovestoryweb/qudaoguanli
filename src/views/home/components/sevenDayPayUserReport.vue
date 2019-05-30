<template>
    <div id="7DayPayUserReport" style="width:100%;height:100%;">
    </div>
</template>
<script>
    import echarts from 'echarts';
import util from '../../../libs/util';
export default {
    name: 'sevenDayPayUserReport',
    mounted () {
        let url = '/market/portal/report/queryChannelOrderList ';
        let ref = this;


        this.$http.get(url, null).then(function(res){
           if(!!res && res.resultCode=='0'){
                var list = res.data;
                if(!!list&&list.length>0){
                    var list = res.data;
                    //显示渠道名称     
                    let channelNameList=[];
                    //显示渠道数据  并且包括图形的类型
                    let channelEntity=[];
                    //时间轴
                    let timeList=[];
                    var entityTemp={};
                    var dataTemp=[];
                    //默认写入一个总计
                    channelNameList.push('总');
                    for (var i = 0; i < list.length; i++) {
                      
                        for (var ii = 0; ii < list[i].channelOrders.length; ii++) {
                          if (channelNameList.indexOf(list[i].channelOrders[ii].channelName)==-1)
                           {
                            channelNameList.push(list[i].channelOrders[ii].channelName);
                           }

                        }
                    }
                    for (var i = 0; i < list.length; i++) {
                        timeList.push(list[i].time);
                    }
                    //总计的实体录入
                        entityTemp={
                              name: '',
                              type: 'bar',
                              barGap: 5,
                              data: [],
                              barMaxWidth : 12,//柱图宽度   
                              barGap: 0.1,             
                              itemStyle: {
                              normal: {
                              //柱形图圆角，初始化效果
                              barBorderRadius:[10, 10, 0, 0],
                              // 定制显示（按顺序）
                              color: function(params) { 
                                  //params 包含了当前数据信息和坐标系的信息。
                              var colorList = ['#3779B6','#84C9F7','#E55D42','#AFD02F','#F8D072', '#F29419','#6EBD6F','#AF915B','#9E9E9F','#C8C9CA','#8DE2B6','#33ACEF','#D5E577','#8AA80E','#FC783D','#FFFF00','#66CC00','#663300','#8AA80E','#FC783D']; 
                                  if (params.seriesIndex<20){
                                  if (params.seriesName=='wap（非渠道）')
                                      {
                                          return '#9E9E9F'
                                      }else if (params.seriesName=='app')
                                      {
                                          return '#C8C9CA'
                                      }
                                          return colorList[params.seriesIndex] 
                                      }
                                      else
                                      {
                                        return ''
                                      }
                                    }
                                  }
                               }
                         };
                        entityTemp.name = '总';
                        dataTemp=[];
                        for (var ii = 0; ii < list.length; ii++) {
                        var totalNum=0;
                        for (var i = 1; i < channelNameList.length; i++) {
                        for (var iii = 0; iii < list[ii].channelOrders.length; iii++) {
                            if (list[ii].channelOrders[iii].channelName==channelNameList[i]) {
                                totalNum=totalNum+list[ii].channelOrders[iii].total*1;
                            }
                        }
                        }
                        dataTemp.push(totalNum);
                        }
                        entityTemp.data = dataTemp;
                        channelEntity.push(entityTemp);
                     // 其他的统计
                    for (var i = 1; i < channelNameList.length; i++) {
                        entityTemp={
                              name: '',
                              type: 'bar',
                              barGap: 0,
                              data: [],
                              barMaxWidth : 12,//柱图宽度   
                              barGap: 0.1,             
                              itemStyle: {
                              normal: {
                              //柱形图圆角，初始化效果
                              barBorderRadius:[10, 10, 0, 0],
                              // 定制显示（按顺序）
                              color: function(params) { 
                              var colorList = ['#3779B6','#84C9F7','#E55D42','#AFD02F','#F8D072', '#F29419','#6EBD6F','#AF915B','#9E9E9F','#C8C9CA','#8DE2B6','#33ACEF','#D5E577','#8AA80E','#FC783D','#FFFF00','#66CC00','#663300','#D5E577','#8AA80E']; 
                                  if (params.seriesIndex<20){
                                  if (params.seriesName=='wap（非渠道）')
                                      {
                                          return '#9E9E9F'
                                      }else if (params.seriesName=='app')
                                      {
                                          return '#C8C9CA'
                                      }
                                          return colorList[params.seriesIndex] 
                                      }
                                      else
                                      {
                                        return ''
                                      }
                                    }
                                  }
                               }
                         };
                        entityTemp.name = channelNameList[i];
                        dataTemp=[];
                        //是否存在该渠道
                        var flag=true;
                        for (var ii = 0; ii < list.length; ii++) {
                        flag=true;
                        for (var iii = 0; iii < list[ii].channelOrders.length; iii++) {
                            if (list[ii].channelOrders[iii].channelName==channelNameList[i]) {
                                dataTemp.push(list[ii].channelOrders[iii].total);
                                flag=false;
                            }
                        }
                        if (flag) 
                        {
                           dataTemp.push(0);
                        }
                        }
                        entityTemp.data = dataTemp;
                        channelEntity.push(entityTemp);
                    }

                let option = {
                    //一次从这里面拉取颜色值
                    color: ['#3779B6','#84C9F7','#E55D42','#AFD02F','#F8D072', '#F29419','#3779B6','#84C9F7','#E55D42','#AFD02F','#F8D072', '#F29419','#6EBD6F','#AF915B','#9E9E9F','#C8C9CA','#8DE2B6','#33ACEF','#D5E577','#8AA80E','#FC783D','#FFFF00','#66CC00','#663300'],
                    tooltip: {
                        trigger: 'axis',  //提示框组件
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        //小图标数据来源
                        data: channelNameList,
                        bottom:0,
                        itemGap: 5,
                        itemWidth:25,
                        left:35,
                        x: 'left',
                        textStyle:{
                           fontSize: 10
                        }
                    },
                    grid:{
                        x:40,
                        y:20,
                        x2:10,
                        y2:60
                    },
                    //工具栏
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                    },
                    calculable: true,
                    //X轴
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            data: timeList
                        }
                    ],
                    yAxis: [
                        {
                            //Y轴类型
                            type: 'value'
                        }
                    ],
                    //数据来源
                     series: channelEntity
                };

                    let incomeCharts = echarts.init(document.getElementById('7DayPayUserReport'));
                    incomeCharts.setOption(option);

                    window.addEventListener('resize', function () {
                        incomeCharts.resize();
                    });
                }
            } 
        });
    }
};
</script>