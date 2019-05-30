<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .channel_field {
        width: 70%;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .error_channelId {
        border: 1px solid #ed3f14;
    }
    .error_channelId:hover {
        border: 1px solid #ed3f14;
    }
    .error_channelId:focus {
        border: 1px solid #ed3f14;
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
                        <div style="float:right;">
                        	{{$t('channelId')}}：
                            <div class="ivu-input-wrapper ivu-input-type" style="width: 200px;">
                                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                <input type="tel" :placeholder="$t('channelIdPlaceholder')" v-model="channelId" oninput='value=value.replace(/\D/gi,"")' maxlength="5" class="ivu-input">
                            </div>
                        	{{$t('channelName')}}：
							<Input v-model="channelName" :placeholder="$t('channelNamePlaceholder')" style="width: 200px;"></Input>
                        	<Button type="primary" icon="ios-search" @click="searchChannel">
                            	{{$t('search')}}  
                        	</Button>
                        </div>
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
            <!-- 新增弹窗/编辑弹窗 -->
            <Modal
                v-model="isShowAddOrEdit"
                :title="isShowAdd ? $t('addChannelTitle') : $t('editChannelTitle')"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <Form ref="channel" :model="channel" :rules="ruleChannel" :label-width="180">
                        <FormItem :label="$t('channelId')" prop="channelId">
                            <!-- Input组件不符合纯数字输入故用原始的input -->
                            <!-- <div class="ivu-input-wrapper ivu-input-type channel_field">
                                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                <input type="tel" v-model="channel.channelId" oninput='value=value.replace(/\D/gi,"")' v-on:blur="validateChannelId" maxlength="5" :class="{'ivu-input':true,'error_channelId':isErrorChannel}" :disabled="isShowEdit">
                            </div>
                            <div class="ivu-form-item-error-tip">{{errorChannelIdMsg}}</div> -->
                            <Input v-model="channel.channelId" class="channel_field" :disabled="isShowEdit" :maxlength="5"></Input>
                            <Button type="primary" @click="generateID" v-show="isShowAdd">{{$t('generateIDBtn')}}</Button>
                        </FormItem>
                        <FormItem :label="$t('channelName')" prop="channelName">
                            <Input v-model="channel.channelName" class="channel_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('channelLinkType')" prop="linkType">
                            <Select class="channel_field" :placeholder="$t('selectPlaceholder')" v-model="channel.linkType" @on-change="linkTypeChange">
                                <Option v-for="item in linkTypeList" :value="item.key" :key="item.key">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('catalogNameCol')" prop="catalogId" v-show="channel.linkType == '1'">
                            <Select class="channel_field" :placeholder="$t('selectPlaceholder')" v-model="channel.catalogId" :loading="isLoadingCatalogName" filterable>
                                <Option v-for="item in catalogList" :value="item.catalogId" :key="item.catalogId">{{ item.catalogName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('appNameCol')" prop="appId" v-show="channel.linkType == '2'||channel.linkType == '3'">
                            <Select class="channel_field" :placeholder="$t('selectPlaceholder')" v-model="channel.appId" :loading="isLoadingAppName" filterable>
                                <Option v-for="item in appList" :value="item.appId" :key="item.appId">{{ item.appName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('callBackCol')" v-show="channel.linkType == '3'||channel.linkType== '4'">
                            <Input v-model="channel.callBack" class="channel_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('dataMappingCol')" v-show="channel.linkType == '3'||channel.linkType== '4'">
                            <Input v-model="channel.dataMapping" class="channel_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('channelLinkAddress')" prop="linkAddress">
                            <Input v-model="channel.linkAddress" class="channel_field" readonly></Input>
                        </FormItem>
                    </Form>
                    <div class="mask" v-show="isClickedBtn"></div>
                </Card>
                <div v-if="isShowAdd" slot="footer">
                    <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedBtn" @click="add()" v-text="$t('saveBtn')"></Button>
                </div>
                <div v-else slot="footer">
                    <Button @click="cancelEdit()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedBtn" @click="edit()" v-text="$t('saveBtn')"></Button>
                </div>
            </Modal>
        </Row>
    </div>
</template>
<script>
export default {
    name: 'channelManagement',
    data () {
        const validateChannelIdIsNum = (rule, value, callback) => {
            if(this.isShowAdd){
                if(!!value){
                    var reg = /^[0-9]*$/;
                    if (reg.test(value)) {
                        callback();
                    }else{
                        callback(new Error(this.$t('channelIdNotNumWarning')));
                    }
                }else{
                    callback();
                }
            }else{
                callback();
            }
        };
        const validateChannelId = (rule, value, callback) => {
            if(this.isShowAdd){
                var reg = /^[0-9]*$/;
                if(!!!value){
                    callback(new Error(this.$t('channelIdWarning')));
                }else if(!reg.test(value)){
                    callback(new Error(this.$t('channelIdNotNumWarning')));
                }else if (value.length !=5 ) {
                    callback(new Error(this.$t('channelIdLengthWarning')));
                }else if (value.length == 5) {
                    let url = '/market/portal/channel/queryChannelByChannelId';
                    let ref = this;
                    var params = {
                        channelId: this.channel.channelId
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                if(res.data){
                                    callback(new Error(ref.$t('channelIdSameWarning')));
                                }else{
                                    callback();
                                }
                            }else{
                                callback(new Error(ref.$t('channelIdFailedWarning')));
                            }
                        }
                    );
                    
                }else{
                    callback();
                }
            }else{
                callback();
            }
        };
        const validateCatalog = (rule, value, callback) => {
            if (this.channel.linkType == 1 && !!!value) {
                callback(new Error(this.$t('catalogWarning')));
            }else{
                callback();
            }
        };
        const validateApp = (rule, value, callback) => {
            if ((this.channel.linkType == 2||this.channel.linkType == 3) && !!!value) {
                callback(new Error(this.$t('appWarning')));
            }else{
                callback();
            }
        };
        const validateCallBack = (rule, value, callback) => {
            if (this.channel.linkType == 3 && !!!value) {
                callback(new Error(this.$t('callBackWarning')));
            }else{
                callback();
            }
        };
        return {
            loadingTable: true,    //表格是否loading
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            isLoadingEdits: [],   //是否loading编辑按钮数组
            isShowAddOrEdit: false, //是否展示新增编辑弹窗
            isShowEdit: false,  //是否展示编辑弹窗
            isClickedBtn: false,   //是否正在发送编辑请求
            isShowDel: false,   //是否展示删除弹窗
            isShowAdd: false,   //是否展示新增弹窗
            channelId: '',	//渠道标识检索条件
            channelName: '',	//渠道名称检索条件
            isLoadingCatalogName: false,	//是否loading栏目名称下拉框
            catalogList: [],	//栏目名称下拉框
            isLoadingAppName: false,	//是否loading应用名称下拉框
            appList: [],	//应用名称下拉框
            sign: '',
            linkTypeList:[
                {
                    key: '0',
                    value: this.$t('home')
                },{
                    key: '1',
                    value: this.$t('column')
                },
                {
                    key: '2',
                    value: this.$t('app')
                },
                {
                    key: '3',
                    value: this.$t('landPage')
                },
                {
                    key: '4',
                    value: this.$t('channelWapCol')
                },
                {
                    key: '5',
                    value: this.$t('channeAndroidlCol')
                }
            ],
            channel:{
            	id: '',
                channelId: '',
                channelName: '',
                linkType: "",
				linkAddress: "",
				catalogId: "",
				appId: "",
                callBack:'',//推广渠道回调地址
                dataMapping:''
            },
            ruleChannel:{
                channelId:[
                    { required: true,validator: validateChannelIdIsNum,trigger: 'change' },
                    { required: true,validator: validateChannelId,trigger: 'blur' }
                ],
                channelName:[
                    { required: true,message: this.$t('channelNameWarning'),trigger: 'blur' }
                ],
                linkType:[
                    { required: true,message: this.$t('linkTypeWarning'),trigger: 'blur' }
                ],
                catalogId: [
                	{ required: true,validator: validateCatalog,trigger: 'change' }
                ],
                appId: [
                	{ required: true,validator: validateApp,trigger: 'change' }
                ],
                callBack: [
                    { required: true,validator: validateCallBack,trigger: 'change' }
                ],
                linkAddress: [
                    { required: true, message: this.$t('linkAddressWarning'),trigger: 'change' }
                ]
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
                    title: this.$t('channelId'),
                    key: 'channelId',
                    align:"center"
                },
                {
                   	title: this.$t('channelName'),
                    key: 'channelName',
                    align:"center"
                },
                {
                   title: this.$t('channelLink'),
                    key: 'linkAddress',
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
                                    loading: this.isLoadingEdits[params.index]
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.row.id,params.index)
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
                                        this.removeChannel(params.row.id)
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
        this.queryChannel();
        this.queryCatalog();
        this.queryApp();
    },
    computed: {
    },
    watch: {
    	'channel.channelId': function(){
    		this.generateLink();
    	},
       	'channel.linkType': function(){
        	this.generateLink();
       	},
       	'channel.catalogId': function(){
        	this.generateLink();
       	},
       	'channel.appId': function(){
        	this.generateLink();
       	},
        'channel.callBack': function(){
            this.generateLink();
        }
    },
    methods: {
        queryChannel(){
            let url = '/market/portal/channel/queryChannelList';
            let ref = this;
            var params = {
                channelId: this.channelId,
            	channelName: this.channelName,
            	pageIndex: this.pageIndex,
            	pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingEdits = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var channelList = res.data;
                        if(!!channelList){
                            for(var i=0;i<channelList.length;i++){
                                ref.data.push(channelList[i]);
                                ref.isLoadingEdits.push(false); 
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        searchChannel() {
        	this.pageIndex = 1;
        	this.total = 0;
        	this.loadingTable = true;
        	this.queryChannel();
        },
        changePageIndex(pageIndex) {
			this.pageIndex = pageIndex;
            this.loadingTable = true;
            this.queryChannel();
        },
        showAdd(){
            this.initChannel();
            this.isShowAddOrEdit = true;
            this.isShowAdd = true;
        },
        generateID(){
        	this.channel.channelId = Math.floor(Math.random()*(100000-9999+1)+10000) + '';
        },
        linkTypeChange() {
        	if(this.channel.linkType == '1'){
        		this.queryCatalog();
        	}else if(this.channel.linkType == '2'){
        		this.queryApp();
        	}
            else if(this.channel.linkType == '3'){
                if(this.isShowAdd)
                {
                    this.channel.callBack='';
                }
                this.queryApp();
            }
            else if(this.channel.linkType == '4' && this.isShowAdd){             
                this.channel.callBack='';               
            }else{}
        },
        queryCatalog(){
			this.isLoadingCatalogName = true;
			let url = '/market/portal/catalog/getCatalogList';
            let ref = this;
            var params = {
            	type: "1",
            	nodeType: 1,
            	pageIndex: 1,
            	pageSize: 99999
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.catalogList = [];
                    if(!!res && res.resultCode == '0'){
                        ref.catalogList = res.data;
                    }
                    ref.isLoadingCatalogName = false;
                }
            );
        },
        queryApp(){
			this.isLoadingAppName = true;
			let url = '/market/portal/app/queryAppList';
            let ref = this;
            var params = {
            	appStatus: "0",
            	pageIndex: 1,
            	pageSize: 999999
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.appList = [];
                    if(!!res && res.resultCode == '0'){
                        ref.appList = res.data;
                    }
                    ref.isLoadingAppName = false;
                }
            );
        },
        generateLink(){
            if(!!this.channel.channelId && this.channel.channelId.length == 5){
                this.channel.linkAddress = '';
                if(this.channel.linkType == '0')
                {
	        		this.channel.linkAddress = 'http://www.xxx.com/portal/ads/rlink?channel='+this.channel.channelId+'&link=index';
	        	}
                else if(this.channel.linkType == '1' && !!this.channel.catalogId)
                {
	        		this.channel.linkAddress = 'http://www.xxx.com/portal/ads/rlink?channel='+this.channel.channelId+'&link=list&section='+this.channel.catalogId;
	        	}
                else if(this.channel.linkType == '2' && !!this.channel.appId)
                {
	        		// this.channel.linkAddress = 'http://www.xxx.com/portal/ads/rlink?channel='+this.channel.channelId+'&link=gameDetail&section='+this.channel.appId;
                    this.channel.linkAddress ='http://www.ethio-play.com/views/landingpage.html?py='+this.channel.appId
	        	}
                else if(this.channel.linkType == '3' && !!this.channel.appId)
                {
                    //landpage推广
                    let url='http://www.ethio-play.com/vas/cl/p?click_id='+this.channel.channelId; 
                    url=url+'&link=landPage&a='+this.channel.appId;
                    this.channel.linkAddress =url;
                }
                else if(this.channel.linkType == '4')
                {
                    //wap商城推广
                    this.channel.linkAddress = 'http://www.ethio-play.com/vas/cl/wp?click_id='+this.channel.channelId+'&link=wap';
                } 
                else if(this.channel.linkType == '5')
                {
                    //android推广
                    this.channel.linkAddress = 'http://www.ethio-play.com/vas/cl/dl?click_id='+this.channel.channelId+'&link=android';
                }
                else
                {
	        		this.channel.linkAddress = '';
	        	}
    		}else{
				this.channel.linkAddress = '';
    		}
        },
        cancelAdd(){
            this.isShowAddOrEdit = false;
            this.isShowAdd = false;
        },
        add(){
            this.$refs['channel'].validate((valid) => {
                if (valid) {
                    this.isClickedBtn = true;
                    let url = '/market/portal/channel/add';
                    let ref = this;  
                    this.$http.post(url, this.channel).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                ref.queryChannel();
                                ref.isShowAddOrEdit = false;
                                ref.isShowAdd = false;
                                ref.$Message.success(ref.$t('savedSuccess'));
                            }
                            ref.isClickedBtn = false;
                        }
                    );
                }
            })
        },
        initChannel(){
            this.$refs['channel'].resetFields();
            this.errorChannelIdMsg = '';
            this.isErrorChannel = false;  
            this.isShowEdit = false;
            this.isShowAdd = false;
            this.channel.id = '';
            this.channel.channelId = '';
            this.channel.channelName = '';
            this.channel.linkType = '';
            this.channel.linkAddress = '';
            this.channel.catalogId = '';
            this.channel.appId = '';
            this.channel.callBack = '';
            this.channel.dataMapping='';
        },
        showEdit(id,index){
            this.initChannel();
            this.isLoadingEdits.splice(index,1,true);
            let url = '/market/portal/channel/queryChannelById';
            let ref = this;
            var params = {
                id: id
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var channelData = res.data;
                        if(!!channelData){
                            // if(channelData.linkType=='3'||channelData.linkType=='4'){
                                // let address=channelData.linkAddress;                                                        
                                // let str =  address.match(/callback=(\S*)/)[1];                                                           
                                // channelData.callBack=decodeURIComponent(str);
                            // }
                            ref.channel = channelData;                            
                        }
                    }
                    ref.isLoadingEdits.splice(index,1,false);
                    ref.isShowEdit = true;
                    ref.isShowAddOrEdit = true;
                }
            );
        },
        edit(){
            this.$refs['channel'].validate((valid) => {
                if (valid) {
                    this.isClickedBtn = true;
                    let url = '/market/portal/channel/modify';
                    let ref = this;
                    this.$http.post(url, this.channel).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('savedSuccess'));
                                ref.queryChannel();
                                ref.isShowAddOrEdit = false;
                                ref.isShowEdit = false;
                            }
                            ref.isClickedBtn = false;
                        }
                    );
                }
            })
        },
        cancelEdit(){
           	this.isShowEdit = false; 
            this.isShowAddOrEdit = false;
        },
        removeChannel(id){
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/channel/delete';
                    let ref = this;
                    var params = {
                        id: id
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('deletedSuccess'));
                                ref.queryChannel();
                            }
                        }
                    );
                }
            });
        }
    }
};
</script>