<style>
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
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <!-- 点击了保存按钮后的朦层 -->
                    <div class="mask" v-show="isClickedSave"></div>
                    <div slot="title">
                        <div style="float:right">
                            <Button type="primary" :loading="isClickedSave" @click="saveSort">
                                {{$t('saveSortBtn')}}  
                            </Button>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div>
                        <Table border :columns="columns" :data="data" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'generalColumnSetting',
    data () {

        return {
            currentPath: '',    //当前页面路径
            catalogId: '',  //当前所属栏目
            catalogIdTemp: '',  //缓存栏目ID
            isLoadingMoveTop: [],   //置顶按钮是否loading
            loadingTable: true,    //表格是否loading
            isClickedSave: false,   //是否点击了保存排序按钮
            columns: [
                {
                    name: '',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span',params.index+1);
                    }
                },
                {
                    title: this.$t('catalogNameCol'),
                    key: 'catalogName'
                },
                {
                    title: this.$t('catalogIdCol'),
                    key: 'catalogId'
                },
                {
                    title: this.$t('catalogDescCol'),
                    key: 'catalogDesc'
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
                                    this.moveTop(params.row.catalogId,params.index)
                                }
                            }
                        }, this.$t('moveTopBtn'));
                        if(this.data.length != params.index+1){
                            //过滤掉最后一条的下移
                            btns.push(moveDownBtn);
                        }
                        if(params.index != 0){
                            //过滤掉第一条数据的置顶
                            btns.push(moveTopBtn);
                        }
                        return h('div',btns);
                    }
                }
            ],
            data: [],
            indexs: []  //二级栏目orderNum顺序
        };
    },
    created() {
        this.currentPath = this.$route.path;
        this.catalogId = this.$route.query.catalogId;
        this.catalogIdTemp = this.catalogId;
        this.queryCatalog();
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
                this.queryCatalog();
            }
        }
    },
    methods: {
        queryCatalog(){
            let url = '/market/portal/catalog/querySubCatalogByCatalogId';
            let ref = this;
            var params = {
                catalogId: this.catalogId,
                pageIndex: 1,
                pageSize: 999
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingMoveTop = [];
                    ref.indexs = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        if(!!res.data){
                            for(var i=0;i<res.data.length;i++){
                                ref.data.push(res.data[i]);
                                ref.indexs.push(res.data[i].orderNum);
                                ref.isLoadingMoveTop.push(false);
                            }
                        }
                    }
                    ref.loadingTable = false;
                }
            );
        },
        saveSort() {
            var catalogIds = [];
            for(var j=0;j<this.data.length;j++){
                catalogIds.push(this.data[j].catalogId);
            }
            if(catalogIds.length == 0 || this.indexs.length == 0){
                return;
            }
            this.isClickedSave = true;
            let url = '/market/portal/catalog/modifySubCatalogToMove';
            let ref = this;
            var params = {
                catalogIds: catalogIds,
                orderNums: this.indexs,
                nodeType: 1,
                catalogType : 1,
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.queryCatalog();
                        ref.$Message.success(ref.$t('savedSuccess'));
                    }
                    ref.isClickedSave = false;
                }
            );
        },
        moveDown(index){
            var temp = this.data[index];
            this.data.splice(index,1,this.data[index+1]);
            this.data.splice(index+1,1,temp);
        },
        moveTop(catalogId,index){
            this.isLoadingMoveTop.splice(index,1,true);
            let url = '/market/portal/catalog/modifySubCatalogToTop';
            let ref = this;
            var params = {
                catalogId: catalogId,
                noteType: 1
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        ref.queryCatalog();
                        ref.$Message.success(ref.$t('moveTopSuccess'));
                    }
                    ref.isLoadingMoveTop.splice(index,1,false);
                }
            );
        },
        initPage(){
            this.loadingTable = true;
        }
    }
};
</script>
