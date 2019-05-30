<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="24">
                <Row :gutter="6">
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="incomeTotal_count"
                            :end-val="count.incomeTotal"
                            iconType="ios-barcode"
                            color="#d4a233"
                            :intro-text="$t('incomeTotalCol')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="incomeYesterday_count"
                            :end-val="count.incomeYesterday"
                            iconType="ios-barcode-outline"
                            color="#b6e207"
                            :intro-text="$t('incomeYesterdayCol')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_count"
                            :end-val="count.user"
                            iconType="ios-contact-outline"
                            color="#2d8cf0"
                            :intro-text="$t('usersTotal')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="newUser_count"
                            :end-val="count.newUser"
                            iconType="android-person-add"
                            color="#64d572"
                            :intro-text="$t('newUsersTotal')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="payUser_count"
                            :end-val="count.payUser"
                            iconType="ios-flame"
                            color="#ffd572"
                            :intro-text="$t('payUsersTotal')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="newPayUser_count"
                            :end-val="count.newPayUser"
                            iconType="ios-flame-outline"
                            color="#FF9800"
                            :intro-text="$t('newPayUsersTotal')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="unSubUser_count"
                            :end-val="count.unSubUser"
                            iconType="ios-glasses"
                            color="#f25e43"
                            :intro-text="$t('totalUserUnsubscribeNumber')"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="newUnSubUser_count"
                            :end-val="count.newUnSubUser"
                            iconType="ios-glasses-outline"
                            color="#9E9E9E"
                            :intro-text="$t('addUserUnsubscribeNumber')"
                        ></infor-card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    今年月收益统计(Br)
                </p>
                <div class="line-chart-con">
                    <income-Report></income-Report>
                </div>
            </Card>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="10" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        landPage通过26092渠道访问统计(次)
                    </p>
                    <div class="data-source-row">
                        <channel-Click></channel-Click>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="14" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        用户来源统计
                    </p>
                    <div class="data-source-row">
                        <user-source></user-source>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="24" >
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        app下载量排行
                    </p>
                    <div class="data-source-row">
                        <app-download></app-download>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    近七日运营数据统计(个)
                </p>
                <div class="line-chart-con">
                    <operation-Report></operation-Report>
                </div>
            </Card>
        </Row>
    </div>
</template>

<script>
import util from '../../libs/util';
import inforCard from './components/inforCard.vue';
import operationReport from './components/operationReport.vue';
import incomeReport from './components/incomeReport.vue';
import channelClick from './components/channelClick.vue';
import userSource from './components/userSource.vue';
import appDownload from './components/appDownload.vue';
export default {
    name: 'home',
    components: {
        inforCard,
        operationReport,
        incomeReport,
        channelClick,
        userSource,
        appDownload   
    },
    data () {
        return {
            count: {
                user: 0, // 总用户
                newUser: 0, // 新用户
                payUser: 0, //总付费用户
                newPayUser: 0, //新付费用户
                unSubUser:0, //总退订用户 
                newUnSubUser:0, //新退订用户
                incomeTotal:0,  //总收益
                incomeYesterday:0 //昨天收益
            },
            yesterdayDate:''//昨天日期
        };
    },
    created() {
        this.yesterdayDate = util.getBeforeDate(1);
        this.queryOperationData();
        this.queryIncomeData();
    },
    computed: {

    },
    methods: {
        //查询运营数据
        queryOperationData(){
            if(!!!this.yesterdayDate){
                this.yesterdayDate = util.getBeforeDate(1);
            }    

            let url = '/market/portal/report/operationReport';
            let ref = this;
           
            var params = {
                beginTime:this.yesterdayDate,
                endTime:this.yesterdayDate,
                type:'1'
            };
            this.$http.post(url, params).then(function(res){
               if(!!res && res.resultCode=='0'){
                    var list = res.data;
                    if(!!list){   
                        ref.count.user = parseInt(list[0].users);
                        ref.count.newUser = parseInt(list[0].newUsers);
                        ref.count.payUser = parseInt(list[0].payUsers);
                        ref.count.newPayUser = parseInt(list[0].newPayUsers);
                        ref.count.unSubUser = parseInt(list[0].unSubUsers);
                        ref.count.newUnSubUser = parseInt(list[0].newUnSubUsers); 
                        // ref.queryIncomeData();
                    }
                } 
            });
        },
        //查询收益数据
        queryIncomeData(){   
            let url = '/market/portal/report/incomeInfo';
            let ref = this;
            this.$http.post(url, null).then(function(res){
               if(!!res && res.resultCode=='0'){
                    var income = res.data;
                    if(!!income){   
                        ref.count.incomeTotal = income.incomeTotal;
                        ref.count.incomeYesterday = income.yesterdayIncome; 
                    }
                } 
            });
       }
    }
};
</script>