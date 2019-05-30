<template>
    <div style="width:100%;height:100%;" id="everyDay_income_report_con"></div>
</template>

<script>
import echarts from 'echarts';
import util from '../../../libs/util';
export default {
    name: 'everyDayIncomeReport',

    props: [
      'yearMouth'
    ],
    watch: {
      yearMouth: function(newVal, oldVal) {
      this.getReport();
      },
    },
    mounted () {
        this.getReport();
    },
    methods:{
        getReport(){
        let url = '/market/portal/report/queryDayIncomme';
        let ref = this;
        var params = {
            month: this.yearMouth
        };
        //var d = new Date();
        let year = this.yearMouth.substr(0,4);
        let mouth = this.yearMouth.substr(5,2);
        this.$http.post(url, params).then(function(res){
            if(!!res && res.resultCode=='0'){
                var list=res.data;
                if(!!list){   
                    //显示实际查询数据     
                    let incomeList=[];
                    //显示实际收入数据 
                    let accruedList=[];
                    //时间轴
                    let timeList=[];
                   for(var i=0;i<list.length;i++){
                        timeList.push(list[i].time);
                        incomeList.push(list[i].income);
                        accruedList.push(list[i].estimatedIncome);
                    }
                    // let timeList=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
                    // let incomeList=[87,383,145,696,898,1099];
                    // let accruedList=[82,183,45,266,488,799];
                    let option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            },
                            formatter: function (datas) {
                            var res = year+'-'+(mouth<10?('0'+mouth):mouth)+'-' + datas[0].name+ '<br/>';
                            for (var i = 0, length = datas.length; i < length; i++) {
                               res += datas[i].seriesName + '：' 
                                   + datas[i].data + '<br/>'
                             }
                             return res
                             }
                        },
                        color:['#3779B6','#D95B41'],
                        legend: {
                            data:[ref.$t('Realcyclereturn'),ref.$t('Estimatedcycleearnings')],
                            bottom:0,
                            itemGap: 5,
                            itemWidth:5,
                            x: 'right',
                            textStyle:{
                                fontSize: 8
                            },
                        },
                        grid: {
                            top: '10%',
                            left: '1.2%',
                            right: '2%',
                            bottom: '10%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: timeList,
                                axisLabel:{interval: 0}
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: ref.$t('Realcyclereturn'),
                                type: 'line',
                                stack: '总量1',
                                areaStyle: {normal: {
                                    color: '#3779B6',
                                    opacity:0.2
                                }},
                                lineStyle:{normal: {
                                    color: '#3779B6',
                                    borderWidth: 1,
                                }},
                                data: incomeList
                            },
                            {
                                name: ref.$t('Estimatedcycleearnings'),
                                type: 'line',
                                stack: '总量2',
                                areaStyle: {normal: {
                                    color: '#D95B41',
                                    opacity:0.2
                                }},
                                lineStyle: {normal: {
                                    color: '#D95B41'
                                }},
                                data: accruedList
                            },
                        ]
                    };

                    let incomeCharts = echarts.init(document.getElementById('everyDay_income_report_con'));
                    incomeCharts.setOption(option);

                    window.addEventListener('resize', function () {
                        incomeCharts.resize();
                    });
                }
             } 
        });


        }
    }
};
</script>