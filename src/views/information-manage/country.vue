<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                         <div>
                             <Row>
                                <Col span="5">
                                    <span class="span_space">国家名称</span>
                                    <Select v-model="addinfo.country" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.country" :key="item.country">{{item.country}}</Option>
                                    </Select>
                                </Col>
                                <Col span="5">
                                    <span class="span_space">国家缩写</span>
                                    <Select v-model="addinfo.suoxie" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.suoxie" :key="item.suoxie">{{item.suoxie}}</Option>
                                    </Select>
                                </Col>
                                <Col span="5">
                                    <span class="span_space">英文名称</span>
                                    <Select v-model="addinfo.english" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.english" :key="item.english">{{item.english}}</Option>
                                    </Select>
                                </Col>
                                <Col span="5">
                                    <span class="span_space">电话代码</span>
                                    <Select v-model="addinfo.phone" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.phone" :key="item.phone">{{item.phone}}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                     <div style="float:right;">
                                        <Button type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
                                    </div>
                                </Col>
                             </Row>
                             <br>
                             <Row>
                                 <Col span="5">
                                     <span class="span_space">所属时区</span>
                                    <Select v-model="addinfo.house" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.house" :key="item.house">{{item.house}}</Option>
                                    </Select>
                                 </Col>
                                 <Col span="5">
                                     <span class="span_space">建议价格</span>
                                     <Select v-model="addinfo.price" class="theme_searchfield" :placeholder="$t('selectPlaceholder')">
                                        <Option v-for="item in results" :value="item.price" :key="item.price">{{item.price}}</Option>
                                    </Select>
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


        <Modal
             width="800px"
             title="新增"
             v-model="isadd">
            <Card :bordered="false" dis-hover>
                    <Form ref="addoffer" :label-width="180">
                        <FormItem :label="$t('国家名称')" prop="">
                            <Input v-model="addinfo.country" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('国家缩写')" prop="">
                            <Input v-model="addinfo.suoxie" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('英文名称')" prop="">
                            <Input v-model="addinfo.english" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('电话代码')" prop="">
                            <Input v-model="addinfo.phone" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('所属时区')" prop="">
                            <Input v-model="addinfo.house" style="width:500px" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('建议价格')" prop="">
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
                addinfo:{
                    country:'',
                    suoxie:'',
                    english:'',
                    phone:'',
                    house:'',
                    price:''
                },
                results:[
                    {
                        country:'中国',
                        suoxie:'CN',
                        english:'china',
                        phone:'54545',
                        house:'东八区',
                        price:'89'
                    },
                    {
                        country:'美国',
                        suoxie:'UN',
                        english:'unnitry',
                        phone:'85412545',
                        house:'西五区',
                        price:'43'
                    }
                ],
                columns:[
                    {
                        title:this.$t('国家名称'),
                        key:'name',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('国家缩写'),
                        key:'suoxie',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('英文名称'),
                        key:'english',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('电话代码'),
                        key:'phone',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('所属时区'),
                        key:'phone',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('建议价格'),
                        key:'price',
                        align:'center',
                        minWidth:50
                    },
                    {
                        title:this.$t('创建时间'),
                        key:'date',
                        align:'center',
                        minWidth:50
                    }
                ]
            }
        },
        methods: {
            search() {
                console.log(111)
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