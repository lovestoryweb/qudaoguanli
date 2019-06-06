<template>
    <div>
         <Row>
             <Col span="24">
                 <Card>
                     <div slot="title">
                        <div>
                            <Row>
                                <Col span="5">
                                    <span class="span_space">{{$t('appNameCol')}}</span>
                                    <Select v-model="addinfo.pingtai" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.pingtai" :key="item.pingtai">{{item.pingtai}}</Option>
                                    </Select>
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
                        <Table border :columns="columns" :data="data" :no-data-text="$t('noResult')"></Table>
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
             :title="$t('addBtn')"
             v-model="isadd">
            <Card :bordered="false" dis-hover>
                    <Form ref="addoffer" :label-width="180">
                        <FormItem :label="$t('carriers')" prop="">
                            <Input v-model="addinfo.yunyingshang" style="width:500px" class="user_field"></Input>
                        </FormItem>
                         <FormItem :label="$t('themeMemo')" prop="">
                            <Input v-model="addinfo.beizhu" type="textarea" style="width:500px" class="user_field"></Input>
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
                 data:[
                     {
                         id:'1',
                         name:'中国移动',
                         bz:'备注',
                         createdate:'2018-2-1',

                     }
                 ],
                 addinfo:{
                     pingtai:'',
                     yunyingshang:'',
                     beizhu:''
                 },
                 results:[
                    {
                         pingtai:'1'
                    },
                    {
                         pingtai:'2'
                    }
                 ],
                 columns:[
                    {
                         title:this.$t('appNameCol'),
                         key:'id',
                         align:'center',
                         minWidth:50
                    },
                    {
                         title:this.$t('catalogDescCol'),
                         key:'name',
                         align:'center',
                         minWidth:50
                    },
                    {
                         title:this.$t('themeMemo'),
                         key:'bz',
                         align:'center',
                         minWidth:50
                     },
                    {
                         title:this.$t('versionCraeatTime'),
                         key:'createdate',
                         align:'center',
                         minWidth:50
                    },
                    {
                         title:this.$t('operateCol'),
                         align:'center',
                         minWidth:50,
                         render:(h,parmas)=>{
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
                                             this.removeOffer(params.row.id)
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
             showAdd(){
                 this.isadd=true;
             },
             canneladd(){
                 this.isadd=false;
             },
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