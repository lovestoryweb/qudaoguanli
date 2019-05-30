<style lang="less" scoped>
    @import "./home.less";
    @import "../../styles/common.less";
    .top_statistics{
        width: 19.47%;
        text-align: center;
        background-color: #fff;
        border-radius: .4em;
        margin :.3%;
        padding: 1%;
        display: grid;
    }
    .top_statistics1{
        width: 19.47%;
        text-align: center;
        background-color: #fff;
        border-radius: .4em;
        margin :.3% .3% .3% 0.1%;
        padding: 1%;
        display: grid;
    }
    .top_statistics2{
        width: 19.47%;
        text-align: center;
        background-color: #fff;
        border-radius: .4em;
        margin :.3% 0% .3% .3%;
        padding: 1%;
        display: grid;
    }
    .main .single-page-con .single-page{
        margin:.5%;
        background-color:#D7D7D7;
    }
    .main .single-page-con{
        background-color:#D7D7D7;
    }
    .top_statistics_line{
        border-top: .1em  solid #dadada;
        margin:4% 0;
    }
    .top_statistics_img{
        width: 18%;
    }
    .top_statistics_title{
        font-size: 1em;
    }
    .top_statistics_data1{
        font-size: 2.5em;
        color:#3779B6;
        font-weight: 600;
    }
    .top_statistics_data2{
        font-size: 2.5em;
        color:#C2996B;
        font-weight: 600;
    }
    .top_statistics_data3{
        font-size: 2.5em;
        color:#6BB56C;
        font-weight: 600;
    }
    .top_statistics_data4{
        font-size: 2.5em;
        color:#E89022;
        font-weight: 600;
    }
    .top_statistics_data5{
        font-size: 2.5em;
        color:#D95B41;
        font-weight: 600;
    }
    .top_statistics_income_left{
        width: 69.5%;
        margin :.3% .5% .5% 0;
    }
    .top_statistics_income_right{
        width: 30%;
        margin :.3% 0 .5% 0;
    }
    .top_statistics_charge_left{
        width: 49.5%;
        margin :.5% .5% .5% 0;
    }
    .top_statistics_charge_right{
        width: 50%;
        margin :.5% 0 .5% 0;
    }
    .top_statistics_line_title{
       height: 1px;
       border-top: 1px solid #CDCDCD;
       text-align: center;
       margin: 1% 0;
    }
    .top_statistics_line_title span{
       position: relative;
       top: -8px;
       background: #D7D7D7;
       padding: 0 20px;
       color:#B3B3B3;
    }
    .top_statistics_history{
        width: 19%;
        text-align: center;
        background-color: #fff;
        border-radius: .4em;
        margin :.5%;
        padding: 1%;
        display: grid;
        color:#707070;
        font-weight: 600;
    }
    .top_statistics_history span{
        font-size:1.4em;
    }
    .top_select{
        width: 100px;
        position: absolute;
        right: 4%;
        top: 3%;
    }
    .top_periodic_income_statement{
        position: absolute;
        bottom: 2.5%;
        width: 70%;
        font-size: .6em;
    }
    .top_periodic_income_statement div{
        float: left;
        line-height: 12px;
    }
    .top_periodic_income_statement_content{
        width:80%;
    }
    .top_periodic_income_statement_content span
    {
        color:red;
    }
    .top_periodic_income_statement_content a
    {
        color:#000;
        text-decoration:none;
        cursor:default;
    }
</style>
<template>
    <div class="home-main">
    <!--     <div class="top_statistics_line">历史数据</div> -->
    <!-- <Row class="top_statistics_line_title"><span>历史数据</span></Row> -->
       <!--  <Row >
            <Col >
                <Row>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics_history">
                        <div >应用总收益（br）</div>
                        <div ><span v-text="count.incomeTotal"></span></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics_history">
                        <div>真实总收益（br）</div>
                        <div><span v-text="count.incomeTotal"></span></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics_history">
                        <div>注册用户总数</div>
                        <div><span v-text="count.user"></span></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics_history">
                        <div>付费用户总数</div>
                        <div><span v-text="count.payUser"></span></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics_history">
                        <div>退订用户总数</div>
                        <div><span v-text="count.unSubUser"></span></div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="top_statistics_line_title"><span>以下数据从3月XX号起开始统计</span></Row> -->
        <Row >
            <Col >
                <Row>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics1">
                        <div><img src="../../images/icon-01.png" class="top_statistics_img"></div>
                        <div class="top_statistics_title" v-text="$t('Estimatedtotalcyclereturn')"></div>
                        <div class="top_statistics_data1" v-text="count.incomeTotal"></div>
                        <div class="top_statistics_line"></div>
                        <div class="top_statistics_title" v-text="$t('Estimatedcycleearningstoday')"></div>
                        <div class="top_statistics_data1" v-text="count.todayIncome"></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics">
                        <div><img src="../../images/icon-02.png" class="top_statistics_img"></div>
                        <div class="top_statistics_title" v-text="$t('Realtotalcyclereturn')"></div>
                        <div class="top_statistics_data2" v-text="count.realTotalIncome"></div>
                        <div class="top_statistics_line"></div>
                        <div class="top_statistics_title" v-text="$t('Todaysrealcycleearnings')"></div>
                        <div class="top_statistics_data2" v-text="count.realTodayIncome"></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics">
                        <div><img src="../../images/icon-03.png" class="top_statistics_img"></div>
                        <div class="top_statistics_title" v-text="$t('totalnumberofregisteredusers')"></div>
                        <div class="top_statistics_data3" v-text="count.userTotal"></div>
                        <div class="top_statistics_line"></div>
                        <div class="top_statistics_title" v-text="$t('Newregistereduserstoday')"></div>
                        <div class="top_statistics_data3" v-text="count.todayUserTotal"></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics">
                        <div><img src="../../images/icon-04.png" class="top_statistics_img"></div>
                        <div class="top_statistics_title" v-text="$t('Totalnumberofmembers')"></div>
                        <div class="top_statistics_data4" v-text="count.memberUserTotal"></div>
                        <div class="top_statistics_line"></div>
                        <div class="top_statistics_title" v-text="$t('Newsubscriberstoday')"></div>
                        <div class="top_statistics_data4" v-text="count.todayMemberUserTotal"></div>
                    </Col>
                    <Col :xs="24" :sm="12" :md="3" class="top_statistics2">
                        <div><img src="../../images/icon-05.png" class="top_statistics_img"></div>
                        <div class="top_statistics_title" v-text="$t('Totalnumberofunsubscription')"></div>
                        <div class="top_statistics_data5" v-text="count.unsubMemberUserTotal"></div>
                        <div class="top_statistics_line"></div>
                        <div class="top_statistics_title" v-text="$t('Numberofunsubscriptiontoday')"></div>
                        <div class="top_statistics_data5" v-text="count.todayUnsubMemberUserTotal"></div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <i-col span="2" class="top_statistics_income_left">
            <Card>
                <p slot="title"><!-- 
                    <Icon type="ios-shuffle-strong"></Icon> -->
                    <span v-text="$t('Dailycyclereturnstatistics')"></span>
                    <Select v-model="yearMouth" class="top_select">
                        <Option v-for="item in mouthList" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </p>
                <div class="line-chart-con" v-if="!!yearMouth">
                    <every-Day-Income-Report :yearMouth="yearMouth"></every-Day-Income-Report>
                </div>
                <div class="top_periodic_income_statement">
                <div v-text="$t('Descriptionofperiodicincome')"></div>
                <div class="top_periodic_income_statement_content"><a v-text="$t('ordertitle01')"></a><span v-text="$t('ordertitle02')"></span><a v-text="$t('ordertitle03')"></a></div>
            </div>
            </Card>
            </i-col>
            <i-col span="2" class="top_statistics_income_right">
            <Card>
                <p slot="title" ><!-- 
                    <Icon type="ios-shuffle-strong"></Icon> -->
                    <span v-text="$t('Monthlycycleearningsstatisticsforthisyear')"></span>
                </p>
                <div class="line-chart-con">
                    <income-Report></income-Report>
                </div>
            </Card>
            </i-col>
        </Row>
        <Row >
            <Col>
                <Card>
                    <p slot="title"><!-- 
                        <Icon type="android-map"></Icon> -->
                    <span v-text="$t('Eachchanneltobringthenewsubscribersnearly7daysstatistics')"></span>
                    </p>
                    <div class="data-source-row">
                    <seven-Day-Pay-User-Report></seven-Day-Pay-User-Report>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <i-col span="2" class="top_statistics_charge_left">
            <Card>
                <p slot="title" ><!-- 
                    <Icon type="ios-shuffle-strong"></Icon> -->
                    <span v-text="$t('Percentageofmembersources')"></span>
                </p>
                <div class="line-chart-con">
                    <pay-User-Channel-Report></pay-User-Channel-Report>
                </div>
            </Card>
            </i-col>
            <i-col span="2" class="top_statistics_charge_right">
            <Card>
                <p slot="title"><!-- 
                    <Icon type="ios-shuffle-strong"></Icon> -->
                    <span v-text="$t('Thenumberoftimesthepagewasordered')"></span>
                </p>
                <div class="line-chart-con">
                    <pay-User-Source-Report></pay-User-Source-Report>
                </div>
            </Card>
            </i-col>
        </Row>
        <Row>
            <Col>
                <Card>
                    <p slot="title" ><!-- 
                        <Icon type="android-map"></Icon> -->
                    <span v-text="$t('rankingList')"></span>
                    </p>
                    <div class="data-source-row">
                    <ranking-List></ranking-List>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import util from '../../libs/util';
import inforCard from './components/inforCard.vue';
import operationReport from './components/operationReport.vue';
import incomeReport from './components/incomeReport.vue';
import everyDayIncomeReport from './components/everyDayIncomeReport.vue';
import channelClick from './components/channelClick.vue';
import userSource from './components/userSource.vue';
import appDownload from './components/appDownload.vue';
import sevenDayPayUserReport from './components/sevenDayPayUserReport.vue';
import payUserChannelReport from './components/payUserChannelReport.vue';
import payUserSourceReport from './components/payUserSourceReport.vue';
import rankingList from './components/rankingList.vue';
export default {
    name: 'home',
    components: {
        inforCard,
        operationReport,
        incomeReport,
        channelClick,
        userSource,
        appDownload,
        everyDayIncomeReport,
        sevenDayPayUserReport,
        payUserChannelReport,
        payUserSourceReport,
        rankingList
    },
    data () {
        return {
            count: {
                // user: 0, // 总用户
                // newUser: 0, // 新用户
                // payUser: 0, //总付费用户
                // newPayUser: 0, //新付费用户
                // unSubUser:0, //总退订用户 
                // newUnSubUser:0, //新退订用户
                // incomeTotal:0,  //总收益
                // incomeYesterday:0, //昨天收益

                incomeTotal : 0,//预估总收益,
                todayIncome : 0,//今日预估账单收益,
                realTotalIncome : 0,//真实总收益,
                realTodayIncome : 0,//今日账单真实收益,
                userTotal : 0,//用户总数,
                todayUserTotal : 0,//今日新增用户总数,
                memberUserTotal : 0,//会员用户总数,
                todayMemberUserTotal : 0,//今日新增会员用户总数,
                unsubMemberUserTotal : 0,//退订会员用户总数,
                todayUnsubMemberUserTotal : 0,//今日退订会员用户总数

            },
            yesterdayDate:'',//昨天日期
            yearMouth:'',//当前月份
            mouthList:[]
        };
    },
    created() {
        this.mouthList=util.getNowMouthList();
        this.yearMouth=util.getNowMouth();
        this.yesterdayDate = util.getBeforeDate(1);
        //this.queryOperationData();
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
                        ref.count.user = ref.toThousands(parseInt(list[0].users));
                        ref.count.newUser = ref.toThousands(parseInt(list[0].newUsers));
                        ref.count.payUser = ref.toThousands(parseInt(list[0].payUsers));
                        ref.count.newPayUser = ref.toThousands(parseInt(list[0].newPayUsers));
                        ref.count.unSubUser = ref.toThousands(parseInt(list[0].unSubUsers));
                        ref.count.newUnSubUser = ref.toThousands(parseInt(list[0].newUnSubUsers)); 
                        // ref.queryIncomeData();
                    }
                } 
            });
        },
        //查询收益数据
        queryIncomeData(){   
            let url = '/market/portal/report/incomeInfo';
            let ref = this;
            this.$http.get(url, null).then(function(res){
               if(!!res && res.resultCode=='0'){
                    var income = res.data;
                    if(!!income){   
                        ref.count.incomeTotal = ref.toThousands(income.incomeTotal);
                        ref.count.todayIncome = ref.toThousands(income.todayIncome);
                        ref.count.realTotalIncome = ref.toThousands(income.realTotalIncome);
                        ref.count.realTodayIncome = ref.toThousands(income.realTodayIncome);
                        ref.count.userTotal = ref.toThousands(income.userTotal);
                        ref.count.todayUserTotal = ref.toThousands(income.todayUserTotal);
                        ref.count.memberUserTotal = ref.toThousands(income.memberUserTotal);
                        ref.count.todayMemberUserTotal = ref.toThousands(income.todayMemberUserTotal);
                        ref.count.unsubMemberUserTotal = ref.toThousands(income.unsubMemberUserTotal);
                        ref.count.todayUnsubMemberUserTotal = ref.toThousands(income.todayUnsubMemberUserTotal);
                    }
                } 
            });
       },
        toThousands(num) {
           var num = (num || 0).toString(), temp = num.length % 3;
           switch (temp) {
               case 1:
                  num = '00' + num;
                   break;
               case 2:
                   num = '0' + num;
                   break;
           }
           return num.match(/\d{3}/g).join(',').replace(/^0+/, '')||0;
       }
    }
};
</script>