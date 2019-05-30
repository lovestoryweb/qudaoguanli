<template>
    <div style="width:100%;height:100%;" id="user_source_con"></div>
</template>

<script>
import echarts from 'echarts';
import util from '../../../libs/util';
export default {
    name: 'userSourcePie',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            let url = '/market/portal/report/userSource';
            let ref = this;

            //显示实际查询数据     
            let legendDate=[];
            let seriesDate=[];
            this.$http.post(url, null).then(function(res){
               if(!!res && res.resultCode=='0'){
                    var list = res.data;
                    if(!!list)
                    {   
                        let temp;
                        for(var i=0;i<list.length;i++)
                        {                            
                            legendDate.push(list[i].channel);
                            temp = {value: list[i].total, name: list[i].channel, itemStyle: {normal: {color: util.getRandomColor()}}};
                            seriesDate.push(temp);
                        }
                       
                        let option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b} : {c} ({d}%)'
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: legendDate
                            },
                            series: [
                                {
                                    name: '用户来源',
                                    type: 'pie',
                                    radius: '66%',
                                    center: ['50%', '60%'],
                                    data: seriesDate,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        };
                        var userSourcePie = echarts.init(document.getElementById('user_source_con'));
                        userSourcePie.setOption(option);
                        window.addEventListener('resize', function () {
                            userSourcePie.resize();
                        });
                    }
                } 
            });            
        });
    }
};
</script>
