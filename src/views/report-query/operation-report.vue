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
    .report_card{
      background: #fff;
      border-radius: .4em;
      margin:0 0 10px 0;
      padding:.5em;
    }
   .ivu-card-body{
      padding: 0px!important;
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
                  <div class="report_card">
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
                        <!--游戏名称 -->
                        <Col span="24">
                            <!--渠道 -->
                            <span class="span_space" v-text="$t('byDayMouth')"></span>：
                            <Select v-model="type" class="user_field" @on-change="changeByType">
                                <Option value='1' v-text="$t('byDay')"></Option>
                                <Option value='2' v-text="$t('byMouth')"></Option>
                            </Select>
                            <span>
                                <Button type="primary" @click="changePageIndex(1)" class="button_search">
                                <Icon type="ios-search" ></Icon>&nbsp;{{$t('search')}} 
                                </Button>
                            </span>
                        </Col>
                    </div>
                        <div class="clear"/>
                  </div>  
                    <div class="report_card_table">
                        <Table border :columns="columns" :data="tableData" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" @on-change="changePageIndex" :page-size="pageSize"></Page>
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
                // {
                //     name: '',
                //     key: 'index',
                //     width: 60,
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('span',params.index+1)
                //     }
                // },
                {
                    title: this.$t('statisticalTime'),
                    key: 'reportTime',
                    align: 'center',
                    minWidth: 80,
                    fixed: 'left'
                },
                {
                    title: this.$t('totalnumberofregisteredusers'),
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
                                  this.generateReport(this.$t('totalnumberofregisteredusers'),'users')
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
                                  this.generateReport(this.$t('addRegisterUserNumber'),'newUsers')
                               }
                           }
                       }, params.row.newUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('totalPayUserNumber'),
                    key: 'payUsers',
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
                                  this.generateReport(this.$t('totalPayUserNumber'),'payUsers')
                               }
                           }
                       }, params.row.payUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('addOrderUserNumber'),
                    key: 'newPayUsers',
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
                                  this.generateReport(this.$t('addOrderUserNumber'),'newPayUsers')
                               }
                           }
                       }, params.row.newPayUsers)
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
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('totalUserUnsubscribeNumber'),'unSubUsers')
                               }
                           }
                       }, params.row.unSubUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('unSubLateTotal'),
                    key: 'unSubLate',
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
                                  this.generateReport(this.$t('unSubLateTotal'),'unSubLate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.unSubLate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('newUserUnsubscribeNumber'),
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
                                  this.generateReport(this.$t('newUserUnsubscribeNumber'),'newUnSubUsers')
                               }
                           }
                       }, params.row.newUnSubUsers)
                       ]);
                    }
                },
                // {
                //     title: this.$t('newUserUnsubscribeRate'),
                //     key: 'newUnSubLate',
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
                //                   this.generateReport(this.$t('newUserUnsubscribeRate'),'newUnSubLate')
                //                }
                //            }
                //        }, this.accMul(Math.ceil(this.accMul(params.row.newUnSubLate *1,10000))/10000,100) +'%')
                //        ]);
                //     }
                // },
                {
                    title: this.$t('sevenDayMemberKeepNumber'),
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
                                  this.generateReport(this.$t('sevenDayMemberKeepNumber'),'sevenDayOrderRemain')
                               }
                           }
                       }, params.row.sevenDayOrderRemain)
                       ]);
                    }
                },
                {
                    title: this.$t('sevenDayMemberKeepRate'),
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
                                  this.generateReport(this.$t('sevenDayMemberKeepRate'),'sevenDayOrderRate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.sevenDayOrderRate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },{
                    title: this.$t('thirtyDayMemberKeepNumber'),
                    key: 'fourteenDayOrderRemain',
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
                                  this.generateReport(this.$t('thirtyDayMemberKeepNumber'),'fourteenDayOrderRemain')
                               }
                           }
                       }, params.row.fourteenDayOrderRemain)
                       ]);
                    }
                },
                {
                    title: this.$t('thirtyDayMemberKeepRate'),
                    key: 'fourteenDayOrderRate',
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
                                  this.generateReport(this.$t('thirtyDayMemberKeepRate'),'fourteenDayOrderRate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.fourteenDayOrderRate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
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
                                  this.generateReport(this.$t('realEarningsCol'),'todayRealIncome')
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
                                  this.generateReport(this.$t('shouldIncomeCol'),'shouldIncome')
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
                                  this.generateReport(this.$t('actualIncomeCol'),'actualIncome')
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
                                  this.generateReport(this.$t('incomeRateCol'),'incomeRate')
                               }
                           }
                       },  this.accMul(Math.ceil(this.accMul(params.row.incomeRate *1,10000))/10000,100) +'%')
                       
                       ]);
                    }
                },
                {
                    title: this.$t('NumberOfSubscribersWithin7DaysOfOrderingCol'),
                    key: 'sevenDayOrderUser',
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
                                  this.generateReport(this.$t('NumberOfSubscribersWithin7DaysOfOrderingCol'),'sevenDayOrderUser')
                               }
                           }
                       }, params.row.sevenDayOrderUser)
                       
                       ]);
                    }
                },
                {
                    title: this.$t('paidUsersCol'),
                    key: 'payedUsers',
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
                                  this.generateReport(this.$t('paidUsersCol'),'payedUsers')
                               }
                           }
                       }, params.row.payedUsers)
                       
                       ]);
                    }
                },
                {
                    title: this.$t('unpaidUsersCol'),
                    key: 'unpayUsers',
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
                                  this.generateReport(this.$t('unpaidUsersCol'),'unpayUsers')
                               }
                           }
                       }, params.row.unpayUsers)
                       
                       ]);
                    }
                },
                {
                    title: this.$t('appStoreDownloadCountCol'),
                    key: 'appStoreDownloadCount',
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
                                  this.generateReport(this.$t('appStoreDownloadCountCol'),'appStoreDownloadCount')
                               }
                           }
                       }, params.row.appStoreDownloadCount)
                       
                       ]);
                    }
                },
                // {
                //     title: this.$t('appStoreDownloadUserCountCol'),
                //     key: 'appStoreDownloadUserCount',
                //     align: 'center',
                //     minWidth: 100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(this.$t('appStoreDownloadUserCountCol'),'appStoreDownloadUserCount')
                //                }
                //            }
                //        }, params.row.appStoreDownloadUserCount)
                       
                //        ]);
                //     }
                // },
                {
                    title: this.$t('appStoreInstallCountCol'),
                    key: 'appStoreInstallCount',
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
                                  this.generateReport(this.$t('appStoreInstallCountCol'),'appStoreInstallCount')
                               }
                           }
                       }, params.row.appStoreInstallCount)
                       
                       ]);
                    }
                },
                // {
                //     title: this.$t('appStoreLanuchCountCol'),
                //     key: 'appStoreLanuchCount',
                //     align: 'center',
                //     minWidth: 90,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(this.$t('appStoreLanuchCountCol'),'appStoreLanuchCount')
                //                }
                //            }
                //        }, params.row.appStoreLanuchCount)
                       
                //        ]);
                //     }
                // },
                // {
                //     title: this.$t('appStoreLanuchUserCountCol'),
                //     key: 'appStoreLanuchUserCount',
                //     align: 'center',
                //     minWidth: 100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(this.$t('appStoreLanuchUserCountCol'),'appStoreLanuchUserCount')
                //                }
                //            }
                //        }, params.row.appStoreLanuchUserCount)
                       
                //        ]);
                //     }
                // }
            ],
            //列表的标题列
            columns2: [
                // {
                //     name: '',
                //     key: 'index',
                //     width: 60,
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('span',params.index+1)
                //     }
                // },
                {
                    title: this.$t('statisticalTime'),
                    key: 'reportTime',
                    align: 'center',
                    minWidth: 80,
                    fixed: 'left'
                },
                {
                    title: this.$t('totalnumberofregisteredusers'),
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
                                  this.generateReport(this.$t('totalnumberofregisteredusers'),'users')
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
                                  this.generateReport(this.$t('addRegisterUserNumber'),'newUsers')
                               }
                           }
                       }, params.row.newUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('totalPayUserNumber'),
                    key: 'payUsers',
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
                                  this.generateReport(this.$t('totalPayUserNumber'),'payUsers')
                               }
                           }
                       }, params.row.payUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('addOrderUserNumber'),
                    key: 'newPayUsers',
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
                                  this.generateReport(this.$t('addOrderUserNumber'),'newPayUsers')
                               }
                           }
                       }, params.row.newPayUsers)
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
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(this.$t('totalUserUnsubscribeNumber'),'unSubUsers')
                               }
                           }
                       }, params.row.unSubUsers)
                       ]);
                    }
                },
                {
                    title: this.$t('unSubLateTotal'),
                    key: 'unSubLate',
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
                                  this.generateReport(this.$t('unSubLateTotal'),'unSubLate')
                               }
                           }
                       }, this.accMul(Math.ceil(this.accMul(params.row.unSubLate *1,10000))/10000,100) +'%')
                       ]);
                    }
                },
                {
                    title: this.$t('newUserUnsubscribeNumber'),
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
                                  this.generateReport(this.$t('newUserUnsubscribeNumber'),'newUnSubUsers')
                               }
                           }
                       }, params.row.newUnSubUsers)
                       ]);
                    }
                },
                // {
                //     title: this.$t('newUserUnsubscribeRate'),
                //     key: 'newUnSubLate',
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
                //                   this.generateReport(this.$t('newUserUnsubscribeRate'),'newUnSubLate')
                //                }
                //            }
                //        }, this.accMul(Math.ceil(this.accMul(params.row.newUnSubLate *1,10000))/10000,100) +'%')
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
                                  this.generateReport(this.$t('realEarningsCol'),'todayRealIncome')
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
                                  this.generateReport(this.$t('shouldIncomeCol'),'shouldIncome')
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
                                  this.generateReport(this.$t('actualIncomeCol'),'actualIncome')
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
                                  this.generateReport(this.$t('incomeRateCol'),'incomeRate')
                               }
                           }
                       },  this.accMul(Math.ceil(this.accMul(params.row.incomeRate *1,10000))/10000,100) +'%')
                       
                       ]);
                    }
                },
                {
                    title: this.$t('NumberOfSubscribersWithin7DaysOfOrderingCol'),
                    key: 'sevenDayOrderUser',
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
                                  this.generateReport(this.$t('NumberOfSubscribersWithin7DaysOfOrderingCol'),'sevenDayOrderUser')
                               }
                           }
                       }, params.row.sevenDayOrderUser)
                       
                       ]);
                    }
                },
                {
                    title: this.$t('paidUsersCol'),
                    key: 'payedUsers',
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
                                  this.generateReport(this.$t('paidUsersCol'),'payedUsers')
                               }
                           }
                       }, params.row.payedUsers)
                       
                       ]);
                    }
                },
                {
                    title: this.$t('unpaidUsersCol'),
                    key: 'unpayUsers',
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
                                  this.generateReport(this.$t('unpaidUsersCol'),'unpayUsers')
                               }
                           }
                       }, params.row.unpayUsers)
                       
                       ]);
                    }
                },
                {
                    title: this.$t('appStoreDownloadCountCol'),
                    key: 'appStoreDownloadCount',
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
                                  this.generateReport(this.$t('appStoreDownloadCountCol'),'appStoreDownloadCount')
                               }
                           }
                       }, params.row.appStoreDownloadCount)
                       
                       ]);
                    }
                },
                // {
                //     title: this.$t('appStoreDownloadUserCountCol'),
                //     key: 'appStoreDownloadUserCount',
                //     align: 'center',
                //     minWidth: 100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(this.$t('appStoreDownloadUserCountCol'),'appStoreDownloadUserCount')
                //                }
                //            }
                //        }, params.row.appStoreDownloadUserCount)
                       
                //        ]);
                //     }
                // },
                {
                    title: this.$t('appStoreInstallCountCol'),
                    key: 'appStoreInstallCount',
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
                                  this.generateReport(this.$t('appStoreInstallCountCol'),'appStoreInstallCount')
                               }
                           }
                       }, params.row.appStoreInstallCount)
                       
                       ]);
                    }
                },
                // {
                //     title: this.$t('appStoreLanuchCountCol'),
                //     key: 'appStoreLanuchCount',
                //     align: 'center',
                //     minWidth: 90,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(this.$t('appStoreLanuchCountCol'),'appStoreLanuchCount')
                //                }
                //            }
                //        }, params.row.appStoreLanuchCount)
                       
                //        ]);
                //     }
                // },
                // {
                //     title: this.$t('appStoreLanuchUserCountCol'),
                //     key: 'appStoreLanuchUserCount',
                //     align: 'center',
                //     minWidth: 100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(this.$t('appStoreLanuchUserCountCol'),'appStoreLanuchUserCount')
                //                }
                //            }
                //        }, params.row.appStoreLanuchUserCount)
                       
                //        ]);
                //     }
                // }
            ],
            tableData: [],
        };
    },
    created() {
        this.columns=this.columns1;
    },
  watch: {
  },
  mounted () {
  },
    methods: {
		loadingData(){
            this.clearEchart();
            let url = '/market/portal/report/operationReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.type,
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
	        this.pageIndex = pageIndex;
	        this.loadingData();
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

        //加载折线图
    generateReport(title,sort){
            let url = '/market/portal/report/operationReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.type,
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
                        ref.chartTitle=title
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
