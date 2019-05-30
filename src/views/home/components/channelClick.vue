<template>
    <div style="width:100%;height:100%;" id="channel_click_con"></div>
</template>

<script>
import echarts from 'echarts';
import util from '../../../libs/util';
export default {
    name: 'channelReport',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            let url = '/market/portal/report/channelReport';
            let ref = this;
            var params = {
                beginTime:util.getBeforeDate(7),
                endTime:util.getBeforeDate(1),
                channelId: "26092",
                type:'1',
                linkType: "3"
            };
            //显示实际查询数据     
            let appList=[];

            this.$http.post(url, params).then(function(res){
               if(!!res && res.resultCode=='0'){
                    var list = res.data;
                    if(!!list){   
                        let temp;
                        for(var i=0;i<list.length;i++){
                            temp = {value: list[i].clicks, name: '', itemStyle: {normal: {color: '#2d8cf0'}}}
                            appList.push(temp);
                        }

                        let option = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            grid: {
                                top: 0,
                                left: '2%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            },
                            yAxis: {
                                type: 'category',
                                data: [util.getBeforeDate(7), util.getBeforeDate(6), util.getBeforeDate(5), util.getBeforeDate(4), util.getBeforeDate(3), 
                                            util.getBeforeDate(2), util.getBeforeDate(1)],
                                nameTextStyle: {
                                    color: '#c3c3c3'
                                }
                            },
                            series: [
                                {
                                    name: '访问量',
                                    type: 'bar',
                                    data: appList
                                }
                            ]
                        };

                        let channelClick = echarts.init(document.getElementById('channel_click_con'));
                        channelClick.setOption(option);
                        window.addEventListener('resize', function () {
                            channelClick.resize();
                        });
                    }
                } 
            });
        });
    }
};
</script>
