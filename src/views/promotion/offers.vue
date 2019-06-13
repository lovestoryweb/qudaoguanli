<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                         <span class="span_space">{{$t('country')}}</span>
                         <Select v-model="searchinfo.countryName" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                            <Option v-for="item in countrylist" :value="item.countryName" :key="item.countryName">{{item.countryName}}</Option>
                         </Select>
                        <span class="span_space">{{$t('carriers')}}</span>
                         <Select v-model="searchinfo.serviceName" class="theme_searchfield">
                            <Option v-for="item in carrierslist" :value="item.serviceName" :key="item.serviceName">{{ item.serviceName}}</Option>
                        </Select>
                        <span class="span_space">{{$t('application')}}</span>
                         <Select v-model="searchinfo.appName" class="theme_searchfield">
                            <Option v-for="item in applicationlist" :value="item.appName" :key="item.appName">{{ item.appName }}</Option>
                        </Select>
                        <span class="span_space">{{$t('platform')}}</span>
                         <Select v-model="searchinfo.platform" class="theme_searchfield">
                            <Option v-for="item in platformlist" :value="item.id" :key="item.id">{{ item.platform }}</Option>
                        </Select>
                        <div style="float:right;">
                            <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
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
        <!-- 新增/编辑 -->
        <Modal
            v-model="isShowAddOrEdit"
            width="800px"
            :title="isShowAdd?$t('addBtn'):$t('editBtn')">
                  <Card :bordered="false" dis-hover>
                      <Form ref="addoffer" :label-width="180" :model="addinfo" :rules="ruleadd">
                          <FormItem :label="$t('country')" prop="country">
                               <Select v-model="addinfo.countryName" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in countrylist" :value="item.countryName" :key="item.countryName">{{item.countryName}}</Option>
                                </Select>
                          </FormItem>
                           <FormItem :label="$t('carriers')" prop="operator">
                               <Select v-model="addinfo.serviceName" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in carrierslist" :value="item.serviceName" :key="item.serviceName">{{item.serviceName}}</Option>
                                </Select>
                                <span @click="tocarriers" class="addspan"><Icon type="md-add-circle" size="20"/></span>
                          </FormItem>
                           <FormItem :label="$t('application')" prop="application">
                                <Select v-model="addinfo.appName" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in applicationlist" :value="item.appName" :key="item.appName">{{item.appName}}</Option>
                                </Select>
                                <span @click="tocarriers" class="addspan"><Icon type="md-add-circle" size="20"/></span>
                          </FormItem>
                           <FormItem :label="$t('platform')" prop="platform">
                              <Select v-model="addinfo.platform" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in platformlist" :value="item.platform" :key="item.id">{{item.platform}}</Option>
                                </Select>
                          </FormItem>
                           <FormItem :label="$t('promotiontype')">
                               <Select v-model="addinfo.promotiontype" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in flowlist" :value="item.id" :key="item.id">{{item.flow}}</Option>
                                </Select>
                          </FormItem>
                           <FormItem :label="$t('originallink')" prop="originallink">
                               <Input v-model="addinfo.originallink" style="width:500px" class="user_field" :placeholder="$t('pleaseente')"></Input>
                          </FormItem>
                          <FormItem :label="$t('captype')">
                               <Select v-model="addinfo.captype" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in captypelist" :value="item.id" :key="item.id">{{item.captype}}</Option>
                                </Select>
                          </FormItem>
                          <FormItem :label="$t('capnumber')">
                               <Input v-model="addinfo.capnumber" style="width:500px" class="user_field" :placeholder="$t('pleaseente')"></Input>
                          </FormItem>
                          <FormItem :label="$t('userEnableCol')">
                                {{aaaaaa}}
                                <RadioGroup @on-change="onchange">
                                    <Radio v-for="item in userEnableCol" :label="item.id" :key="item.id">{{item.value}}</Radio>
                                </RadioGroup>
                          </FormItem>
                      </Form>
                </Card>
                  <!-- 自定义页脚内容 -->  
                 <div v-if="isShowAdd" slot="footer">
                      <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                      <Button type="primary" @click="add()" :loading="isClickedAdd">{{$t('saveBtn')}}</Button>
                 </div>
                  <div v-else slot="footer">
                      <Button @click="cancelEdit()">{{$t('cancelBtn')}}</Button>
                      <Button type="primary" @click="edit()" :loading="isClickedEdit">{{$t('editBtn')}}</Button>
                 </div>
      </Modal>
      
    </div>
</template>

<script>
    export default {
        created(){

        },
        data() {
            return {
                aaaaaa:'',
                total:0,
                pageIndex:1,
                pageSize:10,
                loadingTable:true,
                isClickedAdd:false,
                isClickedEdit:false,
                addinfo:{
                    countryName:'',
                    serviceName:'',
                    appName:'',
                    platform:'',
                    promotiontype:'',
                    originallink:'',
                    captype:'',
                    capnumber:''
                },
                //查询信息
                searchinfo:{
                    countryName:'',
                    serviceName:'',
                    appName:'',
                    platform:''
                },
                countrylist:[],//国家查询列表
                carrierslist:[],//运营商查询列表
                applicationlist:[],//应用查询列表
                
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
                flowlist:[
                    {
                        id:0,
                        flow:'pin码'
                    },
                    {
                        id:1,
                        flow:'one click flow'
                    },
                    {
                        id:2,
                        flow:'two click flow'
                    }
                ],
                captypelist:[
                    {
                        id:0,
                        captype:'open cap'
                    },
                    {
                        id:1,
                        captype:'Limit cap'
                    }
                ],
                userEnableCol:[
                    {
                        key:0,
                        value:this.$t('Yes')
                    },
                    {
                        key:1,
                        value:this.$t('No')
                    }
                ],
                //规则
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
                isShowAddOrEdit:false,
                isonoff:false,
                isShowAdd:false,
                //表格数据
                datalist:[
                    {
                        offerName:'1',
                        flow:1,
                        original_url:'1',
                        capType:1,
                        totalCap:150,
                        offerId:1,
                        linkstatus:1
                    }
                ],
                columns1: [
                    {
                        title: this.$t('offername'),
                        key:"offerName",
                        minWidth: 100,
                        align: 'center',
                    },
                     {
                        title:this.$t('promotiontype'),
                        key:"flow",
                        minWidth: 150,
                        align: 'center',
                        render:(h,params)=>{
                            if(params.row.flow==0){
                                return h('span','pin码')
                            }
                            if(params.row.flow==1){
                                return h('span','one click flow')
                            }
                            if(params.row.flow==2){
                                return h('span','two click flow')
                            }
                        }
                    },
                    {
                        title:this.$t('originallink'),
                        key:"original_url",
                        minWidth: 150,
                        align: 'center',
                    },
                    {
                        title:this.$t('captype'),
                        key:'capType',
                        minWidth: 150,
                        align: 'center',
                        render:(h,params)=>{
                            if(params.row.capType==0){
                                return h('span','open cap')
                            }
                            if(params.row.capType==1){
                                return h('span','Limit cap')
                            }
                        }
                    },
                    {
                        title:this.$t('capnumber'),
                        key:'totalCap',
                        minWidth: 150,
                        align: 'center',
                    },
                    {
                        title:this.$t('linkstatus'),
                        key:'linkstatus',
                        minWidth:100,
                        align:'center',
                        render:(h,params)=>{
                            if(params.row.linkstatus=='0'){
                                return h('span','开启')
                            }
                            if(params.row.linkstatus=='1'){
                                return h('span','关闭')
                            }
                        }
                    },
                     {
                         title:this.$t('updatadate'),
                        key:'updateTime',
                        Width: 150,
                        align: 'center',
                    },
                    {
                        title: this.$t('operateCol'),
                        key: 'action',
                        minWidth: 80,
                        align: 'center',
                        fixed: 'right',
                        render: (h, params) => {
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
                                             this.showEdit(params.row.offerId)
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
                                             this.removeOffer(params.row.offerId)
                                        }
                                    }
                                }, ''),
                            ],);
                        }
                    }
                ],
            }
        },
        methods: {
            onchange(aa){
                console.log(aa);
            },
            //打开新增
            showAdd(){
                this.initaddinfo();
                this.isShowAdd=true;
                this.isShowAddOrEdit=true;
            },
            //打开编辑
            showEdit(id){
                 this.initaddinfo();
                 this.isShowAdd=false;
                 this.isShowAddOrEdit = true;
                 let url='/offer/queryById';
                 let ref=this;
                 var params={
                     offerId:id
                 }
                 this.$http.post(url,params).then(res=>{
                     if(res&&res.resultCode=='0'){
                         ref.addinfo=res.data;
                     }
                 })
            },
            // 确定编辑
            edit(){
                this.$refs['user'].validate((valid) => {
                        if (valid) {
                            this.isClickedEdit = true;
                            let url='/offer/mod';
                            let ref=this;
                            this.$http.post(url,ref.addinfo).then(res=>{
                                ref.isShowAddOrEdit=false;
                                ref.$Message.success(ref.$t('savedSuccess'));
                                ref.queryOfferlist();
                            })
                            this.isClickedEdit=false;
                        }
                })
            },
            // 取消编辑
            cancelEdit(){
                this.isShowAddOrEdit=false;
            },
            // 确定添加
            add(){
                this.$refs['addoffer'].validate((valid) => {
                    if (valid) {
                         this.isClickedAdd = true;
                         let url='/offer/add';
                         let ref=this;
                         this.$http.post(url,ref.addinfo).then(res=>{
                             if(res&&res.resultCode=='0'){
                                ref.isShowAddOrEdit=false;
                                ref.$Message.success(ref.$t('savedSuccess'));
                                ref.queryOfferlist();
                             }
                             this.isClickedAdd=false;
                         })
                    }
                })
            },
            //关闭添加
            cancelAdd(){
                this.isShowAddOrEdit=false;
                this.isShowAdd=false;
            },
            //删除
            removeOffer(offerId){
                    this.$Modal.confirm({
                    title: this.$t('deleteConfirmationTitle'),
                    content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                    loading: true,
                    okText: this.$t('confirmBtn'),
                    cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                        let url = '/offer/del';
                        let ref = this;
                        var params = {
                            offerId: offerId
                        };
                        this.$http.post(url, params).then(res=>{
                            if(!!res&&res.resultCode=='0'){
                                ref.$Message.success(ref.$t('deletedSuccess'));
                                ref.queryOfferlist();
                            }
                        });
                    }
                });
            },
            //查询
            queryOfferlist(){
                let url='/offer/query';
                let ref=this;
                var params={
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize,
                    queryType:1,
                    platform_id:this.searchinfo.platform,
                    app:this.searchinfo.appName,
                    service:this.searchinfo.serviceName,
                    country:this.searchinfo.countryName
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.datalist=res.data;
                    }
                    ref.loadingTable=false;
                })
            },
            search(){
                 this.queryOfferlist();
            },
            
            changePageIndex(pageIndex){
                this.pageIndex=pageIndex;
                this.queryOfferlist();
            },
            changePageSize(pageSize){
                this.pageSize=pageSize;
                pageIndex=1;
                this.queryOfferlist();
            },
            tocarriers(){
                this.$router.push({name:'carriers'});
            },
            initaddinfo(){
                this.addinfo.countryName='',
                this.addinfo.serviceName='',
                this.addinfo.appName='',
                this.addinfo.platform='',
                this.addinfo.promotiontype='',
                this.addinfo.originallink='',
                this.addinfo.captype='',
                this.addinfo.capnumber=''
            },
            querycountrylist(){
                 let url='/country/query';
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
            querycarrierslist(){
                let url='/serviceManage/query';
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
            queryapplist(){
                let url='/app/query';
                let ref=this;
                var params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                     if(res&&res.resultCode=='0'){
                         ref.applicationlist=res.data;
                     }    
                })
            }
        },
        created(){
            this.querycountrylist();
            this.queryapplist();
            this.querycarrierslist();
            this.queryOfferlist();
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
     .span_space{
		width: 60px;
        display: -webkit-inline-box;
    }
</style>