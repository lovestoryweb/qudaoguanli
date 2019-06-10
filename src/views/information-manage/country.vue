<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                         <div>
                             <Row>
                                <Col span="5">
                                    <span class="span_space">{{$t('country')}}</span>
                                    <Input class="theme_searchfield" :placeholder="$t('pleaseente')" v-model="searchinfo.countryName"/>
                                </Col>
                                <Col span="5">
                                    <span class="span_space">{{$t('acronym')}}</span>
                                    <Input class="theme_searchfield" :placeholder="$t('pleaseente')" v-model="searchinfo.countryAbbreviation"/>
                                </Col>
                                <Col span="5">
                                     <span class="span_space">{{$t('timezone')}}</span>
                                    <Input class="theme_searchfield" :placeholder="$t('pleaseente')" v-model="searchinfo.timeZone"/>
                                 </Col>
                                <Col span="9">
                                     <div style="float:right;">
                                        <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
                                    </div>
                                </Col>
                             </Row>
                         </div>
                    </div>
                    <div>
                        <div class="btndiv">
                            <Button type="primary" @click="showAdd()">
                                <Icon type="md-add"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                        </div>
                        <Table border :columns="columns" :data="datalist" :loading="loadingTable"></Table>
                        <Row>
                            <Page 
                             class-name="page" 
                            :total="total" 
                            :current="pageIndex" 
                            :page-size="pageSize"
                            :page-size-opts="[10,20,30,50]"
                            show-sizer
                            show-elevator
                            @on-change="changePageIndex"
                            @on-page-size-change="changePageSize"
                            />
                         </Row>
                    </div>
                </Card>
            </Col>
        </Row>


        <Modal
             width="800px"
             v-model="isShowAddOrEdit"
             :title="isAdd?$t('addBtn'):$t('editBtn')">
            <Card :bordered="false" dis-hover>
                    <Form ref="addoffer" :label-width="180">
                        <FormItem :label="$t('country')" prop="">
                            <Input v-model="addinfo.countryName" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('acronym')" prop="">
                            <Input v-model="addinfo.countryAbbreviation" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('englishname')" prop="">
                            <Input v-model="addinfo.englishName" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('areacode')" prop="">
                            <Input v-model="addinfo.telCode" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('timezone')" prop="">
                            <Input v-model="addinfo.timeZone" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('suggested')" prop="">
                            <Input v-model="addinfo.suggestPrice" style="width:500px" class="user_field"></Input>
                        </FormItem>
                    </Form>
            </Card>
            <div v-if="isAdd" slot="footer">
                <Button @click="canceladd()">{{$t('cancelBtn')}}</Button>
                <Button type="primary" @click="add()" :loading="isClickedAdd">{{$t('saveBtn')}}</Button>
            </div>
            <div v-else slot="footer">
                <Button @click="canceledit()">{{$t('cancelBtn')}}</Button>
                <Button type="primary" @click="edit()" :loading="isClickedEdit">{{$t('editBtn')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isAdd:false,
                isShowAddOrEdit:false,
                loadingTable:true, //表格是否在loading
                isClickedAdd:false,//是否正在发送新增请求
                isClickedEdit:false,//是否正在发送编辑请求
                pageIndex:1,
                pageSize:10,
                total:0,
                searchinfo:{
                    countryName:'',
                    countryAbbreviation:'',
                    timeZone:'',
                },
                datalist:[
                    {
                        countryId:'1',
                        countryAbbreviation:'2',
                        countryName:'3',
                        englishName:'3',
                        telCode:'3',
                        timeZone:'3',
                        suggestPrice:'3',
                        createTime:'3'
                    }
                ],
                addinfo:{
                    countryId:'',
                    countryAbbreviation:'',
                    countryName:'',
                    englishName:'',
                    telCode:'',
                    timeZone:'',
                    suggestPrice:''
                },
                columns:[
                    {
                        title:this.$t('country'),
                        key:'countryName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('acronym'),
                        key:'countryAbbreviation',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('englishname'),
                        key:'englishName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('areacode'),
                        key:'telCode',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('timezone'),
                        key:'timeZone',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('suggested'),
                        key:'suggestPrice',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('versionCraeatTime'),
                        key:'createTime',
                        align:'center',
                        minWidth:50
                    },
                    {
                             title:this.$t('operateCol'),
                             minWidth:100,
                             align:'center',
                             render:(h,params)=>{
                                 return h('div', [
                                     h('Icon', {
                                        props: {
                                            custom:'_icon3',
                                            size:'20'
                                        },
                                        style: {
                                            marginRight: '10px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                 this.showedit(params.row.countryId)
                                            }
                                        }
                                    }, ''),
                                     h('Icon', {
                                        props: {
                                            custom:'_icon6',
                                            size:'20'
                                        },
                                        style: {
                                            marginRight: '10px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                 this.remove(params.row.countryId)
                                            }
                                        }
                                    }, ''),
                            ],);
                             }
                         }
                ]
            }
        },
        created(){
            this.querycountry();
        },
        methods: {
            querycountry(){
                let url='/country/query';
                let ref=this;
                var params={
                    countryName:this.searchinfo.countryName,
                    countryAbbreviation:this.searchinfo.countryAbbreviation,
                    timeZone:this.searchinfo.timeZone,
                    queryType:1,
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                         ref.datalist=res.data;
                         ref.total=total;
                    }
                    ref.loadingTable=false;
                })
            },
            search() {
                this.querycountry();
            },
            showAdd(){
                this.initcountry();
                this.isShowAddOrEdit=true;
                this.isAdd=true;
            },
            canceladd(){
                this.isAdd=false;
                this.isShowAddOrEdit=false;
            },
            add(){
                let url='/country/add';
                let ref=this;
                this.isClickedAdd=true;
                this.$http.post(url,ref.addinfo).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.isShowAddOrEdit=false;
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.querycountry();
                    }
                    ref.isClickedAdd=false;
                })
            },
            showedit(countryId){
                this.initcountry();
                this.isAdd=false;
                this.isShowAddOrEdit=true;
                let url='/country/queryById';
                let ref=this;
                var params={
                    countryId:countryId
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.addinfo=res.data;
                    }
                })
            },
            canceledit(){
                this.isShowAddOrEdit=false;
            },
            edit(){
                let url='/country/mod';
                isClickedEdit:true;
                let ref=this;
                this.$http.post(url,ref.addinfo).then(res=>{
                    if(!!res&&res.resultCode=='0'){
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.querycountry();
                        ref.isShowAddOrEdit = false;
                    }
                    isClickedEdit=false;
                })
            },
            remove(countryId){
                    let url='/country/del';
                    let ref=this;
                    var params={
                        countryId:countryId
                    }
                    this.$http.post(url,params).then(res=>{
                        if(!!res&&res.resultCode=='0'){
                             ref.$Message.success(ref.$t('deletedSuccess'));
                             ref.querycountry();
                        }
                    })
            },
            changePageIndex(pageIndex){
                    this.pageIndex=pageIndex;
                    this.querycountry(); 
            },
                //改变分页大小
            changePageSize(pageSize){
                    console.log(pageSize);
                    this.pageSize=pageSize;
                    this.pageIndex=1;
                    this.querycountry();
            },
            initcountry(){
                this.addinfo.countryId='',
                this.addinfo.countryAbbreviation='',
                this.addinfo.countryName='',
                this.addinfo.englishName='',
                this.addinfo.telCode='',
                this.addinfo.timeZone='',
                this.addinfo.suggestPrice=''
            }

        }
    }
</script>

<style scoped lang='less'>
     .span_space{
		width: 60px;
        display: -webkit-inline-box;
    }
    .theme_searchfield {
        width: 200px!important;
        margin-right: 5%;
    }
    .btndiv{
         margin-bottom:20px;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
</style>