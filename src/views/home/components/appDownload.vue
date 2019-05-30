<template>
    <div style="width:100%;height:100%;" id="app_download"></div>
</template>

<script>
import echarts from 'echarts';

export default {
    name: 'aooDownload',
    mounted () {

        let url = '/market/portal/report/appRank';
        let ref = this;

        let  download_1;
        let  download_2;
        let  download_3;

        this.$http.post(url, null).then(function(res){
           if(!!res && res.resultCode=='0'){
                var list = res.data;
                if(!!list)
                {   
                    if(!!list[0].appName)
                    {
                        download_1 ={
                            name: '下载量',
                            type: 'gauge',
                            min: 0,
                            max: 9000,
                            detail: {
                                formatter: parseInt(list[0].total)>9000?'{value}+次':'{value}次',
                                fontSize: 18,
                                offsetCenter: [0, '60px']
                            },
                            data: [{value: parseInt(list[0].total), name: '第一名:'+list[0].appName}],
                            center: ['45%', '50%'],
                            radius: '100%',
                            title: {
                                offsetCenter: [0, '80px']
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 15
                                }
                            },
                            splitLine: {
                                length: 15
                            }
                        }
                    }    
                    if(!!list[1].appName)
                    {
                        download_2 ={
                            name: '下载量',
                            type: 'gauge',
                            min: 0,
                            max: 9000,
                            detail: {
                                formatter: parseInt(list[1].total)>9000?'{value}+次':'{value}次',
                                fontSize: 18,
                                offsetCenter: [0, '60px']
                            },
                            data: [{value: parseInt(list[1].total), name: '第二名:'+list[1].appName}],
                            center: ['15%', '50%'],
                            radius: '100%',
                            title: {
                                offsetCenter: [0, '80px']
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 15
                                }
                            },
                            splitLine: {
                                length: 15
                            }
                        }
                    } 
                    if(!!list[2].appName)
                    {
                        download_3 ={
                            name: '下载量',
                            type: 'gauge',
                            min: 0,
                            max: 9000,
                            detail: {
                                formatter: parseInt(list[2].total)>9000?'{value}+次':'{value}次',
                                fontSize: 18,
                                offsetCenter: [0, '60px']
                            },
                            data: [{value: parseInt(list[2].total), name: '第三名:'+list[2].appName}],
                            center: ['75%', '50%'],
                            radius: '100%',
                            title: {
                                offsetCenter: [0, '80px']
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 15
                                }
                            },
                            splitLine: {
                                length: 15
                            }
                        }
                    }
                    
                    let option = {
                        tooltip: {
                            formatter: '{a} <br/>{b} : {c}'
                        },
                        series: [ download_2,download_1,download_3 ]
                    }; 

                    let appDownload = echarts.init(document.getElementById('app_download'));
                    appDownload.setOption(option);

                    window.addEventListener('resize', function () {
                        appDownload.resize();
                    });
                }
            } 
        });
    }
};
</script>
