<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .theme_field {
        width: 70%;
    }
    .theme_searchfield {
        width: 150px;
        margin-right: 15%;
    }
    .margin20{
        margin-right: 20%;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .ivu-select-dropdown-list {
      height: 100%
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
                        <div style="float:right;width: 80%">
                            <span class="condition-name">{{$t('themeType')}}：</span>
                            <Select v-model="searchThemeType" class="theme_searchfield" :placeholder="$t('selectPlaceholder')" 
                              >
                                    <Option value="" v-text="$t('selectPlaceholder')"></Option>
                                    <Option value="1">{{$t('themeGeneral')}}</Option>
                                    <Option value="2">{{$t('themeFestival')}}</Option>
                                    <Option value="3">{{$t('themeSpecial')}}</Option>
                            </Select>
                            <span class="condition-name">{{$t('themeStatus')}}：</span>
                            <i-switch v-model="searcThemeStatus"  size="large">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                            </i-switch>
                            <Button type="primary" @click="search" style="float:right;">
                                    <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                            </Button>
                        </div>
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
                :title="isShowAdd ? $t('themeAddVers') : $t('themeModifyVers')"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <Form ref="appTheme" :model="appTheme" :rules="rules" :label-width="180">
                        <FormItem :label="$t('themeName')" prop="name">
                            <Input v-model="appTheme.name" class="theme_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('themeType')" prop="type"  class='ivu-form-item-required'>
                                <Select v-model="appTheme.type" class="theme_field" :placeholder="$t('selectPlaceholder')" v-if="appTheme.type==3&&flag=='modify'" disabled>
                                    <Option value="" v-text="$t('selectPlaceholder')"></Option>
                                    <Option value="1">{{$t('themeGeneral')}}</Option>
                                    <Option value="2">{{$t('themeFestival')}}</Option>
                                    <Option value="3">{{$t('themeSpecial')}}</Option>
                                </Select>
                                <Select v-model="appTheme.type" class="theme_field" :placeholder="$t('selectPlaceholder')" v-else >
                                    <Option value="" v-text="$t('selectPlaceholder')"></Option>
                                    <Option value="1">{{$t('themeGeneral')}}</Option>
                                    <Option value="2">{{$t('themeFestival')}}</Option>
                                    <Option value="3" v-show="!typeKey">{{$t('themeSpecial')}}</Option>
                                </Select>

                                <!-- <div class="ivu-form-item-error-tip" v-text="themeTypeMsg" v-show='showMsg'></div> -->
                        </FormItem>
                        <!-- :value="appTheme.adaptationTime"  -->
                        <FormItem :label="$t('themeAdaptationTime')" prop="adaptationTime" class='ivu-form-item-required' v-if="appTheme.type==2">
                            <DatePicker class="theme_field"
                                @on-change="handleChange" 
                                :value="adaptationTime"
                                format="yyyy-MM-dd" 
                                type="daterange"
                                :editable='false' 
                                :clearable='false'>
                            </DatePicker>
                        </FormItem>
                        <!-- 主题图片地址 --> 
                        <FormItem :label="$t('themeImage')" prop="image" class='ivu-form-item-required'  v-show="appTheme.type!=3">
                            <Input v-model="appTheme.image" v-show="false"></Input>
                            <div class="demo-upload-list" v-for="item in filePath">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(appTheme.image)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload v-show="!!filePath&&filePath.length<1"
                                ref="uploadImage"
                                :show-upload-list="true"
                                :on-success="themeImageSuccess"
                                :format="['jpg','jpeg','png','gif']"
                                :max-size="10240"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                type="drag"
                                action="/market/portal/file/upload"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <div class="ivu-form-item-error-tip" v-text="themeImageMsg" v-show='showMsg'></div>
                        </FormItem>
                        <!-- 主题下载地址 -->
                        <FormItem :label="$t('themeUrl')" prop="url" v-show="appTheme.type!=3">
                            <Input v-model="appTheme.url" v-show="false" ></Input>
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
                                        v-show="!!!appTheme.url">
                                        <Button icon="ios-cloud-upload-outline" type="ghost">
                                            Select page
                                        </Button>
                                    </Upload>
                                    <div v-show="!!appTheme.url">
                                        {{ appPageName }} 
                                        <Button  @click="downloadApp(appTheme.name,appTheme.url)" type="text">
                                            Click to download
                                        </Button>
                                        <Button  @click="removeApp(appTheme.url)" type="text">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <!-- <div class="ivu-form-item-error-tip" v-text="appUrlMsg" v-show='showMsg'></div> -->
                            </template>
                        </FormItem>
                        <FormItem :label="$t('themeMemo')" v-show="appTheme.type!=3">
                            <Input v-model="appTheme.memo" type="textarea" :autosize="{minRows:4,maxRows:8}" class="theme_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('themeStatus')"  >
                                <i-switch v-model="modelThemeStatus"  size="large">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                        </FormItem>
                    </Form>
                    <div class="mask" v-show="loadingBtn"></div>
                </Card>
                <div slot="footer">
                    <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="loadingBtn" @click="save()">{{$t('confirmBtn')}}</Button>
                </div>
            </Modal>
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
import util from '../../libs/util';
export default {
    name: 'appThemeManagement',
    data () {
        const validImage = (rule, value, callback) => {
            if(this.appTheme.type==3)
            {
               callback();
             }
            if (!!!value) {
                callback(new Error(this.$t('themeAppImageWarning')));
            } else {
                callback();
            }
        };
        const validUrl = (rule, value, callback) => {
            if(this.appTheme.type==3)
            {
               callback();
             }
            if (!!!value) {
                callback(new Error(this.$t('themeAppUrlWarning')));
            } else {
                callback();
            }
        };
        const validTime = (rule, value, callback) => {
            /*if(this.appTheme.type!==2)
            {
               callback();
               return;
             }*/
            if (!!!value) {
                callback(new Error(this.$t('themeAppTimeWarning')));
            } else {
                callback();
            }
        };
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
            settingAppThemeId:'',//设置的版本号
            isLoadingAppTheme: false, //是否loading版本下拉框
            appThemeList:[],//版本下拉框列表
            settingtempVerSion:'',//比较大小临时值
            appPageName:'',//下载展示的app名称
            appUrlMsg:'',//appurl错误信息
            showMsg:false,//是否展示校验错误信息
            downAppPath:util.appHeaherUrl,  //app路径
            filePath:[],
            adaptationTime:'',
            themeStatus:'',
            searchThemeType:'',//检索条件主题类型
            searcThemeStatus:'',//检索条件主题状态
            isLoadingenableDisables: [],    //是否loading启用禁用按钮数组
            isLoadingEdits:[],   //是否loading编辑按钮数组
            picturePath:util.fileHeaherUrl,//图片路径
            themeImageMsg:'',
            modifyAdImgUrlTemp:{},//修改时图片的缓存
            waitAdImgUrlTemp:[],//修改时待删除图片列表
            flag:'',//添加或者修改状态
            imgName: '',//显示大图的url
            visible: false,
            typeKey:false,//类型为3时候，特殊主题只有一种
            tempFileList:[],
            modelThemeStatus:true,
            appTheme:{
                id: '',
                name: '',
                image: '',
                url: '',
                type: '',
                status: '',
                memo: '',
                adaptationTime:'',
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
                    title: this.$t('themeName'),
                    key: 'name',
                    align: 'center',
                    width: 100,
                },
                {
                   title: this.$t('themeImage'),
                    key: 'image' ,
                    align: 'center',
                    render:(h,params)=>{
                        var attrs_d={};
                        //attrs_d.src=!!params.row.image?this.picturePath+params.row.image:"../../images/England.png";
                        if (!!params.row.image) {
                            attrs_d.src=this.picturePath+params.row.image;
                        }
                        return h('img',{
                            attrs:attrs_d,
                            style:{
                                width:'50px',
                                height:'50px',
                            }
                        })
                    }
                },
                {
                   title: this.$t('themeType'),
                    key: 'type',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        var str = "";
                        if(params.row.type == 1){
                            str = this.$t('themeGeneral');
                        }else if(params.row.type == 2){
                            str = this.$t('themeFestival');
                        }else if(params.row.type == 3){
                            str = this.$t('themeSpecial');
                        }
                        return h('span',str);
                    }
                },
                {
                   title: this.$t('themeStatus'),
                    key: 'status',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        var str = "";
                        if(params.row.status == 0){
                            str = this.$t('enableShow');
                        }else if(params.row.status == 1){
                            str = this.$t('disableShow');
                        }
                        return h('span',str);
                    }
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    align: 'center',
                    render: (h, params) => {
                        var enableDisableBtnName;
                        var status;
                        if(params.row.status == '1'){
                            enableDisableBtnName = this.$t('enableBtn');
                            status = '0';
                        }else if(params.row.status == '0'){
                            enableDisableBtnName = this.$t('disableBtn');
                            status = '1';
                        }
                        var enableDisableBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.changeThemeStatus(params.row.id,params.index,status)
                                }
                            }
                        }, enableDisableBtnName);
                        return h('div', [
                            enableDisableBtn,
                            h('Button', {
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
                                        this.edit(params.row.id,params.index)
                                    }
                                }
                            }, this.$t('editBtn')),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.row.id,params.row.image,params.row.url,params.row.type)
                                    }
                                }
                            }, this.$t('deleteBtn'))
                        ]);
                    }
                }
            ],
            rules:{
                name:[
                    { required: true, message: this.$t('themeAppNameWarning'),trigger: 'change' }
                ],
                url:[
                    { validator: validUrl, message: this.$t('themeAppUrlWarning'),trigger: 'change' }
                ],
                type:[
                    { required: true, message: this.$t('themeAppTypeWarning'),trigger: 'change' }
                ],
                image:[
                    { validator: validImage, message: this.$t('themeAppImageWarning'),trigger: 'change' }
                ],
                adaptationTime:[
                  //  {  required: true, message: this.$t('themeAppTimeWarning'),trigger: 'change', type: 'date'},
                     { validator: validTime, message: this.$t('themeAppTimeWarning'),trigger: 'change',type: 'date'}
                   
                ]
            },

        };
    },
    created() {
        this.queryAppThemeList();
    },
    computed: {

    },
    watch: {

    },
    methods: { 
        search(){
            this.pageIndex = 1;
            this.pageSize = 10;
            this.queryAppThemeList();
        },
        edit(id,index){
            this.initAppTheme()
            this.clearValidFieldMsg();
            this.isShowAdd=false;
            //关联两个数组
            // this.filePath = this.$refs.uploadImage.fileList;
            //修改的缓存
            this.title=this.$t('themeModifyVers');
            let url = '/market/portal/theme/queryThemeById';
            let ref = this;
            var params = {
                themeId: id
            };
            this.isLoadingEdits.splice(index,1,true);
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var entity = res.data;
                        if(!!entity){
                            entity.type=String(entity.type);
                            ref.appTheme = entity;
                            if(!!ref.appTheme.image){
                                var icon = {
                                    status: 'finished',
                                    url:ref.picturePath+ref.appTheme.image
                                };
                                ref.filePath.push(icon);//广告图片
                            }
                            if (ref.appTheme.status==0){
                                ref.modelThemeStatus=true;
                            }else if (ref.appTheme.status==1){
                                ref.modelThemeStatus=false;
                            }
                            //显示app包名称
                            if (!!ref.appTheme.url){
                              ref.appPageName=ref.appTheme.url.substring(ref.appTheme.url.lastIndexOf('/')+1);
                            }
                            var temp=[];
                            temp.push(ref.appTheme.adaptationTime);
                            temp.push(ref.appTheme.expireTime);
                            ref.adaptationTime=temp;
                        }
                    }
                    ref.isLoadingEdits.splice(index,1,false);
                    ref.isShowAddOrLook = true;
                    ref.flag='modify';
                }
            );
        },  
        //清除校验字段的提示信息
        clearValidFieldMsg()
        {
            this.showMsg=false;
            this.themeImageMsg='';
        },
        //修改主题状态
        changeThemeStatus(id,index,status){
            this.isLoadingenableDisables.splice(index,1,true);
            let url = '/market/portal/theme/modifyStatus';
            let ref = this;
            var params = {
                id: id,
                status: status
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        if(status == '0'){
                            ref.$Message.success(ref.$t('enableSuccess'));
                        }else if(status == '1'){
                            ref.$Message.success(ref.$t('disableSuccess'));
                        }
                        ref.queryAppThemeList();
                    }
                    ref.isLoadingenableDisables.splice(index,1,false);
                }
            );
        },
        //上传图片
        themeImageSuccess(res, file){
            let ref = this;
            if(!!res && res.resultCode == '0'){
                ref.appTheme.image=res.data.path;
                file.url=ref.picturePath+res.data.path;
                ref.validAdImgUrl();
                //预存临时文件
                ref.tempFileList.push(ref.appTheme.image);
            }else{
                ref.$Notice.warning({
                    title: file.name + ':' + this.$t('uploadFailedMsg')
                });
                ref.$refs.uploadImage.fileList=[];
            }
            
        },
        //校验图片
        validAdImgUrl(){
            this.themeImageMsg='';
            if(!!!this.appTheme.image){
                this.themeImageMsg=this.$t('uploadWarning');
            }
        },
        //展示新增窗口 
        showAdd(){
            this.flag='add';
            this.initAppTheme();
            this.isShowAddOrLook = true;
            this.isShowAdd = true;
            this.showMsg=false;
            this.filePath = this.$refs.uploadImage.fileList;
            this.title=this.$t('themeAddVers');
            this.modelThemeStatus=true;
        },
        handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
        handleRemove (url) {
            if(this.flag=='add'){      
                let ref = this;
                if (!!ref.appTheme.image) {
                    this.$http.get("/market/portal/file/delete?id="+url).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                               ref.appTheme.image='';
                               ref.validAdImgUrl();
                               ref.$refs.uploadImage.fileList.splice(0, 1);
                               ref.tempFileList=[];

                            }
                        }
                    );
                }
            }

            if(this.flag=='modify'){
                this.appTheme.image='';
                this.validAdImgUrl();
                this.$refs.uploadImage.fileList.splice(0, 1);
                this.filePath.splice(0, 1);
            } 
        },
        //初始化
        initAppTheme(){
            this.$refs['appTheme'].resetFields();
            this.appTheme.id = '';
            this.appTheme.name = '';
            this.appTheme.image = '';
            this.appTheme.url = '';
            this.appTheme.type = '';
            this.appTheme.status = true;
            this.appTheme.memo = '';
            this.appTheme.adaptationTime = '';
            this.$refs.uploadImage.fileList=[];
            this.filePath=[];
            this.adaptationTime='';
        },
        //取消新增
        cancelAdd(){
            this.isShowAddOrLook = false;
            this.isShowAdd = false;
            this.flag='';
            this.removeTempFile();

        },
        //确定新增或者修改
        save(){
            this.$refs['appTheme'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true;
                    var url = '/market/portal/theme/modify';
                    if (this.flag=='add') 
                    {
                    url = '/market/portal/theme/add';
                    }
                    let ref = this;
                    if (ref.modelThemeStatus){
                        ref.appTheme.status=0;
                    }else if (ref.modelThemeStatus){
                        ref.appTheme.status=1;
                    }
                    if (ref.appTheme.type!=2) {
                        ref.appTheme.adaptationTime='';
                    }
                    this.$http.post(url, ref.appTheme).then(function(res){
                        if(!!res && res.resultCode == '0'){
                            ref.queryAppThemeList();
                            ref.isShowAddOrLook = false;
                            ref.$Message.success(ref.$t('savedSuccess'));
                        }
                        ref.loadingBtn = false;
                    });
                }
            })
        },
        //删除app主题
        remove(id,image,url,type){
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let urls = '/market/portal/theme/delete';
                    let ref = this;
                    var params = {
                        themeId: id
                    };
                    this.$http.post(urls, params).then(function(res){
                        ref.$Modal.remove();
                        if(!!res && res.resultCode == '0'){
                            ref.$Message.success(ref.$t('deletedSuccess'));
                            ref.queryAppThemeList();
                            if (type!==3)
                             {
                             var pathList=[];
                             pathList.push(image);
                             pathList.push(url);
                             var paramsDel = {pathList: pathList};
                             ref.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
                             }
                        }
                    });
                }
            });
        },
        //分页
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.loadingTable = true;
            this.queryAppThemeList();
        },
        //查询主题列表
        queryAppThemeList(){
            if (this.searcThemeStatus) {
                this.searcThemeStatus=0;
            }else if(this.searcThemeStatus===false){
                this.searcThemeStatus=1;
            }else{
                this.searcThemeStatus='';
            }
            let url = '/market/portal/theme/queryThemeList';
            let ref = this;
            var params = {
                themeType: this.searchThemeType,
                themeStatus: this.searcThemeStatus,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            ref.isLoadingEdits = [];
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingShowDetails = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var appThemeList = res.data;
                        if(!!appThemeList){
                            for(var i=0;i<appThemeList.length;i++){
                                ref.data.push(appThemeList[i]);
                                ref.isLoadingShowDetails.push(false); 
                                ref.isLoadingEdits.push(false); 
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
           this.queryThemeTypeKey();
        },
        //查询特殊主题有的一列
        queryThemeTypeKey(){
            let url = '/market/portal/theme/queryThemeList';
            let ref = this;
            var params = {
                themeType: 3,
                themeStatus: '',
                pageIndex: 1,
                pageSize: 10
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'&&!!res.data&&res.data.length>0){
                        ref.typeKey=true;
                    }else
                    {
                        ref.typeKey=false;
                    }
                }
            );
        },
        /*应用程序包上传成功*/
        apkSuccess(res, file){
            let ref = this;
            ref.appUrlMsg='';
            ref.showMsg=false;
            if(!!res)
            {
                if( res.resultCode == '0'){
                    ref.appTheme.url =res.data.path;
                    file.url=res.data.path;
                    //显示app名称
                    if (!!res.data.path){
                      ref.appPageName=res.data.path.substring(res.data.path.lastIndexOf('/')+1);
                    }
                    //上传插件的临时文件
                    this.$refs.upload.fileList=[];
                   //预存临时文件
                    ref.tempFileList.push(ref.appTheme.url);
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
        //删除app
        removeApp (file) {
            let ref = this;
            this.$http.get("/market/portal/file/delete?id="+file).then(function(res){
                if(!!res && res.resultCode == '0'){
                    ref.appTheme.url='';
                    //上传插件的临时文件
                    ref.$refs.upload.fileList=[];
                    ref.tempFileList=[];
                }
            });    
        },
        //日期控件值修改
        handleChange(month) {
            if (!!month&&month.length==2) {
                this.appTheme.adaptationTime = month[0];
                this.appTheme.expireTime =  month[1];
            }
            
        },
        //新增取消的时候需要删除缓存中的文件信息
        removeTempFile(){
            let ref = this;
            if (!!ref.tempFileList&&ref.tempFileList.length>0)
             {
               var paramsDel = {pathList: ref.tempFileList};
               this.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){
               ref.tempFileList=[];
               });
             }
        
        },
    }
};
</script>