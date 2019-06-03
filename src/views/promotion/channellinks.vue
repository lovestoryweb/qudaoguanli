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
                             <span class="span_space">链接开关</span>
                              <Select v-model="addinfo.appReportChannel" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in results" :value="item.appReportChannel" :key="item.appReportChannel">{{item.country}}</Option>
                             </Select>
                               <span class="span_space">优化开关</span>
                              <Select v-model="addinfo.appReportChannel" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in results" :value="item.appReportChannel" :key="item.appReportChannel">{{item.country}}</Option>
                             </Select>
                         </div>
                    </div>
                   


                    <div>
                        <div class="btndiv">
                            <Button type="primary" @click="showAdd()">
                                <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
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
    </div>
</template>

<script>
    export default {
         data() {
             return {
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
                        title:'渠道ID',
                        key:"id",
                        minWidth: 250,
                        align: 'center',
                        fixed:'left'
                    },
                     {
                        title:'二级渠道',
                        key:"id1",
                        minWidth: 250,
                        align: 'center',
                       
                    },
                     {
                        title:'Offer名称',
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
                        title:'推广链接',
                        key:"id4",
                        minWidth: 250,
                        align: 'center',
                        
                    },
                     {
                        title:'价格',
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
                        title:this.$t('linkonoff'),
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
                        title:'回调类型',
                        key:"id7",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:'执行比例',
                        key:"id8",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                    {
                        title:'转化率上限',
                        key:"id8",
                        minWidth: 100,
                        align: 'center',
                        
                    },
                     {
                        title:'优化开关',
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
                        title: '操作',
                        key: 'action',
                        minWidth: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             this.showEdit(params.row.id)
                                        }
                                    }
                                }, this.$t('editBtn')),
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             this.removeOffer(params.row.offername)
                                        }
                                    }
                                }, this.$t('deleteBtn'))
                            ],);
                        }
                    }
                  ]
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