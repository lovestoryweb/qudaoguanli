<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .catalog_field {
        width: 70%;
    }
    .mask {
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:1000;
    }
    .clear {
        clear: both;
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
                        <Button type="primary" @click="showAdd">
                            <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
                        </Button>
                    </div>
                    <div>
                        <Table border :columns="columns" :data="data" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <!-- 新增/编辑弹窗 -->
            <Modal v-model="isShowAddOrEdit" width="800px">
                <p slot="header" class="model-title-p" v-text="isShowAdd ? $t('addCatalogTitle') : $t('editCatalogTitle')"></p>
                <div slot="header" class="model-title-local-div">
                    <Select  v-model="defaultLanguage" class="model-title-local-select" @on-change='changeLanguage(defaultLanguage)'>
                        <Option v-for="item in languageList" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
                    <Button v-text="$t('addLocalLanguage')" @click="addLangs" v-show="isShowAdd"></Button>
                    <Button v-text="$t('deleteLocalLanguage')" @click="removeLangs" 
                        v-show="defaultLanguage!=languageConstant && isShowAdd"></Button>
                </div>

                <Card :bordered="false" dis-hover>
                    <Form ref="catalog" :model="catalog" :label-width="180">
                        <FormItem v-show="defaultLanguage==languageConstant&&isShowEdit"  :label="$t('catalogIdCol')" 
                            class='ivu-form-item-required'>
                            <Input v-model="catalog.catalogId" class="catalog_field" disabled></Input>
                        </FormItem>
                        <FormItem :label="$t('catalogNameCol')"  class='ivu-form-item-required'>
                            <Input v-model="catalog.catalogName" class="catalog_field" @on-change="validCatalogNameFun()"></Input>
                            <div class="ivu-form-item-error-tip" v-text="catalogNameMsg" v-show='showMsg'></div>
                        </FormItem>
<!--                         <FormItem :label="$t('catalogIconCol')" v-show="defaultLanguage==languageConstant">
                            <Input v-model="catalog.catalogIcon" v-show="false"></Input>
                            <div class="demo-upload-list" v-for="item in uploadIconList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove('1')"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                v-show="uploadIconList.length<1"
                                ref="uploadIcon"
                                :show-upload-list="false"
                                :on-success="handleIconSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="10240"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUploadIcon"
                                type="drag"
                                action="/market/portal/file/upload"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <div class="ivu-form-item-error-tip" v-text="catalogIconMsg" v-show='showMsg'></div>
                        </FormItem>  -->
                        <FormItem :label="$t('catalogBacimgField')"  class='ivu-form-item-required' >
                            <Input v-model="catalog.progagandaImg" v-show="false"></Input>
                            <div class="demo-upload-list" v-for="item in uploadProgagandaImgList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove('2')"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                v-show="uploadProgagandaImgList.length<1"
                                ref="uploadProgagandaImg"
                                :show-upload-list="false"
                                :on-success="handleProgagandaImgSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="10240"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUploadProgagandaImg"
                                type="drag"
                                action="/market/portal/file/upload"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <div class="ivu-form-item-error-tip" v-text="progagandaImgMsg" v-show='showMsg'></div>
                        </FormItem>
                        <FormItem :label="$t('catalogDescCol')"  v-show="defaultLanguage==languageConstant">
                            <Input v-model="catalog.catalogDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="catalog_field"></Input>
                        </FormItem>
                    </Form>
                    <div class="mask" v-show="isClickedBtn"></div>
                </Card>
                <div v-if="isShowAdd" slot="footer">
                    <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedBtn" @click="add()">{{$t('saveBtn')}}</Button>
                </div>
                <div v-else slot="footer">
                    <Button @click="cancelEdit()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedBtn" @click="edit()">{{$t('saveBtn')}}</Button>
                </div>
            </Modal>
            <Modal 
                v-model="visible"
                :ok-text="$t('confirmBtn')"
                :cancel-text="$t('cancelBtn')">
                <img :src="imageUrl" v-if="visible" style="width: 100%">
            </Modal>
            <!-- 添加多语言弹窗 -->
            <Modal
                v-model="addLanguageFlag"
                :title="$t('addLocalLanguage')"
                @on-ok="addLangsOk"
                @on-cancel="addLangsCancel">
                    <Select  v-model="selectLanguage">
                        <Option value="" v-text="$t('selectPlaceholder')"></Option>
                        <Option  v-for="item in localLanguage" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
            </Modal> 
            <!-- 校验多语言弹窗 -->
            <Modal v-model="validCatalogLangsFlag" :title="$t('warmPromptDialogTitle')" @on-ok="validCatalogLangsOk" 
                @on-cancel="validCatalogLangsCancel">
                <p v-text="$t('validAppLangsFailText')"></p>
            </Modal>                          
        </Row>
    </div>
</template>

<script>
import util from '../../libs/util';
export default {
    name: 'appColumnManagement',
    data () {
        
        return {
            fileUrl: util.fileHeaherUrl,
            loadingTable: true,    //表格是否loading
            isLoadingEdits: [],   //是否loading编辑按钮数组
            isShowAddOrEdit: false, //是否展示新增编辑弹窗
            isShowAdd: false,   //弹窗当前是否是新增
            isShowEdit: false,   //弹窗当前是否是编辑
            isClickedBtn: false,    //是否正在发送请求
            imageUrl: '',   //展示时的图片链接
            visible: false, //是否展示图片
            // uploadIconList: [],
            uploadProgagandaImgList: [],
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
                    title: this.$t('catalogNameCol'),
                    key: 'catalogName',
                    align:'center'
                },
                {
                    title: this.$t('catalogIdCol'),
                    key: 'catalogId',
                    align:'center'
                },
                {
                    title: this.$t('catalogDescCol'),
                    key: 'catalogDesc',
                    align:'center'
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    width: 300,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let query = {catalogId: params.row.catalogId};
                                        this.$router.push({
                                            name: 'appColumnSetting',
                                            query: query
                                        });
                                    }
                                }
                            }, this.$t('deployBtn')),
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
                                        this.showEdit(params.row.catalogId,params.index)
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
                                        this.removeCatalog(params.row)
                                    }
                                }
                            }, this.$t('deleteBtn'))
                        ]);
                    }
                }
            ],
            data: [],
            catalog: {
                catalogId: '',
                catalogName: '',
                catalogType: '2',
                catalogIcon: '',
                progagandaImg: '',
                catalogDesc: '',
                nodeType: 2
            },
            languageConstant:'en_US',//默认语言常量
            localLanguageList:[],//多语言列表
            languageList:[],//已添加语言列表
            localLanguage:[],//可添加语言列表
            localConstant:{'localName':'en_US',"country":"English"},//默认本地主语言常量
            defaultLanguage:'en_US',//当前选择语言
            addLanguageFlag:false,//是否展示新增语言弹窗标识
            catalogTemp1:{},//多语种App信息缓存1
            catalogTemp2:{},//多语种App信息缓存2
            choinceOperation:true,//判断当前读取那个缓存
            frontOpt:'',//保存catalog语种的前一个选中项
            selectLanguage:'',//选中语言
            catalogNameMsg:'',
            // catalogIconMsg:'',
            progagandaImgMsg:'',
            showMsg:false,//是否显示错误信息标识
            validCatalogLangsFlag: false,//校验多语言弹窗显示标识
            errorCatalogLangName:'',//校验错误的语言
            // modifyIconTemp:{},//修改时图标的缓存
            // waitIconTemp:[],//修改时待删除图标列表
            modifyPorgTemp:{},//修改时宣传图的缓存
            waitPorgTemp:[],//修改时待删除宣传图列表
        };
    },
    created() {
        this.queryCatalog();
        this.queryLanguagelist();
        this.languageList.push(this.localConstant);
    },
    computed: {
        
    },
    watch: {
       
    },
    methods: {
        queryCatalog(){
            let url = '/market/portal/catalog/getCatalogList';
            let ref = this;
            var params = {
                type: '2',  //应用栏目类型
                pageIndex: 1,
                pageSize: 999
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingEdits = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var catalogList = res.data;
                        if(!!catalogList){
                            for(var i=0;i<catalogList.length;i++){
                                ref.data.push(catalogList[i]);
                                ref.isLoadingEdits.push(false); 
                            }
                        }
                    }
                    ref.loadingTable = false;
                }
            );
        },
        showAdd(){
            this.initCatalog();
            this.isShowAddOrEdit = true;
            this.isShowAdd = true;
            this.initData();
            this.clearValidFieldMsg();
        },
        cancelAdd(){
            this.isShowAddOrEdit = false;
            this.isShowAdd = false;
            this.clearValidFieldMsg();
            this.removeCatalogFdfs();//新增时取消需要删除图片缓存
        },
        add(){
            this.clearValidFieldMsg(); //清空校验信息  
            //1先将当前ad信息保存到缓存
            this.catalogTemp1[this.defaultLanguage]=this.catalog;
            //2校验当前语种信息    
            let vaildFlag = this.vaildCatalog();//校验不通过标识
            if(vaildFlag){ return; }//检验不通过
            //3检验其他语种信息
            let result = this.validateOtherLangs(this.catalogTemp1);
            if(!result)
            {
                return;
            } 
            //4从缓存取出app信息
            let catalogList=this.catalogTemp1;

            var local=[];//多语言列表
            var languageInfo={};//多语言实体
            var catalogInfo={};
            var pathList=[];
            var catalogDto = catalogList[this.languageConstant];
            for (var i = 0; i < this.languageList.length; i++){                    
                catalogInfo={};
                catalogInfo = catalogList[this.languageList[i].localName];
                languageInfo={};
                languageInfo = {
                    catalogId:catalogDto.catalogId,
                    catalogName:catalogInfo.catalogName,
                    progagandaImg:catalogInfo.progagandaImg,
                    local:this.languageList[i].localName
                };
                local.push(languageInfo);

            }
            var params = {
                catalogId:catalogDto.catalogId,
                catalogName:catalogDto.catalogName ,
                catalogType:catalogDto.catalogType,
                catalogIcon:catalogDto.catalogIcon,
                progagandaImg:catalogDto.progagandaImg ,
                catalogDesc:catalogDto.catalogDesc,
                parentCatalogId:catalogDto.parentCatalogId,
                nodeType:catalogDto.nodeType,
                catalogLangs:local
            }
            // console.log(params);

            this.isClickedBtn = true;
            let url = '/market/portal/catalog/add';
            let ref = this;
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.isShowAddOrEdit = false;
                        ref.isShowAdd = false;
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.queryCatalog();
                        //清空缓存
                        ref.languageList=[];
                        ref.defaultLanguage=ref.languageConstant;
                        ref.languageList.push(ref.localConstant);
                        ref.choinceOperation=true;
                        ref.frontOpt='';
                        ref.catalogTemp1={};
                        ref.catalogTemp2={};
                    }
                    ref.isClickedBtn = false;
                }
            );
        },
        initCatalog(){
            this.$refs['catalog'].resetFields();
            this.isShowEdit = false;
            this.catalog.catalogId = '';
            this.catalog.catalogName = '';
            this.catalog.catalogType = '2';
            this.catalog.catalogIcon = '';
            this.catalog.progagandaImg = '';
            this.catalog.catalogDesc = '';
            this.catalog.nodeType = 2;
            // if(this.$refs.uploadIcon.fileList.length>0){
            //     this.$refs.uploadIcon.fileList.splice(0, 1);
            // }
            if(this.$refs.uploadProgagandaImg.fileList.length>0){
                this.$refs.uploadProgagandaImg.fileList.splice(0, 1);
            }
            // this.uploadIconList = this.$refs.uploadIcon.fileList;
            this.uploadProgagandaImgList = this.$refs.uploadProgagandaImg.fileList;
        },
        showEdit(catalogId,index){
            this.initCatalog();
            this.clearValidFieldMsg();
            //修改的缓存
            // this.modifyIconTemp={};
            // this.waitIconTemp=[];
            this.modifyPorgTemp={};
            this.waitPorgTemp=[]; 
            this.isShowAdd = false;           
            this.isLoadingEdits.splice(index,1,true);
            let url = '/market/portal/catalog/findCatalogById';
            let ref = this;
            var params = {
                catalogId: catalogId
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var catalogData = res.data;
                        if(!!catalogData){
                            ref.catalog.catalogId = catalogData.catalogId;
                            ref.catalog.catalogName = catalogData.catalogName;
                            ref.catalog.catalogIcon = catalogData.catalogIcon;
                            ref.catalog.progagandaImg = catalogData.progagandaImg;
                            ref.catalog.catalogDesc = catalogData.catalogDesc;
                            // if(!!ref.catalog.catalogIcon){
                            //     var icon = {
                            //         status: 'finished',
                            //         url: ref.fileUrl + ref.catalog.catalogIcon
                            //     };
                            //     ref.uploadIconList.push(icon);
                            // }
                            if(!!ref.catalog.progagandaImg){
                                var progagandaImg = {
                                    status: 'finished',
                                    url: ref.fileUrl + ref.catalog.progagandaImg
                                };
                                ref.uploadProgagandaImgList.push(progagandaImg);
                            }
                            //多语言放入缓存
                            ref.saveCatalogLangs(catalogData);
                        }
                    }
                    ref.isLoadingEdits.splice(index,1,false);
                    ref.isShowEdit = true;
                    ref.isShowAddOrEdit = true;
                }
            );
        },
        cancelEdit() {
            this.isShowEdit = false; 
            this.isShowAddOrEdit = false;
            this.isClickedBtn=false;
            this.clearValidFieldMsg();
            this.delWaitTemp();
        },
        edit(){
            this.clearValidFieldMsg();//清空校验信息      
            //1先将当前ad信息保存到缓存
            this.catalogTemp1[this.defaultLanguage]=this.catalog;
            //2校验当前语种信息    
            let vaildFlag = this.vaildCatalog();//校验不通过标识
            if(vaildFlag){ 
                return; 
            }//检验不通过
            //3检验其他语种信息
            let result = this.validateOtherLangs(this.catalogTemp1);
            if(!result)
            {
                return;
            } 
         
            //从缓存取出app信息
            let catalogList=this.catalogTemp1;

            var local=[];//多语言列表
            var languageInfo={};//多语言实体
            var catalogInfo={};
            var pathList=[];
            var catalogDto = catalogList[this.languageConstant];
            for (var i = 0; i < this.languageList.length; i++){
                catalogInfo={};
                catalogInfo = catalogList[this.languageList[i].localName];
                languageInfo={};
                languageInfo = {
                    catalogId:catalogDto.catalogId,
                    catalogName:catalogInfo.catalogName,
                    progagandaImg:catalogInfo.progagandaImg,
                    local:this.languageList[i].localName
                };
                local.push(languageInfo);

                //宣传图
                if(!!this.modifyPorgTemp[this.languageList[i].localName]
                    &&this.modifyPorgTemp[this.languageList[i].localName]!=catalogInfo.progagandaImg){
                    pathList.push(this.modifyPorgTemp[this.languageList[i].localName]);
                }
                //判断是否存在于缓存数组
                for (var ii1 = 0; ii1 < this.waitPorgTemp.length; ii1++){ 
            　　    if(this.waitPorgTemp[ii1] == catalogInfo.progagandaImg){
                        this.waitPorgTemp.splice(ii1,1);
                        break;
                    }   
                } 
            }
        //     //icon图片
        //     if(!!this.modifyIconTemp[this.languageConstant]&&this.modifyIconTemp[this.languageConstant]!=catalogDto.catalogIcon){
        //         pathList.push(this.modifyIconTemp[this.languageConstant]);
        //     }
        //     //判断是否存在于缓存数组
        //     for (var ii1 = 0; ii1 < this.waitIconTemp.length; ii1++){ 
        // 　　    if(this.waitIconTemp[ii1] == catalogDto.catalogIcon){
        //             this.waitIconTemp.splice(ii1,1);
        //             break;
        //         }   
        //     } 

            var params = {
                catalogId:catalogDto.catalogId,
                catalogName:catalogDto.catalogName ,
                catalogType:catalogDto.catalogType,
                catalogIcon:catalogDto.catalogIcon,
                progagandaImg:catalogDto.progagandaImg ,
                catalogDesc:catalogDto.catalogDesc,
                parentCatalogId:catalogDto.parentCatalogId,
                nodeType:catalogDto.nodeType,
                catalogLangs:local
            }

            // console.log(params);

            this.isClickedBtn = true;
            let url = '/market/portal/catalog/modify';
            let ref = this;
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.queryCatalog();
                        ref.isShowAddOrEdit = false;
                        ref.isShowEdit = false;
                        //清空缓存
                        ref.languageList=[];
                        ref.defaultLanguage=ref.languageConstant;
                        ref.languageList.push(ref.localConstant);
                        ref.choinceOperation=true;
                        ref.frontOpt='';
                        ref.catalogTemp1={};
                        ref.catalogTemp2={};
                        //修改时切换图片的缓存
                        if(pathList.length>0)
                        {
                            var paramsDel = {pathList: pathList};
                            ref.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
                        }

                        ref.delWaitTemp();//清除点切换图片的临时数据
                    }
                    ref.isClickedBtn = false;
                }
            );
        },
        removeCatalog(catalog){
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let byIdUrl = '/market/portal/catalog/findCatalogById';
                    let url = '/market/portal/catalog/delete';
                    let ref = this;
                    var params = {
                        catalogId: catalog.catalogId
                    };
                    this.$http.post(byIdUrl, params).then(function(resp){
                        if(!!resp && resp.resultCode == '0'){
                            var catalogData = resp.data;
                            ref.$http.post(url, params).then(function(res){
                                ref.$Modal.remove();
                                if(!!res && res.resultCode == '0'){
                                    ref.$Message.success(ref.$t('deletedSuccess'));
                                    ref.$store.commit('closeOpenedListByParameter', 'catalogId='+catalog.catalogId);
                                    ref.queryCatalog();
                                    var pathList = [];
                                    if(!!catalogData.catalogIcon){
                                        pathList.push(catalogData.catalogIcon);
                                    }
                                    for(var i=0;i<catalogData.catalogLangs.length;i++){
                                        if(!!catalogData.catalogLangs[i].progagandaImg){
                                            pathList.push(catalogData.catalogLangs[i].progagandaImg);
                                        }
                                    }
                                    //批量删除图片
                                    if(pathList.length>0){
                                        ref.batchDelFile(pathList);
                                    }
                                }
                            });
                        }
                    });         
                }
            });
        },
        handleView (imageUrl) {
            this.imageUrl = imageUrl;
            this.visible = true;
        },
        handleRemove (content) {
            let url = '/market/portal/file/delete';
            let ref = this;
            var id;
           
            if(this.isShowAdd){
                if(content == '1'){
                    id = this.catalog.catalogIcon; //1为栏目图标
                }else if(content == '2'){
                    id = this.catalog.progagandaImg; //2为背景图
                }

                var params = {id: id};
                this.$http.get(url, params).then(function(res){
                    if(content == '1'){
                        // ref.$refs.uploadIcon.fileList.splice(0, 1);
                        // ref.catalog.catalogIcon = '';
                        // ref.validCatalogIconFun();
                    }else if(content == '2'){
                        ref.$refs.uploadProgagandaImg.fileList.splice(0, 1);
                        ref.catalog.progagandaImg = '';
                        ref.validProgagandaImgFun();
                    }
                });

            }else{
                if(content == '1'){
                    // this.$refs.uploadIcon.fileList.splice(0, 1);
                    // let iconTemp=this.catalog.catalogIcon;
                    // this.catalog.catalogIcon = '';
                    // this.validCatalogIconFun();
                    // if(this.defaultLanguage==this.languageConstant && iconTemp!=this.modifyIconTemp[this.defaultLanguage])
                    // {
                    //     this.waitIconTemp.push(iconTemp);
                    // }  
                }else if(content == '2'){
                    this.$refs.uploadProgagandaImg.fileList.splice(0, 1);
                    let progTemp=this.catalog.progagandaImg;
                    this.catalog.progagandaImg = '';
                    this.validProgagandaImgFun();
                    if(progTemp!=this.modifyPorgTemp[this.defaultLanguage])
                    {
                        this.waitPorgTemp.push(progTemp);
                    } 
                }
                this.catalogTemp1[this.defaultLanguage]=this.catalog;
                this.catalogTemp2[this.defaultLanguage]=this.catalog;
            }
        },
        // handleIconSuccess (res, file) {
        //     if(!!res && res.resultCode == '0'){
        //         file.url = this.fileUrl + res.data.path;
        //         this.catalog.catalogIcon = res.data.path;
        //         this.validCatalogIconFun();
        //         if(!this.isShowAdd){
        //             this.waitIconTemp.push(this.catalog.catalogIcon);
        //         }                
        //     }else{
        //         this.$Notice.warning({
        //             title: file.name + ':' + this.$t('uploadFailedMsg')
        //         });
        //         this.$refs.uploadIcon.fileList.splice(0, 1);
        //     }
        // },
        handleProgagandaImgSuccess(res, file){
            if(!!res && res.resultCode == '0'){
                file.url = this.fileUrl + res.data.path;
                this.catalog.progagandaImg = res.data.path;
                this.validProgagandaImgFun();
                if(!this.isShowAdd){
                    this.waitPorgTemp.push(this.catalog.progagandaImg);
                }                
            }else{
                this.$Notice.warning({
                    title: file.name + ':' + this.$t('uploadFailedMsg')
                });
                this.$refs.uploadProgagandaImg.fileList.splice(0, 1);
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
        handleBeforeUploadIcon () {
            // const check = this.uploadIconList.length < 1;
            // return check;
        },
        handleBeforeUploadProgagandaImg(){
            const check = this.uploadProgagandaImgList.length < 1;
            return check;
        },
        batchDelFile(pathList){
            let url = '/market/portal/file/batchDelete';
            let ref = this;
            var params = {
                pathList: pathList
            };
            this.$http.post(url, params).then(
                function(res){
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
        //新增多语言
        addLangs(){
            this.addLanguageFlag= true;
            this.isShowAddOrEdit=false;
            
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
            this.catalogTemp1[this.defaultLanguage]=this.catalog;        
            this.catalogTemp2[this.defaultLanguage]=this.catalog;
            //置空catalog实体
            this.catalog={};
        },       
        //新增多语言确定
        addLangsOk(){
            if(!!this.selectLanguage)
            {
                //移除校验效果  
                this.emptyCatalogInfo(); 
                //添加catalog语种
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
                this.catalogTemp1[this.defaultLanguage]=this.catalog;        
                this.catalogTemp2[this.defaultLanguage]=this.catalog;
                //置空下拉框选中项
                this.selectLanguage='';
            }
            this.isShowAddOrEdit=true;
        },
        //新增多语言取消
        addLangsCancel(){
            this.selectLanguage='';
            this.isShowAddOrEdit=true;
        },
        //删除多语言
        removeLangs(){
            //先删除图片
            var entity = this.catalog;
            let pathList=[];
            if(!!entity){
                if(!!entity.catalogIcon){
                    pathList.push(entity.catalogIcon);
                }
                if(!!entity.progagandaImg){
                    pathList.push(entity.progagandaImg);
                }
                if(pathList.length>0){
                    var paramsDel = {pathList: pathList};
                    this.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
                }
            }
            //移除app缓存数据
            delete this.catalogTemp1[this.defaultLanguage];
            delete this.catalogTemp2[this.defaultLanguage];
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
        //切换多语言
        changeLanguage(selectLang){
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
                    this.catalogTemp1[this.frontOpt]=this.catalog;
                }
                if(!!this.catalogTemp2[selectLang])
                {
                    //从多语言数据缓存中获取当前选择语言信息
                    this.emptyCatalogInfo();
                    this.catalog=this.catalogTemp2[selectLang];
                    this.changeImgCatalog(this.catalog);
                }    
            }
            else
            {
                if(flage)
                { 
                    //更新多语言数据到缓存中
                    this.catalogTemp2[this.frontOpt]=this.catalog;
                }
                if(!!this.catalogTemp1[selectLang])
                {
                    //从多语言数据缓存中获取当前选择语言信息
                    this.emptyCatalogInfo();
                    this.catalog=this.catalogTemp1[selectLang];
                    this.changeImgCatalog();      
                }
            }
            //变更下次优选操作的缓存
            this.choinceOperation =!this.choinceOperation;
            //保存本次选中的opt
            this.frontOpt=selectLang;  
        },
       //清空catalog图片信息
        emptyCatalogInfo(){
            this.catalog={};
            // this.uploadIconList=[];//栏目icon
            // if(this.$refs.uploadIcon.fileList.length>0){
            //     this.$refs.uploadIcon.fileList=[];
            // }
            // this.uploadIconList = this.$refs.uploadIcon.fileList;
            this.uploadProgagandaImgList=[];//栏目宣传图
            if(this.$refs.uploadProgagandaImg.fileList.length>0){
                this.$refs.uploadProgagandaImg.fileList=[];
            }
            this.uploadProgagandaImgList = this.$refs.uploadProgagandaImg.fileList;
        },
        //切换语言时切换图片
        changeImgCatalog(){
            // if(!!this.catalog.catalogIcon){
            //     var template = {
            //         status: 'finished',
            //         url:this.fileUrl+this.catalog.catalogIcon
            //     };
            //     this.uploadIconList.push(template);//广告图标
            // } 
            if(!!this.catalog.progagandaImg){
                var template = {
                    status: 'finished',
                    url:this.fileUrl+this.catalog.progagandaImg
                };
                this.uploadProgagandaImgList.push(template);//广告图标
            } 
        },
        //初始化数据
        initData(){
            //重置多语言信息
            this.languageList=[];
            this.defaultLanguage=this.languageConstant;
            this.languageList.push(this.localConstant);
            this.catalogTemp1={};
            this.catalogTemp2={};
        },
        //清除校验字段的提示信息
        clearValidFieldMsg(){
            this.showMsg=false;
            this.catalogNameMsg='';
            // this.catalogIconMsg='';
            this.progagandaImgMsg='';
        },
        validCatalogNameFun () {
            this.catalogNameMsg='';
            if (!!!this.catalog.catalogName) {
                this.catalogNameMsg=this.$t('catalogNameWarning');
            }
        },
        // validCatalogIconFun () {
        //     this.catalogIconMsg='';
        //     if(this.defaultLanguage==this.languageConstant && this.catalog.nodeType==2){  
        //         if (!!!this.catalog.catalogIcon ) {
        //             this.catalogIconMsg=this.$t('catalogIconWarning');
        //         }
        //     }
        // },
        validProgagandaImgFun ()  {
            this.progagandaImgMsg='';
            if (!!!this.catalog.progagandaImg ) {
                this.progagandaImgMsg=this.$t('catalogProgagandaImgWarning');
            }
        },
        //检验catalog信息
        vaildCatalog(){
            if (!!!this.catalog.catalogName) {
                this.catalogNameMsg=this.$t('catalogNameWarning');
            }
            if (!!!this.catalog.progagandaImg ) {
                this.progagandaImgMsg=this.$t('catalogProgagandaImgWarning');
            }
            if(!!this.catalogNameMsg||!!this.progagandaImgMsg)
            {
                this.showMsg=true;
                return true;
            }else
            {
                return false;
            }
        },
        //检验catalog信息确定按钮
        validCatalogLangsOk(){
            this.defaultLanguage=this.errorCatalogLangName;
            this.validCatalogLangsFlag=false;
            this.isShowAddOrEdit=true;
        },
        //检验catalog信息取消按钮
        validCatalogLangsCancel(){
            this.validCatalogLangsFlag=false;
            this.isShowAddOrEdit=true;
        },
        //校验其他语种
        validateOtherLangs(langs){
            let result ='';
            this.errorCatalogLangName='';
            for(var i=0; i<this.languageList.length;i++)
            {
                var langName=this.languageList[i].localName;
                if(langName!=this.defaultLanguage)
                {
                    var catalogLang = langs[langName];
                    result = this.vaildCatalogInfo(langName,catalogLang)
                    //检验失败，打开弹窗
                    if(!result)
                    {
                        this.errorCatalogLangName=langName;
                        this.validCatalogLangsFlag=true;
                        this.isShowAddOrEdit=false;
                        return false;  
                    }
                } 
            }
            return true;  
        },
        vaildCatalogInfo(langName,cataloglang){
            if(!!!cataloglang.catalogName|| !!!cataloglang.progagandaImg){
                return false;
            }          
            return true;   
        },
        //将byId查回来的多语言信息放入缓存
        saveCatalogLangs(catalog){
            let catalogLangs = catalog.catalogLangs;
            let languageInfo;
            let temp;
            this.catalogTemp1={};
            this.catalogTemp2={};
            this.languageList=[];
            for(var i=0; i<catalogLangs.length; i++)
            {
                temp ='';
                temp = catalogLangs[i];
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
                        catalogId: catalog.catalogId,
                        catalogName: temp.catalogName,
                        progagandaImg:temp.progagandaImg
                    };
                }
                else{
                    languageInfo = {
                        catalogId:catalog.catalogId,
                        catalogName:catalog.catalogName ,
                        catalogType:catalog.catalogType,
                        catalogIcon:catalog.catalogIcon,
                        progagandaImg:catalog.progagandaImg ,
                        catalogDesc:catalog.catalogDesc,
                        parentCatalogId:catalog.parentCatalogId,
                        nodeType:catalog.nodeType
                    };    
                }
                this.catalogTemp1[temp.local]=languageInfo;
                this.catalogTemp2[temp.local]=languageInfo;
                this.defaultLanguage=this.languageConstant;
                this.frontOpt=this.languageConstant;
                //修改的缓存   
                // this.modifyIconTemp[temp.local]=catalog.catalogIcon;
                this.modifyPorgTemp[temp.local]=temp.progagandaImg;
            }
        },       
        //新增取消的时候需要删除缓存中的文件信息
        removeCatalogFdfs(){
            this.catalogTemp1[this.defaultLanguage]=this.catalog;
            var pathList=[];
            for(var i=0; i<this.languageList.length;i++){
                var langName=this.languageList[i].localName;
                var entity=this.catalogTemp1[langName];
                if(!!entity){
                    if (!!entity.progagandaImg) { pathList.push(entity.progagandaImg); }
                    if(langName==this.languageConstant &&!!entity.catalogIcon){
                        pathList.push(entity.catalogIcon);
                    }
                }
            }

            if(pathList.length>0){
                var paramsDel = {pathList: pathList};
                this.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
            }
        },
        //清除修改时切换图片的缓存
        delWaitTemp() {
            //待删除列表
            var pathList=[];                
            //删除icon  
            // var iconTemp=this.arrayDistinct(this.waitIconTemp);
            // if(iconTemp.length>0)
            // {
            //     for (var i = 0; i < iconTemp.length; i++) {
            //         pathList.push(iconTemp[i]);
            //     }
            // }
            //删除宣传图
            var porgTemp=this.arrayDistinct(this.waitPorgTemp);
            if(porgTemp.length>0)
            {
                for (var i = 0; i < porgTemp.length; i++) {
                    pathList.push(porgTemp[i]);
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

    },
    mounted () {
        // this.uploadIconList = this.$refs.uploadIcon.fileList;
        this.uploadProgagandaImgList = this.$refs.uploadProgagandaImg.fileList;
    }
};
</script>