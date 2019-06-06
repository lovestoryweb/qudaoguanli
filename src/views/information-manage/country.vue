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
                            <Button type="primary" @click="add()">
                                <Icon type="md-add"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                        </div>
                        <Table border :columns="columns" :data="datalist"></Table>
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
             title="新增"
             v-model="isadd">
            <Card :bordered="false" dis-hover>
                    <Form ref="addoffer" :label-width="180">
                        <FormItem :label="$t('country')" prop="">
                            <Input v-model="addinfo.country" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('acronym')" prop="">
                            <Input v-model="addinfo.suoxie" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('englishname')" prop="">
                            <Input v-model="addinfo.english" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('areacode')" prop="">
                            <Input v-model="addinfo.phone" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('timezone')" prop="">
                            <Input v-model="addinfo.house" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('suggested')" prop="">
                            <Input v-model="addinfo.price" style="width:500px" class="user_field"></Input>
                        </FormItem>
                    </Form>
            </Card>
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
                isadd:false,
                pageIndex:1,
                pageSize:10,
                loadingTable:true,
                total:0,
                searchinfo:{
                    countryName:'',
                    countryAbbreviation:'',
                    timeZone:'',
                },
                datalist:[],
                addinfo:{
                    country:'',
                    suoxie:'',
                    english:'',
                    phone:'',
                    house:'',
                    price:''
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
                    loadingTable=false;
                })
                
            },
            search() {
                this.querycountry();
            },
            add(){
                this.isadd=true;
            },
            canneladd(){
                this.isadd=false;
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