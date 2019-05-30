<style scoped>
    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .condition-name {
        width:110px;
        display:inline-block;
        text-align:right;
    }
    .model-title-p
    {
        text-align:left;
    }
    .model-title-local-div{
        text-align: right;
        margin: -26px 35px -4px 0px;
    }
    .model-title-local-select{
        width: 20%;
        margin-right: 1px;
        text-align: left;
    }
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title" style="margin:0em 0em 3em 0px">
                        <!-- app名称 -->
                        <Col span="12">
                            <div class="condition-name">{{$t('appNameCol')}}：</div>
                            <Input v-model="appName" :placeholder="$t('appNamePlaceholder')" style="width: 200px" />
                        </Col>
                        <Col span="12">
                            <div class="condition-name">{{$t('applicationClassify')}}：</div>
                            <!-- <span v-text="$t('applicationClassify')"></span>： -->
                            <!-- 栏目分类 -->
                             <Select v-model="catalogId" style="width: 200px" filterable :placeholder="$t('selectPlaceholder')">
                                <Option value=""></Option>
                                <Option  v-for="item in catalogList" :value="item.catalogId" :key="item.catalogId">{{item.catalogName}}</Option>
                            </Select>
<!--                             <div style="float:right">
                                <Button type="primary" @click="OneClickAudit">
                                    {{$t('OneClickAuditBtn')}}  
                                </Button>
                            </div> -->
                        </Col>
                    </div>
                    <div slot="title" style="margin:0em 0em 5em 0px">
                        <Col span="12"><!-- 状态 -->
                            <div class="condition-name">{{$t('appStatus')}}：</div>
                            <!-- <span v-text="$t('appStatus')"></span>： -->
                            <Select v-model="appStatus"  style="width: 200px" filterable :placeholder="$t('selectPlaceholder')">
                                <Option value="" ></Option>
                                <Option value="0" >{{$t('online')}}</Option>
                                <Option value="1" >{{$t('draft')}}</Option>
                                <Option value="2" >{{$t('offLine')}}</Option>
                                <Option value="3" >{{$t('checking')}}</Option>
                                <Option value="4" >{{$t('turnDown')}}</Option>
                            </Select>
                        </Col>
                        <Col span="12">
                            <!-- cp列表 -->
                            <div class="condition-name">{{$t('partners')}}：</div>
                            <!-- <span v-text="$t('partners')"></span>： -->
                             <Select v-model="cpId" style="width: 200px" filterable :placeholder="$t('selectPlaceholder')">
                                <Option value=""></Option>
                                <Option  v-for="item in cpList" :value="item.cpId" :key="item.cpId" >{{item.cpName}}</Option>
                            </Select>
                            <div style="float:right">    
                                <Button type="primary" @click="OneClickAudit">
                                    {{$t('OneClickAuditBtn')}}  
                                </Button>
                                <Button type="primary" @click="changePageIndex(1)">
                                    <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                                </Button>
                            </div>
                        </Col>
                    </div>
                    <div>
                        <Table border :columns="columns" :data="tableData" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" @on-change="changePageIndex"></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <!-- 信息弹窗 -->
            <Modal v-model="isShow" width="800px">
                <p slot="header" class="model-title-p" v-text="title"></p>
                <div slot="header" class="model-title-local-div">
                    <Select  v-model="defaultLang" class="model-title-local-select" @on-change='changeLanguage(defaultLang)'>
                        <Option  v-for="item in languageList" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
                </div>

                <Form ref="app" :model="app" :label-width="180">
                    <FormItem :label="$t('appNameCol')" style="margin-bottom:0px">
                        <span v-text="app.appName"></span>
                    </FormItem>
                    <FormItem :label="$t('applicationLevel')" style="margin-bottom:0px"  v-show="defaultLang=='en_US'">
                        <Rate show-text v-model="rate" :disabled="app.appStatus!='3'"></Rate>
                    </FormItem>
                    <FormItem :label="$t('applicationClassify')" style="margin-bottom:0px" v-show="defaultLang=='en_US'">
                        <span v-text="catalogName"></span>
                    </FormItem>
                    <FormItem :label="$t('applicationVersion')" style="margin-bottom:0px">
                        <span v-text="app.appVersion"></span>
                    </FormItem>
                    <FormItem :label="$t('developer')" style="margin-bottom:0px">
                        <span v-text="app.developer"></span>
                    </FormItem>
                    <FormItem :label="$t('appLabel')" style="margin-bottom:0px">
                        <span v-text="app.appLabel"></span>
                    </FormItem>
                    <FormItem :label="$t('applicationDetailIntrodution')" style="margin-bottom:0px">
                        <span v-text="app.content"></span>
                    </FormItem>
                    <!-- app程序包 -->
                    <FormItem :label="$t('applicationProgram')" style="margin-bottom:0px">
                        <div v-if="!!app.appUrl">{{appPageName}}
                            <Button @click="upload(app.appName,app.appUrl)" type="text">Click to download</Button>
                        </div>
                    </FormItem>
                    <!-- icon -->
                    <FormItem :label="$t('applicationIcon')" style="margin-bottom:0px">
                        <div class="demo-upload-list" v-for="(item,index) in appIcon">
                            <template  v-if="!!item" >
                                <img :src="downPath+item">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(downPath+app.appIcon)"></Icon>
                                </div>
                            </template> 
                        </div>
                    </FormItem> 
                    <!-- 宣传图 -->
                    <FormItem :label="$t('applicationAdversitingMap')" style="margin-bottom:0px">
                        <div class="demo-upload-list" v-for="(item,index) in progagandaImg">
                            <template v-if="!!item">
                                <img :src="downPath+item">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(downPath+app.progagandaImg)"></Icon>
                                </div>
                            </template> 
                        </div>
                    </FormItem>
                    <!-- 截图 -->
                    <FormItem :label="$t('applicationScreenshot')" style="margin-bottom:0px">
                        <div class="demo-upload-list" v-for="(item,index) in imgThumbList">
                            <template v-if="!!item" >
                                <img :src="downPath+item">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(downPath+imgList[index])"></Icon><!-- 备份大图imgList[index] -->
                                </div>
                            </template> 
                        </div>
                    </FormItem>
                    <FormItem :label="$t('applicationUpgradeDesc')" style="margin-bottom:0px">
                        <span v-text="app.upgradeDesc"></span>
                    </FormItem> 
                </Form>
                <div slot="footer">
                    <Button @click="cancel('app')">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClicked" @click="audit('app')" v-show="app.appStatus=='3'">{{$t('auditBtn')}}</Button>
                    <Button type="primary" :loading="isReject" @click="reject('app')" v-show="app.appStatus=='3'">{{$t('turnDownBtn')}}</Button>
                    <!-- <Button type="primary" :loading="isClicked" @click="offline('app')" v-show="app.appStatus=='0'">{{$t('offLineBtn')}}</Button> -->
                </div>
            </Modal>
            <!-- 查看大图的弹窗 -->
            <Modal 
                v-model="visible"
                :ok-text="$t('confirmBtn')"
                :cancel-text="$t('cancelBtn')">
                <img :src="imgName" v-if="visible" style="width: 100%">
            </Modal>
        </Row>
    </div>
</template>

<script>
import axios from 'axios';
import util from '../../libs/util';
export default {
    name: 'appManagement',
    data () {
        return {
            appName:'',//应用名称
            pageIndex: 1,   //查询页码
            pageSize: 10,   //查询大小
            total: 0, //总数  
            loadingTable: true,    //表格是否loading
            flag:'',//add代表新增状态 edit代表修改状态  view代表查看状态
            isLoadingEdits: [],   //是否loading编辑按钮数组
            isShowDel: false,   //是否展示删除弹窗
            isShow: false,   //是否展示新增弹窗
            isClicked: false,   //是否正在发送审核请求
            isReject: false,   //是否正在发送驳回请求
            catalogId:null,//应用分类
            catalogName:'',//分类名称
            appStatus:null,//应用状态
            cpId:null,//合作伙伴分类
            app:{},
            title:'',
            imgThumbList:[],//截图小图
            imgList:[],//截图大图
            appIcon:[],//应用图标下载缓存
            progagandaImg:[],//宣传图大图下载缓存
            catalogList:[],//栏目列表
            cpList:[],//合作伙伴列表
            checkingAppIdList: [],  //当前页面待审核列表
            downPath:util.fileHeaherUrl,//图片路径
            downAppPath:util.appHeaherUrl,  //app路径
            rate:0,
            defaultLang:'en_US',//默认语言
            languageList:[],//语言下拉列表
            localLanguageList:[],//多语言列表
            appInfoLangList:{},//多语言app信息缓存
            appPageName:'',//包名称

            //列表的标题列
            columns: [
                {
                    name: '',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span',params.index+1)
                    }
                },
                {
                    title: this.$t('appNameCol'),
                    key: 'appName',
                    align: 'center',
                },
                {
                    title: this.$t('appRateCol'),
                    key: 'appRate',
                    width: 70,
                    align: 'center',
                },
                {
                    title: this.$t('catalogNameCol'),
                    key: 'catalogName',
                    align: 'center',
                },
                {
                    title: this.$t('applicationVersion'),
                    key: 'appVersion',
                    align: 'center',
                },
                {
                    title: this.$t('developer'),
                    key: 'developer',
                    align: 'center',
                },
                {
                    title: this.$t('appStatus'),
                    key: 'appStatus',
                    align: 'center',
                    render: (h, params) => {
                        var status = "";
                        if(params.row.appStatus == '0'){
                            status = this.$t('online');
                        }else if(params.row.appStatus == '1'){
                            status = this.$t('draft');
                        }else if(params.row.appStatus == '2'){
                            status = this.$t('offLine');
                        }else if(params.row.appStatus == '3'){
                            status = this.$t('checking');
                        }else if(params.row.appStatus == '4'){
                            status = this.$t('turnDown');
                        }
                        return h('span',status);
                    }
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        var btns = [];
                        var appDetailBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                loading: this.isLoadingEdits[params.index]
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.edit(params.row.appId,params.index)
                                }
                            }
                        }, this.$t('appDetailBtn'));
                        btns.push(appDetailBtn);
                        if(params.row.appStatus == '0'){
                            var offlineBtn =  h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.offline(params.row.appId)
                                    }
                                }
                            }, this.$t('offlineBtn'));
                            btns.push(offlineBtn);
                        }
                        return h('div', btns);
                    }
                }
            ],
            tableData: [],
            visible: false,
            imgName: '',
        };
    },
    created() {
        this.loadingData();
        this.loadingCp();
        this.loadingCatalog();
        this.queryLanguagelist(); //查询多语言列表 
       // this.app.appType='1';
    },
    methods: {
        loadingData(){
            this.loadingTable = true;
            let url = '/market/portal/app/queryAppList';
            let ref = this;
            var params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                appName:this.appName,
                catalogId:this.catalogId,
                appStatus:this.appStatus,
                cpId:this.cpId
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingEdits = [];
                    ref.tableData = [];
                    ref.checkingAppIdList = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                if(list[i].appStatus == '3'){
                                    ref.checkingAppIdList.push(list[i].appId);
                                }
                                ref.tableData.push(list[i]);
                                ref.isLoadingEdits.push(false); 
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
           
        },
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.loadingData();
        },
        search(){
            this.pageIndex = 1;
            this.pageSize = 10;
            this.loadingData();
        },
        /*加载cp列表*/
        loadingCp(){
            let url = '/market/portal/cp/queryCpList';
            let ref = this;
            var params = {
                pageIndex: 1,
                pageSize: 99999,
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.cpList = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.cpList.push(list[i]);
                            }
                        }
                    }
                }
            );
        },
        /*加载栏目列表*/
        loadingCatalog(){
            let url = '/market/portal/catalog/getCatalogList';
            let ref = this;
            var params = {
                type:'1',
                nodeType: 1,
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
        //审核按钮
        audit(name){
            this.$Modal.confirm({
                title: this.$t('assuranceAudit'),
                content: '<p>'+this.$t('AuditonfirmApp')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/app/batchUpdateAppStatus';
                    let ref = this;
                    var appTemps=[];
                    var temps={};
                    temps.appId=ref.app.appId;
                    temps.appRate=ref.rate;
                    temps.status='0';
                    appTemps.push(temps);
                    var params = {
                        appTemps: appTemps
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('auditSussecc'));
                                ref.loadingData();
                                ref.isShow = false;
                                ref.flag='';
                                ref.isClicked=false;
                            }
                        }
                    );
                }
            });
        },
        //驳回按钮
        reject(name){
            this.$Modal.confirm({
                title: this.$t('dismissTheConfirmation'),
                content: '<p>'+this.$t('areYouSureDismissTheApp')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                    let url = '/market/portal/app/batchUpdateAppStatus';
                    let ref = this;
                    var appTemps=[];
                    var temps={};
                    temps.appId=ref.app.appId;
                    temps.status=4;
                    appTemps.push(temps);
                    var params = {
                        appTemps: appTemps
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('dismissTheSuccess'));
                                ref.loadingData();
                                ref.isShow = false;
                                ref.flag='';
                                ref.isReject=false;
                            }
                        }
                    );
                }
            });
        },
        //下线
        offline(appId){
            this.$Modal.confirm({
                title: this.$t('offlineConfirmation'),
                content: '<p>'+this.$t('offlineConfirmationMsg')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                    let url = '/market/portal/app/batchUpdateAppStatus';
                    let ref = this;
                    var appTemps=[];
                    var temps={};
                    temps.appId=appId;
                    temps.status=2;
                    appTemps.push(temps);
                    var params = {
                        appTemps: appTemps
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('offlineSuccess'));
                                ref.loadingData();
                                ref.isShow = false;
                                ref.flag='';
                                ref.isClicked=false;
                            }
                        }

                    );
                }
            });
        },
        cancel(name){
            this.isShow = false;
            this.isReject = false;
            this.isClicked = false;
            // this.$refs[name].resetFields();
        },
        edit(id,index){
            this.flag='view';
            this.isClicked=false;
            this.title=this.$t('appDetailBtn');
            this.app={};
            this.imgThumbList=[];
            this.imgList=[];
            this.progagandaImg=[];
            this.appIcon=[];
            this.rate=0;
            let url = '/market/portal/app/queryAppById';
            let ref = this;
            var params = {
                appId: id
            };
            this.isLoadingEdits.splice(index,1,true);
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var entity = res.data;
                        if(!!entity){
                            ref.app = entity;
                            if (!!ref.app.appIconThumb)
                            {
                                ref.appIcon.push(ref.app.appIconThumb);
                            }
                            if (!!ref.app.progagandaImg)
                            {
                                ref.progagandaImg.push(ref.app.progagandaImg);
                            }
                            if (!!ref.app.bannerImgThumb1)
                            {
                                ref.imgThumbList.push(ref.app.bannerImgThumb1);
                                ref.imgList.push(ref.app.bannerImg1);
                            }
                            if (!!ref.app.bannerImgThumb2)
                            {
                                ref.imgThumbList.push(ref.app.bannerImgThumb2);
                                ref.imgList.push(ref.app.bannerImg2);
                            }
                            if (!!ref.app.bannerImgThumb3)
                            {
                                ref.imgThumbList.push(ref.app.bannerImgThumb3);
                                ref.imgList.push(ref.app.bannerImg3);
                            }
                            if (!!ref.app.bannerImgThumb4)
                            {
                                ref.imgThumbList.push(ref.app.bannerImgThumb4);
                                ref.imgList.push(ref.app.bannerImg4);
                            }
                            ref.rate=ref.app.appRate*1;
                            //应用分类名称匹配    
                            if(!!ref.catalogList){
                                for(var i=0; i<ref.catalogList.length; i++){
                                    if(ref.catalogList[i].catalogId == entity.catalogId){
                                        ref.catalogName = ref.catalogList[i].catalogName;
                                        break;
                                    }
                                }
                            }
                           //显示app包名称
                            if (!!ref.app.appUrl){
                              ref.appPageName=ref.app.appUrl.substring(ref.app.appUrl.lastIndexOf('/')+1);
                            }
                            //多语言放入缓存
                            ref.saveAppLangs(entity);
                        }
                    }
                    ref.isShow = true;
                    ref.isLoadingEdits.splice(index,1,false);
                }
            );
        },
        /*显示大图方法*/
        handleView (name) {
            this.imgName = name;
            // console.log("this.imgName>>"+this.imgName)
            this.visible = true;
        },
        //下载
        upload(name,url){
            let ref = this;
            let urlTemp='/market/portal/appVersion/getPackageUrl';
            var params = {
                name: name,
                url: url
            };
            this.$http.post(urlTemp, params).then(function(res){
                if(!!res && res.resultCode == '0'){
                    if(!!res.data){
                        window.downloadFile(ref.downAppPath+res.data);
                    }
                }
            });
        },
        OneClickAudit(){
            if(this.checkingAppIdList.length == 0) {
                this.$Notice.info({
                    title:this.$t('checkingAppIdListWarning')
                });
                return;
            }
            this.$Modal.confirm({
                title: this.$t('oneClickAuditConfirmationTitle'),
                content: '<p>'+this.$t('oneClickAuditConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/app/batchUpdateAppStatus';
                    let ref = this;
                    var appList = [];
                    for(var i=0;i<this.checkingAppIdList.length;i++){
                        var temp = {
                            appId: this.checkingAppIdList[i],
                            appRate: "5",
                            status: "0"
                        }
                        appList.push(temp);
                    }
                    var params = {
                        appTemps:appList
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('oneClickAuditSuccess'));
                                ref.loadingData();
                            }
                        }
                    );
                }
            });
        },
        /*查询多语言列表*/
        queryLanguagelist(){
            let url = '/market/portal/setting/queryLocals';
            let ref = this;
            this.$http.post(url, null).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.localLanguageList.push(list[i]);
                            }
                        }
                    }
                }
            );
        },
        //将byId查回来的多语言信息放入缓存
        saveAppLangs (appInfo){
            let applangs = appInfo.appLangs;
            let languageInfo={};
            let temp='';
            this.appInfoLangList={};
            this.languageList=[];
            let  bannerImgs=[];
            let  bannerImgThumbs=[];
            for(var i=0; i<applangs.length; i++)
            {
                temp ='';
                temp = applangs[i];
                //添加app语种
                for(var ii=0;ii<this.localLanguageList.length;ii++){
                    if(temp.local == this.localLanguageList[ii].localName)
                    {
                        this.languageList.push(this.localLanguageList[ii]);
                        break;
                    }  
                } 

                languageInfo={};
                if(temp.local!=this.languageConstant)
                {
                    languageInfo = {
                        appId:temp.appId,
                        appName:temp.appName,
                        appIcon:temp.appIcon,
                        appIconThumb:temp.appIconThumb,
                        appLabel:temp.appLabel,
                        appUrl:temp.appUrl,
                        appVersion:temp.appVersion,
                        appSize:temp.appSize,
                        developer:temp.developer,
                        content:temp.content,
                        bannerImg1:temp.bannerImg1,
                        bannerImg2:temp.bannerImg2,
                        bannerImg3:temp.bannerImg3,
                        bannerImg4:temp.bannerImg4,
                        bannerImgThumb1:temp.bannerImgThumb1,
                        bannerImgThumb2:temp.bannerImgThumb2,
                        bannerImgThumb3:temp.bannerImgThumb3,
                        bannerImgThumb4:temp.bannerImgThumb4,
                        progagandaImg:temp.progagandaImg,
                        upgradeDesc:temp.upgradeDesc,
                        appStatus:appInfo.appStatus
                    };
                }
                else{
                    languageInfo = {
                        appId:temp.appId,
                        appName:temp.appName,
                        appIcon:temp.appIcon,
                        appIconThumb:temp.appIconThumb,
                        appRate:appInfo.appRate,
                        appLabel:temp.appLabel,
                        appUrl:temp.appUrl,
                        appSize:appInfo.appSize,
                        appVersion:appInfo.appVersion,
                        developer:temp.developer,
                        content:temp.content,
                        catalogId:appInfo.catalogId,
                        bannerImg1:temp.bannerImg1,
                        bannerImg2:temp.bannerImg2,
                        bannerImg3:temp.bannerImg3,
                        bannerImg4:temp.bannerImg4,
                        bannerImgThumb1:temp.bannerImgThumb1,
                        bannerImgThumb2:temp.bannerImgThumb2,
                        bannerImgThumb3:temp.bannerImgThumb3,
                        bannerImgThumb4:temp.bannerImgThumb4,
                        progagandaImg:temp.progagandaImg,
                        upgradeDesc:temp.upgradeDesc,                        
                        appStatus:appInfo.appStatus
                    };    
                }
                this.appInfoLangList[temp.local]=languageInfo;
                this.defaultLang='en_US';   
            }
        },
         /*添加语言下拉框chang事件*/
        changeLanguage(selectLang){   
            if(!!this.appInfoLangList[selectLang])
            {
                //从多语言数据缓存中获取当前选择语言信息
                let temp= this.rate;//保存星级数
                this.emptyAppInfo();
                this.app=this.appInfoLangList[selectLang];
                this.rate=temp;
                this.changeImageApp(this.app);
            }        
        },
        //清空app图片、包信息
        emptyAppInfo()
        {
            this.app={};
            this.imgList=[];//截图大图
            this.imgThumbList=[];//截图缩略图
            this.appIcon=[];//应用图标
            this.progagandaImg=[];//宣传图大图
            this.appUrl='';//下载程序

        },
        //切换app 图片
        changeImageApp(temp){
            let ref= this;
            ref.app = temp;

            if (!!ref.app.appIconThumb)
            {
                ref.appIcon.push(ref.app.appIconThumb);
            }
            if (!!ref.app.progagandaImg)
            {
                ref.progagandaImg.push(ref.app.progagandaImg);
            }
            if (!!ref.app.bannerImgThumb1)
            {
                ref.imgThumbList.push(ref.app.bannerImgThumb1);
                ref.imgList.push(ref.app.bannerImg1);
            }
            if (!!ref.app.bannerImgThumb2)
            {
                ref.imgThumbList.push(ref.app.bannerImgThumb2);
                ref.imgList.push(ref.app.bannerImg2);
            }
            if (!!ref.app.bannerImgThumb3)
            {
                ref.imgThumbList.push(ref.app.bannerImgThumb3);
                ref.imgList.push(ref.app.bannerImg3);
            }
            if (!!ref.app.bannerImgThumb4)
            {
                ref.imgThumbList.push(ref.app.bannerImgThumb4);
                ref.imgList.push(ref.app.bannerImg4);
            }
            //显示app包名称
            ref.appPageName='';
            if (!!ref.app.appUrl){
              ref.appPageName=ref.app.appUrl.substring(ref.app.appUrl.lastIndexOf('/')+1);
            }
        },
    }
};
</script>