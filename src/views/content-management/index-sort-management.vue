<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
    .page {
        float: right;
        margin-top: 10px;
    }
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                        <Button type="primary" @click="saveSort" :loading="isClickedSaveSort">
                            {{$t('saveSortBtn')}}  
                        </Button>

                        <div style="float:right">
                            <Button type="primary" @click="search">
                                    <Icon type="ios-search"></Icon>&nbsp;{{$t('search')}}  
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Table border :columns="columns" :data="data" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="pageIndex" :total="total" :page-size="pageSize" @on-change=""></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import util from '../../libs/util';
export default {
    name: 'indexSortManagement',
    data () {
        return {
            loadingTable: true,    //表格是否loading
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            data:[],
            searchName:'', //列表查询条件
            isLoadingMoveTop: [],   // 置顶按钮是否loading
            isClickedSaveSort: false,   //是否点击了保存排序按钮
            columns: [
                {
                    name: '',
                    key: 'orderNum',
                    width: 60,
                    align: 'center',
                },
                {
                    title: this.$t('catalogIdCol'),
                    key: 'catalogId',
                    align: 'center',
                },
                {
                    title: this.$t('catalogNameCol'),
                    key: 'catalogName',
                    align: 'center',
                },{
                    title: this.$t('operateCol'),
                    key: 'operate',
                    align: 'center',
                    width: 300,
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
                                    this.moveTop(params.row.catalogId,params.index,2);
                                }
                            }
                        }, this.$t('moveTopBtn'));
                        if(this.data.length > params.index+1)
                        {
                            //过滤掉最后一页最后一条的下移
                            btns.push(moveDownBtn);
                        }
                        if(this.pageIndex != 1 || params.index != 0)
                        {
                            //过滤掉第一页并且是第一条数据的置顶
                            btns.push(moveTopBtn);
                        }
                        return h('div',btns);
                    }
                }
                
            ]

        };
    },
    created() {
        this.queryList();
    },
    computed: {

    },
    watch: {

    },
    methods: {

        search(){
            this.pageIndex = 1;
            this.pageSize = 10;
            this.queryList();
        },
        //查询列表
        queryList(){
            let url = '/market/portal/catalog/queryHomePageCatalogList';
            let ref = this;
            var params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingShowDetails = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var appList = res.data;
                        if(!!appList){
                            for(var i=0;i<appList.length;i++){
                                ref.data.push(appList[i]);
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        //js主页栏目顶置
        moveTop(id,index,type)
        {
            this.isLoadingMoveTop.splice(index,1,true);
            let url = '/market/portal/catalog/modifyMarketCatalogToTop';
            let ref = this;
            var params = {
               catalogId:id,
               noteType:2
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0')
                    {
                        ref.queryList();
                        ref.$Message.success(ref.$t('moveTopSuccess'));
                    }
                    ref.isLoadingMoveTop.splice(index,1,false);
                }
            );
        },
        moveDown(index)
        {
            var temp1 = this.data[index];
            var temp2 = this.data[index+1];
            temp1.orderNum=temp1.orderNum+1;
            temp2.orderNum=temp2.orderNum-1;
            this.data.splice(index,1,temp2);
            this.data.splice(index+1,1,temp1);
            
        },
        saveSort()
        {
            this.$Modal.confirm({
                title: this.$t('saveSortBtn'),
                content: '<p>'+this.$t('confirmSaveSort')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
            var ids = [];
            var orderNumsArray =[];
            for(var i=0;i<this.data.length;i++)
            {
                ids.push(this.data[i].catalogId);
                orderNumsArray.push(this.data[i].orderNum);
            }
            this.isClickedSaveSort = true;
            let url = '/market/portal/catalog/modifyMarketCatalogToMove';
            let ref = this;
            var params = {
                catalogIds: ids,
                orderNums:orderNumsArray,
                nodeType:2,
                catalogType:3,
            };
            this.$http.post(url, params).then(
                function(res)
                {
                    ref.$Modal.remove();
                    if(!!res && res.resultCode == '0')
                    {
                        
                        ref.queryList();
                        ref.$Message.success(ref.$t('savedSuccess'));
                    }
                    ref.isClickedSaveSort = false;
                }
            );

                }
            });
        },
    }
};
</script>