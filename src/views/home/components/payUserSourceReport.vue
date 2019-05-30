<template>
    <div id="payUserSourceReport" style="width:100%;height:100%;">
    </div>
</template>
<script>
    import echarts from 'echarts';
import util from '../../../libs/util';
export default {
    name: 'payUserSourceReport',
    mounted () {
        let url = '/market/portal/report/queryOrderSource';
        let ref = this;
        this.$http.get(url, null).then(function(res){
           if(!!res && res.resultCode=='0'){
                var list = res.data;
                let pData = [];
                var entity={};
                //左边注释条
                var legendData=[];
                var colorList = ['#3779B6','#84C9F7','#E55D42','#AFD02F','#F8D072', '#F29419','#6EBD6F','#AF915B','#9E9E9F','#C8C9CA','#8DE2B6','#33ACEF','#D5E577','#8AA80E','#FC783D']; 
                for (var i = 0; i < list.length; i++) {
                    entity={};
                    entity.value = list[i].total;
                    entity.name = list[i].orderSource;
                    if (i<15)
                     {
                      entity.itemStyle={};
                      entity.itemStyle.normal={};
                      entity.itemStyle.normal.color = colorList[i];
                     }
                    pData.push(entity);
                    legendData.push(list[i].orderSource);
                }
                console.info(JSON.stringify(pData));
                if(!!list){
                 let option = {
                /*tooltip: {
                    trigger: 'item',
                    formatter: "{b} <br/>发生订购总数：{c} <br/>占比：{d}%"
                },*/
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} <br/>"+ref.$t('Totalnumberoforders')+"{c} ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: legendData,
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '55%'],
                        // avoidLabelOverlap: false,
                        center:['40%','50%'],
                        label: {
                            normal: {
                                // formatter: '{a|{b}}{abg|}\n{hr|}\n{per|'+ref.$t('Totalnumberoforders')+'{c}} \n {per|'+ref.$t('Accountedfor')+'{d}%}  ',
                                // backgroundColor: '#eee',
                                // borderColor: '#aaa',
                                // borderWidth: 1,
                                // borderRadius: 4,
                                // shadowBlur:3,
                                // shadowOffsetX: 2,
                                // shadowOffsetY: 2,
                               // shadowColor: '#999',
                                // padding: [0, 7],
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 10,
                                        align: 'center'
                                    },
                                    abg: {
                                        width: '100%',
                                        align: 'left',
                                        height: 22,
                                        borderRadius: [4, 4, 0, 0]
                                    },
                                    hr: {
                                        borderColor: '#aaa',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: 10,
                                        lineHeight: 10
                                    },
                                    per: {
                                        align: 'left',
                                        color: '#999',
                                        padding: [2, 2],
                                        borderRadius: 2,
                                    }
                                }
                            }
                        },
                        data:pData
                    }
                    ]
                    };

                    let incomeCharts = echarts.init(document.getElementById('payUserSourceReport'));
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