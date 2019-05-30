<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .page {
        float: right;
        margin-top: 10px;
    }
    .bundle_field {
        width: 70%;
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
    .search-modul{
        width:600px
    }
    .div_h{
        height: 20px;
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
                         <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" @on-change="changePageIndex"></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <!-- 新增弹窗 -->
            <Modal v-model="isShowModel" width="800px">
                <p slot="header" class="model-title-p" v-text="flag=='add' ? $t('addBundleTitle') : $t('editBundleTitle')"></p>
                <div slot="header" class="model-title-local-div">
                    <Select  v-model="defaultLanguage" class="model-title-local-select" @on-change='changeLanguage(defaultLanguage)'>
                        <Option v-for="item in languageList" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
                    <Button v-text="$t('addLocalLanguage')" @click="addLangs()" v-show="flag=='add'"></Button>
                    <Button v-text="$t('deleteLocalLanguage')" @click="delLangs()" 
                        v-show="defaultLanguage!=languageConstant && flag=='add'"></Button>
                </div>
                <Card :bordered="false" dis-hover>
                    <Form ref="bundle" :model="bundle"  :label-width="180">
                        <FormItem :label="$t('bundleIdCol')"  class='ivu-form-item-required' v-show="defaultLanguage==languageConstant">
                            <Input v-model="bundle.bundleId" class="bundle_field" :disabled="flag=='modify'" 
                                @on-blur="queryBundleExist()" @on-change="validBundleIdFun()"></Input>
                            <div class="ivu-form-item-error-tip" v-text="bundleIdMsg" v-show='showMsg'></div>
                        </FormItem>
                        <FormItem :label="$t('bundleNameField')" class='ivu-form-item-required'>
                            <Input v-model="bundle.bundleName"  class="bundle_field" @on-change="validBundleNameFun()"></Input>
                            <div class="ivu-form-item-error-tip" v-text="bundleNameMsg" v-show='showMsg'></div>
                        </FormItem>
                        <FormItem :label="$t('bundleTypeField')" class='ivu-form-item-required' v-show="defaultLanguage==languageConstant">
                            <Select v-model="bundle.bundleType" class="bundle_field" :placeholder="$t('selectPlaceholder')" 
                                @on-change="validBundleTypeFun()">
                                <Option v-for="item in typeList" :value="item.key" :key="item.key" v-text="item.value"></Option>
                            </Select>
                            <div class="ivu-form-item-error-tip" v-text="bundleTypeMsg" v-show='showMsg'></div>
                        </FormItem>
                        <!-- 套餐图片地址 --> 
                        <FormItem :label="$t('bundleImageCol')" class='ivu-form-item-required' v-show="defaultLanguage==languageConstant">
                            <Input v-model="bundle.image" v-show="false" @on-change="validBundleImageFun()"></Input>
                            <div class="demo-upload-list" v-for="item in imagePath">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(bundle.image)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload v-show="!!imagePath&&imagePath.length<1"
                                ref="uploadImage"
                                :show-upload-list="true"
                                :on-success="bundleImageSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="10240"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUploadImg"
                                type="drag"
                                action="/market/portal/file/upload"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <div class="ivu-form-item-error-tip" v-text="bundleImageMsg" v-show='showMsg'></div>
                        </FormItem>                        
                        <FormItem :label="$t('bundleTimeField')" class='ivu-form-item-required' v-show="defaultLanguage==languageConstant">
                            <Input v-model="bundle.useTime" class="bundle_field" @on-change="validBundleUseTimeFun()"></Input>
                            <div class="ivu-form-item-error-tip" v-text="bundleUseTimeMsg" v-show='showMsg'></div>
                        </FormItem>
                        <FormItem :label="$t('bundlePriceField')" class='ivu-form-item-required' v-show="defaultLanguage==languageConstant">
                            <Input v-model="bundle.price" class="bundle_field" @on-change="validBundlePriceFun()"></Input>
                            <div class="ivu-form-item-error-tip" v-text="bundlePriceMsg" v-show='showMsg'></div>                            
                        </FormItem>
                        <FormItem :label="$t('bundleMemoCol')">
                            <Input v-model="bundle.memo" class="bundle_field" type="textarea" :autosize="{minRows:5,maxRows:8}"></Input>
                        </FormItem>
                         <!-- 图片icon -->
                         <FormItem :label="$t('bundleImageIcon')" class='ivu-form-item-required' v-show="defaultLanguage==languageConstant">
                            <Input v-model="bundle.image" v-show="false" @on-change="validBundleImageFun()"></Input>
                            <div class="demo-upload-list" v-for="item in imagePath">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(bundle.image)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload v-show="!!imagePath&&imagePath.length<1"
                                ref="uploadImage"
                                :show-upload-list="true"
                                :on-success="bundleImageSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="10240"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUploadImg"
                                type="drag"
                                action="/market/portal/file/upload"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <div class="ivu-form-item-error-tip" v-text="bundleImageMsg" v-show='showMsg'></div>
                        </FormItem>      


                    </Form>
                    <div class="mask" v-show="isClickedAdd"></div>
                </Card>
               <div slot="footer">
                    <div v-show ="flag=='add'"> 
                        <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                        <Button type="primary" :loading="isClickedAdd" @click="add()">{{$t('saveBtn')}}</Button>
                    </div>
                    <div v-show ="flag=='modify'">                       
                        <Button @click="cancelEdit()">{{$t('cancelBtn')}}</Button>
                        <Button type="primary" :loading="isClickedEdit" @click="edit()">{{$t('saveBtn')}}</Button>
                    </div>
                </div>
            </Modal>
            <!-- 添加多语言弹窗 -->
            <Modal
                v-model="addLanguageFlag"
                :title="$t('addLocalLanguage')"
                @on-ok="addLanguageOk"
                @on-cancel="addLanguageCancel">
                    <Select  v-model="selectLanguage">
                        <Option value="" v-text="$t('selectPlaceholder')"></Option>
                        <Option  v-for="item in localLangs" :value="item.localName" :key="item.localName" v-text="item.country"></Option>
                    </Select>
            </Modal>
            <Modal 
                v-model="visible"
                :ok-text="$t('confirmBtn')"
                :cancel-text="$t('cancelBtn')">
                <img :src="imgName" v-if="visible" style="width: 100%">
            </Modal> 
            <!-- 校验多语言弹窗 -->
            <Modal v-model="validBundleLangsFlag" :title="$t('warmPromptDialogTitle')" @on-ok="validBundleLangsOk" 
                @on-cancel="validBundleLangsCancel">
                <p v-text="$t('validAppLangsFailText')"></p>
            </Modal>            
        </Row>
        <Row>
             <Modal
             v-model="isShowSeach"
             width="800px"
             :title="$t('searchGame')"
             >
              <Input placeholder='请输入游戏名称' clearable="true" style='width:85%'></Input>
              <Button type="primary" icon="ios-search">{{$t('search')}}</Button>
              <div class="div_h"></div>
              <Table height="400"></Table>
             </Modal>
                
        </Row>
    </div>
</template>
<script>
import util from '../../libs/util';
export default {
    name: 'bundleManagement',
    data () {
        return {
            pageIndex: 1,   //查询页码
            pageSize: 10,   //查询大小
            total: 0, //总数 
            isShowSeach: false, //是否显示查询窗口
            flag:'',//add modify
            loadingTable: true,    //表格是否loading
            isLoadingEdits: [],   //是否loading编辑按钮数组
            isClickedAdd: false,   //是否正在发送新增请求
            isClickedEdit: false,   //是否正在发送编辑请求
            isShowModel: false,   //是否展示新增/编辑弹窗
            languageList:[],//已添加语言
            localLanguageList:[],//多语言列表
            localLangs:[],//可添加多语言列表
            addLanguageFlag:false,//是否展示新增语言弹窗
            selectLanguage:'',//选中语言
            languageConstant:'en_US',//默认语言常量
            bundleLang:{},//套餐多语言信息
            bundleIdExist:false,//套餐ID是否存在
            bundleIdMsg:'',//套餐ID重复提示
            imagePath:[],//图片
            picturePath:util.fileHeaherUrl,//图片路径
            visible: false,
            defaultLanguage:'en_US',//当前选择语言
            localConstant:{'localName':'en_US',"country":"English"},//默认本地主语言常量
            bundleTemp1:{},//多语种套餐信息缓存1
            bundleTemp2:{},//多语种套餐信息缓存2
            choinceOperation:true,//判断当前读取那个缓存
            frontOpt:'',//保存catalog语种的前一个选中项
            validBundleLangsFlag: false,//校验多语言弹窗显示标识
            errorBundleLangName:'',//校验错误的语言
            bundleNameMsg:'',
            bundleUseTimeMsg:'',
            bundlePriceMsg:'',
            bundleTypeMsg:'',
            bundleImageMsg:'',
            showMsg:false,//是否显示错误信息标识
            modifyImageTemp:{},//修改时图标的缓存
            waitImageTemp:[],//修改时待删除图标列表
            typeList:[
                {
                    key: '1',
                    value: this.$t('monthlyBundle')
                },{
                    key: '2',
                    value: this.$t('weekBundle')
                },
                {
                    key: '3',
                    value: this.$t('DailyBundle')
                }
            ],
            bundle:{
                bundleId: '',
                bundleName: '',
                useTime: '',
                price: '',
                bundleType: '',
                image:'',
                memo:''
            },
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
                    title: this.$t('bundleNameCol'),
                    key: 'bundleName',
                    align:"center"
                },
                {
                   title: this.$t('bundleTypeField'),
                   align:"center",
                    key: 'bundleType',
                    render: (h, params) => {
                        var bundleType;
                        if(params.row.bundleType == '1'){
                            bundleType = this.$t('monthlyBundle');
                        }else if(params.row.bundleType == '2'){
                            bundleType = this.$t('weekBundle');
                        }else if(params.row.bundleType == '3'){
                            bundleType = this.$t('DailyBundle');
                        }else if(params.row.bundleType == '4'){
                            bundleType = this.$t('onDemandBundle');
                        }
                        return h('span',bundleType)
                    } 
                },
                {
                   title: this.$t('bundleTimeCol'),
                    key: 'useTime' ,
                    align:"center"
                },
                {
                   title: this.$t('bundlePriceCol'),
                    key: 'price' ,
                    align:"center"
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button',{
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style:{
                                    marginRight: '4px',
                                    width:'75px'
                                },
                                on:{
                                    click:()=>{
                                        this.searchGame()
                                    }
                                }
                            },this.$t('searchGame')),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.isLoadingEdits[params.index]
                                },
                                style: {
                                    marginRight: '4px'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.row.bundleId,params.index)
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
                                        this.removeBundle(params.row.bundleId)
                                    }
                                }
                            }, this.$t('deleteBtn'))
                        ]);
                    }
                }
            ],
            data: []
        };
    },
    created() {
        this.queryBundle();
        this.queryLanguagelist();
        this.languageList.push(this.localConstant);
    },
    computed: {},
    watch: {},
    methods: {
        //分页  
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.queryBundle();
        },
        queryBundle(){
            let url = '/market/portal/bundle/queryBundleList';
            let ref = this;
            var params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingEdits = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var bundleList = res.data;
                        if(!!bundleList){
                            for(var i=0;i<bundleList.length;i++){
                                ref.data.push(bundleList[i]);
                                ref.isLoadingEdits.push(false); 
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        showAdd(){
            this.initBundle();
            this.isShowModel = true;
            this.flag='add';
        },
        cancelAdd(){
            this.flag='';
            this.isShowModel = false;
            this.clearValidFieldMsg();
            //清除图片 
            this.removeBundleFdfs();
        },        
        //校验多语言
        validBundleLang(local){
            let temp=false;
            if(!!this.bundleTemp1[local].bundleName){
                temp = true;      
            }
            else{
                this.bundleNameMsg=this.$t('bundleNameWarning');
                this.showMsg=true;
            }            
            return temp;
        },
        //查询套餐是否已存在
        queryBundleExist()
        {
            if(!!!this.bundle.bundleId)
            {
                return;
            }
            let ref = this;
            ref.bundleIdExist=false
            let url = '/market/portal/bundle/queryBundleById';
            var params = {
                bundleId: this.bundle.bundleId
            };
            this.$http.post(url, params).then(function(res){
                if(!!res && res.resultCode == '0'&&!!res.data){
                   //查询套餐ID存在
                    ref.bundleIdExist=true;
                }
            });
        },
        //校验英文套餐信息
        vaildEnglishBundleInfo(){  
            
            let bundleInfo = this.bundleTemp1[this.languageConstant];
            if (!!!bundleInfo.bundleId) {
                this.bundleIdMsg=this.$t('bundleIdWarning');
            }else{
                if(this.bundleIdExist){
                    this.bundleIdMsg=this.$t('validBundleIdExist');
                }
            }
                       
            if (!!!bundleInfo.bundleName ) {
                this.bundleNameMsg=this.$t('bundleNameWarning');
            }
           
            if (!!!bundleInfo.bundleType ) {
                this.bundleTypeMsg=this.$t('bundleTypeWarning');
            }
           
            if (!!!bundleInfo.useTime) {
                this.bundleUseTimeMsg=this.$t('bundleTimeWarning');
            }else{
                var regNumber = /^[0-9]*$/;
                if (!regNumber.test(bundleInfo.useTime)) {
                    this.bundleUseTimeMsg=this.$t('validBundleInteger');
                }
                var timeTemp =bundleInfo.useTime.replace(/\b(0+)/gi,"");//js如果第一位是0那就从第二位判断
                if (!!!timeTemp){
                    this.bundleUseTimeMsg=this.$t('validUserTimeNoZero');
                }
                else if (!!timeTemp && timeTemp.length>4) {
                    this.bundleUseTimeMsg=this.$t('validUserTimeLen');
                } else {}
            }

            if (!!!bundleInfo.price ) {
                this.bundlePriceMsg=this.$t('bundlePriceWarning');
            }else{
                var regNumber = /^[0-9]*$/;
                if (!regNumber.test(bundleInfo.price)) {
                    this.bundlePriceMsg=this.$t('validBundleInteger');
                }
                var priceTemp =bundleInfo.price.replace(/\b(0+)/gi,"");//js如果第一位是0那就从第二位判断
                if (!!!priceTemp){
                    this.bundlePriceMsg=this.$t('vaildBundlePriceNoZero');
                }
                else if (!!priceTemp && priceTemp.length>9) {
                    this.bundlePriceMsg=this.$t('vaildBundlePriceLen');
                } else {}
            }

            if (!!!bundleInfo.image ) {
                this.bundleImageMsg=this.$t('bundleImageWarning');
            }

            if(!!this.bundleIdMsg||!!this.bundleNameMsg||!!this.bundleTypeMsg||
                !!this.bundleUseTimeMsg||!!this.bundlePriceMsg||!!this.bundleImageMsg)
            {
                this.showMsg=true;
                return false;
            }else
            {
                return true;
            }
        },
        //校验其他语种
        validateOtherLangs(langs){
            let result ='';
            this.errorBundleLangName='';
            for(var i=0; i<this.languageList.length;i++)
            {
                var langName=this.languageList[i].localName;
                this.clearValidFieldMsg();
                if(langName!=this.defaultLanguage)
                {
                    if(langName==this.languageConstant)
                    {
                        result=this.vaildEnglishBundleInfo();
                    }
                    else
                    {                
                        result=this.validBundleLang(langName);
                    }  

                    //检验失败，打开弹窗
                    if(!result)
                    {
                        this.errorBundleLangName=langName;
                        this.validBundleLangsFlag=true;
                        this.isShowModel=false;
                        return false;  
                    }
                } 
            }
            return true;  
        },
        add(){
            this.clearValidFieldMsg(); 
            //1先将当前信息保存到缓存
            this.bundleTemp1[this.defaultLanguage]=this.bundle;
            //检查当前语言    
            let vaildFlag=false;    
            if(this.defaultLanguage==this.languageConstant)
            {
                vaildFlag=this.vaildEnglishBundleInfo();
            }
            else
            {                
                vaildFlag=this.validBundleLang(this.defaultLanguage);
            }    

            if(!vaildFlag){ return; }//检验不通过   
            
            //3检验其他语种信息
            if(this.languageList.length>1)
            {
                let result = this.validateOtherLangs(this.bundleTemp1);
                if(!result)
                {
                    return;
                } 
            }
            this.isClickedAdd = true;
            let url = '/market/portal/bundle/add';
            let ref = this;
            let bundleLangs=[];
            let bundleLang;
            let temp;
            for(var i=0;i<this.languageList.length;i++){
                bundleLang={};   
                let temp =this.bundleTemp1[this.languageList[i].localName]
                bundleLang={
                    "bundleName":temp.bundleName,
                    'memo':temp.memo,
                    "local":this.languageList[i].localName
                };
                bundleLangs.push(bundleLang);
            }

            let bundleEn =this.bundleTemp1[this.languageConstant];
            let params={
                bundleId : bundleEn.bundleId,
                bundleName : bundleEn.bundleName,
                useTime : bundleEn.useTime.replace(/\b(0+)/gi,""),
                price : bundleEn.price.replace(/\b(0+)/gi,""),
                bundleType : bundleEn.bundleType,
                extend1 : bundleEn.image,
                memo : bundleEn.memo,
                bundleLangs:bundleLangs
            }

            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.isShowModel = false;
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.queryBundle();
                    }
                    ref.isClickedAdd = false;
                }
            );    
        },

        initBundle(){
            this.$refs['bundle'].resetFields();
            this.bundle.bundleId = '';
            this.bundle.bundleName = '';
            this.bundle.useTime = '';
            this.bundle.price = '';
            this.bundle.bundleType = '';
            this.bundle.image = '';
            this.bundle.memo = '';
            this.$refs.uploadImage.fileList=[];
            this.imagePath = this.$refs.uploadImage.fileList;

            this.languageList=[];
            this.languageList.push(this.localConstant);
            this.defaultLanguage=this.languageConstant;
            this.bundleTemp1={};
            this.bundleTemp1={};

            this.clearValidFieldMsg(); 
        },
        showEdit(bundleId,index){
            this.initBundle();
            this.modifyImageTemp={};
            this.waitImageTemp=[]; 
            this.isLoadingEdits.splice(index,1,true);
            let url = '/market/portal/bundle/queryBundleById';
            let ref = this;
            var params = {
                bundleId: bundleId
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var bundleData = res.data;
                        if(!!bundleData){

                            var bundleDto = res.data;
                            ref.bundle.bundleId = bundleDto.bundleId;
                            ref.bundle.bundleName = bundleDto.bundleName;
                            ref.bundle.useTime = bundleDto.useTime
                            ref.bundle.price = bundleDto.price;
                            ref.bundle.bundleType = bundleDto.bundleType;
                            ref.bundle.image = bundleDto.extend1;
                            ref.bundle.memo = bundleDto.memo;
                            if(!!ref.bundle.image)
                            {
                                    var icon = {
                                        name: bundleDto.bundleName,
                                        status: 'finished',
                                        url: ref.picturePath + ref.bundle.image
                                    };
                                    ref.imagePath.push(icon);
                            }
                            //多语言放入缓存
                            ref.saveBundleLangs(bundleDto);
                        }
                    }
                    ref.isLoadingEdits.splice(index,1,false);
                    ref.isShowModel = true;
                    ref.flag='modify'
                }
            );
        },
        edit(){
            this.clearValidFieldMsg(); 
            //1先将当前信息保存到缓存
            this.bundleTemp1[this.defaultLanguage]=this.bundle;
            //检查当前语言    
            let vaildFlag=false;    
            if(this.defaultLanguage==this.languageConstant)
            {
                vaildFlag=this.vaildEnglishBundleInfo();
            }
            else
            {                
                vaildFlag=this.validBundleLang(this.defaultLanguage);
            }    

            if(!vaildFlag){ return; }//检验不通过   
            
            //3检验其他语种信息
            if(this.languageList.length>1)
            {
                let result = this.validateOtherLangs(this.bundleTemp1);
                if(!result)
                {
                    return;
                } 
            }

            this.isClickedAdd = true;
            let url = '/market/portal/bundle/modify';
            let ref = this;
            let bundleLangs =[];
            let bundleLang;
            for (var i = 0; i < this.languageList.length; i++) 
            {
                bundleLang=={};
                let temp =this.bundleTemp1[this.languageList[i].localName]
                bundleLang={
                    "bundleId":temp.bundleId,
                    "bundleName":temp.bundleName,
                    'memo':temp.memo,
                    "local":this.languageList[i].localName
                } 
                bundleLangs.push(bundleLang);
            }

            let bundleEn = this.bundleTemp1[this.languageConstant];
            let pathList = [];
            //宣传图
            if(!!this.modifyImageTemp[this.languageConstant]
                &&this.modifyImageTemp[this.languageConstant]!=bundleEn.image){
                pathList.push(this.modifyImageTemp[this.languageConstant]);
            }
            //判断是否存在于缓存数组
            for (var ii1 = 0; ii1 < this.waitImageTemp.length; ii1++){ 
        　　    if(this.waitImageTemp[ii1] == bundleEn.image){
                    this.waitImageTemp.splice(ii1,1);
                    break;
                }   
            } 
            let params={
                bundleId : bundleEn.bundleId,
                bundleName : bundleEn.bundleName,
                useTime : bundleEn.useTime.replace(/\b(0+)/gi,""),
                price : bundleEn.price.replace(/\b(0+)/gi,""),
                bundleType : bundleEn.bundleType,
                extend1 : bundleEn.image,
                memo : bundleEn.memo,
                bundleLangs:bundleLangs
            }

            this.$http.post(url, params).then( function(res){
                if(!!res && res.resultCode == '0'){
                    ref.$Message.success(ref.$t('savedSuccess'));
                    ref.queryBundle();
                    ref.isShowModel = false;

                    //修改时切换图片的缓存
                    if(pathList.length>0)
                    {
                        var paramsDel = {pathList: pathList};
                        ref.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
                    }

                    ref.delWaitTemp();//清除点切换图片的临时数据
                }
                ref.isClickedAdd = false;
            });
        },
        cancelEdit(){
            this.clearValidFieldMsg(); 
            this.isShowModel=false;
            this.delWaitTemp();
        },
        removeBundle(bundleId){
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/bundle/removeBundle';
                    let ref = this;
                    var params = {
                        bundleId: bundleId
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('deletedSuccess'));
                                ref.queryBundle();
                            }
                        }
                    );
                }
            });
        },
        searchGame(){
             var ref=this;
             this.isShowSeach=true;
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
            this.isShowModel=false;
            this.addLanguageFlag=true;
            var tempArray1 = [];//临时数组1
            var tempArray2 = [];//临时数组2
            for(var i=0;i<this.languageList.length;i++){
                //将数 languageList 中的元素值作为tempArray1 中的键，值为true；
                tempArray1[this.languageList[i].localName]=true;
            }
            
            for(var i=0;i<this.localLanguageList.length;i++){
                if(!tempArray1[this.localLanguageList[i].localName]){
                    //过滤相同的元素；
                    this.localLanguageList[i].bundleName='';
                    tempArray2.push(this.localLanguageList[i]);
                }
            }
            this.localLangs = tempArray2;

            //保存多语言数据到缓存中  
            this.bundleTemp1[this.defaultLanguage]=this.bundle;        
            this.bundleTemp2[this.defaultLanguage]=this.bundle;
            //置空套餐实体
            this.bundle={};
        },
        /*新增多语言确定*/
        addLanguageOk () {
            if(!!this.selectLanguage){
                //添加app语种
                for(var i=0;i<this.localLanguageList.length;i++){
                    if(this.selectLanguage == this.localLanguageList[i].localName){
                        //添加语种
                        this.languageList.push(this.localLanguageList[i]);
                        break;
                    }  
                }
                //保存前一个opt选项 新增时应为新增的选项
                this.frontOpt=this.selectLanguage;
                //app选中当前语种
                this.defaultLanguage=this.selectLanguage;
                //保存多语言数据到缓存中
                this.bundleTemp1[this.defaultLanguage]=this.bundle;        
                this.bundleTemp2[this.defaultLanguage]=this.bundle;
                //置空下拉框选中项
                this.selectLanguage='';
            }
            this.isShowModel=true;
            this.addLanguageFlag=false;
        },
        /*新增多语言取消*/
        addLanguageCancel () {
            this.selectLanguage='';
            this.isShowModel=true;
            this.addLanguageFlag=false;
        },
        //删除多语言
        delLangs(language){
            //移除套餐缓存数据
            delete this.bundleTemp1[this.defaultLanguage];
            delete this.bundleTemp2[this.defaultLanguage];
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
        //套餐图片上传
        bundleImageSuccess(res, file){
            let ref = this;
            if(!!res && res.resultCode == '0'){
                ref.bundle.image=res.data.path;
                file.url=ref.picturePath+res.data.path;
                this.validBundleImageFun();
                if(this.flag=='modify'){
                    this.waitImageTemp.push(ref.bundle.image);
                } 

            }else{
                ref.$Notice.warning({
                    title: file.name + ':' + this.$t('uploadFailedMsg')
                });
                ref.$refs.uploadImage.fileList=[];
            }
            
        },
        handleBeforeUploadImg () {
            const check = this.imagePath.length < 1;
            return check;
        },        
        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (url) {
            if(this.flag=='add'){      
                let ref = this;
                if (!!ref.bundle.image) {
                    this.$http.get("/market/portal/file/delete?id="+url).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                               ref.bundle.image='';
                               ref.validBundleImageFun();
                               ref.$refs.uploadImage.fileList.splice(0, 1);
                            }
                        }
                    );
                }
            }

            if(this.flag=='modify'){
                let imageTemp=this.bundle.image;
                this.bundle.image='';
                this.$refs.uploadImage.fileList.splice(0, 1);
                this.validBundleImageFun();

                if(imageTemp!=this.modifyImageTemp[this.defaultLanguage])
                {
                    this.waitImageTemp.push(imageTemp);
                } 

                this.bundleTemp1[this.defaultLanguage]=this.bundle;
                this.bundleTemp2[this.defaultLanguage]=this.bundle;
            } 
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
                    this.bundleTemp1[this.frontOpt]=this.bundle;
                }
                if(!!this.bundleTemp2[selectLang])
                {
                    //从多语言数据缓存中获取当前选择语言信息
                    this.emptyBundleImgInfo();
                    this.bundle=this.bundleTemp2[selectLang];
                    this.changeBundleImg();
                }    
            }
            else
            {
                if(flage)
                { 
                    //更新多语言数据到缓存中
                    this.bundleTemp2[this.frontOpt]=this.bundle;
                }
                if(!!this.bundleTemp1[selectLang])
                {
                    //从多语言数据缓存中获取当前选择语言信息
                    this.emptyBundleImgInfo();
                    this.bundle=this.bundleTemp1[selectLang];
                    this.changeBundleImg();
                }
            }
            //变更下次优选操作的缓存
            this.choinceOperation =!this.choinceOperation;
            //保存本次选中的opt
            this.frontOpt=selectLang;  
        },
        //检验其他套餐信息确定按钮
        validBundleLangsOk(){
            this.defaultLanguage=this.errorBundleLangName;
            this.validBundleLangsFlag=false;
            this.isShowModel=true;
        },
        //检验其他套餐信息取消按钮
        validBundleLangsCancel(){
            this.validBundleLangsFlag=false;
            this.isShowModel=true;
        },
        //将byId查回来的多语言信息放入缓存
        saveBundleLangs(bundleDto){
            let bundleLangs = bundleDto.bundleLangs;
            let languageInfo;
            let temp;
            this.bundleTemp1={};
            this.bundleTemp2={};
            this.languageList=[];
            for(var i=0; i<bundleLangs.length; i++)
            {
                temp ='';
                temp = bundleLangs[i];
                //添加套餐语种
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
                        bundleId: bundleDto.bundleId,
                        bundleName: temp.bundleName,
                        memo:temp.memo
                    };
                }
                else{
                    languageInfo = {
                        bundleId:bundleDto.bundleId,
                        bundleName:bundleDto.bundleName ,
                        useTime:bundleDto.useTime,
                        price:bundleDto.price,
                        bundleType:bundleDto.bundleType ,
                        image:bundleDto.extend1,
                        memo:bundleDto.memo,
                    };    
                }

                this.bundleTemp1[temp.local]=languageInfo;
                this.bundleTemp2[temp.local]=languageInfo;
                this.frontOpt=this.languageConstant;
                this.defaultLanguage=this.languageConstant;
                //修改的缓存   
                this.modifyImageTemp[temp.local]=bundleDto.extend1;
            }
       
        },
        //切换语言清空bundle图片信息
        emptyBundleImgInfo(){
            this.bundle={};
            this.imagePath=[];
            if(this.$refs.uploadImage.fileList.length>0){
                this.$refs.uploadImage.fileList=[];
            }
            this.imagePath = this.$refs.uploadImage.fileList;
        },
        //切换语言修改图片
        changeBundleImg(){
            if(!!this.bundle.image){
                var template = {
                    name: this.bundle.bundleName,
                    status: 'finished',
                    url:this.picturePath+this.bundle.image
                };
                this.imagePath.push(template);//广告图标
            } 
        },              
        //校验bundleId字段
        validBundleIdFun () {
            this.bundleIdMsg='';
            if (!!!this.bundle.bundleId) {
                this.bundleIdMsg=this.$t('bundleIdWarning');
            }
        },
        //校验bundleName字段
        validBundleNameFun () {
            this.bundleNameMsg=''; 
            if (!!!this.bundle.bundleName ) {
                this.bundleNameMsg=this.$t('bundleNameWarning');
            }
            
        },
        //校验useTime字段
        validBundleUseTimeFun () {
            this.bundleUseTimeMsg='';
            if (!!!this.bundle.useTime ) {
                this.bundleUseTimeMsg=this.$t('bundleTimeWarning');
                return;
            }

            var regNumber = /^[0-9]*$/;
            if (!regNumber.test(this.bundle.useTime)) {
                this.bundleUseTimeMsg=this.$t('validBundleInteger');
            }
            var timeTtemp =this.bundle.useTime.replace(/\b(0+)/gi,"");//js如果第一位是0那就从第二位判断
            if (!!!timeTtemp){
                this.bundleUseTimeMsg=this.$t('validUserTimeNoZero');
            }
            else if (!!timeTtemp && timeTtemp.length>4) {
                this.bundleUseTimeMsg=this.$t('validUserTimeLen');
            } else {}
        },
        //校验price字段
        validBundlePriceFun () {
            this.bundlePriceMsg='';
            if (!!!this.bundle.price ) {
                this.bundlePriceMsg=this.$t('bundlePriceWarning');
            }

            var regNumber = /^[0-9]*$/;
            if (!regNumber.test(this.bundle.price)) {
                this.bundlePriceMsg=this.$t('validBundleInteger');
            }
            var priceTemp = this.bundle.price.replace(/\b(0+)/gi,"");//js如果第一位是0那就从第二位判断
            if (!!!priceTemp){
                this.bundlePriceMsg=this.$t('vaildBundlePriceNoZero');
            }
            else if (!!priceTemp && priceTemp.length>9) {
                this.bundlePriceMsg=this.$t('vaildBundlePriceLen');
            } else {}
        },
        //校验bundleType字段
        validBundleTypeFun () {
            this.bundleTypeMsg='';
            if (!!!this.bundle.bundleType ) {
                this.bundleTypeMsg=this.$t('bundleTypeWarning');
            }else
            {
                if(this.bundle.bundleType=='1')
                {
                    this.bundle.useTime=24*30;  
                }
                else if(this.bundle.bundleType=='2')
                {
                    this.bundle.useTime=24*7; 
                }else{
                    this.bundle.useTime=24; 
                }
            }

        },
        //校验image字段 
        validBundleImageFun () {
            this.bundleImageMsg='';
            if (!!!this.bundle.image ) {
                this.bundleImageMsg=this.$t('bundleImageWarning');
            }
        },
        //清除校验字段的提示信息
        clearValidFieldMsg(){
            this.showMsg=false;
            this.bundleIdMsg='';
            this.bundleNameMsg='';
            this.bundleUseTimeMsg='';
            this.bundlePriceMsg='';
            this.bundleTypeMsg='';
            this.bundleImageMsg='';            
        },
        //新增取消的时候需要删除缓存中的文件信息
        removeBundleFdfs(){
            this.bundleTemp1[this.defaultLanguage]=this.bundle;
            var pathList=[];
            for(var i=0; i<this.languageList.length;i++)
            {
                var langName=this.languageList[i].localName;
                var entity=this.bundleTemp1[langName];
                if(!!entity){
                    if (!!entity.image) { pathList.push(entity.image); }
                }
            }

            if(pathList.length>0)
            {
                var paramsDel = {pathList: pathList};
                this.$http.post("/market/portal/file/batchDelete", paramsDel).then(function(res){});
            }
        },
        //清除修改时切换图片的缓存
        delWaitTemp() {
            //待删除列表
            var pathList=[];                
            //删除图片  
            var imageTemp=this.arrayDistinct(this.waitImageTemp);
            if(imageTemp.length>0)
            {
                for (var i = 0; i < imageTemp.length; i++) {
                    pathList.push(imageTemp[i]);
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
    mounted () 
    {
        this.imagePath = this.$refs.uploadImage.fileList;
    }
};
</script>