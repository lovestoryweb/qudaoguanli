<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div style="margin:0em 0em 5em 0px">
                        <Col span="12" >
                            <Button type="primary" @click="refrechCachModel('1')">
                                <Icon type="flash"></Icon>&nbsp;{{$t('refrechIndexBtn')}}  
                            </Button>
                        </Col>
                        <Col span="12" >
                            <Button type="primary" @click="refrechCachModel('2')">
                                <Icon type="flash"></Icon>&nbsp;{{$t('refrechCategoryRelationBtn')}}  
                            </Button>
                        </Col>                    
                    </div>
                    <div style="margin:0em 0em 10em 0px">
                        <Col span="12" >
                            <Button type="primary" @click="refrechCachModel('3')">
                                <Icon type="flash"></Icon>&nbsp;{{$t('refrechHotTagBtn')}}  
                            </Button>
                        </Col>
                        <Col span="12" >
                            <Button type="primary" @click="refrechCachModel('4')">
                                <Icon type="flash"></Icon>&nbsp;{{$t('refrechBundlesBtn')}}  
                            </Button>
                        </Col>                    
                    </div>
                    <div style="margin:0em 0em 15em 0px">
                        <Col span="20" >
                            <div style="margin-top:5px;">   
                                <label>{{$t('cacheSelectAdsLabel')}}</label>
                                <RadioGroup v-model="selectAd" style="margin-top:-1px;">
                                    <Radio :label="$t('cacheBannerAdLabel')"></Radio>
                                    <Radio :label="$t('cacheSortAdLabel')"></Radio>
                                    <Radio :label="$t('cacheBundleAdLabel')"></Radio>
                                    <Radio :label="$t('cachePOPAdLabel')"></Radio>
                                    <Radio :label="$t('cachetextAdLabel')"></Radio>
                                </RadioGroup>
                                <Button type="primary" @click="refrechCachModel('5')">
                                    <Icon type="flash"></Icon>&nbsp;{{$t('refrechAdsBtn')}}  
                                </Button>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <Modal v-model="showModel" width="400">
                <p slot="header" style="color:#1c2438;text-align:center">
                    <span v-text="$t('cacheRefreshOk')"></span>
                </p>
                <div style="text-align:center">
                    <p v-if="'1'==type" v-text="$t('refrechIndexBtn')+'?'"></p>
                    <p v-else-if="'2'==type" v-text="$t('refrechCategoryRelationBtn')+'?'"></p>
                    <p v-else-if="'3'==type" v-text="$t('refrechHotTagBtn')+'?'"></p>
                    <p v-else-if="'4'==type" v-text="$t('refrechBundlesBtn')+'?'"></p>
                    <p v-else-if="'5'==type" v-text="$t('refrechAdsBtn')+'?'"></p>
                </div>
                <div slot="footer">
                    <Button type="info" size="large" long :loading="modal_loading" @click="refrechCach()">{{$t('cacheRefresh')}}</Button>
                </div>
            </Modal>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'cacheManagement',
    data () {
        return {
            selectAd: '', //选择的广告
            showModel: false,  //是否确认弹窗
            modal_loading: false,   //是否正在发送编辑请求
            type: ''  //刷新类型
        };
    },
    created() {
    
    },
    computed: {
        
    },
    watch: {
       
    },
    methods: {
        //刷新确认弹窗    
        refrechCachModel(type)  
        {
            this.showModel=true;
            this.type=type;
        },
        //刷新缓存
        refrechCach(){
            let url='/market/portal/refresh/cache/'; 
            let params= null;
            if('1'==this.type){
                //首页
                url = url + 'index'; 
            }
            else if('2'==this.type){
                //栏目关系
                url = url + 'category';
            }
            else if('3'==this.type){
                url = url + 'hotTag';
            }
            else if('5'==this.type){
                if(!!!this.selectAd){
                    this.$Notice.warning({title: this.$t('cacheError'), desc: this.$t('cacheSelectAdMsg')});
                    this.showModel=false;
                    return;
                }

                if(this.selectAd==this.$t('cacheBannerAdLabel')) 
                {
                    //轮播广告
                    url = url + 'promotion/ads';
                    params = {type:'6'};  //栏目映射表的type 
                }
                else if(this.selectAd==this.$t('cacheSortAdLabel')) {
                    //分类页广告
                    url = url + 'promotion/ads';
                    params = {type:'2'}; //栏目映射表的type 
                }
                else if(this.selectAd==this.$t('cacheBundleAdLabel')) {
                    //套餐广告
                    url = url + 'pop/ads';
                    params = {type:'6'}; //广告表的type 
                }
                else if(this.selectAd==this.$t('cachePOPAdLabel')) {
                    //pop广告
                    url = url + 'pop/ads';
                    params = {type:'7'}; //广告表的type
                }
                else{
                    //文字广告
                    url = url + 'pop/ads';
                    params = {type:'8'}; //广告表的type
                }
            }
            else{
                //套餐
                url = url + 'bundles';
            }   

            let ref = this;
            this.modal_loading=true;
            this.$http.post(url, params).then(function(res){
                if(!!res && res.resultCode == '0'){
                    ref.$Notice.success({ title: ref.$t('cacheSuccess'), desc: ref.$t('cacheSuccessMsg')});
                }
                else{
                    ref.$Notice.error({title: ref.$t('cacheFail'), desc: ref.$t('cacheErrorMsg')});
                }
                ref.modal_loading=false;
                ref.showModel=false;
            });
        }
    }
};
</script>
