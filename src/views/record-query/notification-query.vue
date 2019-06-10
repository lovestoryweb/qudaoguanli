<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                        <!-- 查询选择 S -->
                        <!-- 日历选择 S -->
                        <Row :gutter="16">
                            <Col :xs="12" :lg="5">
                                <span class="span_space">{{$t('startTime')}}</span>
                                <DatePicker type="datetime" placeholder="Select date" style="width: 200px" @on-change="changedatestart"></DatePicker>
                            </Col>
                            <Col :xs="12" :lg="5">
                                <span class="span_space">{{$t('endTime')}}</span>
                                <DatePicker type="datetime" placeholder="Select date" style="width: 200px" @on-change="changedateend"></DatePicker>
                            </Col>
                        </Row>
                        <!-- 日历选择 E -->
                        <br>

                        <div>
                            <Row :gutter="16">
                                <Col span="5">
                                    <span class="span_space">二级渠道</span>
                                    <Select v-model="searchchannel" style="width:200px">
                                        <Option v-for="item in channeldatalist" :value="item.channelName" :key="item.channelName">{{ item.channelName }}</Option>
                                    </Select>
                                </Col>
                                <Col span="5">
                                    <span class="span_space">应用名称</span>
                                    <Select v-model="searchapplication" style="width:200px">
                                        <Option v-for="item in applicationdatalist" :value="item.appName" :key="item.appName">{{ item.appName }}</Option>
                                    </Select>
                                </Col>
                                <Col span="5">
                                    <span class="span_space">点击ID</span>
                                    <Input placeholder="请输入查询ID" style="width: 200px" v-model="searchclickID"/>
                                </Col>
                                <Col span="9">
                                    <div style="float:right">
                                        <Button @click="queryclicklist()" type="primary" icon="ios-search">查询</Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <!-- 查询选择 E -->
                    <div>
                        <Table :columns="columns1" border :data="resultslist" :loading="isloading"></Table>
                        <Row>
                            <Page class-name="page" :total="total" :current="pageIndex" :page-size="pageSize" :page-size-opts="[10,20,30,50]" show-sizer show-elevator @on-change="changePageIndex" @on-page-size-change="changePageSize"/>
                        </Row>
                        <!-- 分页器 E -->
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    // var data = require("./mock/mock.js");

    export default {
        data() {
            return {
                startTime: "",
                endTime: "",
                pageIndex: 1,
                searchchannel: "",
                searchapplication: "",
                searchclickID: "",
                pageSize: 10,
                total: 0,
                // 渠道二级下拉
                channeldatalist: [
                    {
                        channelId: "1",
                        channelName: "323",
                        level: "2",
                        notifyUrl: "3232",
                        callback_params: "3232",
                        response: "3232",
                        successRespKey: "3232",
                        remarks: "323",
                        createTime: "32323"
                    }
                ],
                // 应用名称下拉
                applicationdatalist: [],
                isloading: true,
                // Table表格数据
                resultslist: [],
                columns1: [
                    {
                        title: this.$t("clickId"),
                        key: "clickid",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("nameOfPreferential"),
                        key: "nameofpreferential",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("channelId"),
                        key: "channelid",
                        // sortable: true,
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("channel"),
                        key: "channel",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("subchannelParameter"),
                        key: "subchannelparameter",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("noticeTheResults"),
                        key: "notictheresults",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("clickOnTheTime"),
                        key: "clickonthetime",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("noticeTheTime"),
                        key: "noticethetime",
                        align: "center",
                        minWidth: 50
                    }
                ]
            };
        },
        methods: {
            //改变页码
            changePageIndex(pageIndex) {
                this.pageIndex = pageIndex;
                this.queryclicklist();
            },
            //改变每页得条数
            changePageSize(pageSize) {
                this.pageSize = pageSize;
                this.pageIndex = 1;
                this.queryclicklist();
            },
            // 默认查询
            changedate(data1, data2) {
                return {
                    data1,
                    data2
                };
            },
            //开始时间
            changedatestart(data) {
                this.startTime = data;
            },
            //结束时间
            changedateend(data) {
                this.endTime = data;
            },

            // timestampToTime(data) {
            //     var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            //     Y = date.getFullYear() + "-";
            //     M =
            //         (date.getMonth() + 1 < 10
            //             ? "0" + (date.getMonth() + 1)
            //             : date.getMonth() + 1) + "-";
            //     D = date.getDate() + " ";
            //     h = date.getHours() + ":";
            //     m = date.getMinutes() + ":";
            //     s = date.getSeconds();
            //     return Y + M + D + h + m + s;
            // },

            queryclicklist() {
                // console.log(111);
                let url = "/click/query";
                let ref = this;
                var params = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    clickId: this.searchclickID,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    channel: this.searchchannel,
                    appName: this.searchapplication
                };
                this.$http.post(url, params).then(res => {
                    if (res && res.resultCode == "0") {
                        ref.resultslist = res.data;
                        ref.total = res.total;
                    }
                    ref.isloading = false;
                });
            },

            //默认下拉查询渠道
            querychannel() {
                let url = "/channel/query";
                let ref = this;
                var params = {
                    //查询类型
                    queryType: 0
                };
                this.$http.post(url, params).then(res => {
                    if (res && res.resultCode == "0") {
                        ref.channeldatalist = res.data;
                        ref.channeldatalist = ref.channeldatalist.filter(item => {
                            return item.level == 2;
                        });
                    }
                });
            },
            queryaplication() {
                let url = "/app/query";
                let ref = this;
                var params = {
                    queryType: 0
                };
                this.$http.post(url, params).then(res => {
                    if (res && res.resultCode == "0") {
                        ref.applicationdatalist = res.data;
                    }
                });
            }
        },
        computed: {},

        created() {
            this.querychannel();
            this.queryaplication();
            this.queryclicklist();
        },
        computed: {}
    };
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
</style>