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
    .application_report_card{
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
                  <div class="application_report_card">
                    <div slot="title" >
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
                    <div slot="title" >
                    <!--渠道 -->
                    <Col span="12">
                            <span class="span_space" v-text="$t('byDayMouth')"></span>：
                            <Select v-model="channel" class="user_field" @on-change="changeByType">
                                <Option value='1' v-text="$t('byDay')"></Option>
                                <Option value='2' v-text="$t('byMouth')"></Option>
                            </Select>
                          </Col>
                          <Col span="12">
                            <!-- 一级栏目 -->
                            <span class="span_space" v-text="$t('classify')"></span>： 
                            <Select v-model="catalogId" class="user_field" filterable  @on-change="changeAppBycataloId" :placeholder="$t('selectPlaceholder')">
                                <Option value="" ></Option>
                                <Option  v-for="item in catalogList" :value="item.catalogId" :key="item.catalogId" >{{item.catalogName}}</Option>
                            </Select>
                          </Col>
                    </div>
                    <div slot="title" >
                        <!--游戏名称 -->
                        <Col span="12">
                            <span class="span_space" v-text="$t('appNameCol')"></span>：
                            <Select v-model="appId" class="user_field" filterable :placeholder="$t('selectPlaceholder')">
                                <Option value=""></Option>
                                <Option  v-for="item in appList" :value="item.appId" :key="item.appId" >{{item.appName}}</Option>
                            </Select>
                          </Col>
                        <Col span="12">
                            <span class="span_space" v-text="$t('sortType')"></span>：
                            <Select v-model="sortType" class="user_field" @on-change="change">
                                <Option value='0' v-text="$t('byReportTime')"></Option>
                                <Option value='1' v-text="$t('byTotalDownload')"></Option>
                               <!--  <Option value='2' v-text="$t('byfirststartusrs')"></Option> -->
                               <!--  <Option value='3' v-text="$t('bystartusrs')" v-show="clientType==3"></Option> -->
                                <Option value='4' v-text="$t('bystartnumber')" v-show="clientType==3"></Option>
                            </Select>
                        </Col>
                    </div>
                    <div slot="title" >
                        <!--客户端类型 -->
                        <Col span="24">
                            <span class="span_space" v-text="$t('clientType')"></span>：
                            <Select v-model="clientType" class="user_field" @on-change="changeSortType">
                                <Option value="" v-text="$t('selectPlaceholder')"></Option>
                                <Option value='1'>APP</Option>
                                <Option value='2'>H5</Option>
                                <Option value='3'>ALL</Option>
                            </Select>
                            <span>
                                <Button type="primary" @click="changePageIndex(1)" class="button_search">
                                <Icon type="ios-search" ></Icon>&nbsp;{{$t('search')}} 
                                </Button>
                            </span>
                        </Col>
                    </div>
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
            appReport:{},//应用报表
            startTimeVal:'',//开始时间提交值
            endTimeVal:'',//结束时间提交值
            startTime:'',//开始时间
            endTime:'',//结束时间
            reportMonth:'',//选择月份
            channel:'1',//按月或者按日
            pageIndex: 1,//查询页码
            pageSize: 15,//查询大小
            total: 0, //总数  
            loadingTable: false,//表格是否loading
            cpId:null,//合作伙伴分类
            catalogList:[],//栏目列表
            catalogId:'',//栏目ID
            appList:[],//游戏列表
            appId:'',//游戏检索ID
            startTimeOptions: {}, //开始日期设置
            endTimeOptions: {}, //结束日期设置
            lineData: [],
            areaData: [],
            timeType:'date',
            timeFormat:'yyyy-MM-dd',
            chartTitle:'',
            sortType:'1',
            clientType:'',
            //列表的标题列
            columns:[],
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
                    minWidth:70,
                    fixed:'left',
                },
                {
                    title: this.$t('gameName'),
                    key: 'appName',
                    align: 'center',
                    minWidth:160,
                    fixed:'left',
                },
                {
                    title: this.$t('clickRateCol'),
                    key: 'clicks',
                    align: 'center',
                    minWidth:110,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('clickRateCol'),params.row.appName,'clicks')
                               }
                           }
                       }, params.row.clicks)
                       ]);
                    }
                },
                {
                    title: this.$t('totalClickRate'),
                    key: 'downLoads',
                    align: 'center',
                    minWidth:60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('totalClickRate'),params.row.appName,'downLoads')
                               }
                           }
                       }, params.row.downLoads)
                       ]);
                    }
                },
                {
                    title: this.$t('indexDownLoadRate'),
                    key: 'indexDownLoad',
                    align: 'center',
                    minWidth:70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('indexDownLoadRate'),params.row.appName,'indexDownLoad')
                               }
                           }
                       }, params.row.indexDownLoad)
                       ]);
                    }
                },
                {
                    title: this.$t('rankingDownLoadRate'),
                    key: 'rankingDownLoad',
                    align: 'center',
                    minWidth:80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('rankingDownLoadRate'),params.row.appName,'rankingDownLoad')
                               }
                           }
                       }, params.row.rankingDownLoad)
                       ]);
                    }
                },
                // {
                //     title: this.$t('sortDownLoadRate'),
                //     key: 'sortDownLoad',
                //     align: 'center',
                //     minWidth:100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(params.row.appId,this.$t('sortDownLoadRate'),params.row.appName,'sortDownLoad')
                //                }
                //            }
                //        }, params.row.sortDownLoad)
                //        ]);
                //     }
                // },
                 {
                    title: this.$t('firstSortDownLoadCol'),
                    key: 'firstSortDownLoad',
                    align: 'center',
                    minWidth:90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('firstSortDownLoadCol'),params.row.appName,'firstSortDownLoad')
                               }
                           }
                       }, params.row.firstSortDownLoad)
                       ]);
                    }
                },
                {
                    title: this.$t('secondSortDownLoadCol'),
                    key: 'secondSortDownLoad',
                    align: 'center',
                    minWidth:100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('secondSortDownLoadCol'),params.row.appName,'secondSortDownLoad')
                               }
                           }
                       }, params.row.secondSortDownLoad)
                       ]);
                    }
                },
                {
                    title: this.$t('detailDownLoadNumber'),
                    key: 'detailDownLoad',
                    align: 'center',
                    minWidth:80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('detailDownLoadNumber'),params.row.appName,'detailDownLoad')
                               }
                           }
                       }, params.row.detailDownLoad)
                       ]);
                    }
                }
            ],
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
                    minWidth:70,
                    fixed:'left',
                },
                {
                    title: this.$t('gameName'),
                    key: 'appName',
                    align: 'center',
                    minWidth:160,
                    fixed:'left',
                },
                {
                    title: this.$t('clickRateCol'),
                    key: 'clicks',
                    align: 'center',
                    minWidth:100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('clickRateCol'),params.row.appName,'clicks')
                               }
                           }
                       }, params.row.clicks)
                       ]);
                    }
                },
                {
                    title: this.$t('totalClickRate'),
                    key: 'downLoads',
                    align: 'center',
                    minWidth:60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('totalClickRate'),params.row.appName,'downLoads')
                               }
                           }
                       }, params.row.downLoads)
                       ]);
                    }
                },
                {
                    title: this.$t('indexDownLoadRate'),
                    key: 'indexDownLoad',
                    align: 'center',
                    minWidth:70,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('indexDownLoadRate'),params.row.appName,'indexDownLoad')
                               }
                           }
                       }, params.row.indexDownLoad)
                       ]);
                    }
                },
                {
                    title: this.$t('rankingDownLoadRate'),
                    key: 'rankingDownLoad',
                    align: 'center',
                    minWidth:80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('rankingDownLoadRate'),params.row.appName,'rankingDownLoad')
                               }
                           }
                       }, params.row.rankingDownLoad)
                       ]);
                    }
                },
                // {
                //     title: this.$t('sortDownLoadRate'),
                //     key: 'sortDownLoad',
                //     align: 'center',
                //     minWidth:100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(params.row.appId,this.$t('sortDownLoadRate'),params.row.appName,'sortDownLoad')
                //                }
                //            }
                //        }, params.row.sortDownLoad)
                //        ]);
                //     }
                // },
                 {
                    title: this.$t('firstSortDownLoadCol'),
                    key: 'firstSortDownLoad',
                    align: 'center',
                    minWidth:90,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('firstSortDownLoadCol'),params.row.appName,'firstSortDownLoad')
                               }
                           }
                       }, params.row.firstSortDownLoad)
                       ]);
                    }
                },
                {
                    title: this.$t('secondSortDownLoadCol'),
                    key: 'secondSortDownLoad',
                    align: 'center',
                    minWidth:100,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('secondSortDownLoadCol'),params.row.appName,'secondSortDownLoad')
                               }
                           }
                       }, params.row.secondSortDownLoad)
                       ]);
                    }
                },
                {
                    title: this.$t('detailDownLoadNumber'),
                    key: 'detailDownLoad',
                    align: 'center',
                    minWidth:80,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('detailDownLoadNumber'),params.row.appName,'detailDownLoad')
                               }
                           }
                       }, params.row.detailDownLoad)
                       ]);
                    }
                },
                // ,{
                //     title: this.$t('firstLanuchCountCol'),
                //     key: 'firstLanuchCount',
                //     align: 'center',
                //     minWidth:130,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(params.row.appId,this.$t('firstLanuchCountCol'),params.row.appName,'firstLanuchCount')
                //                }
                //            }
                //        }, params.row.firstLanuchCount)
                //        ]);
                //     }
                // }
                // {
                //     title: this.$t('lanuchCountCol'),
                //     key: 'lanuchCount',
                //     align: 'center',
                //     minWidth:100,
                //     render: (h, params) => {
                //         return h('div', [
                //        h('a', {
                //            style: {
                //                marginRight: '5px'
                //            },
                //            on: {
                //                click: () => {
                //                   this.generateReport(params.row.appId,this.$t('lanuchCountCol'),params.row.appName,'lanuchCount')
                //                }
                //            }
                //        }, params.row.lanuchCount)
                //        ]);
                //     }
                // },
                {
                    title: this.$t('appStartsRate'),
                    key: 'appStarts',
                    align: 'center',
                    minWidth:60,
                    render: (h, params) => {
                        return h('div', [
                       h('a', {
                           style: {
                               marginRight: '5px'
                           },
                           on: {
                               click: () => {
                                  this.generateReport(params.row.appId,this.$t('appStartsRate'),params.row.appName,'appStarts')
                               }
                           }
                       }, params.row.appStarts)
                       ]);
                    }
                }
            ],
            tableData: [],
        };
    },
    created() {
		    this.loadingCatalog();
        this.loadingApp();
        this.sortType='0';
        this.columns=this.columns1;
    },
  watch: {
  },
  mounted () {
  },
    methods: {
		loadingData(){
            this.clearEchart();
            // var sort='';
            // if (this.sortType==1)
            //  {sort=1;}
            let url = '/market/portal/appReport/queryAppReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.channel,
                catalogId:this.catalogId,
                appId:this.appId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                sortType:this.sortType,
                clientType:this.clientType,
            };
            // 客户类型为空时候，不显示后三项
            if (this.clientType=='3') 
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
            if(this.validateDayDate(this.startTime,this.endTime,this.channel)==1){
               this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                  desc: this.$t('byDayOverDay')
               });
               return 
            }
            /*判断是否超过一年*/
            if(this.validateDayDate(this.startTime,this.endTime,this.channel)==2){
               this.$Notice.warning({
                  title: this.$t('warmPromptDialogTitle'),
                  desc: this.$t('byMouthOverMouth')
               });
               return 
            }
	        this.pageIndex = pageIndex;
	        this.loadingData();
    	},
    	//日期控件值修改
	    handleChange(month) {
	    	this.reportMonth = month;
	    },
        /*加载栏目列表*/
        loadingCatalog(){
            let url = '/market/portal/catalog/getCatalogList';
            let ref = this;
            var params = {
                pageIndex: 1,
                pageSize: 99999,
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.catalogList = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.catalogList.push(list[i]);
                            }
                        }
                    }
                }
            );
        },
         
        /*加载游戏列表*/
        loadingApp(){
            let url = '/market/portal/app/queryAppList';
            let ref = this;
            var params = {
                catalogId:this.catalogId,
                pageIndex: 1,
                pageSize: 99999,
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.appList = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.appList.push(list[i]);
                            }
                        }
                    }
                }
            );
        },
        changeAppBycataloId(){
         this.loadingApp();
        },
        changeByType(){
            if (this.channel==1)
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
            let url = '/market/portal/appReport/queryAppReport';
            let ref = this;
            var params = {
                beginTime:this.startTimeVal,
                endTime:this.endTimeVal,
                type:this.channel,
                catalogId:this.catalogId,
                appId:id,
                sortType:this.sort,
                clientType:this.clientType,
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
        changeSortType(value){
          if (this.clientType!==3&&(this.sortType==3||this.sortType==4)) 
          {
            this.sortType='';
          }




        }
    }
};

</script>
