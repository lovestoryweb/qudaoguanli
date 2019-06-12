<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                         <Row>
                             <Col :xl="4">
                                <span class="span_space">{{$t('channels')}}</span>
                                <Select v-model="searchinfo.channelsname" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in channelslist" :value="item.channels" :key="item.channels">{{item.channels}}</Option>
                                </Select>
                             </Col>
                             <Col :xl="4">
                                 <span class="span_space">{{$t('country')}}</span>
                                <Select v-model="searchinfo.country" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in countrylist" :value="item.country" :key="item.country">{{item.country}}</Option>
                                </Select>
                             </Col>
                             <Col :xl="4">
                                <span class="span_space">{{$t('carriers')}}</span>
                                <Select v-model="searchinfo.carriers" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in carrierslist" :value="item.carriers" :key="item.carriers">{{item.carriers}}</Option>
                                </Select>
                             </Col>
                             <Col :xl="4">
                                <span class="span_space">{{$t('violation')}}</span>
                                <Select v-model="searchinfo.violation" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in violationlist" :value="item.violation" :key="item.violation">{{item.violation}}</Option>
                                </Select>
                             </Col>
                             <Col :xl="4">
                                <span class="span_space">{{$t('violation')}}</span>
                                <Select v-model="searchinfo.violation" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                   <Option v-for="item in violationlist" :value="item.violation" :key="item.violation">{{item.violation}}</Option>
                                </Select>
                             </Col>
                             <Col>
                                <div style="float:right">
                                        <Button @click="search()" type="primary" icon="ios-search">查询</Button>
                                </div>
                             </Col>
                         </Row>
                    </div>
                    <div>
                        <div class="btndiv">
                            <Button type="primary" @click="showAdd()">
                                <Icon type="md-add"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                        </div>
                        <Table border :columns="columns" :data="datalist" :loading="loadingTable"></Table>
                        <!-- <Row>
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
                         </Row> -->
                    </div>
                </Card>
            </Col>
        </Row>


        <Modal
        v-model='isadd'
        width='800px'
        :title="$t('isaddviolation')">
            <Card :bordered="false" dis-hover>
                <Form :label-width="180" :model="addinfo" :rules="ruleadd">
                    <FormItem :label="$t('offername')" prop="offername">
                        <Select v-model="addinfo.offerName" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in offerlist.offerName" :value="item.offerName" :key="item.offerName">{{item.offerName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('channels')" prop="channels">
                        <Select v-model="addinfo.channelName" style="width:500px" :placeholder="$t('selectPlaceholder')">
                                <Option v-for="item in channelslist" :value="item.channelName" :key="item.channelName">{{item.channelName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('subchannelParameter')" prop="subchannelParameter" >
                            <Input style="width:500px" class="user_field" :placeholder="$t('pleaseente')"></Input>
                    </FormItem>
                    <FormItem :label="$t('violationtype')" >
                        <Select v-model="addinfo.violationtype" style="width:500px">
                            <Option v-for="item in violationtypelist" :value="item.key" :key="item.key">{{item.value}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('violationlevel')" >
                        <Select v-model="addinfo.violationlevel" style="width:500px" :placeholder="$t('selectPlaceholder')">
                            <Option v-for="item in violationlevellist" :value="item.key" :key="item.key">{{item.value}}</Option>
                        </Select>
                    </FormItem>    
                     <FormItem :label="$t('violationtime')" >
                        <DatePicker type="datetime" :placeholder="$t('selectPlaceholder')" style="width: 500px"></DatePicker>
                    </FormItem>
                     <FormItem :label="$t('firstlinereport')" >
                        <Upload 
                        :format="['txt','pdf','doc','xls','xlsx','docx']"
                        :on-format-error="handleFormatError"
                        :on-success="violationSuccess"
                        name=""
                        action="//jsonplaceholder.typicode.com/posts/">
                              <Button icon="ios-cloud-upload-outline">Upload files</Button>
                        </Upload>
                    </FormItem> 
                    <FormItem :label="$t('channelsreport')">
                         <Input v-model="value6" type="textarea" :rows="4" :placeholder="$t('pleaseente')" style="width: 500px" />
                    </FormItem>
                    <FormItem :label="$t('quantengReport')">
                          <Input v-model="value6" type="textarea" :rows="4" :placeholder="$t('pleaseente')" style="width: 500px"/>
                    </FormItem>
                </Form>
            </Card>

            <div slot="footer">
                <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                <Button type="primary" @click="save()" :loading="isClickedAdd">{{$t('saveBtn')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isadd:false,
                isClickedAdd:false,
                searchinfo:[
                    {
                        offername:'',
                        channelsname:'',
                        country:'',
                        carriers:''
                    }
                ],
                addinfo:{
                    offername:'',
                    channelsname:'',
                    subchannelParameter:'',
                    violationtype:'',
                    violationlevel:''
                },
               
                channelslist:[],
                countrylist:[],
                carrierslist:[],
                violationlist:[],
                offerlist:[],
                total:0,
                pageIndex:1,
                pageSize:10,
                violationtypelist:[
                    {
                        key: '1',
                        value:'成人流量'
                    },
                    {
                        key: '2',
                        value:'无感知订购'
                    },
                    {
                        key: '3',
                        value: '诱导订购'
                    },{
                        key:'4',
                        value:'其它'
                    }
                ],
                violationlevellist:[
                    {
                        key: '1',
                        value:'1级'
                    },
                    {
                        key: '2',
                        value:'2级'
                    },
                    {
                        key: '3',
                        value: '3级'
                    }
                ],
                datalist:[
                    {
                        offername:'1',
                        channelId:'1',
                        channelName:'1',
                        subchannelParameterL:'1',
                        violationtype:'1',
                        violationlevel:'1',
                        firstlinereport:'1',

                    }
                ],
                columns:[
                    {
                        title:this.$t('offername'),
                        key:'offername',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('channelid'),
                        key:'channelId',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('channelName'),
                        key:'channelName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('subchannelParameter'),
                        key:'channelName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('violationtype'),
                        key:'channelName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('violationlevel'),
                        key:'channelName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('firstlinereport'),
                        key:'channelName',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('channelsreport'),
                        key:'channelsreport',
                        align:'center',
                        minWidth:50,
                        render:(h,params)=>{
                            return h('div',[
                                h('Icon',{
                                    props: {
                                        type:'ios-eye',
                                        size:'20'
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            alert(111);
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title:this.$t('quantengReport'),
                        key:'quantengReport',
                        align:'center',
                        minWidth:50,
                        render:(h,params)=>{
                            return h('div',[
                                h('Icon',{
                                    props:{
                                        type:'ios-eye',
                                        size:'20'
                                    },
                                    style:{
                                        custom:'pointer',
                                    },
                                    on:{
                                        click:()=>{
                                            alert(222);
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title:this.$t('violationtime'),
                        key:'violationtime',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('result'),
                        key:'result',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('updatadate'),
                        key:'updatadate',
                        align:'center',
                        minWidth:50
                    }
                ]
            }
        },
        methods: {
            showAdd(){
                this.isadd=true;
            },
            cancelAdd(){
                this.isadd=false;
            },
            //新增保存
            save(){

            },
            querychannelslist() {
                let url='/channel/query';
                let ref=this;
                params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                    if(res&&res.resultCode=='0'){
                        ref.channelslist=res.data;
                    }
                })
            },
            quercountrylist(){
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
            queryofferlist(){
                let url='/offer/query';
                let ref=this;
                var params={
                    queryType:0
                }
                this.$http.post(url,params).then(res=>{
                        if(res&&res.resultCode=='0'){
                             ref.offerlist=res.data
                        }
                })
            },
            changePageIndex(){
                
            },
            changePageSize(){

            },
            handleFormatError(file){
                 this.$Notice.warning({
                    title: file.name + ':' + this.$t('fileTypeWarning')
                });
            },
            violationSuccess(res,file){
                 console.log(res,file);
            }
        },
        created(){
            this.querychannelslist();
            this.quercountrylist();
            this.querycarrierslist();
        }
    }
</script>

<style scoped lang='less'>
.btndiv {
    margin-bottom: 20px;
}
.theme_searchfield {
    width: 150px;
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
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}
.addspan {
    display: inline;
    cursor: pointer;
}
.span_space {
    width: 60px;
    display: -webkit-inline-box;
}
.sp{
    display:inline-block;
    border: 2px solid #ccc;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    cursor: pointer;
}
</style>