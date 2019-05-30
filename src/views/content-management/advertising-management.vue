<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .page {
        float: right;
        margin-top: 10px;
    }
    .user_field {
        width: 70%;
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
    .spin-container{
        width: 93%;
        height: 100%;
        position: absolute;
        top:0;
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
                    <div slot="title">
                        <Button type="primary" @click="add">
                            <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
                        </Button>
                        <div style="float:right;">
                        <span v-text="$t('advertisementName')"></span>:
                        <Input v-model="advertisementName" :placeholder="$t('advertisingNamePlaceholder')" style="width: 200px" /> 
                        <Button type="primary" @click="search">
                            <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                        </Button>
                        </div>
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
                    <Select  v-model="defaultLanguage" class="model-title-local-select" @on-change='changeLanguage(defaultLanguage)'>
                        <Option v-for="item in languageList" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
                    <Button v-text="$t('addLocalLanguage')" @click="addLanguage" v-show="flag=='add'"></Button>
                    <Button v-text="$t('deleteLocalLanguage')" @click="removeLanguage" 
                        v-show="defaultLanguage!=languageConstant && flag =='add'"></Button>
                </div>

                <Card :bordered="false" dis-hover>
                    <Form ref="advertisement" :model="advertisement" :label-width="180">
                        <div v-show='defaultLanguage==languageConstant'>
                            <FormItem :label="$t('advertisementName')" class='ivu-form-item-required'>
                                <Input v-model="advertisement.advertisementName" class="user_field" :readonly="isClicked"  @on-change="validAdName()"></Input>
                                <div class="ivu-form-item-error-tip" v-text="adNameMsg" v-show='showMsg'></div>
                            </FormItem>
                            <FormItem :label="$t('advertisementType')"  class='ivu-form-item-required'>
                                <Select v-model="advertisement.advertisementType" class="user_field" :placeholder="$t('selectPlaceholder')" 
                                @on-change="validAdType()">
                                    <Option value="1">{{$t('externalLinks')}}</Option>
                                    <Option value="2">{{$t('app')}}</Option>
                                    <Option value="3">{{$t('column')}}</Option>
                                    <Option value="4">{{$t('LaunchPage')}}</Option>
                                    <Option value="5">{{$t('landingPage')}}</Option>
                                    <Option value="6">{{$t('bundleCol')}}</Option>
                                    <Option value="7">{{$t('interactiveAdv')}}</Option>   
                                    <Option value="8">{{$t('orderAds')}}</Option>                                       
                                </Select>
                                <div class="ivu-form-item-error-tip" v-text="adTypeMsg" v-show='showMsg'></div>
                            </FormItem>
                            <FormItem :label="$t('advertisementUrl')" v-show="advertisement.advertisementType==1 || advertisement.advertisementType==4 ||advertisement.advertisementType==5">
                                <Input v-model="advertisement.advertisementUrl" class="user_field" ></Input>
                            </FormItem>
                            <FormItem :label="$t('column')" v-show="advertisement.advertisementType==3"> 
                                <Select v-model="advertisement.column" class="user_field" :placeholder="$t('selectPlaceholder')" :not-found-text="$t('noResult')" filterable>
                                    <Option value="" ></Option>
                                    <Option  v-for="item in catalogList" :value="item.catalogId" :key="item.catalogId" >{{item.catalogName}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem :label="$t('bundleCol')" v-show="advertisement.advertisementType==7||advertisement.advertisementType==8"> 
                                <Select v-model="advertisement.bundle" class="user_field" :placeholder="$t('selectPlaceholder')" :not-found-text="$t('noResult')" filterable>
                                    <Option value="" )"></Option>
                                    <Option  v-for="item in orderList" :value="item.bundleId" :key="item.bundleId">{{item.bundleName}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem :label="$t('app')" v-show="advertisement.advertisementType==2"> 
                                <Select v-model="advertisement.app" class="user_field" :placeholder="$t('selectPlaceholder')" :not-found-text="$t('noResult')" filterable>
                                    <Option value="" ></Option>
                                    <Option  v-for="item in appList" :value="item.appId" :key="item.appId">{{item.appName}}</Option>
                                </Select>
                            </FormItem>
                        </div>
                        <FormItem :label="$t('advertisementPicture')" class='ivu-form-item-required'>
                            <Input v-model="advertisement.imgUrl" v-show="false"></Input>
                            <div class="demo-upload-list" v-for="item in filePath">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(advertisement.imgUrl)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload v-show="!!filePath&&filePath.length<1"
                                ref="upload"
                                :show-upload-list="false"
                                :on-success="handleSuccess"
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
                            <div class="ivu-form-item-error-tip" v-text="adImgUrlMsg" v-show='showMsg'></div>
                        </FormItem>
                        <FormItem :label="$t('catalogDescCol')">
                            <Input v-model="advertisement.memo" type="textarea" :autosize="{minRows: 5,maxRows: 10}" class="user_field"></Input>
                        </FormItem>
                       <div v-show='defaultLanguage==languageConstant'>
                            <FormItem :label="$t('userEnableCol')" v-show="flag=='add'" >
                                <i-switch v-model="validSwitch"  size="large">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </FormItem>
                        </div>
                        <div class="spin-container"  v-show="isClicked"> </div>    
                    </Form>
               </Card>
               <div slot="footer">
                    <Button @click="cancel('advertisement')">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClicked" @click="save('advertisement')">{{$t('saveBtn')}}</Button>
                </div>
            </Modal>
            <Modal 
                v-model="visible"
                :ok-text="$t('confirmBtn')"
                :cancel-text="$t('cancelBtn')">
                <img :src="imgName" v-if="visible" style="width: 100%">
            </Modal>
            <!-- 添加多语言弹窗 -->
            <Modal
                v-model="addLanguageFlag"
                :title="$t('addLocalLanguage')"
                @on-ok="addLanguageOk"
                @on-cancel="addLanguageCancel">
                    <Select  v-model="selectLanguage">
                        <Option value="" v-text="$t('selectPlaceholder')"></Option>
                        <Option  v-for="item in localLanguage" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
            </Modal>
            <!-- 校验多语言弹窗 -->
            <Modal v-model="validAdLangsFlag" :title="$t('warmPromptDialogTitle')" @on-ok="validAdLangsOk" @on-cancel="validAdLangsCancel">
                <p v-text="$t('validAppLangsFailText')"></p>
            </Modal>            
        </Row>
    </div>
    
</template>

<script>
import axios from 'axios';
import util from '../../libs/util';
export default {
    name: 'advertisingManagement',
    data () {
        return {
            advertisementName:'',//广告名称
            picturePath:util.fileHeaherUrl,//图片路径
            pageIndex: 1,   //查询页码
            pageSize: 10,   //查询大小
            total: 0, //总数  
            loadingTable: true,    //表格是否loading
            flag:'',//add代表新增状态 edit代表修改状态  view代表查看状态
            isLoadingenableDisables: [],    //是否loading启用禁用按钮数组
            isLoadingEdits: [],   //是否loading编辑按钮数组
            isShowDel: false,   //是否展示删除弹窗
            isShow: false,   //是否展示新增弹窗
            isClicked: false,   //是否正在发送新增请求
            advertisement:{},
            title:'',
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
                    title: this.$t('advertisementName'),
                    key: 'advertisementName',
                    align:'center'
                },
                {
                    title: this.$t('advertisementType'),
                    key: 'advertisementType',
                    align:'center',
                    render: (h, params) => {
                        var type;
                        if(params.row.advertisementType == '1'){
                            type = this.$t('externalLinks');
                        }else if(params.row.advertisementType == '2'){
                            type = this.$t('app');
                        }else if(params.row.advertisementType == '3'){
                            type = this.$t('column');
                        }else if(params.row.advertisementType == '4'){
                            type = this.$t('LaunchPage');
                        }else if(params.row.advertisementType == '5'){
                            type = this.$t('landingPage');
                        }else if(params.row.advertisementType == '6'){
                            type = this.$t('bundleCol');
                        }else if(params.row.advertisementType == '7'){
                            type = this.$t('interactiveAdv');
                        }else if(params.row.advertisementType == '8'){
                            type = this.$t('orderAds');
                        }else{}

                        return h('span',type)
                    }
                },
                {
                    title: this.$t('advertisementUrl'),
                    key: 'advertisementUrl',
                    align:'center'
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    width: 300,
                    align: 'center',
                    render: (h, params) => {
                        var enableDisableBtnName;
                        var status;
                        if(params.row.isValid == '0'){
                            enableDisableBtnName = this.$t('enableBtn');
                            status = '1';
                        }else if(params.row.isValid == '1'){
                            enableDisableBtnName = this.$t('disableBtn');
                            status = '0';
                        }
                        var enableDisableBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                loading: this.isLoadingenableDisables[params.index]
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.changeAdStatus(params.row.advertisementId,params.index,status)
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
                                        this.edit(params.row.advertisementId,params.index)
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
                                        this.remove(params.row.advertisementId)
                                    }
                                }
                            }, this.$t('deleteBtn'))
                        ]);
                    }
                }
            ],
            tableData: [],
            visible: false,
            imgName: '',
            appList:[],//应用列表
            catalogList:[],//栏目列表
            orderList:[],//订单列表
            filePath:[],
            languageConstant:'en_US',//默认语言常量
            localLanguageList:[],//多语言列表
            languageList:[],//已添加语言列表
            localLanguage:[],//可添加语言列表
            localConstant:{'localName':'en_US',"country":"English"},//默认本地主语言常量
            defaultLanguage:'en_US',//当前选择语言
            addLanguageFlag:false,//是否展示新增语言弹窗标识
            adTemp1:{},//多语种App信息缓存1
            adTemp2:{},//多语种App信息缓存2
            choinceOperation:true,//判断当前读取那个缓存
            frontOpt:'',//保存ad语种的前一个选中项
            selectLanguage:'',//选中语言
            validSwitch:false,//开关状态
            validAdLangsFlag: false,//校验多语言弹窗显示标识
            errorAdLangName:'',//校验错误的语言
            adNameMsg:'',
            adTypeMsg:'',
            adImgUrlMsg:'',
            showMsg:false,//是否显示错误信息标识
            modifyAdImgUrlTemp:{},//修改时图片的缓存
            waitAdImgUrlTemp:[],//修改时待删除图片列表
        };
    },
    created() {
        this.loadingData();
        this.loadingCatalog();
        this.loadingOrder();
        this.loadingApp();
        this.queryLanguagelist();
        this.languageList.push(this.localConstant);
       // this.advertisement.advertisementType='1';
    },
    methods: {
        loadingData(){
            let url = '/market/portal/ad/queryAdList';
            let ref = this;
            var params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                advertisementName: this.advertisementName,
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingenableDisables = [];    
                    ref.isLoadingEdits = [];
                    ref.tableData = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.tableData.push(list[i]);
                                ref.isLoadingenableDisables.push(false);
                                ref.isLoadingEdits.push(false); 
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        search(){
            this.pageIndex = 1;
            this.pageSize = 10;
            this.loadingData();
        },
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.loadingData();
        },
        /*加载栏目列表*/
        loadingCatalog(){
            let url = '/market/portal/catalog/queryAdsConfigCatalogList';
            let ref = this;
            this.$http.get(url, null).then(
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
        /*加载套餐列表*/
        loadingOrder(){
            let url = '/market/portal/bundle/queryAdsConfigBundleList';
            let ref = this;
            this.$http.get(url, null).then(
                function(res){
                    ref.orderList = [];
                    if(!!res && res.resultCode == '0'){
                        var list = res.data;
                        if(!!list){
                            for(var i=0;i<list.length;i++){
                                ref.orderList.push(list[i]);
                            }
                        }
                    }
                }
            );
        },
        /*加载应用列表*/
        loadingApp(){
            let url = '/market/portal/app/queryAdsConfigAppList';
            let ref = this;
            this.$http.get(url, null).then(
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
        add(){
            this.isShow = true;
            this.flag='add';
            this.advertisement={};
            this.title=this.$t('addAdvertisement');
            if(this.$refs.upload.fileList.length>0){
                this.$refs.upload.fileList=[];
            }
            this.filePath = this.$refs.upload.fileList;
            this.initData();
            this.validSwitch=false;
            this.clearValidFieldMsg();
        },
        //保存按钮
        save(){
            //清空校验信息       
            this.clearValidFieldMsg();
            //1先将当前ad信息保存到缓存
            this.adTemp2[this.defaultLanguage]=this.advertisement;
            //2校验当前语种信息    
            let vaildFlag = this.vaildteAd();//校验不通过标识
            if(vaildFlag){ return; }//检验不通过
            //3检验其他语种信息
            let result = this.validateOtherLangs(this.adTemp2);
            if(!result)
            {
                return;
            } 
            //4从缓存取出app信息
            let adList=this.adTemp2;

            let ref = this;
            var url='/market/portal/ad/add';
   
            ref.isClicked = true;
            //新增不需要id
            if(ref.flag=='modify'){
                url='/market/portal/ad/modify';
                ref.advertisement.advertisementId
            }else{
                ref.advertisement.advertisementId="";
            }
            
            var local=[];//多语言列表
            var languageInfo={};//多语言实体
            var adInfo={};
            var pathList=[];
            var adDto = adList[this.languageConstant];
            for (var i = 0; i < this.languageList.length; i++){                    
                adInfo={};
                adInfo = adList[this.languageList[i].localName];
                languageInfo={};
                languageInfo = {
                    advertisementId:adDto.advertisementId,
                    advertisementName:adDto.advertisementName,
                    imgUrl:adInfo.imgUrl,
                    memo:adInfo.memo,
                    local:this.languageList[i].localName
                };
                local.push(languageInfo);

                //修改时判断是否需要删除原先的缓存数据
                if(ref.flag=='modify')
                {
                    //广告图片
                    if(!!this.modifyAdImgUrlTemp[this.languageList[i].localName]
                        &&this.modifyAdImgUrlTemp[this.languageList[i].localName]!=adInfo.imgUrl){
                        pathList.push(this.modifyAdImgUrlTemp[this.languageList[i].localName]);
                    }
                    //判断是否存在于缓存数组
                    for (var ii1 = 0; ii1 < this.waitAdImgUrlTemp.length; ii1++){ 
                　　    if(this.waitAdImgUrlTemp[ii1] == adInfo.imgUrl){
                            this.waitAdImgUrlTemp.splice(ii1,1);
                            break;
                        }   
                    } 
                }

            }

            //类型对应栏目、应用或者app
            if (adDto.advertisementType==1){
                adDto.targetId="";
            }else if (adDto.advertisementType==2){
                adDto.targetId=adDto.app;
            }else if (adDto.advertisementType==3){
                adDto.targetId=adDto.column;
            }else if (adDto.advertisementType==7||adDto.advertisementType==8){
                adDto.targetId=adDto.bundle;
            }
            let tempValid;
            if(this.validSwitch){
                tempValid='1';
            }
            else{
                tempValid='0';
            }

            var params = {
                advertisementId: adDto.advertisementId,
                advertisementName: adDto.advertisementName,
                advertisementUrl: adDto.advertisementUrl,
                imgUrl: adDto.imgUrl,
                advertisementType: adDto.advertisementType,
                targetId: adDto.targetId,
                memo: adDto.memo,
                isValid:tempValid,
                adsLangs:local
            }; 

            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.isShow = false;
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.loadingData();
                        //清空缓存
                        ref.languageList=[];
                        ref.defaultLanguage=ref.languageConstant;
                        ref.languageList.push(ref.localConstant);
                        ref.choinceOperation=true;
                        ref.frontOpt='';
                        ref.adTemp1={};
                        ref.adTemp2={};
                        //修改时要删除原先的缓存数据
                        if(ref.flag=='modify')
                        {
                            if(pathList.length>0)
                            {
                                var paramsDel = {pathList: pathList};
                                ref.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
                            }

                            ref.delWaitTemp();//清除点切换图片的临时数据
                        } 
                    }
                    ref.isClicked = false;
                }
            );
        },
        cancel(name){
            if(this.flag=='modify')
            {
                this.delWaitTemp();
            }
            this.removeAdFdfs();//新增时取消需要删除图片缓存
            this.isShow = false;
            this.validSwitchfalse=false;
            // this.$refs[name].resetFields();
            this.isClicked = false;
            this.clearValidFieldMsg();//清空检验信息
        },
        edit(id,index){
            this.clearValidFieldMsg();
            this.advertisement={};
            //修改的缓存
            this.modifyAdImgUrlTemp={};
            this.waitAdImgUrlTemp=[];
            this.title=this.$t('editAdvertisement');
            if(this.$refs.upload.fileList.length>0){
                this.$refs.upload.fileList=[];
            }
            this.filePath = this.$refs.upload.fileList;
            let url = '/market/portal/ad/queryAdById';
            let ref = this;
            var params = {
                advertisementId: id
            };
            this.isLoadingEdits.splice(index,1,true);
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var entity = res.data;
                        if(!!entity){
                            ref.advertisement = entity;
                            if(!!ref.advertisement.imgUrl){
                                var icon = {
                                    status: 'finished',
                                    url:ref.picturePath+ref.advertisement.imgUrl
                                };
                                ref.filePath.push(icon);//广告图片
                            }
                            if (ref.advertisement.advertisementType==1){
                                ref.advertisement.targetId="";
                            }else if (ref.advertisement.advertisementType==2){
                                ref.advertisement.app=ref.advertisement.targetId;
                            }else if (ref.advertisement.advertisementType==3){
                                ref.advertisement.column=ref.advertisement.targetId;
                            }else if (ref.advertisement.advertisementType==7||ref.advertisement.advertisementType==8){
                                ref.advertisement.bundle=ref.advertisement.targetId;
                            }
                            //多语言放入缓存
                            ref.saveAdLangs(entity);
                        }
                    }
                    ref.isLoadingEdits.splice(index,1,false);
                    ref.isShow = true;
                    ref.flag='modify';
                    ref.isClicked=false;
                }
            );

        },
        remove(id){
            let ref = this;
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let byIdUrl = '/market/portal/ad/queryAdById';
                    var params = {advertisementId: id};
                    this.$http.post(byIdUrl, params).then(
                    function(res){
                        if(!!res && res.resultCode == '0'){
                            var entity = res.data;
                            if(!!entity){
                                let url = '/market/portal/ad/delete';
                                var pathList=[];
                                for (var i =0;i<entity.adsLangs.length;i++) {
                                    if(!!entity.adsLangs[i].imgUrl)
                                    {
                                        pathList.push(entity.adsLangs[i].imgUrl);
                                    }
                                }
                                var paramsDel = {
                                    pathList: pathList
                                };
                                ref.$http.post("/market/portal/file/batchDelete", paramsDel).then(
                                    function(resp){
                                        if(!!resp && resp.resultCode == '0'){
                                            var params = {
                                                advertisementId: id
                                            };
                                            ref.$http.post(url, params).then(
                                                function(rsp){
                                                    ref.$Modal.remove();
                                                    if(!!rsp && rsp.resultCode == '0'){
                                                        ref.$Message.success(ref.$t('deletedSuccess'));
                                                        ref.loadingData();
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    });
                }
            });
        },
        handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
        handleRemove (url) {
            if(this.flag=='add'){      
                let ref = this;
                if (!!ref.advertisement.imgUrl) {
                    this.$http.get("/market/portal/file/delete?id="+url).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                               ref.advertisement.imgUrl='';
                               ref.validAdImgUrl();
                               ref.$refs.upload.fileList.splice(0, 1);
                            }
                        }
                    );
                }
            }

            if(this.flag=='modify'){
                this.advertisement.imgUrl='';
                this.$refs.upload.fileList.splice(0, 1);
                this.validAdImgUrl();
                this.adTemp1[this.defaultLanguage]=this.advertisement;
                this.adTemp2[this.defaultLanguage]=this.advertisement;
                if(url!=this.modifyAdImgUrlTemp[this.defaultLanguage])
                {
                    this.waitAdImgUrlTemp.push(url);
                }
            } 
        },
        handleSuccess (res, file) {
            let ref = this;
            if(!!res && res.resultCode == '0'){
                ref.advertisement.imgUrl=res.data.path;
                file.url=ref.picturePath+res.data.path;
                ref.validAdImgUrl();
                if(this.flag=='modify'){
                    this.waitAdImgUrlTemp.push(ref.advertisement.imgUrl);
                }
            }else{
                ref.$Notice.warning({
                    title: file.name + ':' + this.$t('uploadFailedMsg')
                });
                ref.$refs.upload.fileList=[];
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
        handleBeforeUpload () {
            const check = this.uploadIconList.length < 1;
            return check;
        },
        //修改广告状态
        changeAdStatus(advertisementId,index,status){
            this.isLoadingenableDisables.splice(index,1,true);
            let url = '/market/portal/ad/modifyStatus';
            let ref = this;
            var params = {
                advertisementId: advertisementId,
                isValid: status
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        if(status == '1'){
                            ref.$Message.success(ref.$t('enableSuccess'));
                        }else if(status == '0'){
                            ref.$Message.success(ref.$t('disableSuccess'));
                        }
                        ref.loadingData();
                    }
                    ref.isLoadingenableDisables.splice(index,1,false);
                }
            );
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
        /*新增多语言*/
        addLanguage() {
            this.addLanguageFlag= true;
            this.isShow=false;
            
            //临时数组存放
            var tempArray1 = [];//临时数组1
            var tempArray2 = [];//临时数组2
            for(var i=0;i<this.languageList.length;i++){
                //将数 languageList 中的元素值作为tempArray1 中的键，值为true；
                tempArray1[this.languageList[i].localName]=true;
            }
            for(var i=0;i<this.localLanguageList.length;i++){
                if(!tempArray1[this.localLanguageList[i].localName]){
                    //过滤localLanguageList 中与defaultLanguage 相同的元素；
                    tempArray2.push(this.localLanguageList[i]);
                }
            }
            this.localLanguage = tempArray2;
            //保存多语言数据到缓存中  
            this.adTemp1[this.defaultLanguage]=this.advertisement;        
            this.adTemp2[this.defaultLanguage]=this.advertisement;
            //置空ad实体
            this.advertisement={};
        },
        /*新增多语言确定*/
        addLanguageOk () {
            if(!!this.selectLanguage)
            {
                //移除校验效果  
                this.emptyAdInfo(); 
                // this.$refs['advertisement'].resetFields();
                //添加app语种
                for(var i=0;i<this.localLanguageList.length;i++){
                    if(this.selectLanguage == this.localLanguageList[i].localName)
                    {
                        this.languageList.push(this.localLanguageList[i]);
                        break;
                    }  
                }
                //保存前一个opt选项 新增时应为新增的选项
                this.frontOpt=this.selectLanguage;
                //app选中当前语种
                this.defaultLanguage=this.selectLanguage;
                //保存多语言数据到缓存中
                this.adTemp1[this.defaultLanguage]=this.advertisement;        
                this.adTemp2[this.defaultLanguage]=this.advertisement;
                //置空下拉框选中项
                this.selectLanguage='';
            }
            this.isShow=true;
        },
        /*新增多语言取消*/
        addLanguageCancel () {
            this.selectLanguage='';
            this.isShow=true;
        },
        //删除多语言
        removeLanguage(){
            //先删除图片
            var entity = this.adTemp1[this.defaultLanguage];
            if(!!entity && !!entity.imgUrl){
                this.$http.get("/market/portal/file/delete?id="+entity.imgUrl).then(function(res){});
            }
            //移除app缓存数据
            delete this.adTemp1[this.defaultLanguage];
            delete this.adTemp2[this.defaultLanguage];
            //移出下拉框
            for(var i=0;i<this.languageList.length;i++){
                if(this.defaultLanguage==this.languageList[i].localName)
                {
                    this.languageList.splice(i,1);
                    break;
                }  
            }
            //记录删除opt
            this.frontOpt=this.defaultLanguage;
            //删除后默认英文
            this.defaultLanguage = this.languageConstant;
        },
        //切换语言
        changeLanguage(selectLang ){
            //清空校验信息       
            this.clearValidFieldMsg();
            var flage = false;  
            //检查语种是否被删除
            for(var i=0;i<this.languageList.length;i++){
                if(this.defaultLanguage==this.languageList[i].localName)
                {
                    flage = true;
                    break;
                }  
            }
            if (this.choinceOperation)
            {
                //未删除的语种才做更新操作
                if(flage)
                {   
                    //更新多语言数据到缓存中
                    this.adTemp1[this.frontOpt]=this.advertisement;
                }
                if(!!this.adTemp2[selectLang])
                {
                    //从多语言数据缓存中获取当前选择语言信息
                    this.emptyAdInfo();
                    this.advertisement=this.adTemp2[selectLang];
                    this.changeImageAd(this.advertisement);
                }    
            }
            else
            {
                if(flage)
                { 
                    //更新多语言数据到缓存中
                    this.adTemp2[this.frontOpt]=this.advertisement;
                }
                if(!!this.adTemp1[selectLang])
                {
                    //从多语言数据缓存中获取当前选择语言信息
                    this.emptyAdInfo();
                    this.advertisement=this.adTemp1[selectLang];
                    this.changeImageAd(this.advertisement);      
                }
            }
            if(this.defaultLanguage==this.languageConstant){
                if (this.advertisement.advertisementType==1){
                    this.advertisement.targetId="";
                }else if (this.advertisement.advertisementType==2){
                    this.advertisement.app=this.advertisement.targetId;
                }else if (this.advertisement.advertisementType==3){
                    this.advertisement.column=this.advertisement.targetId;
                }else if (this.advertisement.advertisementType==7||this.advertisement.advertisementType==8){
                    this.advertisement.bundle=this.advertisement.targetId;
                }
            }
            //变更下次优选操作的缓存
            this.choinceOperation =!this.choinceOperation;
            //保存本次选中的opt
            this.frontOpt=selectLang;  
        },
        //初始化数据
        initData(){
            //重置多语言信息
            this.languageList=[];
            this.defaultLanguage=this.languageConstant;
            this.languageList.push(this.localConstant);
            this.adTemp1={};
            this.adTemp2={};
        },
        //清空app图片、包信息
        emptyAdInfo(){
            this.advertisement={};
            this.advertisement.isValid=false;
            this.filePath=[];//广告图标
            if(this.$refs.upload.fileList.length>0){
                this.$refs.upload.fileList=[];
            }
            this.filePath = this.$refs.upload.fileList;
        },
        changeImageAd(ad){
            let ref= this;
            ref.advertisement = ad;
            if(!!ref.advertisement.imgUrl){
                var template = {
                    status: 'finished',
                    url:ref.picturePath+ref.advertisement.imgUrl
                };
                ref.filePath.push(template);//广告图标
            } 
        },
        //检验ad信息确定按钮
        validAdLangsOk(){
            this.defaultLanguage=this.errorAdLangName;
            this.validAdLangsFlag=false;
            this.isShow=true;
        },
        //检验ad信息取消按钮
        validAdLangsCancel(){
            this.validAdLangsFlag=false;
            this.isShow=true;
        },
        //校验其他语种
        validateOtherLangs(langs){
            let result ='';
            this.errorAdLangName='';
            for(var i=0; i<this.languageList.length;i++)
            {
                var langName=this.languageList[i].localName;
                if(langName!=this.defaultLanguage)
                {
                    var adLang = langs[langName];
                    result = this.vaildateAdInfo(langName,adLang)
                    //检验失败，打开弹窗
                    if(!result)
                    {
                        this.errorAdLangName=langName;
                        this.validAdLangsFlag=true;
                        this.isShow=false;
                        return false;  
                    }
                } 
            }
            return true;  
        },
        //检验其他语种信息
        vaildateAdInfo(langName,adLang){
            if(!!!adLang.imgUrl){
                return false;
            }

            if(langName==this.languageConstant){
                if(!!!adLang.advertisementName|| !!!adLang.advertisementType){
                    return false;
                }
                return true;
            }
            else
            {
                return true;
            }
        },
        validAdName(){
            this.adNameMsg='';
            if(this.defaultLanguage==this.languageConstant){
                if(!!!this.advertisement.advertisementName){
                    this.adNameMsg=this.$t('advertisementEnNameWarning');
                }
            } 
        },
        validAdType(){
            this.adTypeMsg='';
            if(this.defaultLanguage==this.languageConstant){
                if(!!!this.advertisement.advertisementType){
                    this.adTypeMsg=this.$t('advertisementTypeWarning');
                }
            }
        },
        validAdImgUrl(){
            this.adImgUrlMsg='';
            if(!!!this.advertisement.imgUrl){
                this.adImgUrlMsg=this.$t('uploadAdvertisiongWarning');
            }
        },
        //检验app信息
        vaildteAd(){
            if(this.defaultLanguage==this.languageConstant){
                if(!!!this.advertisement.advertisementName){
                    this.adNameMsg=this.$t('advertisementEnNameWarning');
                }
                if(!!!this.advertisement.advertisementType){
                    this.adTypeMsg=this.$t('advertisementTypeWarning');
                }
            } 
            if(!!!this.advertisement.imgUrl){
                this.adImgUrlMsg=this.$t('uploadAdvertisiongWarning');
            }
            if(!!this.adNameMsg ||!!this.adTypeMsg||!!this.adImgUrlMsg)
            {
                this.showMsg=true;
                return true;
            }else
            {
                return false;
            }

        },   
        //清除校验字段的提示信息
        clearValidFieldMsg()
        {
            this.showMsg=false;
            this.adNameMsg='';
            this.adTypeMsg='';
            this.adImgUrlMsg='';
        },
        //将byId查回来的多语言信息放入缓存
        saveAdLangs (adInfo){
            let adlangs = adInfo.adsLangs;
            let languageInfo;
            let temp;
            this.adTemp1={};
            this.adTemp2={};
            this.languageList=[];
            for(var i=0; i<adlangs.length; i++)
            {
                temp ='';
                temp = adlangs[i];
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
                        advertisementId: adInfo.advertisementId,
                        imgUrl: temp.imgUrl,
                        memo: temp.memo
                    };
                }
                else{
                    languageInfo = {
                        advertisementId: adInfo.advertisementId,
                        advertisementName: adInfo.advertisementName,
                        advertisementUrl: adInfo.advertisementUrl,
                        imgUrl: temp.imgUrl,
                        advertisementType: adInfo.advertisementType,
                        targetId: adInfo.targetId,
                        memo: adInfo.memo,
                        isValid:adInfo.isValid
                    };    
                }
                this.adTemp1[temp.local]=languageInfo;
                this.adTemp2[temp.local]=languageInfo;
                this.defaultLanguage=this.languageConstant;
                this.frontOpt=this.languageConstant;
                //修改的缓存   
                this.modifyAdImgUrlTemp[temp.local]=temp.imgUrl;
            }
                // console.log(this.modifyAdImgUrlTemp)
        },
        //新增取消的时候需要删除缓存中的文件信息
        removeAdFdfs(){
            if(this.flag!='add'){
                return ;
            }

            this.adTemp1[this.defaultLanguage]=this.advertisement;
            var pathList=[];

            for(var i=0; i<this.languageList.length;i++)
            {
                var langName=this.languageList[i].localName;
                var entity=this.adTemp1[langName];
                if(!!entity){
                    if (!!entity.imgUrl) { pathList.push(entity.imgUrl); }
                }
            }
            if(pathList.length>0)
            {
                var paramsDel = {pathList: pathList};
                this.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
            }
        },
        //清除修改时切换图片的缓存
        delWaitTemp()
        {
            //待删除列表
            var pathList=[];                
            //删除图标    
            var imgUrlTemp=this.arrayDistinct(this.waitAdImgUrlTemp);
            if(imgUrlTemp.length>0)
            {
                for (var i = 0; i < imgUrlTemp.length; i++) {
                    pathList.push(imgUrlTemp[i]);
                }
            }

            //将待删除列表中的数据删除
            if(pathList.length>0)
            {
                var paramsDel = {pathList: pathList};
                this.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
            }
        },
        //数组去重
        arrayDistinct (arr){
            var i,j,len = arr.length;
            for(i = 0; i < len; i++){
                for(j = i + 1; j < len; j++){
                   if(arr[i] == arr[j]){
                       arr.splice(j,1);
                       len--;
                       j--;
                    }
                }
            }
            return arr;
        },

    }
};
</script>