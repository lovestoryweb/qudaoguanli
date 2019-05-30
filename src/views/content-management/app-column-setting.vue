<style>
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
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <!-- 点击了保存按钮后的朦层 -->
                    <div class="mask" v-show="isClickedSave"></div>
                    <div slot="title">
                        <Button type="primary" :loading="isLoadingDeploy" @click="showDeploy">
                                <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                        <div style="float:right">
                            {{$t('appNameCol')}}:
                            <Input v-model="appName" :placeholder="$t('appNamePlaceholder')" style="width: 200px"></Input>
                            <Button type="primary" @click="searchApp">
                                <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                            </Button>
                            <Button type="primary" :loading="isClickedSave" @click="saveSort">
                                {{$t('saveSortBtn')}}  
                            </Button>
                        </div>
                    </div>
                    <div>
                        <!-- <Row type="flex" justify="center">
                            {{catalogName}}
                        </Row> -->
                        <!-- 外部表格 -->
                        <Table border :columns="columns" :data="data" :loading="loadingOutTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" @on-change="changePageIndex"></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <!-- 增加配置app弹窗 -->
            <Modal
                v-model="isShowDeploy"
                :title="$t('deployAppTitle')"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <div slot="title">
                        <div style="text-align:center;">
                            {{$t('appNameCol')}}:
                            <Input v-model="appNameModal" :placeholder="$t('appNamePlaceholder')" style="width: 200px"></Input>
                            <Button type="primary" @click="searchAppNotInCatalog">
                                <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                            </Button>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div>
                        <Table border ref="selection" :columns="columnsModal" :data="dataModal" :loading="loadingModalTable" :no-data-text="$t('noResult')" @on-selection-change="selectChange"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndexModal" :total="totalModal" @on-change="changePageIndexModal"></Page>
                        </Row>
                        <div class="mask" v-show="isClickedDeploy"></div>
                    </div>
                </Card>
                <div slot="footer">
                    <Button @click="cancelDeploy()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedDeploy" @click="deploy()">{{$t('deployBtn')}}</Button>
                </div>
            </Modal>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'appColumnSetting',
    data () {

        return {
            currentPath: '',    //当前页面路径
            catalogId: '',  //当前所属栏目
            catalogIdTemp: '',  //缓存栏目ID
            // catalogName: '',    //当前所属栏目名称
            appName: '',    //根据app名称查询在栏目中的app
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            isClickedSave: false,   //是否点击了保存排序按钮
            isLoadingMoveTop: [],   //置顶按钮是否loading
            loadingOutTable: true,    //外部表格是否loading
            isLoadingDeploy: false, //按钮是否loading
            isShowDeploy: false,   //是否展示新增弹窗
            isClickedDeploy: false,    //是否正在发送配置请求
            pageIndexModal: 1,  //未配置的app页码
            totalModal: 0, //未配置的app总数
            loadingModalTable: true,    //弹窗表格是否loading
            appNameModal: '',   //弹窗中的app名称输入框
            columns: [
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
                /*{
                    title: this.$t('catalogNameCol'),
                    key: 'catalogName'
                },*/
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
                                    this.moveDown(params.index)
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
                                    this.moveTop(params.row.id,params.index)
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
                                    this.removeRelation(params.row.appId)
                                }
                            }
                        }, this.$t('deleteRelationBtn'));
                        if(this.datas.length > params.index+1){
                            //过滤掉最后一页最后一条的下移
                            btns.push(moveDownBtn);
                        }
                        if(this.pageIndex != 1 || params.index != 0){
                            //过滤掉第一页并且是第一条数据的置顶
                            btns.push(moveTopBtn);
                        }
                        btns.push(deleteRelationBtn);
                        return h('div',btns);
                    }
                }
            ],
            data:[],    //对应表格数据
            indexs:[],  //对应order
            columnsModal: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
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
                }
            ],
            dataModal: [],    //未配置的app数据
            appIds: [],    //选中未配置的appId数组
            datas: []   //查询回来的，会多一条数据，供排序使用
        };
    },
    created() {
        this.currentPath = this.$route.path;
        this.catalogId = this.$route.query.catalogId;
        this.catalogIdTemp = this.catalogId;
        this.queryAppInCatalog();
    },
    computed: {
        
    },
    watch: {
        $route(){
            if(!!this.$route.query.catalogId && this.$route.path == this.currentPath){
                this.catalogId = this.$route.query.catalogId;
            }
        },
        catalogId: function(){
            if(this.catalogIdTemp != this.catalogId){
                this.catalogIdTemp = this.catalogId;
                this.initPage();
                this.queryAppInCatalog();
            }
        }
    },
    methods: {
        queryAppInCatalog(){
            let url = '/market/portal/catalogrelation/getCatalogAppRelation';
            let ref = this;
            var params = {
                catalogId: this.catalogId,
                appName: this.appName,
                type: 5,    //应用栏目下的应用类型
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingMoveTop = [];
                    //展示用的数据
                    ref.data = [];
                    //暂存的原数据（可能为十一条，为了第十条的下移）
                    ref.datas = [];
                    //原orderNum数组
                    ref.indexs = [];
                    if(!!res && res.resultCode == '0'){
                        // ref.catalogName = res.data.catalogName;
                        if(!!res.data){
                            var appList = res.data.appInfos;
                            if(!!appList){
                                for(var i=0;i<appList.length;i++){
                                    ref.datas.push(appList[i]);
                                    if(i<10){
                                        ref.data.push(appList[i]);
                                        ref.isLoadingMoveTop.push(false);
                                    }
                                    ref.indexs.push(appList[i].order);
                                }
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingOutTable = false;
                }
            );
        },
        searchApp() {
            this.pageIndex = 1;
            this.total = 0;
            this.loadingOutTable = true;
            this.queryAppInCatalog();
        },
        saveSort() {
            var ids = [];
            for(var j=0;j<this.datas.length;j++){
                ids.push(this.datas[j].id);
            }
            if(ids.length == 0 || this.indexs.length == 0){
                return;
            }
            this.isClickedSave = true;
            let url = '/market/portal/catalogrelation/batchUpgradeColumnAppRanks';
            let ref = this;
            var params = {
                ids: ids,
                rankPriorities: this.indexs
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.queryAppInCatalog();
                        ref.$Message.success(ref.$t('savedSuccess'));
                    }
                    ref.isClickedSave = false;
                }
            );
        },
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.loadingOutTable = true;
            this.queryAppInCatalog();
        },
        moveDown(index){
            var temp;
            if(index == 9){
                this.data.splice(index,1,this.datas[index+1]);
                temp = this.datas[index];
                this.datas.splice(index,1,this.datas[index+1]);
                this.datas.splice(index+1,1,temp);
            }else{
                temp = this.data[index];
                this.data.splice(index,1,this.data[index+1]);
                this.data.splice(index+1,1,temp);
                this.datas.splice(index,1,this.datas[index+1]);
                this.datas.splice(index+1,1,temp);
            }
        },
        moveTop(id,index){
            this.isLoadingMoveTop.splice(index,1,true);
            let url = '/market/portal/catalogrelation/updateToTop';
            let ref = this;
            var params = {
                catalogId: this.catalogId,
                id: id
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.queryAppInCatalog();
                        ref.$Message.success(ref.$t('moveTopSuccess'));
                    }
                    ref.isLoadingMoveTop.splice(index,1,false);
                }
            );
        },
        removeRelation(appId){
            this.$Modal.confirm({
                title: this.$t('removeRelationConfirmationTitle'),
                content: '<p>'+this.$t('removeRelationContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/catalogrelation/deleteCatalogTargetRel';
                    let ref = this;
                    var params = {
                        catalogId: this.catalogId,
                        targetId: appId
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('removeRelationSuccess'));
                                ref.queryAppInCatalog();
                            }
                        }
                    );
                }
            });
        },
        queryAppNotInCatalog(){
            this.loadingModalTable = true;
            let url = '/market/portal/catalogrelation/getNotInCatalogAppRel';
            let ref = this;
            var params = {
                catalogId: this.catalogId,
                appName: this.appNameModal,
                type: 5,  //应用栏目下的应用类型
                pageIndex: this.pageIndexModal,
                pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.dataModal = [];
                    if(!!res && res.resultCode == '0'){
                        var appList = res.data;
                        if(!!appList){
                            for(var i=0;i<appList.length;i++){
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
        searchAppNotInCatalog(){
            this.appIds = [];
            this.$refs.selection.selectAll(false);
            this.totalModal = 0;
            this.pageIndexModal = 1;
            this.queryAppNotInCatalog();
        },
        initModal(){
            this.appNameModal = '';
            this.pageIndexModal = 1;
            this.totalModal = 0;
            this.isLoadingDeploy = true;
        },
        showDeploy(){
            this.initModal();
            this.queryAppNotInCatalog();
        },
        changePageIndexModal(pageIndexModal) {
            this.appIds = [];
            this.$refs.selection.selectAll(false);
            this.pageIndexModal = pageIndexModal;
            this.queryAppNotInCatalog();
        },
        cancelDeploy(){
            this.isShowDeploy = false;
        },
        selectChange(selection){
            this.appIds = [];
            for(var i=0;i<selection.length;i++){
                this.appIds.push(selection[i].appId);
            }
        },
        deploy(){
            if(!!!this.appIds || this.appIds.length == 0){
                return;
            }
            this.isClickedDeploy = true;
            let url = '/market/portal/catalogrelation/addCatalogTargetRel';
            let ref = this;
            var params = {
                type: 5,  //应用栏目下的应用类型
                catalogId: this.catalogId,
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
        initPage(){
            this.pageIndex = 1;
            this.total = 0;
            this.appName = '';
            this.loadingOutTable = true;
        }
    }
};
</script>