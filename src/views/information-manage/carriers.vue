<template>
    <div>
         <Row>
             <Col span="24">
                 <Card>
                     <div slot="title">
                        <div>
                            <Row>
                                <Col span="5">
                                    <span class="span_space">{{$t('carriers')}}</span>
                                     <Input class="theme_searchfield" :placeholder="$t('channelNamePlaceholder')" v-model="searchinfo.serviceName"/>
                                </Col>
                                <Col offset="14" span="5">
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
                        <Table border :columns="columns" :data="datalist" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page 
                            class-name="page" 
                            :current="1" 
                            :total="total" 
                            @on-change=""  
                            show-sizer
                          show-elevator></Page>
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
                <Form ref="" :label-width="180">
                    <FormItem :label="$t('carriers')" prop="">
                        <Input v-model="addinfo.serviceName" style="width:500px" class="user_field"></Input>
                    </FormItem>
                     <FormItem :label="$t('themeMemo')" prop="">
                        <Input v-model="addinfo.remarks" type="textarea" style="width:500px" class="user_field"></Input>
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
                searchinfo:{
                     serviceName:''
                },
                datalist:[
                    {
                        serviceId:'1',
                        serviceCode:'1',
                        serviceName:'2',
                        remarks:'2',
                        createTime:'2'
                    }
                ],
                addinfo:{
                     serviceId:'',
                     serviceCode:'',
                     serviceName:'',
                     remarks:''
                },
                pageIndex:1,
                pageSize:10,
                total:0,
                loadingTable:true, //表格是否在loading
                isClickedAdd:false,//是否正在发送新增请求
                isClickedEdit:false,//是否正在发送编辑请求
                columns:[
                    {
                         title:this.$t('carrierid'),
                         key:'serviceId',
                         align:'center',
                         minWidth:50
                    },
                    {
                         title:this.$t('carriername'),
                         key:'serviceName',
                         align:'center',
                         minWidth:50
                    },
                    {
                         title:this.$t('themeMemo'),
                         key:'remarks',
                         align:'center',
                         minWidth:50
                     },
                    {
                         title:this.$t('themeCreateTime'),
                         key:'createTime',
                         align:'center',
                         minWidth:50
                    },
                    {
                         title:this.$t('operateCol'),
                         align:'center',
                         minWidth:50,
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
                                             this.showEdit(params.row.serviceId)
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
                                             this.remove(params.row.serviceId)
                                        }
                                    }
                                }, ''),
                            ],);
                         }
                    }
                     
                 ],
             }
         },
         created(){
             this.querycarriers();
         },
         methods: {
            showAdd(){
                this.initcarriesr();
                this.isShowAddOrEdit=true;
                this.isAdd=true;
            },
            canceladd(){
                this.isAdd=false;
                this.isShowAddOrEdit=false;
            },
            add(){
                let url='/serviceManage/add';
                let ref=this;
                this.isClickedAdd=true;
                this.$http.post(url,ref.addinfo).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.isShowAddOrEdit=false;
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.querycarriers();
                    }
                    ref.isClickedAdd=false;
                })
            },
            showEdit(serviceId){
                this.initcarriesr();
                this.isAdd=false;
                this.isShowAddOrEdit=true;
                let url='/serviceManage/queryById';
                let ref=this;
                var params={
                    serviceId:serviceId
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
                let url='/serviceManage/mod';
                isClickedEdit:true;
                let ref=this;
               
                this.$http.post(url,ref.addinfo).then(res=>{
                    if(!!res&&res.resultCode=='0'){
                        ref.$Message.success(ref.$t('savedSuccess'));
                        ref.querycarriers();
                        ref.isShowAddOrEdit = false;
                    }
                })
            },
            remove(serviceId){
                this.$Modal.confirm({
                     title: this.$t('deleteConfirmationTitle'),
                     content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                     loading: true,
                     okText: this.$t('confirmBtn'),
                     cancelText: this.$t('cancelBtn'),
                     onOk: () => {
                        let url='/serviceManage/del';
                        let ref=this;
                        var params={
                            serviceId:serviceId
                        }
                        this.$http.post(url,params).then(res=>{
                            if(!!res&&res.resultCode=='0'){
                                 ref.$Message.success(ref.$t('deletedSuccess'));
                                 ref.querycarriers();
                            }
                        })
                     }
                })
            },
            querycarriers(){
                let url='/serviceManage/query';
                let ref=this;
                var params={
                    serviceName:this.searchinfo.serviceName,
                    queryType:1,
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.datalist=res.data;
                        ref.total=res.total;
                    }
                    ref.loadingTable=false;
                })
            },
            search() {
                this.querycarriers();
            },
            initcarriesr(){
                this.addinfo.serviceId='',
                this.addinfo.serviceCode='',
                this.addinfo.serviceName='',
                this.addinfo.remarks=''
            }
         },
    }
</script>

<style scoped lang='less'>
     .btndiv{
         margin-bottom:20px;
    }
    .theme_searchfield {
        width: 200px!important;
        margin-right: 5%;
    }
    .page {
        float: right;
        margin-top: 10px;
    }
    .user_field {
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
    .addspan{
        display: inline;
        cursor: pointer;
    }
     .span_space{
		width: 60px;
        display: -webkit-inline-box;
    }
</style>