<template>
    <div>
       <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                            <div class="lineh">
                                <span class="span_space">{{$t('channels')}}</span>
                                <Select v-model="addinfo.appReportChannel" class="theme_searchfield" :placeholder="$t('selectPlaceholder')" >
                                    <Option v-for="item in results" :value="item.appReportChannel" :key="item.appReportChannel">{{item.country}}</Option>
                                </Select>
                                <span class="span_space">{{$t('carriers')}}</span>
                                <Select v-model="addinfo.operator" class="theme_searchfield">
                                    <Option v-for="item in results" :value="item.operator" :key="item.operator">{{ item.operator}}</Option>
                                </Select>
                                <span class="span_space">{{$t('application')}}</span>
                                <Select v-model="addinfo.application" class="theme_searchfield">
                                    <Option v-for="item in results" :value="item.application" :key="item.application">{{ item.application }}</Option>
                                </Select>
                                <span class="span_space">{{$t('platform')}}</span>
                                 <Select v-model="addinfo.platform" class="theme_searchfield">
                                    <Option v-for="item in results" :value="item.platform" :key="item.platform">{{ item.platform }}</Option>
                                </Select>
                            </div>
                         <div style="float:right;">
                             <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
                         </div>
                          <div>
                             <span class="span_space">{{$t('country')}}</span>
                              <Select v-model="addinfo.country" class="theme_searchfield":placeholder="$t('selectPlaceholder')">
                                 <Option v-for="item in results" :value="item.country" :key="item.country">{{item.country}}</Option>
                              </Select>
                             <span class="span_space">{{$t('linkswitch')}}</span>
                              <Select v-model="addinfo.appReportChannel" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in results" :value="item.appReportChannel" :key="item.appReportChannel">{{item.country}}</Option>
                             </Select>
                               <span class="span_space">{{$t('optimizationswitch')}}</span>
                              <Select v-model="addinfo.appReportChannel" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in results" :value="item.appReportChannel" :key="item.appReportChannel">{{item.country}}</Option>
                             </Select>
                         </div>
                    </div>
                    <div>
                        <div class="btndiv">
                            <Button type="primary" @click="showAdd()">
                                <Icon type="md-add"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                        </div>
                        <Table border :columns="columns1" :data="data1" :no-data-text="$t('noResult')"></Table>
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




        <!-- 新增渠道链接 -->
        <Modal
             v-model="isAddChannel"
             width="800px"
             title="新增渠道链接">
              <Card :bordered="false" dis-hover>
                 <Form ref="addoffer" :label-width="180" :model="addinfo" :rules="ruleadd">
                     <FormItem :label="$t('offername')" prop="">
                          <Select v-model="addinfo.country" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in results" :value="item.country" :key="item.value">{{item.country}}</Option>
                           </Select>
                     </FormItem>
                     <FormItem :label="$t('channels')" prop="">
                          <Select v-model="addinfo.country" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in results" :value="item.country" :key="item.value">{{item.country}}</Option>
                           </Select>
                     </FormItem>
                      <FormItem :label="$t('unitprice')" prop="">
                            <Input v-model="addinfo.capnumber" style="width:500px" class="user_field"></Input>
                     </FormItem>
                     <FormItem :label="PO" prop="">
                            <Input v-model="addinfo.capnumber" style="width:500px" class="user_field" placeholder="转化/日"></Input>
                     </FormItem>
                      <FormItem label="是否开启" prop="">
                            <i-switch v-model="addinfo.cpStatus" true-value="0" false-value="1" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                      </FormItem>
                 </Form>
             </Card>
             <!-- 自定义页脚内容 -->  
            <div slot="footer">
                 <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                 <Button type="primary" @click="add()">{{$t('saveBtn')}}</Button>
            </div>
        </Modal>

        <!-- 新增优化 -->
        <Modal
             v-model="isAddOptimization"
             width="800px"
             title="新增优化">
             <Card :bordered="false" dis-hover>
                 <Form ref="addoffer" :label-width="180" :model="addinfo" :rules="ruleadd">
                     <FormItem label="$t('offername')" prop="">
                          <Select v-model="addinfo.country" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in results" :value="item.country" :key="item.value">{{item.country}}</Option>
                           </Select>
                     </FormItem>
                     <FormItem label="$t('channels')" prop="">
                          <Select v-model="addinfo.country" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in results" :value="item.country" :key="item.value">{{item.country}}</Option>
                           </Select>
                     </FormItem>
                      <FormItem label="$t('unitprice')" prop="">
                            <Input v-model="addinfo.capnumber" style="width:500px" class="user_field"></Input>
                     </FormItem>
                     <FormItem label="PO" prop="">
                            <Input v-model="addinfo.capnumber" style="width:500px" class="user_field" placeholder="转化/日"></Input>
                     </FormItem>
                      <FormItem label="是否开启" prop="">
                            <i-switch v-model="addinfo.cpStatus" true-value="0" false-value="1" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                      </FormItem>
                 </Form>
             </Card>
             <!-- 自定义页脚内容 -->  
            <div slot="footer">
                 <Button @click="canceOptimization()">{{$t('cancelBtn')}}</Button>
                 <Button type="primary" @click="add()">{{$t('saveBtn')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
         data() {
             return {
                   isAddChannel:false,
                   isAddOptimization:false,
                   total:0,
                   addinfo:{
                      country:'',
                      operator:'',
                      application:'',
                      platform:'',
                      promotiontype:'',
                      originallink:'',
                      captype:'',
                      capnumber:'',
                      appReportChannel:''
                  },
                  results:[
                      {
                      country:'1',
                      operator:'1',
                      application:'1',
                      platform:'1',
                      promotiontype:'1',
                      originallink:'1',
                      captype:'1',
                      capnumber:'1',
                      appReportChannel:'1',
                      },
                       {
                      country:'2',
                      operator:'2',
                      application:'2',
                      platform:'2',
                      promotiontype:'2',
                      originallink:'2',
                      captype:'2',
                      capnumber:'2',
                      appReportChannel:'2'
                      }
                  ],
                  data1:[
                      {     
                          id:"测试1",
                          id1:"测试2",
                          id2:"测试3",
                          id3:"测试4",
                          id4:"测试5",
                          id5:"测试6",
                          id6:"测试7",
                          id7:"测试8",
                          id8:"测试8",
                          id9:"测试9",
                        
                      }
                  ],
                  columns1:[
                    {
                        title:this.$t('channelid'),
                        key:"id",
                        minWidth: 250,
                        align: 'center',
                        fixed:'left'
                    },
                     {
                        title:this.$t('channels'),
                        key:"id1",
                        minWidth: 250,
                        align: 'center',
                       
                    },
                     {
                        title:this.$t('offername'),
                        key:"id2",
                        minWidth: 250,
                        align: 'center',
                        
                    },
                     {
                        title:'UID',
                        key:"id3",
                        minWidth: 250,
                        align: 'center',
                        
                    },
                     {
                        title:this.$t('originallink'),
                        key:"id4",
                        minWidth: 250,
                        align: 'center',
                        
                    },
                     {
                        title:this.$t('unitprice'),
                        key:"id5",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                     {
                        title:'PO',
                        key:"id6",
                        minWidth: 100,
                        align: 'center',
                       
                    },
                      {
                        title:this.$t('linkswitch'),
                        key:'old',
                        minWidth: 150,
                        align: 'center',
                        render: (h, params) => {  // 重点
                        return h('i-switch', {  //按钮的话是：button自行替换
                             props: {  //这里可以设置它的属性
                                value:this.isonoff,     //设置它的值比如：true或false
                              },
                              on: { //操作事件
                                 'on-change':(value)=>{
                                     console.log(value);
                                     this.isonoff=value;
                                 }
                              }
                        })
                      }
                    },
                    {
                        title:this.$t('postback'),
                        key:"id7",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:this.$t('ratio'),
                        key:"id8",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:this.$t('conversion'),
                        key:"id8",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                     {
                        title:this.$t('optimizationswitch'),
                        key:'old',
                        minWidth: 150,
                        align: 'center',
                        render: (h, params) => {  // 重点
                        return h('i-switch', {  //按钮的话是：button自行替换
                             props: {  //这里可以设置它的属性
                                value:this.isonoff,     //设置它的值比如：true或false
                              },
                              on: { //操作事件
                                 'on-change':(value)=>{
                                     alert("11111")
                                     console.log(value);
                                     this.isonoff=value;
                                 }
                              }
                        })
                      }
                    },
                     {
                        title: this.$t('operateCol'),
                        key: 'action',
                        minWidth: 200,
                        align: 'center',
                        fixed:'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        custom:'_icon11',
                                        size:'20'
                                    },
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                             this.editOne(params.row.offername)
                                        }
                                    }
                                }, ''),
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
                                             this.editTwo(params.row.offername)
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
                                             this.removeOffer(params.row.offername)
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
                this.isAddChannel=true;
             },
             cancelAdd(){
                 this.isAddChannel=false;
             },
             add(){
                 alert('保存成功')
             },
             removeOffer(){
                  this.$Modal.confirm({
                    title: this.$t('deleteConfirmationTitle'),
                    content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                    loading: true,
                    okText: this.$t('confirmBtn'),
                    cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                        let url = '/market/portal/cp/remove';
                        let ref = this;
                        var params = {
                           
                        };
                        this.$http.post(url, params).then(
                           
                        );
                    }
                });
             },
             //打开新增优化界面
             editOne(){
                 this.isAddOptimization=true;
             },
             //关闭新增优化
             canceOptimization(){
                 this.isAddOptimization=false;
             },
            
             editTwo(){

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
</style>