<template>
    <div>
       <Row>
           <Col span="24">
                <Card>
                    <div slot="title">
                         <Row>
                             <Col span="5">
                                <span class="span_space">{{$t('channelName')}}</span>
                                <Input class="theme_searchfield" :placeholder="$t('channelNamePlaceholder')" v-model="searchinfo.channelName"/>
                             </Col>
                             <Col span="5">
                                <span class="span_space">{{$t('channelid')}}</span>
                                <Input :placeholder="$t('channelIdPlaceholder')" class="theme_searchfield" v-model="searchinfo.channelId"/>
                             </Col>
                             <Col span="14">
                                  <div style="float:right;">
                                     <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
                                  </div>
                             </Col>
                         </Row>
                    </div>
                    <div class="">
                         <div class="btndiv">
                             <Button type="primary" @click="showadd()">
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

        <!-- 新增 -->
          <Modal
                  v-model="isShowAddOrEdit"
                  width="800px"
                  :title="isAdd?$t('addBtn'):$t('editBtn')">
                  <Card :bordered="false" dis-hover>
                      <Form ref="addoffer" :label-width="180">
                            <FormItem :label="$t('channel')" prop="" v-if="!isAdd">
                                <Input v-model="addinfo.channelId" disabled style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('channel')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('callBackCol')" prop="">
                                <Input v-model="addinfo.notifyUrl" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('callBackParameter')" prop="">
                                <Input v-model="addinfo.callback_params" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('message')" prop="">
                                <Input v-model="addinfo.response" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('keywordsforsuccess')" prop="">
                                <Input v-model="addinfo.successRespKey" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('themeMemo')" prop="">
                                <Input v-model="addinfo.remarks" style="width:500px" class="user_field"></Input>
                            </FormItem>
                      </Form>
                  </Card>
                  <!-- 自定义页脚内容 -->  
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
                     pageIndex:1,
                     pageSize:10,
                     total:0,
                     isAdd:false,//是否打开新增窗口
                     loadingTable:true, //表格是否在loading
                     isClickedAdd:false,//是否正在发送新增请求
                     isClickedEdit:false,//是否正在发送编辑请求
                     isShowAddOrEdit:false,//新增编辑窗口
                     addinfo:{
                         channelId:'',
                         channelName:'',
                         level:'',
                         notifyUrl:'',
                         callback_params:'',
                         response:'',
                         successRespKey:'',
                         remarks:''
                     },
                     searchinfo:{
                         channelName:'',
                         channelId:''
                     },
                     datalist:[
                         {
                         channelId:'1222222',
                         channelName:'1',
                         level:'1',
                         notifyUrl:'1',
                         callback_params:'1',
                         response:'1',
                         successRespKey:'1',
                         remarks:'1'
                         }
                     ],
                     columns:[
                         {
                             title:this.$t('channelId'),
                             key:'channelId',
                             minWidth:50,
                             align:'center'
                         },
                         {
                             title:this.$t('channelName'),
                             key:'channelName',
                             minWidth:50,
                             align:'center'
                         },
                         {
                             title:this.$t('callBackCol'),
                             key:'notifyUrl',
                             minWidth:150,
                             align:'center'
                         },
                         {
                             title:this.$t('callBackParameter'),
                             key:'callback_params',
                             minWidth:100,
                             align:'center'
                         },
                         {
                             title:this.$t('message'),
                             key:'response',
                             minWidth:50,
                             align:'center'
                         },
                         {
                             title:this.$t('keywordsforsuccess'),
                             key:'successRespKey',
                             minWidth:50,
                             align:'center'
                         },{
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
                                                 this.showedit(params.row.channelId)
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
                                                 this.remove(params.row.channelId)
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
                this.queryChannellist();
            },
            methods: {
                //改变页数
                changePageIndex(pageIndex){
                    this.pageIndex=pageIndex;
                    this.queryChannellist(); 
                },
                //改变分页大小
                changePageSize(pageSize){
                    console.log(pageSize);
                    this.pageSize=pageSize;
                    this.pageIndex=1;
                    this.queryChannellist();
                },
                
                //关闭新增窗口
                canceladd(){
                    this.isAdd=false;
                    this.isShowAddOrEdit=false;
                },
                //打开编辑窗口
                showedit(channelId){
                    this.initchannel();
                    this.isAdd=false;
                    this.isShowAddOrEdit=true;
                    let url='/channel/queryById';
                    let ref=this;
                    var params={
                        channelId:channelId
                    }
                    this.$http.post(url,params).then(res=>{
                        if(res&&res.resultCode=='0'){
                             ref.addinfo=res.data;
                        }
                    })

                },
                //保存编辑
                edit(){
                     let url='/channel/mod';
                     let ref=this;
                     isClickedEdit:true;
                     this.$http.post(url,ref.addinfo).then(res=>{
                         if(!!res&&res.resultCode=='0'){
                              ref.$Message.success(ref.$t('savedSuccess'));
                              ref.queryChannellist();
                              ref.isAdd = false;
                         }
                         isClickedEdit:false;
                     })
                     
                },
                //取消编辑
                canceledit(){
                    this.isShowAddOrEdit=false;
                },
                //打开新增窗口
                showadd(){
                    this.initchannel();
                    this.isAdd=true;
                    this.isShowAddOrEdit=true;
                },
                //删除
                remove(channelId){
                    let url='/channel/del';
                    let ref=this;
                    var params={
                        channelId:channelId
                    }
                    this.$http.post(url,params).then(res=>{
                        if(!!res&&res.resultCode=='0'){
                             ref.$Message.success(ref.$t('deletedSuccess'));
                             ref.queryChannellist();
                        }
                    })
                },
                  //新增保存
                add(){
                     let url='/channel/add';
                    let ref=this;
                    this.isClickedAdd=true;
                    var params={
                         channelId:this.addinfo.channelId,
                         channelName:this.addinfo.channelName,
                         level:this.addinfo.level,
                         notifyUrl:this.addinfo.notifyUrl,
                         callback_params:this.addinfo.callback_params,
                         response:this.addinfo.response,
                         successRespKey:this.addinfo.successRespKey,
                         remarks:this.addinfo.remarks
                    }
                    console.log(params)
                    this.$http.post(url,params).then(res=>{
                         if(!!res&&res.resultCode=='0'){
                              ref.isAdd=false;
                              ref.$Message.success(ref.$t('savedSuccess'));
                              ref.queryChannellist();
                         }
                         ref.isClickedAdd=false;
                    })
                },
                
                //查询渠道信息
                queryChannellist(){
                    let url='/channel/query';
                    let ref=this;
                    var params={
                        channelId:this.searchinfo.channelId,
                        channelName:this.searchinfo.channelName,
                        pageIndex:this.pageIndex,
                        pageSize:this.pageSize,
                        queryType:1
                    }
                    this.$http.post(url,params).then(res=>{
                         if(res&&res.resultCode=='0'){
                               this.datalist=res.data;
                               this.total=res.total;
                         }
                         ref.loadingTable=false;
                    })
                },
                //查询按钮
                search(){
                   this.queryChannellist();
                },
                //初始化输入框
                initchannel(){
                          this.addinfo.channelId='',
                          this.addinfo.channelName='',
                          this.addinfo.level='',
                          this.addinfo.notifyUrl='',
                          this.addinfo.callback_params='',
                          this.addinfo.response='',
                          this.addinfo.successRespKey='',
                          this.addinfo.remarks=''
                }
            },
    }
</script>

<style scoped lang='less'>
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
     .span_space{
		width: 60px;
        display: -webkit-inline-box;
    }
</style>