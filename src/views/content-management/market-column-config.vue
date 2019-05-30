<style>
    .catalog_field {
        width: 70%;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .clear {
        clear: both;
    }
    .mask {
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:1000;
    }
    .ivu-card-head {
        padding: 14px 16px;
        line-height: 1; 
    }
</style>

<template>
    <div>
        <Row>

            <Col span="24">
                <Card>
                    <!-- 选择配置类型和配置内容部分 -->
                    <div slot="title">

                        <span>{{$t('associationType')}}：</span>
                        <Select v-model="configType" style="width:200px;" @on-change="chooseValue();" :disabled="iSneedConfigType || isFailed">
                            <Option v-for="item in configContentTypeLists" :value="item.value" :key="item.value">
                                {{item.title}}
                            </Option>
                        </Select>
                
                        <template v-if="configType==1">
                            <!-- 广告配置 -->
                            <div style="display:inline-block;">
                                <span style="display:inline-block;margin-left:2px;">{{$t('advPosition')}}：</span>
                                <Select v-model="positionTypeIndex" style="width:200px;" :disabled="iSneedConfigType  || isFailed" @on-change="advPositionTypeChanged();">
                                    <Option v-for="item in advTypeList" :value="item.value" :key="item.value">{{ item.title }}</Option>
                                </Select>
                            </div>
                            <span style="margin-left:2px;">{{$t('configAdvText')}}：</span>
                            <Select v-model="configContentValue" filterable style="width:200px;" :disabled="ifHaveThingsConfig  || isFailed" :loading="isLoadingConfigAdv">
                                <Option v-for="item in configAdvList" :value="item.advertisementId" :key="item.advertisementId">{{ item.advertisementName }}</Option>
                            </Select>
                            <div style="float:right">
                                <Button type="primary" :disabled="isFailed" :loading="isClickedSave" @click="saveDialogs()">{{$t('saveBtn')}}</Button>
                                <Button type="primary" :disabled="isFailed" :loading="isClickedSaveSort" @click="saveSort(1)">
                                    {{$t('saveSortBtn')}}  
                                </Button>
                        </div>
                        </template>
                
                        <template v-if="configType==3">
                            <!-- 普通栏目配置  -->
                            <!-- <div style="display:inline-block; width:250px;">
                                <span style="display:inline-block;margin-left:5%;">{{$t('configColumnText')}}</span>
                                <Select v-model="positionTypeIndex" style="width:150px;" :disabled="iSneedConfigType" @on-change="advPositionTypeChanged();">
                                    <Option v-for="item in columnTypeList" :value="item.value" :key="item.value">{{ item.title }}</Option>
                                </Select>
                            </div> -->
                            <span style="margin-left: 2px;">{{$t('catalogNameCol')}}：</span>
                            <div style="display:inline-block;">
                                <Select v-model="configContentValue" :disabled="isFailed" filterable style="width:200px;" :loading="isLoadingConfigCol">
                                    <Option v-for="item in configColumnList" :value="item.catalogId" :key="item.catalogId">{{ item.catalogName }}</Option>
                                </Select>
                            </div>
                            <div style="float:right">
                                <Button type="primary" :disabled="isFailed" :loading="isClickedSave" @click="saveDialogs()">{{$t('saveBtn')}}</Button>
                            </div>
                        </template>

                        <template v-if="configType==2">
                            <!-- 应用配置 -->
                            <!-- <div style="display:inline-block;">
                                <span style="display:inline-block;margin-left:2px;">{{$t('appPosition')}}：</span>
                                <Select v-model="positionTypeIndex" style="width:150px;" :disabled="iSneedConfigType" @on-change="advPositionTypeChanged();">
                                    <Option v-for="item in appTypeList" :value="item.value" :key="item.value">{{ item.title }}</Option>
                                </Select>
                            </div> -->
                            <Button type="primary" :disabled="isFailed" :loading="isLoadingDeploy" @click="doConfigApps()">{{$t('deployAppTitle')}}</Button>
                            <div style="display:inline-block;float:right;">
                                <span>&nbsp;{{$t('configCatalogText')}}：</span>
                                <Input v-model="appName" :placeholder="$t('appNamePlaceholder')" :disabled="isFailed" style="width: 200px;">
                                </Input>
                                <Button type="primary" icon="ios-search" :disabled="isFailed" @click="searchAppInCatalog">{{$t('search')}}</Button>
                                <Button type="primary" :disabled="isFailed" :loading="isClickedSaveSort" @click="saveSort(2)">
                                    {{$t('saveSortBtn')}}  
                                </Button>
                             </div>
                        </template>
                    </div>
                    <!-- 配置内容部分 -->
                    <div>

                        <!-- 已经配置的广告 -->
                        <template v-if="configType==1">
                            <div>
                                <Table border :columns="columnsAdv" :data="data" :loading="loadingTable" 
                                :no-data-text="$t('noResult')"></Table>
                            </div>
                        </template>
                        
                        <!-- 已经配置的普通栏目 -->
                        <template v-if="configType==3">
                            <div>
                                <Table border :columns="columnsColumn" :data="data" :loading="loadingTable" 
                                :no-data-text="$t('noResult')"></Table>
                            </div>
                        </template>

                        <!-- 已经配置的应用 -->
                        <template v-if="configType==2">
                            <div>
                                <!-- 外部表格 -->
                                <Table border :columns="appsConfigured" :data="data" :loading="loadingOutTable" 
                                :no-data-text="$t('noResult')"></Table>
                                <Row>
                                    <Page class-name="page" :current="pageIndex" :total="total" @on-change="changePageIndex"></Page>
                                </Row>
                            </div>
                        </template>
                    </div>
                </Card>
            </Col>
        </Row>
             
        <Row>
            <!-- 增加配置app弹窗 -->
            <Modal
                v-model="isShowDeploy"
                :title="$t('deployAppTitle')"
                :mask-closable="false"
                :closable="true"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <div slot="title">
                        <div style="text-align:center;">
                            {{$t('appNameCol')}}:
                            <Input v-model="confAppSearchName" :placeholder="$t('appNamePlaceholder')" style="width: 200px;"></Input>
                            <Button type="primary" @click="searchAppNotInCatalog">
                                <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                            </Button>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div>
                        <Table border ref="selection" :columns="columnsConfigApps" :data="dataModal" :loading="loadingModalTable" :no-data-text="$t('noResult')" @on-selection-change="selectChange"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndexModal" :total="totalModal" @on-change="changePageIndexModal"></Page>
                        </Row>
                        <div class="mask" v-show="isClickedDeploy"></div>
                    </div>
                </Card>
                <div slot="footer">
                    <Button @click="cancelConfigApp">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedDeploy" @click="deploy">{{$t('deployBtn')}}</Button>
                </div>
            </Modal>
        </Row>
    </div>
</template>

<script>
export default 
{
    name: 'app_column_management',
    data () {
        
        return {
            isFirstIn:true,            //是否第一次进入页面
            isFirstSelectChange: true,  //下拉框是否首次改变
            isFailed: false,    //进入页面时调用接口是否失败
            currentCatalogId: '',   //当前栏目ID
            catalogIdTemp: '',  //缓存栏目ID
            isClickedSaveSort: false,   //是否点击了保存排序按钮
            isClickedSave: false,   //是否点击了保存按钮
            isClickedDeploy: false,    //是否正在发送配置请求
            isShowDeploy: false ,       //是否展示配置应用弹窗
            loadingModalTable: true,    //弹窗表格是否loading
            totalModal:0,               //未配置的app总数
            pageIndexModal:1,           //未配置的app页码
            isLoadingDeploy: false, //配置应用按钮是否loading
            isLoadingConfigAdv: false,  //是否loading可配置广告下拉框
            isLoadingConfigCol: false,  //是否loading可配置栏目下拉框

            confAppSearchName:'',//搜索未配置的app名称输入框
            appName:'',//搜索已配置的app名称输入框
       
            iSneedConfigType:false , //标记是否需要配置类型，根据该标志使配置框失效与否
            iSneedConfigPlace:false , //标记是否需要配置广告位置、应用位置、栏目位置，根据该标志使配置框失效与否
            ifHaveThingsConfig:false,//标记，当前是否存在广告、应用、普通栏目 可以配置，没有的话，下拉框失效

            configTypeList:'',//已经配置的关联关系类型（由页面处理加工得....）
           
            configType:1,  // 初始化时候，configType = 1 配置类型默认选中广告.

            configContentValue:'', //当前选中的配置类型选项，下标

            loadingTable: true,     //表格是否loading
            data: [] ,//当前已经配置的列表，展示用

            datas:[],//当前已经配置的应用列表，排序用
            indexs:[],  //对应排序优先级 orderNum

            //应用分页下标和总页数
            loadingOutTable: true,    //外部表格是否loading,标记已经配置的应用列表加载是否loading
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            isLoadingMoveTop: [],   // 置顶按钮是否loading

            //配置类型，列表
            configContentTypeLists:[{value:1,title:this.$t('advertisement')},{value:2,title:this.$t('app')},{value:3,title:this.$t('configColumnText')}],
            advTypeList:[{value:1,title:this.$t('homeAdvertisement')},{value:2,title:this.$t('categoryPageAd')},{value:6,title:this.$t('rotateAds')}],
            appTypeList:[{value:3,title:this.$t('homeApp')}],
            // columnTypeList:[{value:4,title:'热门分类类型'}],
            positionTypeIndex:'',//配置位置类型,默认首位（根据实际查询的配置类型初始化该值）

            //营销栏目可配置 广告、栏目当前内容的列表
            configAdvList:[],
            configColumnList:[],
 
            //营销栏目已配置 广告、栏目、应用信息显示模版
            columnsAdv: [
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
                    key: 'advertisementName'
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    width: 300,
                    align: 'center',
                    render: (h, params) => {
                        var btns = [];
                        var moveDownBtn =  h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'arrow-down-c'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.moveDownNotPaging(params.index)
                                }
                            }
                        }, this.$t('moveDownBtn'));
                        var moveTopBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'arrow-up-c',
                                loading: this.isLoadingMoveTop[params.index]
                            },
                             style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.moveTop(params.row.id,params.index,1);
                                }
                            }
                        }, this.$t('moveTopBtn'));
                        var deleteRelationBtn =  h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                   this.removeRelation(params.row.advertisementId);
                                }
                            }
                        }, this.$t('deleteRelationBtn'));
                        if(this.data.length != params.index+1)
                        {
                            //过滤掉最后一页最后一条的下移
                            btns.push(moveDownBtn);
                        }
                        if(params.index != 0){
                            //过滤掉第一页并且是第一条数据的置顶
                            btns.push(moveTopBtn);
                        }
                        btns.push(deleteRelationBtn);
                        return h('div',btns);
                    }
                }
            ],
            columnsColumn: [
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
                    title: this.$t('configColumnText'),
                    key: 'catalogName'
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.removeRelation(params.row.catalogId);
                                    }
                                }
                            }, this.$t('deleteRelationBtn'))
                        ]);
                    }
                }
            ],
            //已配置应用显示模块
            appsConfigured: [
                {
                    name: '',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span',params.index+1+(this.pageIndex - 1) * this.pageSize)
                    }
                },
                {
                    title: this.$t('appNameCol'),
                    key: 'appName'
                },
                {
                    title: this.$t('appRateCol'),
                    key: 'appRate'
                },
                {
                    title: this.$t('appVersionCol'),
                    key: 'appVersion'
                },
                {
                    title: this.$t('appDeveloperCol'),
                    key: 'developer'
                },
                {
                    title: this.$t('operateCol'),
                    key: 'operate',
                    width: 320,
                    align: 'center',
                    render: (h, params) => {
                        var btns = [];
                        var moveDownBtn =  h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'arrow-down-c'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.moveDown(params.index);
                                }
                            }
                        }, this.$t('moveDownBtn'));
                        var moveTopBtn = h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon: 'arrow-up-c',
                                loading: this.isLoadingMoveTop[params.index]
                            },
                             style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.moveTop(params.row.id,params.index,2);
                                }
                            }
                        }, this.$t('moveTopBtn'));
                        var deleteRelationBtn =  h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.removeRelation(params.row.appId);
                                }
                            }
                        }, this.$t('deleteRelationBtn'));

                        if(this.datas.length > params.index+1)
                        {
                            //过滤掉最后一页最后一条的下移
                            btns.push(moveDownBtn);
                        }
                        if(this.pageIndex != 1 || params.index != 0)
                        {
                            //过滤掉第一页并且是第一条数据的置顶
                            btns.push(moveTopBtn);
                        }
                        btns.push(deleteRelationBtn);
                        return h('div',btns);
                    }
                }
            ],
            //可配置应用模块
            columnsConfigApps: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: this.$t('appNameCol'),
                    key: 'appName',
                    height:70
                },
                {
                    title: this.$t('appRateCol'),
                    key: 'appRate'
                },
                {
                    title: this.$t('appVersionCol'),
                    key: 'appVersion'
                },
                {
                    title: this.$t('appDeveloperCol'),
                    key: 'developer'
                }
            ],
            dataModal: [],              //未配置的app数据
            appIds: [],    //选中未配置的appId数组
                           
            configcatalogAppsList: []  //查询回来的，会多一条数据，供排序使用 可配置数据
            
        };
    },
    created() 
    {
        this.currentPath = this.$route.path;
        this.currentCatalogId = this.$route.query.catalogId;
        this.catalogIdTemp = this.currentCatalogId;
        this.queryCatalogConfig();
    },
    computed: {
        
    },
    watch: 
    {
        $route()
        {
            if(!!this.$route.query.catalogId && this.$route.path == this.currentPath)
            {
                this.currentCatalogId = this.$route.query.catalogId;
            }
        },
        currentCatalogId: function()
        {
            if(this.catalogIdTemp != this.currentCatalogId){
                this.catalogIdTemp = this.currentCatalogId;
                this.initPage();
                this.queryCatalogConfig();
            }
        }
    },
    methods: {
        chooseValue() //  选择配置类型
        {
            this.configContentValue='';
            this.positionTypeIndex='';
            
            switch(this.configType)
            {
                case 1:
                    this.positionTypeIndex = 1; // 1、2、6 广告              
                    break;
                case 2:
                    this.positionTypeIndex = 3; //3  应用
                    break;
                case 3:
                    this.positionTypeIndex = 4; //4 普通栏目
                    this.advPositionTypeChanged();
                    break;
            }

            this.loadingOutTable=false;
        },
        queryCatalogConfig(flag) //初始化数据查询 flag为1代表是从删除首页应用或者是首页广告关联关系完后回调的
        {
            let ref = this;
            var url = '/market/portal/catalogrelation/searchCatalogTargetRelation';
            var param = {
                catalogId:this.currentCatalogId,
                pageIndex:1,
                pageSize:999
            }
            this.$http.post(url,param).then(function(res)
            {
                ref.data = [];
                ref.indexs = [];
                ref.isLoadingMoveTop = [];
                ref.loadingOutTable = false;//关闭应用列表的加载loading
                ref.loadingTable = false;
                if(!!res && '0' === res.resultCode)
                {
                    if(!!!res.data)
                    {
                        ref.iSneedConfigType=false;//恢复配置类型下拉框可选。恢复 配置位置可选
                        ref.iSneedConfigPlace=false; 
                        ref.configType = 1; // 1、2、6 初始化默认1   
                        ref.positionTypeIndex=1;
                        //这里不调用查询可选择的配置内容接口，因为positionTypeIndex变动会调用changed 方法  

                        ref.configAdvList = [];//清空所有配置信息列表
                        ref.configColumnList = [];

                        ref.data=[];//清空数据表格

                        if(flag == 1 || ref.isFirstIn)
                        {
                            ref.queryAdvNotIncatalog(ref.positionTypeIndex);
                        }
                        ref.isFirstIn = false;
                        return ;
                    }

                    //type 126 属于广告类型1 ； 3 属于应用类型2 ；4 属于普通栏目类型
                    //并查询可配置内容列表
                    if(res.data.type === 1)
                    {
                        ref.positionTypeIndex = 1;
                        ref.configTypeList = 1;
                        ref.queryAdvNotIncatalog(ref.positionTypeIndex);
                    }
                    else if(res.data.type === 2)
                    {
                        ref.positionTypeIndex = 2;
                        ref.configTypeList = 1;
                        ref.queryAdvNotIncatalog(ref.positionTypeIndex);
                    }
                    else if(res.data.type === 3)
                    {
                        ref.positionTypeIndex = 3;
                        ref.configTypeList = 2;
                        ref.queryAppInCatalog();
                    }
                    else if(res.data.type === 4)
                    {
                        ref.positionTypeIndex = 4;
                        ref.configTypeList = 3;
                        ref.queryColumnNotIncatalog(4);//查询普通栏目可配置列表
                    }
                    else if(res.data.type === 6)
                    {
                        ref.positionTypeIndex = 6;
                        ref.configTypeList = 1;
                        ref.queryAdvNotIncatalog(ref.positionTypeIndex);
                    }

                    ref.iSneedConfigType = true; //当前已经有配置关系，不可选择其他类型配置（下拉框不可选中）
                    ref.configType = ref.configTypeList;//已经配置的类型
                    if(res.data.type != 3)
                    {
                        var target = res.data.target;   //已经配置的列表
                        for(var i=0;i<target.length;i++)
                        {
                            ref.data.push(target[i]);
                            ref.indexs.push(target[i].order);
                            ref.isLoadingMoveTop.push(false);
                        }
                    }
                }
                else
                {
                    if(ref.isFirstIn)
                    {
                        ref.isFailed = true;    //第一次进入调用接口失败
                    }
                }
                ref.isFirstIn = false;
            });
        },
        saveDialogs()//保存当前选择配置内容
        {
             
            if(!!!this.configContentValue)
            {
                // this.$Message.error("未选中配置内容");
                return ;
            }

            this.isClickedSave = true;
            let ref = this;
            let url= 'market/portal/catalogrelation/addCatalogTargetRel';
            var targetIds = [];
            targetIds.push(this.configContentValue);

            var param = 
            {   
                catalogId:this.currentCatalogId,
                type:this.positionTypeIndex,
                targetIds:targetIds
            }
            this.$http.post(url,param).then(function(res)
            {
                if(!!res && '0' === res.resultCode)
                {
                    ref.$Message.success(ref.$t('configDialogSuccess'));
                    ref.queryCatalogConfig();
                }
                ref.isClickedSave = false;
                /*else
                {
                    ref.$Message.success(ref.$t('networkAnomalyMsg'));
                    ref.queryCatalogConfig();
                }*/
            });
        },
        initModal()
        {
            this.confAppSearchName = '';
            this.pageIndexModal = 1;
            this.totalModal = 0;
            this.isLoadingDeploy = true;
        },
        doConfigApps()//配置应用弹窗
        {
            this.isShowDeploy=true;//显示弹窗
            this.appIds = [];//清除数据
            this.$refs.selection.selectAll(false);
            this.initModal();
            this.queryAppNotInCatalog();
        },
        queryAppNotInCatalog()
        {
            this.loadingModalTable = true;
            let url = '/market/portal/catalogrelation/getNotInCatalogAppRel';
            let ref = this;
            var params = {
                catalogId: this.currentCatalogId,
                appName: this.confAppSearchName,
                type: this.positionTypeIndex,  //应用栏目下的应用类型
                pageIndex: this.pageIndexModal,
                pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.dataModal = [];
                    if(!!res && res.resultCode == '0')
                    {
                        var appList = res.data;
                        if(!!appList)
                        {
                            for(var i=0;i<appList.length;i++)
                            {
                                ref.dataModal.push(appList[i]);
                            }
                        }
                        ref.totalModal = res.totalCount;
                    }
                    ref.loadingModalTable = false;
                    ref.isLoadingDeploy = false;
                    ref.isShowDeploy = true;
                }
            );
        },
        advPositionTypeChanged()
        {
            this.configContentValue='';
            if(!this.isFirstSelectChange)
            {
                switch(this.positionTypeIndex)
                {
                    case 1:
                    case 2:
                    case 6:
                        this.queryAdvNotIncatalog(this.positionTypeIndex); //查询广告类型 可以配置的内容列表
                        break;
                    case 3:
                        //查询应用 可以配置的内容列表 等到点击按钮再查询
                        break;
                    case 4:
                        this.queryColumnNotIncatalog(4);//查询普通栏目 可以配置的内容列表
                        break;
                }
            }
            this.isFirstSelectChange = false;
        },
        queryColumnNotIncatalog(columnPositionType)
        {
            this.isLoadingConfigCol = true;
            var url = '/market/portal/catalogrelation/searchCatalogNotInCatalog';
            let ref = this;
            var param = 
            {
                catalogId:this.currentCatalogId,
                type:columnPositionType,
                pageIndex:1,
                pageSize:999
            }
            this.$http.post(url,param).then(function(res)
            {
                if(!!res && '0' === res.resultCode)
                {
                    if(!!!res.data)
                    {
                        //设置不可以选。且提示已经全部配置了
                        ref.ifHaveThingsConfig = true;
                        ref.$Message.error(this.$t('noContentForConfig'));
                    }
                    ref.configColumnList = res.data; 
                }
                ref.isLoadingConfigCol = false;
            });
        },
        queryAdvNotIncatalog(advPositionType)
        {
            this.isLoadingConfigAdv = true;
            var url = '/market/portal/catalogrelation/searchAdsNotInCatalog';
            let ref = this;
            var param = 
            {
                catalogId:this.currentCatalogId,
                type:advPositionType,
                pageIndex:1,
                pageSize:999
            }
            this.$http.post(url,param).then(function(res)
            {
                if(!!res && '0' === res.resultCode)
                {
                    if(!!!res.data)
                    {
                        //设置不可以选。且提示已经全部配置了
                        ref.ifHaveThingsConfig = true;
                        ref.$Message.warn(this.$t('noContentForConfig'));
                    }
                    ref.configAdvList = res.data; 
                }
                ref.isLoadingConfigAdv = false;
            });
        },
        searchAppNotInCatalog()
        {
            this.appIds = [];
            this.$refs.selection.selectAll(false);
            this.loadingModalTable = true;
            this.totalModal = 0;
            this.pageIndexModal = 1;
            this.queryAppNotInCatalog();
        },
        selectChange(selection)
        {
            this.appIds = [];
            for(var i=0;i<selection.length;i++){
                this.appIds.push(selection[i].appId);
            }
        },
        changePageIndexModal(pageIndexModal)
        {
            this.appIds = [];
            this.$refs.selection.selectAll(false);
            this.pageIndexModal = pageIndexModal;
            this.queryAppNotInCatalog();
        },
        cancelConfigApp()
        {
            this.isShowDeploy = false;
        },
        deploy()
        {
            if(!!!this.appIds || this.appIds.length == 0)
            {
                return;
            }
            this.isClickedDeploy = true;
            let url = '/market/portal/catalogrelation/addCatalogTargetRel';
            let ref = this;
            var params = {
                type: this.positionTypeIndex,  //营销栏目下的应用类型
                catalogId: this.currentCatalogId,
                targetIds: this.appIds
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.queryAppInCatalog();
                        ref.$Message.success(ref.$t('configDialogSuccess'));
                        ref.isShowDeploy = false;
                    }
                    ref.isClickedDeploy = false;
                }
            );
        },
        changePageIndex(pageIndex)
        {
            this.pageIndex = pageIndex;
            this.queryAppInCatalog();
        },
        queryAppInCatalog()
        {
            this.loadingOutTable = true;
            let url = '/market/portal/catalogrelation/getCatalogAppRelation';
            let ref = this;
            var params = {
                catalogId: this.currentCatalogId,
                appName: this.appName,
                type: this.positionTypeIndex,    //应用栏目下的应用类型
                pageIndex: this.pageIndex,
                pageSize: this.pageSizes
            };
            this.$http.post(url, params).then(
                function(res)
                {
                    ref.isLoadingMoveTop = [];
                    ref.data = [];  //展示用的数据
                    ref.datas = [];//暂存的原数据（可能为十一条，为了第十条的下移）
                    ref.indexs = [];//原orderNum数组

                    if(!!res && res.resultCode == '0')
                    {
                        if(!!res.data)
                        {
                            var appList = res.data.appInfos;
                            if(!!appList)
                            {
                                for(var i=0;i<appList.length;i++)
                                {
                                    ref.datas.push(appList[i]);

                                    if(i < 10)
                                    {
                                        ref.data.push(appList[i]);
                                        ref.isLoadingMoveTop.push(false);
                                    }
                                    ref.indexs.push(appList[i].order);
                                }
                            }
                            ref.iSneedConfigType = true; //当前已经有配置关系，不可选择其他类型配置（下拉框不可选中）
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingOutTable = false;
                }
            );
        },
        //js 应用排序
        moveTop(id,index,type)
        {
            this.isLoadingMoveTop.splice(index,1,true);
            let url = '/market/portal/catalogrelation/updateToTop';
            let ref = this;
            var params = {
                catalogId: this.currentCatalogId,
                id: id
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0')
                    {
                        if(type == 1)
                        {
                            ref.queryCatalogConfig();
                        }
                        else if(type == 2)
                        {
                            ref.queryAppInCatalog();
                        }
                        ref.$Message.success(ref.$t('moveTopSuccess'));
                    }
                    ref.isLoadingMoveTop.splice(index,1,false);
                }
            );
        },
        removeRelation(targetId)
        {
            this.$Modal.confirm({
                title: this.$t('removeRelationConfirmationTitle'),
                content: '<p>'+this.$t('removeRelationContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {

                    let ref = this;
                    let url ='/market/portal/catalogrelation/deleteCatalogTargetRel';
                    var param =
                    {
                        catalogId: this.currentCatalogId,
                        targetId: targetId
                    }
                    this.$http.post(url, param).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0')
                            {
                                ref.$Message.success(ref.$t('removeRelationSuccess'));
                                if(ref.positionTypeIndex == 1 || ref.positionTypeIndex == 3)
                                {
                                    ref.queryCatalogConfig(1);
                                }
                                else
                                {
                                    ref.queryCatalogConfig();
                                }
                            }
                        }
                    );
                }
            });
        },
        moveDown(index)
        {
            var temp;
            if(index == 9)
            {
                this.data.splice(index,1,this.datas[index+1]);
                temp = this.datas[index];
                this.datas.splice(index,1,this.datas[index+1]);
                this.datas.splice(index+1,1,temp);
            }
            else
            {
                temp = this.data[index];
                this.data.splice(index,1,this.data[index+1]);
                this.data.splice(index+1,1,temp);
                this.datas.splice(index,1,this.datas[index+1]);
                this.datas.splice(index+1,1,temp);
            }
        },
        moveDownNotPaging(index)
        {
            var temp = this.data[index];
            this.data.splice(index,1,this.data[index+1]);
            this.data.splice(index+1,1,temp);
        },
        saveSort(type)
        {
            var ids = [];
            if(type == 1)   //1为广告的内容排序
            {
                for(var i=0;i<this.data.length;i++)
                {
                    ids.push(this.data[i].id);
                }
            }
            else if(type == 2)  //2为应用的内容排序
            {
                for(var j=0;j<this.datas.length;j++)
                {
                    ids.push(this.datas[j].id);
                }
            }
            if(ids.length == 0 || this.indexs.length == 0)
            {
                return;
            }
            this.isClickedSaveSort = true;
            let url = '/market/portal/catalogrelation/batchUpgradeColumnAppRanks';
            let ref = this;
            var params = {
                ids: ids,
                rankPriorities: this.indexs
            };
            this.$http.post(url, params).then(
                function(res)
                {
                    if(!!res && res.resultCode == '0')
                    {
                        if(type == 1)
                        {
                            ref.queryCatalogConfig();
                        }
                        else if(type == 2)
                        {
                            ref.queryAppInCatalog();
                        }
                        ref.$Message.success(ref.$t('savedSuccess'));
                    }
                    ref.isClickedSaveSort = false;
                }
            );
        },
        searchAppInCatalog()
        {
            this.pageIndex = 1;
            this.total = 0;
            this.loadingOutTable = true;
            this.queryAppInCatalog();
        },
        initPage()
        {
            this.isFirstIn = true;          //是否第一次进入页面
            this.isShowDeploy = false;       //是否展示配置应用弹窗
            this.loadingModalTable = true;    //弹窗表格是否loading
            this.isClickedSave = false;
            this.isClickedSaveSort = false;
        }
    }
}
</script>