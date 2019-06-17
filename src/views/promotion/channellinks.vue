<!-- 页面问题
    1.table的channel-key  后台参数不完善
    2.查询条件后台参数不完善
-->
<template>
    <div>
       <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                            <div class="lineh">
                                <span class="span_space">{{$t('channels')}}</span>
                                <Select v-model="searchinfo.channelId" class="theme_searchfield" :placeholder="$t('selectPlaceholder')" >
                                    <Option v-for="item in channellist" :value="item.channelId" :key="item.channelName">{{item.channelName}}</Option>
                                </Select>
                                <span class="span_space">{{$t('carriers')}}</span>
                                <Select v-model="searchinfo.service" class="theme_searchfield">
                                    <Option v-for="item in carrierslist" :value="item.serviceName" :key="item.serviceName">{{ item.serviceName}}</Option>
                                </Select>
                                <span class="span_space">{{$t('application')}}</span>
                                <Select v-model="searchinfo.appName" class="theme_searchfield">
                                    <Option v-for="item in applicationlist" :value="item.appName" :key="item.appName">{{ item.appName }}</Option>
                                </Select>
                                <span class="span_space">{{$t('platform')}}</span>
                                 <Select v-model="searchinfo.platform_id" class="theme_searchfield">
                                    <Option v-for="item in platformlist" :value="item.id" :key="item.id">{{ item.platform }}</Option>
                                </Select>
                            </div>
                         <div style="float:right;">
                             <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
                         </div>
                          <div>
                             <span class="span_space">{{$t('country')}}</span>
                              <Select v-model="searchinfo.countryName" class="theme_searchfield":placeholder="$t('selectPlaceholder')">
                                 <Option v-for="item in countrylist" :value="item.countryName" :key="item.countryName">{{item.countryName}}</Option>
                              </Select>
                             <span class="span_space">{{$t('linkswitch')}}</span>
                              <Select v-model="searchinfo.linkstatus" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in linkstatuslist" :value="item.id" :key="item.id">{{item.value}}</Option>
                             </Select>
                               <span class="span_space">{{$t('optimizationswitch')}}</span>
                              <Select v-model="searchinfo.optimizationstatus" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in optimizationstatuslist" :value="item.id" :key="item.value">{{item.value}}</Option>
                             </Select>
                         </div>
                    </div>
                    <div>
                        <div class="btndiv">
                            <Button type="primary" @click="showAdd()">
                                <Icon type="md-add"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                        </div>
                        <Table border :columns="columns1" :data="datalist" :no-data-text="$t('noResult')" :loading="loadingTable"></Table>
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
        <!-- 新增渠道链接 -->
        <Modal
             v-model="isShowAddOrEdit"
             width="800px"
             :title="isAdd?$t('addchannellink'):$t('editchannellink')">
              <Card :bordered="false" dis-hover :class="isopen?'':'dscard'">
                 <Form ref="addoffer" :label-width="180" :model="addinfo" :rules="ruleadd">
                     <FormItem :label="$t('offername')" prop="">
                          <Select v-model="addinfo.offerName" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in offernamelist" :value="item.offerName" :key="item.platform_id">{{item.offerName}}</Option>
                           </Select>
                     </FormItem>
                     <FormItem :label="$t('channels')" prop="">
                          <Select v-model="addinfo.channelId" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in channellist" :value="item.channelId" :key="item.channelName">{{item.channelName}}</Option>
                           </Select>
                     </FormItem>
                      <FormItem :label="$t('unitprice')" prop="">
                            <Input v-model="addinfo.price" style="width:500px" class="user_field"></Input>
                     </FormItem>
                     <FormItem label="PO" prop="">
                            <Input v-model="addinfo.po" style="width:500px" class="user_field" placeholder="转化/日"></Input>
                     </FormItem>
                      <FormItem :label="$t('linkstatus')" prop="">
                            <!-- <i-switch v-model="addinfo.cpStatus" true-value="0" false-value="1" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch> -->
                            <RadioGroup v-model="addinfo.urlValid">
                                    <Radio v-for="item in islinkstatuslist" :label="item.value" :key="item.value"><span>{{item.label}}</span></Radio>
                            </RadioGroup>
                      </FormItem>
                      <div @click="onmore" class="more">
                           <span>编辑优化</span>
                      </div>
                      <FormItem :label="$t('type')">
                           <RadioGroup v-model="addinfo.deductType">
                                    <Radio v-for="item in istypelist" :label="item.value" :key="item.value"><span>{{item.label}}</span></Radio>
                            </RadioGroup>
                      </FormItem>
                      <FormItem v-if="addinfo.deductType===0||addinfo.deductType===2" :label="$t('restrictivecapratio')" >
                            <Input v-model="addinfo.ratioFixed" style="width:500px" class="user_field"></Input>
                      </FormItem>
                      <FormItem v-if="addinfo.deductType===1||addinfo.deductType===2" :label="$t('opencapratio')">
                            <Input v-model="addinfo.ratioOpen" style="width:500px" class="user_field"></Input>
                      </FormItem>
                      <FormItem v-if="addinfo.deductType===2" :label="$t('conversion')">
                           <Input v-model="addinfo.convRatio" style="width:500px" class="user_field"></Input>
                      </FormItem>
                      <FormItem :label="$t('islinkop')">
                          <RadioGroup v-model="addinfo.deductValid">
                                <Radio v-for="item in islinkoplist" :label="item.value" :key="item.value"><span>{{item.label}}</span></Radio>
                          </RadioGroup>
                      </FormItem>

                 </Form>
             </Card>
             <!-- 自定义页脚内容 -->  
            <div v-if="isAdd" slot="footer">
                 <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
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
                   isShowAddOrEdit:false,
                   isAdd:false,
                   isAddOptimization:false,
                   isopen:false,//是否展开新增多余列表
                   isClickedAdd:false,//是否正在新增保存
                   isClickedEdit:false,//是否正在编辑
                    loadingTable:true, //表格是否在loading
                    countrylist:[],//国家查询列表
                    offernamelist:[],//offer查询列表
                    carrierslist:[],//运营商查询列表
                    applicationlist:[],//应用查询列表
                    channellist:[],//渠道查询列表
                   total:0,
                   pageIndex:1,
                   pageSize:10,
                //    查询信息
                   searchinfo:{
                        channelId:'',
                        service:'',
                        appName:'',
                        platform_id:'',
                        countryName:'',

                        linkstatus:'',
                        optimizationstatus:''
                   },
                   addinfo:{
                    country:'',
                    service:'',
                    appName:'',
                    platform_id:'',
                    offerName:'',
                    channelId:'',
                    price:'',
                    originalUrl:'',
                    promotionalUrl:'',
                    urlValid:'',
                    deductType:'',
                    po:'',
                    ratioFixed:'',
                    ratioOpen:'',
                    convRatio:'',
                    deductValid:''
                  },
                  datalist:[
                      {
                         country:'1',
                         service:'1',
                         appName:'1',
                         platform_id:'1',
                         offerName:'1',
                         channelId:'1',
                         price:'1',
                         originalUrl:'1',
                         promotionalUrl:'1',
                         urlValid:'1',
                         deductType:'1',
                         po:'1',
                         ratioFixed:'1',
                         ratioOpen:'1',
                         convRatio:'1',
                         deductValid:'1',
                         promotionId:'1'
                      }
                  ],
                  platformlist:[//平台
                    {
                        id:1,
                        platform:'intouch'
                    },
                    {   
                        id:2,
                        platform:'opticks'
                    }
                ],
                //新增框类型单选
                istypelist:[
                    {
                        value:0,
                        label:'固定比例',
                    },
                    {
                        value:1,
                        label:'开放'
                    },
                    {
                        value:2,
                        label:'限制'
                    }
                ],
                // 下拉条
                linkstatuslist:[
                    {
                        id:1,
                        value:'开启'
                    },
                    {
                        id:0,
                        value:'关闭'
                    }
                ],
                //是否开启
                 islinkstatuslist: [
                     {
                       label: '是',
                       value: '1'
                     }, {
                       label: '否',
                       value: '0'
                     }
                ],
                 islinkoplist: [
                     {
                       label: '是',
                       value: '1'
                     }, {
                       label: '否',
                       value: '0'
                     }
                ],

                // 下拉条
                optimizationstatuslist:[
                    {
                        id:1,
                        value:'开启'
                    },
                    {
                        id:0,
                        value:'关闭'
                    }
                ],
                  columns1:[
                     {
                        title:this.$t('channelid'),
                        key:"channelId",
                        minWidth: 100,
                        align: 'center',
                    },
                    {
                        title:this.$t('channels'),
                        key:"id1",
                        minWidth: 150,
                        align: 'center',
                       
                    },
                     {
                        title:this.$t('offername'),
                        key:"offerName",
                        minWidth: 200,
                        align: 'center',
                        
                    },
                    {
                        title:this.$t('copylink'),
                        minWidth:100,
                        align:'center',
                        render:(h,params)=>{
                            return h('Icon',{
                                props:{
                                    custom:'_iconcopy',
                                    size:20
                                    
                                },
                                style:{
                                     cursor: 'pointer'
                                },
                                on:{
                                    click:()=>{
                                        this.copyCode(params.row.promotionalUrl);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title:this.$t('unitprice'),
                        key:"price",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:'Cap',
                        key:"id6",
                        minWidth: 100,
                        align: 'center',
                       
                    },
                    {
                        title:this.$t('postback'),
                        key:"id7",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:this.$t('restrictivecapratio'),
                        key:'ratioFixed',
                        minWidth:100,
                        align:'center'
                    },
                    {
                        title:this.$t('opencapratio'),
                        key:'ratioOpen',
                        minWidth:100,
                        align:'center'
                    },
                     {
                        title:this.$t('conversion'),
                        key:"convRatio",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:this.$t('linkstatus'),
                        key:'urlValid',
                        minWidth:100,
                        align:'center',
                        render:(h,params)=>{
                            if(params.row.urlValid==0){
                                return h('span',{},'关闭')
                            }if(params.row.urlValid==1){
                                return h('span',{},'开启')
                            }
                        }
                    },
                    // {
                    //     title:this.$t('originallink'),
                    //     key:"id4",
                    //     minWidth: 250,
                    //     align: 'center',
                        
                    // },
                    // {
                    //     title:this.$t('linkswitch'),
                    //     key:'old',
                    //     minWidth: 150,
                    //     align: 'center',
                    //     render: (h, params) => {  // 重点
                    //     return h('i-switch', {  //按钮的话是：button自行替换
                    //          props: {  //这里可以设置它的属性
                    //             value:this.isonoff,     //设置它的值比如：true或false
                    //           },
                    //           on: { //操作事件
                    //              'on-change':(value)=>{
                    //                  console.log(value);
                    //                  this.isonoff=value;
                    //              }
                    //           }
                    //     })
                    //   }
                    // },
                    // {
                    //     title:this.$t('ratio'),
                    //     key:"id8",
                    //     minWidth: 100,
                    //     align: 'center',
                        
                    // },
                    // {
                    //     title:this.$t('conversion'),
                    //     key:"id8",
                    //     minWidth: 100,
                    //     align: 'center',
                        
                    // },
                    //  {
                    //     title:this.$t('optimizationswitch'),
                    //     key:'old',
                    //     minWidth: 150,
                    //     align: 'center',
                    //     render: (h, params) => {  // 重点
                    //     return h('i-switch', {  //按钮的话是：button自行替换
                    //          props: {  //这里可以设置它的属性
                    //             value:this.isonoff,     //设置它的值比如：true或false
                    //           },
                    //           on: { //操作事件
                    //              'on-change':(value)=>{
                    //                  alert("11111")
                    //                  console.log(value);
                    //                  this.isonoff=value;
                    //              }
                    //           }
                    //     })
                    //   }
                    // },
                    {
                        title:this.$t('optimizationstatus'),
                        key:'deductValid',
                        minWidth:100,
                        align:'center',
                        render:(h,params)=>{
                            if(params.row.deductValid==0){
                                return h('span',{},'关闭')
                            }
                            if(params.row.deductValid==1){
                                return h('span',{},'开启')
                            }
                        }
                    },
                    {
                        title:this.$t('offerlink'),
                        key:'originalUrl',
                        minWidth:100,
                        align:'center'
                    },
                    {
                        title:this.$t('promotionlink'),
                        key:'promotionalUrl',
                        minWidth:100,
                        align:'center'
                    },
                     {
                        title: this.$t('operateCol'),
                        key: 'action',
                        minWidth: 150,
                        align: 'center',
                        fixed:'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        custom:'_icon3',
                                        size:'20'
                                    },
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        color:'#239FED'
                                    },
                                    on: {
                                        click: () => {
                                             this.showEdit(params.row.promotionId)
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
                                        cursor: 'pointer',
                                        color:'#ff4401'
                                    },
                                    on: {
                                        click: () => {
                                             this.remove(params.row.promotionId)
                                        }
                                    }
                                }, ''),
                            ],);
                        }
                    }
                  ],
                  ruleadd:{
                    country:[
                        { required: true,message:this.$t('addcountryWarning'),trigger: 'change' }
                    ],
                    operator:[
                        {required:true,message:this.$t('addoperatorWarning'),trigger: 'change'}
                    ],
                    application:[
                        {required:true,message:this.$t('addapplicationWarning'),trigger:'change'}
                    ],
                    platform:[
                        {required:true,message:this.$t('addplatformWarning'),trigger:'change'}
                    ],
                    originallink:[
                        {required:true,message:this.$t('addoriginallink'),trigger:'blur'}
                    ]
                },
             }
         },
         methods: {
             showAdd(){
                this.isShowAddOrEdit=true;
                this.isAdd=true;
                this.initchannellink();
             },
             cancelAdd(){
                 this.isShowAddOrEdit=false;
                 this.isAdd=false;
             },
             add(){
                let url='/api/urlManage/add';
                let ref=this;
                this.isClickedAdd=true;
                var params = {
                    country:this.addinfo.country,
                    service:this.addinfo.service,
                    app:this.addinfo.appName,
                    platform:this.addinfo.platform_id,
                    offerName:this.addinfo.offerName,
                    channelId:this.addinfo.channelId,
                    price:this.addinfo.price,
                    originalUrl:this.addinfo.originalUrl,
                    promotionalUrl:this.addinfo.promotionalUrl,
                    urlValid:this.addinfo.urlValid,
                    deductType:this.addinfo.deductType,
                    po:this.addinfo.po,
                    ratioFixed:this.addinfo.ratioFixed,
                    ratioOpen:this.addinfo.ratioOpen,
                    convRatio:this.addinfo.convRatio,
                    deductValid:this.addinfo.deductValid
                };
                this.$http.post(url,params).then(res=>{
                    if(!!res&&res.resultCode=='0'){
                         ref.isAdd=false;
                         ref.isShowAddOrEdit=false;
                         ref.$Message.success(ref.$t('savedSuccess'));
                         ref.querylinkslist();
                    }
                    ref.isClickedAdd=false;
                })
             },
             search(){
                 this.querylinkslist();
             },
             changePageIndex(pageIndex){
                 this.pageIndex=pageIndex;
                 this.querylinkslist();
             },
             changePageSize(pageSize){
                 this.pageSize=pageSize;
                 this.pageIndex=1;
                 this.querylinkslist();
             },
             removeOffer(){
                  this.$Modal.confirm({
                    title: this.$t('deleteConfirmationTitle'),
                    content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                    loading: true,
                    okText: this.$t('confirmBtn'),
                    cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                        let url = '';
                        let ref = this;
                        
                        this.$http.post(url, params).then(res=>{
                            if(res&&res.resultCode=='0'){

                            }
                        });
                    }
                });
             },
             //打开编辑
             showEdit(promotionId){
                 this.initchannellink();
                 this.isShowAddOrEdit=true;
                 let url='/api/urlManage/queryById';
                 let ref=this;
                 var params={
                     promotionId:promotionId
                 }
                 this.$http.post(url,params).then(res=>{
                     if(res&&res.resultCode=='0'){
                         ref.addinfo=res.data;
                     }
                 })
             },
             //关闭新增优化
             canceledit(){
                 this.isShowAddOrEdit=false;
             },
             //编辑
             edit(){
                 this.isClickedEdit=true;
                 let url='/api/urlManage/mod';
                 let ref=this;
                 var params={
                     
                 }
                 this.$http.post(url,ref.addinfo).then(res=>{
                     if(!!res&&res.resultCode=='0'){
                          ref.$Message.success(ref.$t('savedSuccess'));
                          ref.isShowAddOrEdit=false;
                          ref.querylinkslist();
                     }
                 })

             },
             //删除
             remove(promotionId){
                  this.$Modal.confirm({
                             title: this.$t('deleteConfirmationTitle'),
                             content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                             loading: true,
                             okText: this.$t('confirmBtn'),
                             cancelText: this.$t('cancelBtn'),
                             onOk: () => {
                                let url='/api/urlManage/del';
                                let ref=this;
                                var params={
                                    promotionId:promotionId
                                }
                                this.$http.post(url,params).then(res=>{
                                    ref.$Modal.remove();
                                    if(!!res&&res.resultCode=='0'){
                                        ref.$Message.success(ref.$t('deletedSuccess'));
                                        ref.querylinkslist();
                                    }
                                })
                             }
                    });
             },



            //   channelId:'',
            //             service:'',
            //             appName:'',
            //             platform_id:'',
            //             countryName:'',

            //             linkstatus:'',
            //             optimizationstatus:''
             //查询默认链接配置数据
             querylinkslist(){
                let url='/api/urlManage/query';
                let ref=this;
                var params={
                    country:this.searchinfo.countryName,
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize,
                    queryType:1,
                    platform_id:this.searchinfo.platform_id,
                    channelId:this.searchinfo.channelId
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.datalist=res.data;
                        ref.total=res.total;
                    }
                    ref.loadingTable=false;
                })
             },
             //查询国家
             querycountrylist(){
                 let url='/api/country/query';
                 let ref=this;
                 var params={
                     queryType:0
                 }
                 this.$http.post(url,params).then(res=>{
                     if(res&&res.resultCode=='0'){
                          ref.countrylist=res.data;
                     }
                 })
            },
            //查询运营商
            querycarrierslist(){
                let url='/api/serviceManage/query';
                let ref=this;
                var params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.carrierslist=res.data;
                    }
                })
            },
            //查询应用
            queryapplist(){
                let url='/api/app/query';
                let ref=this;
                var params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                     if(res&&res.resultCode=='0'){
                         ref.applicationlist=res.data;
                     }    
                })
            },
            //查询渠道
            querychannellist(){
                let url='/api/channel/query';
                let ref=this;
                var params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.channellist=res.data;
                    }
                })
            },
            //查询offier列表
            queryoffernamelist(){
                let url='/api/offer/query';
                let ref=this;
                var params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.offernamelist=res.data
                    }
                })
            },
            onmore(){
                this.isopen=!this.isopen;
            },
            initchannellink(){
                this.addinfo.country='',
                this.addinfo.service='',
                this.addinfo.appName='',
                this.addinfo.platform_id='',
                this.addinfo.offerName='',
                this.addinfo.channelId='',
                this.addinfo.price='',
                this.addinfo.originalUrl='',
                this.addinfo.promotionalUrl='',
                this.addinfo.urlValid='',
                this.addinfo.deductType='',
                this.addinfo.po='',
                this.addinfo.ratioFixed='',
                this.addinfo.ratioOpen='',
                this.addinfo.convRatio='',
                this.addinfo.deductValid=''
            },
            copyCode(promotionalUrl){
                this.$copyText(promotionalUrl).then(
		        res => {
		          this.$Message.info(this.$t('copysuccess'));
		        }
		      )
            }
         },
         created(){
             this.querylinkslist();
             this.querycountrylist();
             this.querycarrierslist();
             this.queryapplist();
             this.querychannellist();
             this.queryoffernamelist();
         }
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
    .user_field {
        // margin: .5em 5em 0 .5em;    
    }
     .span_space{
		width: 60px;
        display: -webkit-inline-box;
    }
    .lineh{
        margin-bottom: 20px;
    }
    .more{
        text-align:center;
        line-height:60px;
        height: 60px;
    }
    .more::after{

    }
    .dscard{
        height: 350px;
        overflow:hidden;
        cursor: pointer;
    }
</style>