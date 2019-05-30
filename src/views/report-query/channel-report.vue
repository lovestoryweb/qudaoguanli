<style type="text/css" scoped>
    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .user_field {
        width: 200px!important;
        margin: .5em 0;
    }
    .span_space{
        margin-left: 10px;
        width: 60px;
        display: -webkit-inline-box;
    }
    #chart path {
        fill: transparent;
        stroke: green;
    }

    .ivu-card-bordered{
      border: 0px !important;
    }
    .ivu-card{
      background:#D7D7D7!important;
    }
    .channel_report_card{
      background: #fff;
      border-radius: .4em;
      margin:0 0 10px 0;
      padding:.5em;
    }
    .ivu-card-body{
      padding: 0px;
      border-radius: .4em;  
    }

    .report_card_table{
      background: #fff;
      border-radius: .4em;    
      padding: 1em;
    }
    .report_card_title{
      background: #fff; 
      padding: 1em;
    }
    .report_card_table_background{
      background: #fff!important;
      height: 400px;
      border-bottom-right-radius: .5em;
      border-bottom-left-radius: .5em;
    }
    .clear{
      clear:both;
    }
    .button_search{
      position: absolute;
      right: 1%;
      top: 15%;
    }
    .ivu-table-body .ivu-table-overflowX span{
      word-break: keep-all !important;
    }
</style>

<!-- table不在页面内，修改样式用全局修改 -->
<style type="text/css" >
   .ivu-table-cell{
        padding-left: 0px!important;
        padding-right: 0px!important; 
    }
   .ivu-table-cell span{
      word-break:break-word!important;
    }
    .ivu-table td{
      height: 40px!important;
    }
</style>
<template>
    <div>
       <Row>
            <Col span="24">
                  <div class="channel_report_card">
                    <div slot="title">
                    <!-- 开始时间 -->
                    <Col span="12">
                    <span class="span_space" v-text="$t('startTime')"></span>：
                    <DatePicker 
                      @on-change="startTimeChange"
                      :options="startTimeOptions"
                      v-model="startTime" 
                      :format="timeFormat" 
                      :type="timeType" 
                      :editable='true' 
                      :clearable='false'
                      class="user_field"
                      :placeholder="$t('startTime')">
                    </DatePicker>
                    </Col>
                    <Col span="12">
                    <!-- 结束时间 -->
                    <span class="span_space" v-text="$t('endTime')"></span>：
                    <DatePicker 
                     @on-change="endTimeChange" 
                     :options="endTimeOptions" 
                     v-model="endTime" 
                     :format="timeFormat" 
                     :type="timeType" 
                     :editable='true' 
                     :clearable='false'
                      class="user_field"
                     :placeholder="$t('endTime')">
                    </DatePicker>
                    </Col>
                    </div>
                    <div slot="title">
                    <!--渠道 -->
                    <Col span="12">
                            <span class="span_space" v-text="$t('byDayMouth')"></span>：
                            <Select v-model="type" class="user_field" @on-change="changeByType">
                                <Option value='1' v-text="$t('byDay')"></Option>
                                <Option value='2' v-text="$t('byMouth')"></Option>
                            </Select>
                          </Col>
                          <Col span="12">
                            <!-- 渠道ID -->
                            <span class="span_space" v-text="$t('channelList')"></span>： 
                            <Select v-model="channelId" class="user_field" filterable :placeholder="$t('selectPlaceholder')">
                                <Option value=""></Option>
                                <Option  v-for="item in channelList" :value="item.channelId" :key="item.channelId">{{item.channelName}}</Option>
                            </Select>
                            <span>
                                <Button type="primary" @click="changePageIndex(1)" class="button_search">
                                <Icon type="ios-search" ></Icon>&nbsp;{{$t('search')}} 
                                </Button>
                            </span>
                          </Col>
                    </div>
                  <!--   <div slot="title"> -->
                        <!--游戏名称 -->
                     <!--    <Col span="24"> -->
                            <!--链接类型 -->
                           <!--  <span class="span_space" v-text="$t('linkNameCol')"></span>：
                            <Select v-model="linkType" class="user_field" filterable :placeholder="$t('selectPlaceholder')">
                                <Option value="" ></Option>
                                <Option value='3' >{{$t('landingPageAdv')}}</Option>
                                <Option value='4' >{{$t('wapShopAdv')}}</Option>
                                <Option value='5' >{{$t('appAdv')}}</Option>
                            </Select>
                            <span>
                                <Button type="primary" @click="changePageIndex(1)" class="button_search">
                                <Icon type="ios-search" ></Icon>&nbsp;{{$t('search')}} 
                                </Button>
                            </span>
                        </Col>
                    </div> -->
                        <div class="clear" />
                  </div>
                    <div class="report_card_table">
                        <Table border :columns="columns" :data="tableData" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" @on-change="changePageIndex"  :page-size="pageSize"></Page>
                        </Row>
                    </div>
                     <div id='svgContainer' class="report_card_title">
                        <div class="every">
                          <h3 v-text="chartTitle">
                          </h3>
                        </div>
                      </div>
                    <div id="container" class="report_card_table_background"></div>
            </Col>
        </Row>
    </div>
</template>

<script>
import axios from 'axios';
import util from '../../libs/util';
import * as echarts from 'echarts';
export default {
    name: 'ApplicationReportManagements',
    data () {
        return {
            startTimeVal:'',//开始时间提交值
            endTimeVal:'',//结束时间提交值
            startTime:'',//开始时间
            endTime:'',//结束时间
            type:'1',//按月或者按日
            pageIndex: 1,//查询页码
            pageSize: 15,//查询大小
            total: 0, //总数  
            loadingTable: false,//表格是否loading
            channelList:[],//渠道列表
            channelId:'',//渠道ID
            linkType:'',//链接类型ID
            startTimeOptions: {}, //开始日期设置
            endTimeOptions: {}, //结束日期设置
            lineData: [],
            areaData: [],
            timeType:'date',
            timeFormat:'yyyy-MM-dd',
            chartTitle:'',
            columns: [],
            //列表的标题列
            columns1: [
               /* {
                    name: '',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span',params.index+1)
                    }
                },*/
                {
                    title: this.$t('statisticalTime'),
                    key: 'reportTime',
                    align: 'center',
                    minWidth: 80,
                    fixed: 'left'
                },
                {
                    title: this.$t('channelName'),
                    key: 'channelName',
                    align: 'center',
                    minWidth: 250
                },
                {
                    title: this.$t('appNameCol'),
                    key: 'appName',
                    align: 'center',
                    minWidth: 160,
                },
                {
                    title: this.$t('linkNameCol'),
                    key: 'linkType',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        var str = "";
                        if(params.row.linkType == 3){
                            str = this.$t('landingPageAdv');
                        }else if(params.row.linkType == 4){
                            str = this.$t('wapShopAdv');
                        }else if(params.row.linkType == 5){
                            str = this.$t('appAdv');
                        }
                        return h('span',str);
                    }
                },
                {
                    title: this.$t('clickRate'),
                    key: 'clicks',
                    align: 'center',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('clickRate'),params.row.channelName,'clicks')
                               }
                           }
                       }, params.row.clicks)
                       ]);
                    }
                },
                {
                    title: this.$t('percentConversion'),
                    key: 'percentConversion',
                    align: 'center',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReportOther(params.row.channelId,this.$t('percentConversion'),params.row.channelName,'newOrderUsers','clicks')
                               }
                           }
                       }, !!params.row.clicks&&params.row.clicks!=='0'?this.accMul(Math.ceil(this.accMul(params.row.newOrderUsers/params.row.clicks *1,10000))/10000,100) +'%':'0%')
                       ]);
                    }
                },
                {
                    title: this.$t('totalClickRate'),
                    key: 'downLoads',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalClickRate'),params.row.channelName,'downLoads')
                               }
                           }
                       }, params.row.downLoads)
                       ]);
                    }
                },
                {
                    title: this.$t('appDownloads'),
                    key: 'gameDownloads',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.gameDownloads,this.$t('appDownloads'),params.row.channelName,'gameDownloads')
                               }
                           }
                       }, params.row.gameDownloads)
                       ]);
                    }
                },
                {
                    title: this.$t('appDownloadsCol'),
                    key: 'storeDownloads',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.storeDownloads,this.$t('appDownloadsCol'),params.row.channelName,'storeDownloads')
                               }
                           }
                       }, params.row.storeDownloads)
                       ]);
                    }
                },
                {
                    title: this.$t('totalUserNumber'),
                    key: 'users',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalUserNumber'),params.row.channelName,'users')
                               }
                           }
                       }, params.row.users)
                       ]);
                    }
                },
                {
                    title: this.$t('addRegisterUserNumber'),
                    key: 'newUsers',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('addRegisterUserNumber'),params.row.channelName,'newUsers')
                               }
                           }
                       }, params.row.newUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('totalPayUserNumber'),
                    key: 'orderUsers',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalPayUserNumber'),params.row.channelName,'orderUsers')
                               }
                           }
                       }, params.row.orderUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('addOrderUserNumber'),
                    key: 'newOrderUsers',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('addOrderUserNumber'),params.row.channelName,'newOrderUsers')
                               }
                           }
                       }, params.row.newOrderUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('newOrderCountCol'),
                    key: 'newOrderCount',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('newOrderCountCol'),'newOrderCount')
                               }
                           }
                       }, params.row.newOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('renewOrderCountCol'),
                    key: 'renewOrderCount',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('renewOrderCountCol'),'renewOrderCount')
                               }
                           }
                       }, params.row.renewOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('renewOrderSuccessCountCol'),
                    key: 'renewOrderSuccessCount',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('renewOrderSuccessCountCol'),'renewOrderSuccessCount')
                               }
                           }
                       }, params.row.renewOrderSuccessCount)
                       ]);
                    }
                },
                {
                    title: this.$t('totalUserUnsubscribeNumber'),
                    key: 'unSubUsers',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalUserUnsubscribeNumber'),params.row.channelName,'unSubUsers')
                               }
                           }
                       }, params.row.unSubUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('addUserUnsubscribeNumber'),
                    key: 'newUnSubUsers',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('addUserUnsubscribeNumber'),params.row.channelName,'newUnSubUsers')
                               }
                           }
                       }, params.row.newUnSubUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('sevenDayPayKeepNumber'),
                    key: 'sevenDayOrderRemain',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('sevenDayPayKeepNumber'),params.row.channelName,'sevenDayOrderRemain')
                               }
                           }
                       }, params.row.sevenDayOrderRemain)
                       ]);
                    }
                },
                {
                    title: this.$t('sevenDayPayKeepRate'),
                    key: 'sevenDayOrderRate',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('sevenDayPayKeepRate'),params.row.channelName,'sevenDayOrderRate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.sevenDayOrderRate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('thirtyDayMemberKeepNumber'),
                    key: 'thirtyDayOrderRemain',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('thirtyDayMemberKeepNumber'),params.row.channelName,'thirtyDayOrderRemain')
                               }
                           }
                       }, params.row.thirtyDayOrderRemain)
                       ]);
                    }
                },
                {
                    title: this.$t('thirtyDayMemberKeepRate'),
                    key: 'thirtyDayOrderRate',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('thirtyDayMemberKeepRate'),params.row.channelName,'thirtyDayOrderRate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.thirtyDayOrderRate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('repeatOrderCountCol'),
                    key: 'repeatOrderCount',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('repeatOrderCountCol'),params.row.channelName,'repeatOrderCount')
                               }
                           }
                       }, params.row.repeatOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('repeatOrderRemainCol'),
                    key: 'repeatOrderRemain',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('repeatOrderRemainCol'),params.row.channelName,'repeatOrderRemain')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.repeatOrderRemain *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                // {
                //     title: this.$t('repeateOrderUserRateCol'),
                //     key: 'repeateOrderUserRate',
                //     align: 'center',
                //     minWidth: 130,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(params.row.channelId,this.$t('repeateOrderUserRateCol'),params.row.channelName,'repeateOrderUserRate')
                //                }
                //            }
                //        }, this.accMul(Math.ceil(this.accMul(params.row.repeateOrderUserRate *1,10000))/10000,100) +'%')
                //        ]);
                //     }
                // },
                {
                    title: this.$t('realEarningsCol'),
                    key: 'todayRealIncome',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('realEarningsCol'),params.row.channelName,'todayRealIncome')
                               }
                           }
                       }, params.row.todayRealIncome)
                       ]);
                    }
                },
                {
                    title: this.$t('shouldIncomeCol'),
                    key: 'shouldIncome',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('shouldIncomeCol'),params.row.channelName,'shouldIncome')
                               }
                           }
                       }, params.row.shouldIncome)
                       ]);
                    }
                },
                {
                    title: this.$t('actualIncomeCol'),
                    key: 'actualIncome',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('actualIncomeCol'),params.row.channelName,'actualIncome')
                               }
                           }
                       }, params.row.actualIncome)
                       ]);
                    }
                },
                {
                    title: this.$t('incomeRateCol'),
                    key: 'incomeRate',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('incomeRateCol'),params.row.channelName,'incomeRate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.incomeRate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('eightDayOrderCountCol'),
                    key: 'eightDayOrderCount',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('eightDayOrderCountCol'),params.row.channelName,'eightDayOrderCount')
                               }
                           }
                       }, params.row.eightDayOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('payedUserCountCol'),
                    key: 'payedUserCount',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('payedUserCountCol'),params.row.channelName,'payedUserCount')
                               }
                           }
                       }, params.row.payedUserCount)
                       ]);
                    }
                },
                {
                    title: this.$t('unpaidUserCountCol'),
                    key: 'unpaidUserCount',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('unpaidUserCountCol'),params.row.channelName,'unpaidUserCount')
                               }
                           }
                       }, params.row.unpaidUserCount)
                       ]);
                    }
                }
            ],
            tableData: [],
            columns2:[  {
                    title: this.$t('statisticalTime'),
                    key: 'reportTime',
                    align: 'center',
                    minWidth: 80,
                    fixed: 'left'
                },
                {
                    title: this.$t('channelName'),
                    key: 'channelName',
                    align: 'center',
                    minWidth: 250
                },
                {
                    title: this.$t('appNameCol'),
                    key: 'appName',
                    align: 'center',
                    minWidth: 160,
                },
                {
                    title: this.$t('linkNameCol'),
                    key: 'linkType',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        var str = "";
                        if(params.row.linkType == 3){
                            str = this.$t('landingPageAdv');
                        }else if(params.row.linkType == 4){
                            str = this.$t('wapShopAdv');
                        }else if(params.row.linkType == 5){
                            str = this.$t('appAdv');
                        }
                        return h('span',str);
                    }
                },
                {
                    title: this.$t('clickRate'),
                    key: 'clicks',
                    align: 'center',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('clickRate'),params.row.channelName,'clicks')
                               }
                           }
                       }, params.row.clicks)
                       ]);
                    }
                },
                {
                    title: this.$t('percentConversion'),
                    key: 'percentConversion',
                    align: 'center',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReportOther(params.row.channelId,this.$t('percentConversion'),params.row.channelName,'newOrderUsers','clicks')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.newOrderUsers/params.row.clicks *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('totalClickRate'),
                    key: 'downLoads',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalClickRate'),params.row.channelName,'downLoads')
                               }
                           }
                       }, params.row.downLoads)
                       ]);
                    }
                },
                {
                    title: this.$t('appDownloads'),
                    key: 'gameDownloads',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.gameDownloads,this.$t('appDownloads'),params.row.channelName,'gameDownloads')
                               }
                           }
                       }, params.row.gameDownloads)
                       ]);
                    }
                },
                {
                    title: this.$t('appDownloadsCol'),
                    key: 'storeDownloads',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.storeDownloads,this.$t('appDownloadsCol'),params.row.channelName,'storeDownloads')
                               }
                           }
                       }, params.row.storeDownloads)
                       ]);
                    }
                },
                {
                    title: this.$t('totalUserNumber'),
                    key: 'users',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalUserNumber'),params.row.channelName,'users')
                               }
                           }
                       }, params.row.users)
                       ]);
                    }
                },
                {
                    title: this.$t('addRegisterUserNumber'),
                    key: 'newUsers',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('addRegisterUserNumber'),params.row.channelName,'newUsers')
                               }
                           }
                       }, params.row.newUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('totalPayUserNumber'),
                    key: 'orderUsers',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalPayUserNumber'),params.row.channelName,'orderUsers')
                               }
                           }
                       }, params.row.orderUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('addOrderUserNumber'),
                    key: 'newOrderUsers',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('addOrderUserNumber'),params.row.channelName,'newOrderUsers')
                               }
                           }
                       }, params.row.newOrderUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('newOrderCountCol'),
                    key: 'newOrderCount',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('newOrderCountCol'),'newOrderCount')
                               }
                           }
                       }, params.row.newOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('renewOrderCountCol'),
                    key: 'renewOrderCount',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('renewOrderCountCol'),'renewOrderCount')
                               }
                           }
                       }, params.row.renewOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('renewOrderSuccessCountCol'),
                    key: 'renewOrderSuccessCount',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('renewOrderSuccessCountCol'),'renewOrderSuccessCount')
                               }
                           }
                       }, params.row.renewOrderSuccessCount)
                       ]);
                    }
                },
                {
                    title: this.$t('totalUserUnsubscribeNumber'),
                    key: 'unSubUsers',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('totalUserUnsubscribeNumber'),params.row.channelName,'unSubUsers')
                               }
                           }
                       }, params.row.unSubUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('addUserUnsubscribeNumber'),
                    key: 'newUnSubUsers',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('addUserUnsubscribeNumber'),params.row.channelName,'newUnSubUsers')
                               }
                           }
                       }, params.row.newUnSubUsers)
                       ]);
                    }
                },
                
                {
                    title: this.$t('repeatOrderCountCol'),
                    key: 'repeatOrderCount',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('repeatOrderCountCol'),params.row.channelName,'repeatOrderCount')
                               }
                           }
                       }, params.row.repeatOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('repeatOrderRemainCol'),
                    key: 'repeatOrderRemain',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('repeatOrderRemainCol'),params.row.channelName,'repeatOrderRemain')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.repeatOrderRemain *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                // {
                //     title: this.$t('repeateOrderUserRateCol'),
                //     key: 'repeateOrderUserRate',
                //     align: 'center',
                //     minWidth: 130,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(params.row.channelId,this.$t('repeateOrderUserRateCol'),params.row.channelName,'repeateOrderUserRate')
                //                }
                //            }
                //        }, this.accMul(Math.ceil(this.accMul(params.row.repeateOrderUserRate *1,10000))/10000,100) +'%')
                //        ]);
                //     }
                // },
                {
                    title: this.$t('realEarningsCol'),
                    key: 'todayRealIncome',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('realEarningsCol'),params.row.channelName,'todayRealIncome')
                               }
                           }
                       }, params.row.todayRealIncome)
                       ]);
                    }
                },
                {
                    title: this.$t('shouldIncomeCol'),
                    key: 'shouldIncome',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('shouldIncomeCol'),params.row.channelName,'shouldIncome')
                               }
                           }
                       }, params.row.shouldIncome)
                       ]);
                    }
                },
                {
                    title: this.$t('actualIncomeCol'),
                    key: 'actualIncome',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('actualIncomeCol'),params.row.channelName,'actualIncome')
                               }
                           }
                       }, params.row.actualIncome)
                       ]);
                    }
                },
                {
                    title: this.$t('incomeRateCol'),
                    key: 'incomeRate',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('incomeRateCol'),params.row.channelName,'incomeRate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.incomeRate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('eightDayOrderCountCol'),
                    key: 'eightDayOrderCount',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('eightDayOrderCountCol'),params.row.channelName,'eightDayOrderCount')
                               }
                           }
                       }, params.row.eightDayOrderCount)
                       ]);
                    }
                },
                {
                    title: this.$t('payedUserCountCol'),
                    key: 'payedUserCount',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('payedUserCountCol'),params.row.channelName,'payedUserCount')
                               }
                           }
                       }, params.row.payedUserCount)
                       ]);
                    }
                },
                {
                    title: this.$t('unpaidUserCountCol'),
                    key: 'unpaidUserCount',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.channelId,this.$t('unpaidUserCountCol'),params.row.channelName,'unpaidUserCount')
                               }
                           }
                       }, params.row.unpaidUserCount)
                       ]);
                    }
                }],
        };
    },
    created() {
        this.loadingChannel();
        this.columns=this.columns1;
    },
  watch: {
  },
  mounted () {
  },
    methods: {
        loadingData(){
            this.clearEchart();
            let url = '/market/portal/report/channelReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.type,
                linkType:this.linkType,
                channelId:this.channelId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            if (this.type=='2') 
            {
               this.columns=this.columns2;
            }else
            {
               this.columns=this.columns1;
            }
            // console.log(params);
            this.$http.post(url, params).then(
                function(res){
                    ref.tableData = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.tableData.push(list[i]);
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        //分页
        changePageIndex(pageIndex){
            if (!!!this.startTime||!!!this.endTime) {
                this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                    desc: this.$t('dateNullWarning')
                });
                return
            }
            if(this.validateDate(this.startTime,this.endTime)){
               this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                  desc: this.$t('startTimeBigerEndTime')
               });
               return 
            }
            /*判断是否超过31天*/
            if(this.validateDayDate(this.startTime,this.endTime,this.type)==1){
               this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                  desc: this.$t('byDayOverDay')
               });
               return 
            }
            /*判断是否超过一年*/
            if(this.validateDayDate(this.startTime,this.endTime,this.type)==2){
               this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                  desc: this.$t('byMouthOverMouth')
               });
               return 
            }
            /*判断是否超过一年*/
            if(!this.channelId){
               this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                  desc: this.$t('channelNameWarning')
               });
               return 
            }
            this.pageIndex = pageIndex;
            this.loadingData();
        },
        /*加载渠道列表*/
        loadingChannel(){
            let url = '/market/portal/channel/queryChannelList';
            let ref = this;
            var params = {
                pageIndex: 1,
                pageSize: 99999,
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.channelList = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.channelList.push(list[i]);
                            }
                        }
                    }
                }
            );
        },
        changeByType(){
            if (this.type==1)
             {
               this.timeType="date";
               this.timeFormat="yyyy-MM-dd";
               if (!!this.startTime) {
                    this.startTimeVal=this.changceDateTime(this.startTime).substring(0,10);
               }
               if (!!this.endTime) {
                    this.endTimeVal=this.changceDateTime(this.endTime).substring(0,10);
               }
             }else
             {
               this.timeType="month";
               this.timeFormat="yyyy-MM";
               if (!!this.startTime) {
                    this.startTimeVal=this.changceDateTime(this.startTime).substring(0,7);
               }
               if (!!this.endTime) {
                    this.endTimeVal=this.changceDateTime(this.endTime).substring(0,7);
               }
             }
        },

      startTimeChange: function(e) { //设置开始时间
        this.startTimeVal=e;
        this.startTime = e;
        this.endTimeOptions = {
          disabledDate: date => {
            let starttime = this.startTime ? new Date(this.startTime).valueOf() : '';
            return date && (date.valueOf() < starttime);
          }
        }
      },
      endTimeChange: function(e) { //设置结束时间
        this.endTimeVal = e;
         this.endTime = e;
        let endtime = this.endTime ? new Date(this.endTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
        this.startTimeOptions = {
          disabledDate(date) {
            return date && date.valueOf() > endtime;
          }
        }
      },

        //删除app主题
    generateReport(id,title,appName,sort){
            let url = '/market/portal/report/channelReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.type,
                linkType:this.linkType,
                channelId:id,
                pageIndex: 1,
                pageSize: 9999,
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){

                        ref.areaData=[];
                        ref.lineData=[];
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.areaData.push(list[i].reportTime);
                                ref.lineData.push(list[i][sort]);
                            }
                        }
                        ref.chartTitle=appName+title
                        ref.getEchart();
                    }
                }
            );
    },
        //删除app主题
    generateReportOther(id,title,appName,sort1,sort2){
            let url = '/market/portal/report/channelReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.type,
                linkType:this.linkType,
                channelId:id,
                pageIndex: 1,
                pageSize: 9999,
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){

                        ref.areaData=[];
                        ref.lineData=[];
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.areaData.push(list[i].reportTime);
                                ref.lineData.push(ref.accMul(Math.ceil(ref.accMul(list[i][sort1]/list[i][sort2] *1,10000))/10000,100) );
                            }
                        }
                        ref.chartTitle=appName+title
                        ref.getEchart();
                    }
                }
            );
    },
    getEchart(){
            var dom = document.getElementById("container");
            var myChart = echarts.init(dom);
            var app = {};
            var option = null;
            option = {
                xAxis: {
                    type: 'category',
                    data: this.areaData
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.lineData,
                    type: 'line',
                    smooth: true
                }]
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }

         },
         clearEchart(){
            this.chartTitle = '';
            var dom = echarts.init(document.getElementById('container'));
            dom.clear();
         },
         /*校验开始时间晚于结束时间*/
        validateDate (startTime, endTime) {
          var beginTime = startTime;
          var endTime = endTime;
          var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
          if (a >= 0) {
            return false;
          }
          else {
            return true;
          }

        },
         /*校验开始时间晚于结束时间*/
        validateDayDate (startTime, endTime,type) {
          var beginTime = startTime;
          var endTime = endTime;
          var a = Date.parse(endTime) - Date.parse(beginTime);
          var dateSpan = Math.abs(a);
          var iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
          if (type==1&&iDays>31) {
            return 1;
          }
          else if(type==2&&iDays>366){
            return 2;
          }else
          {
            return 3;
          }

        },
        changceDateTime(date)
        {
          var yy = date.getFullYear();      //年
          var mm = date.getMonth() + 1;     //月
          var dd = date.getDate();          //日
          var hh = date.getHours();         //时
          var ii = date.getMinutes();       //分
          var ss = date.getSeconds();       //秒
          var clock = yy + "-";
          if(mm < 10) clock += "0";
          clock += mm + "-";
          if(dd < 10) clock += "0";
          clock += dd + " ";
          return clock;     //获取当前日期
        },
        accMul(arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) {}
            try {
                m += s2.split(".")[1].length
            } catch (e) {}
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }
    }
};

</script>
