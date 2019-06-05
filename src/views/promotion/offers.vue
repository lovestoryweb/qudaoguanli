<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                         <span class="span_space">{{$t('country')}}</span>
                         <Select v-model="addinfo.country" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                            <Option v-for="item in results" :value="item.country" :key="item.country">{{item.country}}</Option>
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
        <!-- 新增/编辑 -->
        <Modal
            v-model="isShowAddOrEdit"
            width="800px"
            :title="isShowAdd?$t('addBtn'):$t('editBtn')">
                  <Card :bordered="false" dis-hover>
                      <Form ref="addoffer" :label-width="180" :model="addinfo" :rules="ruleadd">
                          <FormItem :label="$t('country')" prop="country">
                               <Select v-model="addinfo.country" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.country" :key="item.value">{{item.country}}</Option>
                                </Select>
                          </FormItem>
                           <FormItem :label="$t('carriers')" prop="operator">
                               <Select v-model="addinfo.operator" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.operator" :key="item.value">{{item.operator}}</Option>
                                </Select>
                                <span @click="aaaaaaaaaa" class="addspan"><Icon type="md-add-circle" size="20"/></span>
                          </FormItem>
                           <FormItem :label="$t('application')" prop="application">
                                <Select v-model="addinfo.application" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.application" :key="item.value">{{item.application}}</Option>
                                </Select>
                                <span @click="aaaaaaaaaa" class="addspan"><Icon type="md-add-circle" size="20"/></span>
                          </FormItem>
                           <FormItem :label="$t('platform')" prop="platform">
                              <Select v-model="addinfo.platform" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.platform" :key="item.value">{{item.platform}}</Option>
                                </Select>
                          </FormItem>
                           <FormItem :label="$t('promotiontype')">
                               <Select v-model="addinfo.promotiontype" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.promotiontype" :key="item.value">{{item.promotiontype}}</Option>
                                </Select>
                          </FormItem>
                           <FormItem :label="$t('originallink')" prop="originallink">
                               <Input v-model="addinfo.originallink" style="width:500px" class="user_field"></Input>
                          </FormItem>
                          <FormItem :label="$t('captype')">
                               <Select v-model="addinfo.captype" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.captype" :key="item.value">{{item.captype}}</Option>
                                </Select>
                          </FormItem>
                          <FormItem :label="$t('capnumber')">
                               <Input v-model="addinfo.capnumber" style="width:500px" class="user_field"></Input>
                          </FormItem>
                      </Form>
                </Card>
                  <!-- 自定义页脚内容 -->  
                 <div v-if="isShowAdd" slot="footer">
                      <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                      <Button type="primary" @click="add()">{{$t('saveBtn')}}</Button>
                 </div>
                  <div v-else slot="footer">
                      <Button @click="cancelEdit()">{{$t('cancelBtn')}}</Button>
                      <Button type="primary" @click="edit()">{{$t('editBtn')}}</Button>
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
                total:0,
                addinfo:{
                    country:'',
                    operator:'',
                    application:'',
                    platform:'',
                    promotiontype:'',
                    originallink:'',
                    captype:'',
                    capnumber:''
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
                    capnumber:'1'
                    },
                     {
                    country:'2',
                    operator:'2',
                    application:'2',
                    platform:'2',
                    promotiontype:'2',
                    originallink:'2',
                    captype:'2',
                    capnumber:'2'
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
                isShowAddOrEdit:false,
                isonoff:false,
                isShowAdd:false,
                data1:[
                    {
                        id:1,
                        sourceChannelName:'fdfd',
                        targetChannelName:'212ffdf',
                        min:'gdfdfd',
                        max:'fdsfsd',
                        new:'ghgf',
                        old:'fdf'
                    }
                ],
                columns1: [
                    {
                        title: this.$t('offername'),
                        key:"id",
                        minWidth: 100,
                        align: 'center',
                        // fixed:'left'
                    },
                     {
                        title:this.$t('promotiontype'),
                        key:"sourceChannelName",
                        minWidth: 150,
                        align: 'center',
                    },
                    {
                        title:this.$t('originallink'),
                        key:"targetChannelName",
                        minWidth: 150,
                        align: 'center',
                    },
                    {
                        title:this.$t('captype'),
                        key:'min',
                         minWidth: 150,
                        align: 'center',
                    },
                    {
                         title:this.$t('capnumber'),
                        key:'max',
                        minWidth: 150,
                        align: 'center',
                    },
                     {
                         title:this.$t('updatadate'),
                        key:'new',
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
            queryinit(){
                 
            },
            //打开新增
            showAdd(){
                this.initaddinfo();
                this.isShowAdd=true;
                this.isShowAddOrEdit=true;
            },
            //打开编辑
            showEdit(id){
                 console.log(id)
                 this.isShowAdd=false;
                 this.isShowAddOrEdit = true;
            },
            // 确定编辑
            edit(){
                 console.log(this.addinfo)
                 console.log("编辑")
            },
            // 取消编辑
            cancelEdit(){
                this.isShowAddOrEdit=false;
            },
            // 确定添加
            add(){
                console.log(this.addinfo)
                console.log("添加");
            },
            //关闭添加
            cancelAdd(){
                this.isShowAddOrEdit=false;
                this.isShowAdd=false;
            },
            //删除
            removeOffer(){
                    this.$Modal.confirm({
                    title: this.$t('deleteConfirmationTitle'),
                    content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                    loading: true,
                    okText: this.$t('confirmBtn'),
                    cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                        // let url = '/market/portal/cp/remove';
                        let ref = this;
                        var params = {
                            // cpId: cpId
                        };
                        this.$http.post(url, params).then(
                            // function(res){
                            //     ref.$Modal.remove();
                            //     if(!!res && res.resultCode == '0'){
                            //         ref.$Message.success(ref.$t('deletedSuccess'));
                            //         ref.queryUsers();
                            //     }
                            // }
                        );
                    }
                });
            },
            //查询
            search(){
                 console.log(this.addinfo) 
            },
            aaaaaaaaaa(){
                alert(111)
            },
            initaddinfo(){
                this.addinfo.country='',
                this.addinfo.operator='',
                this.addinfo.application='',
                this.addinfo.platform='',
                this.addinfo.promotiontype='',
                this.addinfo.originallink='',
                this.addinfo.captype='',
                this.addinfo.capnumber=''
            }
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