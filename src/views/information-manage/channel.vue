<template>
    <div>
       <Row>
           <Col span="24">
                <Card>
                    <div slot="title">
                         <span class="span_space">{{$t('渠道名称')}}</span>
                         <Select v-model="searchinfo.name" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                            <Option v-for="item in results" :value="item.name" :key="item.name">{{item.name}}</Option>
                         </Select>
                          <span class="span_space">{{$t('渠道ID')}}</span>
                         <Select v-model="searchinfo.id" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                            <Option v-for="item in results" :value="item.id" :key="item.id">{{item.id}}</Option>
                         </Select>
                         <div style="float:right;">
                            <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
                         </div>
                    </div>
                    <div class="">
                         <div class="btndiv">
                             <Button type="primary" @click="add()">
                                 <Icon type="md-add"></Icon>新增
                             </Button>
                         </div>
                         <Table border :columns="columns"></Table>
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

        <!-- 新增 -->
          <Modal
                  v-model="isAdd"
                  width="800px"
                  title="新增渠道链接">
                  <Card :bordered="false" dis-hover>
                      <Form ref="addoffer" :label-width="180">
                            <FormItem :label="$t('渠道名称')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('回调地址')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('回调参数')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('报文录入')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('回调成功关键字')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                            <FormItem :label="$t('备注')" prop="">
                                <Input v-model="addinfo.channelName" style="width:500px" class="user_field"></Input>
                            </FormItem>
                      </Form>
                  </Card>
                  <!-- 自定义页脚内容 -->  
                  <div slot="footer">
                      <Button @click="canneladd()">{{$t('cancelBtn')}}</Button>
                      <Button type="primary" @click="save()">{{$t('saveBtn')}}</Button>
                 </div>
        </Modal>
    </div>
</template>

<script>
    export default {
            data() {
                return {
                     total:0,
                     isAdd:false,
                     addinfo:{
                         channelName:'',

                     },
                     searchinfo:{
                         name:'',
                         id:''
                     },
                     results:[
                         {
                             name:'1',
                             id:'1'
                         },
                         {
                             name:'2',
                             id:'2'
                         }
                     ],
                     columns:[
                         {
                             title:'渠道ID',
                             key:'id',
                             minWidth:50,
                             align:'center'
                         },
                         {
                             title:'渠道名称',
                             key:'name',
                             minWidth:50,
                             align:'center'
                         },
                         {
                             title:'回调地址',
                             key:'address',
                             minWidth:150,
                             align:'center'
                         },
                         {
                             title:'回调参数',
                             key:'callback',
                             minWidth:100,
                             align:'center'
                         },
                         {
                             title:'报文',
                             key:'message',
                             minWidth:50,
                             align:'center'
                         },
                         {
                             title:'回调成功关键字',
                             key:'success',
                             minWidth:50,
                             align:'center'
                         },{
                             title:'操作',
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
                                                 this.showEdit(params.row.id)
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
                }
            },
            methods: {
                add(){
                    this.isAdd=true;
                },
                canneladd(){
                    this.isAdd=false;
                },
                search(){
                    
                },
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