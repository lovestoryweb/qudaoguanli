<template>
    <div style="width:100%;height:100%;" id="operation_report_con"></div>
</template>

<script>
import echarts from 'echarts';
import util from '../../../libs/util';
export default {
    name: 'operationReport',
    mounted () {
        //显示实际查询数据     
        let userList=[];
        let newUserList=[];
        let payUserList=[];
        let newPayUserList=[];
        let unSubUserList=[];
        let newUnSubUserList=[]; 

        let url = '/market/portal/report/operationReport';
        let ref = this;
        var params = {
            beginTime:util.getBeforeDate(7),
            endTime:util.getBeforeDate(1),
            type:'1'
        };
        this.$http.post(url, params).then(function(res){
           if(!!res && res.resultCode=='0'){
                var list = res.data;
                if(!!list){   
                   for(var i=0;i<list.length;i++){
                        userList.push(list[i].users);
                        newUserList.push(list[i].newUsers);
                        payUserList.push(list[i].payUsers);
                        newPayUserList.push(list[i].newPayUsers);
                        unSubUserList.push(list[i].unSubUsers);
                        newUnSubUserList.push(list[i].newUnSubUsers);
                    }
                    let option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            top: '10%',
                            left: '1.2%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: [util.getBeforeDate(7), util.getBeforeDate(6), util.getBeforeDate(5), util.getBeforeDate(4), util.getBeforeDate(3), 
                                    util.getBeforeDate(2), util.getBeforeDate(1)]
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: ref.$t('usersTotal'),
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#2d8cf0'
                                }},
                                data: userList
                            },
                            {
                                name: ref.$t('newUsersTotal'),
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#10A6FF'
                                }},
                                data: newUserList
                            },
                            {
                                name: ref.$t('payUsersTotal'),
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#0C17A6'
                                }},
                                data: payUserList
                            },
                            {
                                name: ref.$t('newPayUsersTotal'),
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#4608A6'
                                }},
                                data: newPayUserList
                            },
                            {
                                name: ref.$t('totalUserUnsubscribeNumber'),
                                type: 'line',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                areaStyle: {normal: {
                                    color: '#398DBF'
                                }},
                                data: unSubUserList
                            },
                            {
                                name: ref.$t('addUserUnsubscribeNumber'),
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#584d3c'
                                }},
                                data: newUnSubUserList
                            }
                        ]
                    };

                    const reportCharts = echarts.init(document.getElementById('operation_report_con'));
                    reportCharts.setOption(option);

                    window.addEventListener('resize', function () {
                        reportCharts.resize();
                    });
                }
            } 
        });
    }
};
</script>