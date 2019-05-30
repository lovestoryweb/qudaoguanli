<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .appVersion_field {
        width: 70%;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .ivu-select-dropdown-list {
      height: 141px
    }
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                        <Button type="primary" @click="showAdd">
                            <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
                        </Button>
                        <Button type="primary" @click="showSetting">
                            <Icon type="settings"></Icon>&nbsp;{{$t('setting')}}  
                        </Button>
                    </div>
                    <div>
                        <Table border :columns="columns" :data="data" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" :page-size="pageSize" @on-change="changePageIndex"></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <!-- 新增弹窗/编辑弹窗 -->
            <Modal
                v-model="isShowAddOrLook"
                :title="isShowAdd ? $t('versionAddVers') : $t('versionlooKdetail')"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <Form ref="appVersion" :model="appVersion" :rules="rules" :label-width="180">
                        <FormItem :label="$t('versionAppName')" prop="name">
                            <Input v-model="appVersion.name" class="appVersion_field" :disabled="!isShowAdd"></Input>
                        </FormItem>
                        <!-- app应用程序 -->
                        <FormItem :label="$t('applicationProgram')" prop="url">
                            <Input v-model="appVersion.url" v-show="false" ></Input>
                            <template>
                                <div>
                                    <Upload 
                                        ref="upload"
                                        :on-success="apkSuccess"
                                        :show-upload-list="true"
                                        :format="['apk']"
                                        :max-size="10240000"
                                        :on-format-error="handleFormatError"
                                        :on-exceeded-size="handleMaxSize"
                                        action="/market/portal/file/uploadApp"
                                        name='app'
                                        v-show="!!!appVersion.url">
                                        <Button icon="ios-cloud-upload-outline" type="ghost">
                                            Select APP
                                        </Button>
                                    </Upload>
                                    <div v-show="!!appVersion.url">
                                        {{ appPageName }} 
                                        <Button  @click="downloadApp(appVersion.name,appVersion.url)" type="text">
                                            Click to download
                                        </Button>
                                        <Button  @click="removeApp(appVersion.url)" type="text" v-show="isShowAdd">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <div class="ivu-form-item-error-tip" v-text="appUrlMsg" v-show='showMsg'></div>
                            </template>
                        </FormItem>
                        <!-- 版本号 -->
                        <FormItem :label="$t('versionVsCode')" class='ivu-form-item-required'>
                            <span v-text="appVersion.version"></span>
                        </FormItem>
                        <FormItem :label="$t('versionUpgradeDesc')">
                            <Input v-model="appVersion.memo" type="textarea" :autosize="{minRows:4,maxRows:8}" 
                                class="appVersion_field" :disabled="!isShowAdd"></Input>
                        </FormItem>
                    </Form>
                    <div class="mask" v-show="loadingBtn"></div>
                </Card>
                <div v-if="isShowAdd" slot="footer">
                    <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="loadingBtn" @click="add()">{{$t('confirmBtn')}}</Button>
                </div>
                <div v-else slot="footer">
                    <Button type="primary" @click="cancelLooK()">{{$t('confirmBtn')}}</Button>
                </div>
            </Modal>
            <!-- 设置强制版本弹窗 -->
            <Modal
                v-model="isShowSetting"  
                :title="$t('setting')" 
                width="500px">
                <Card :bordered="false" dis-hover>
                    <Form :label-width="140">
                        <FormItem :label="$t('versionSettingMinVers')">
                            <span class="appVersion_field" v-text="settingMinVerSion"></span>
                        </FormItem>
                        <FormItem :label="$t('versionSettingMaxVers')" >
                           <span class="appVersion_field" v-text="settingMaxVerSion"></span>
                        </FormItem>
                        <FormItem :label="$t('versionSettingTo')">
                            <Select class="appVersion_field" :placeholder="$t('selectPlaceholder')" v-model="settingAppVersionId" 
                            :loading="isLoadingAppVersion">
                                <Option v-for="item in appVersionList" :value="item.id" :key="item.id">{{ item.version }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('warmPromptDialogTitle')+'：'">
                             <span class="appVersion_field" v-text="$t('versionSettingWarmPrompt')"> </span>
                        </FormItem>
                    </Form>
                    <div class="mask" v-show="loadingBtn"></div>
                </Card>
                <div slot="footer">
                    <Button @click="cancelSetting()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="loadingBtn" @click="saveSetting()">{{$t('saveBtn')}}</Button>
                </div>
            </Modal>
        </Row>
    </div>
</template>

<script>
import util from '../../libs/util';
export default {
    name: 'appVersionManagement',
    data () {
        return {
            loadingTable: true,    //表格是否loading
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data:[],
            searchName:'', //列表查询条件
            searchVersion:'',//列表查询条件
            isLoadingDownload: [],   //是否loading下载按钮数组
            isLoadingShowDetails:[],//是否loading查看详情按钮数组
            isShowAddOrLook:false,//是否显示新增查看弹窗
            isShowAdd:false,//是否新增
            loadingBtn:false,
            isShowSetting:false,//是否打开设置强制版本弹窗
            settingMinVerSion:'',//设置的最低版本号
            settingMaxVerSion:'',//设置的最高版本号
            settingAppVersionId:'',//设置的版本号
            isLoadingAppVersion: false, //是否loading版本下拉框
            appVersionList:[],//版本下拉框列表
            settingtempVerSion:'',//比较大小临时值
            appPageName:'',//下载展示的app名称
            appUrlMsg:'',//appurl错误信息
            showMsg:false,//是否展示校验错误信息
            downAppPath:util.appHeaherUrl,  //app路径
            appVersion:{
                id: '',
                name: '',
                version: '',
                packageName: '',
                url: '',
                upgrade:'0',
                memo: '',
                createTime:'',
            },//app版本信息实体
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
                    title: this.$t('versionAppName'),
                    key: 'name',
                    align:"center"
                },
                {
                   title: this.$t('versionCraeatTime'),
                    key: 'createTime' ,
                    align:"center"
                },
                {
                   title: this.$t('versionVsCode'),
                    key: 'version' ,
                    align:"center"
                },                
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.isLoadingDownload[params.index]
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.downloadApp(params.row.name,params.row.url)
                                    }
                                }
                            }, this.$t('download')),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.isLoadingShowDetails[params.index]
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showDetail(params.row.id,params.index)
                                    }
                                }
                            }, this.$t('checkDescription')),                            
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.row.id)
                                    }
                                }
                            }, this.$t('deleteBtn'))
                        ]);
                    }
                }
            ],
            rules:{
                name:[
                    { required: true, message: this.$t('versionAppNameWarning'),trigger: 'change' }
                ],
                url:[
                    { required: true, message: this.$t('versionAppPackageWarning'),trigger: 'change' }
                ]
            },

        };
    },
    created() {
        this.queryAppVersionList();
    },
    computed: {

    },
    watch: {

    },
    methods: { 
        //展示新增窗口 
        showAdd(){
            this.initAppVersion();
            this.isShowAddOrLook = true;
            this.isShowAdd = true;
            this.showMsg=false;
        },
        initAppVersion(){
            this.$refs['appVersion'].resetFields();
            this.appVersion.id = '';
            this.appVersion.name = '';
            this.appVersion.version = '';
            this.appVersion.url = '';
            this.appVersion.upgrade = '0';
            this.appVersion.memo = '';
            this.appVersion.createTime = '';
        },
        //取消新增
        cancelAdd(){
            this.isShowAddOrLook = false;
            this.isShowAdd = false;
        },
        //确定新增
        add(){
            this.$refs['appVersion'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true;
                    let url = '/market/portal/appVersion/createAppVersion';
                    let ref = this;

                    this.$http.post(url, this.appVersion).then(function(res){
                        if(!!res && res.resultCode == '0'){
                            ref.queryAppVersionList();
                            ref.isShowAddOrLook = false;
                            ref.isShowAdd = false;
                            ref.$Message.success(ref.$t('savedSuccess'));
                        }
                        ref.loadingBtn = false;
                    });
                }
            })
        },
        //查看
        showDetail(appVersionId,index){
            this.initAppVersion();
            this.isShowAdd = false;
            let url = '/market/portal/appVersion/searchAppVersionById';
            let ref = this;
            var params = {
                appVersionId: appVersionId
            };
            this.isLoadingShowDetails.splice(index,1,true);
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var entity = res.data;
                        if(!!entity){
                            ref.appVersion = entity;
                           //显示app包名称
                            if (!!ref.appVersion.url){
                              ref.appPageName=ref.appVersion.url.substring(ref.appVersion.url.lastIndexOf('/')+1);
                            }
 
                        }
                    }
                    ref.isShowAddOrLook = true;
                    ref.isLoadingShowDetails.splice(index,1,false);
                }
            );
        },
        //关闭查看详情
        cancelLooK(){
            this.isShowAddOrLook = false;
        },
        //展示设置窗口
        showSetting(){
            this.isShowSetting = true;
            this.settingMinVerSion='',//设置的最低版本号
            this.settingMaxVerSion='',//设置的最高版本号
            this.settingAppVersionId='',//设置的版本号
            this.isLoadingAppVersion= false, //是否loading版本下拉框
            this.appVersionList=[],//版本下拉框列表
            this.searchAppVersionList();
        },
        //取消设置
        cancelSetting(){
            this.isShowSetting = false;
        },
        //保存设置
        saveSetting(){
            this.loadingBtn = true;
            let url = '/market/portal/appVersion/settingAppVersion';
            let ref = this;
            var params = {
                appVersionId: this.settingAppVersionId
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.queryAppVersionList();
                        ref.isShowSetting = false;
                        ref.$Message.success(ref.$t('savedSuccess'));
                    }
                    ref.loadingBtn = false;
                }
            );
        },
        //检查版本号大小
        checkAppVersionNum(){
            let oldVs =this.settingMaxVerSion.split('\.');
            let newVs =this.settingtempVerSion.split('\.')
            let flag= true;
            if (oldVs.length == newVs.length)
            {
                for (let ii = 0, jj = oldVs.length; ii < jj; ii++)
                {
                    if (parseInt(oldVs[ii]) > parseInt(newVs[ii]))
                    {
                        flag = false;
                        break;
                    }
                }
            }
            else if (oldVs.length > newVs.length)
            {
                for (let ii = 0, jj = newVs.length; ii < jj; ii++)
                {
                    if (parseInt(oldVs[ii]) > parseInt(newVs[ii]))
                    {
                        flag = false;
                        break;
                    }
                    //如果全部比完都没有小于旧版本
                    if (ii == jj-1 && flag)
                    {
                        flag = false;
                    }
                }
            }
            else
            {
                for (let ii = 0, jj = oldVs.length; ii < jj; ii++)
                {
                    if (parseInt(oldVs[ii]) > parseInt(newVs[ii]))
                    {
                        flag = false;
                        break;
                    }
                }
            }

            if (flag)
            {
               this.settingMaxVerSion=this.settingtempVerSion;
            } 
        },
        //删除app版本信息
        remove(appVersionId){
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/appVersion/deleteAppVersion';
                    let ref = this;
                    var params = {
                        appVersionId: appVersionId
                    };
                    this.$http.post(url, params).then(function(res){
                        ref.$Modal.remove();
                        if(!!res && res.resultCode == '0'){
                            ref.$Message.success(ref.$t('deletedSuccess'));
                            ref.queryAppVersionList();
                        }
                    });
                }
            });
        },
        //分页
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.loadingTable = true;
            this.queryAppVersionList();
        },
        //查询app版本信息列表
        queryAppVersionList(){
            let url = '/market/portal/appVersion/searchAppVersionList';
            let ref = this;
            var params = {
                version: this.searchVersion,
                name: this.searchName,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingShowDetails = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var appVersionList = res.data;
                        if(!!appVersionList){
                            for(var i=0;i<appVersionList.length;i++){
                                ref.data.push(appVersionList[i]);
                                ref.isLoadingShowDetails.push(false); 
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        //查询app版本信息列表(设置下拉框列表)
        searchAppVersionList(){
            let url = '/market/portal/appVersion/searchAppVersionList';
            let ref = this;
            var params = {
                pageIndex: 1,
                pageSize: 999
            };
            this.isLoadingAppVersion = true;
            this.$http.post(url, params).then(function(res){
                if(!!res && res.resultCode == '0'){
                    var appVersions = res.data;
                    if(!!appVersions){
                        ref.appVersionList = appVersions;
                        for(var i=0;i<appVersions.length;i++){
                            if(appVersions[i].upgrade=='1')
                            {
                                ref.settingMinVerSion=appVersions[i].version;
                                ref.settingAppVersionId=appVersions[i].id;
                            }   
                            ref.settingtempVerSion=appVersions[i].version;
                            ref.checkAppVersionNum();
                        }
                    }
                }
                ref.isLoadingAppVersion = false;
            });
        },
        /*应用程序包上传成功*/
        apkSuccess(res, file){
            let ref = this;
            ref.appUrlMsg='';
            ref.showMsg=false;
            if(!!res)
            {
                if( res.resultCode == '0'){
                    ref.appVersion.url =res.data.path;
                    ref.appVersion.version=res.data.version;
                    ref.appVersion.packageName=res.data.packageName;
                    file.url=res.data.path;
                    //显示app名称
                    if (!!res.data.path){
                      ref.appPageName=res.data.path.substring(res.data.path.lastIndexOf('/')+1);
                    }
                    //上传插件的临时文件
                    this.$refs.upload.fileList=[];
                }
                else
                {
                    ref.$refs.upload.fileList=[];
                    ref.appUrlMsg=this.$t('uploadException');
                    ref.showMsg=true;
                }
            }
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: file.name + ':' + this.$t('fileTypeWarning')
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: file.name + ':' + this.$t('fileSizeWarning')
            });
        },
        //下载app
        downloadApp(name,url){
            let urlTemp='/market/portal/appVersion/getPackageUrl';
            let ref = this;
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
        //删除app
        removeApp (file) {
            let ref = this;
            this.$http.get("/market/portal/file/delete?id="+file).then(function(res){
                if(!!res && res.resultCode == '0'){
                    ref.appVersion.url='';
                    ref.appVersion.version='';
                    ref.appVersion.packageName='';
                    //上传插件的临时文件
                    ref.$refs.upload.fileList=[];
                }
            });    
        },
    }
};    
</script>