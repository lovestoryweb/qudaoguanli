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
                                <Col :xs="12" :lg="5">
                                    <span>{{$t('TheChildChannel')}}</span>
                                    <Select v-model="subChannel" style="width:200px">
                                        <Option v-for="item in channeldatalist" :value="item.channelId" :key="item.channelId">{{ item.channelId }}</Option>
                                    </Select>
                                </Col>
                                <Col :xs="12" :lg="5">
                                    <span>{{$t('nameOfPreferential')}}</span>
                                    <Select v-model="nameOfPreferential" style="width:200px">
                                        <Option v-for="item in channeldatalist" :value="item.nameOfPreferential" :key="item.nameOfPreferential">{{ item.nameOfPreferential}}</Option>
                                    </Select>
                                </Col>

                                <Col :xs="12" :lg="14">
                                    <div style="float:right">
                                        <Button type="primary" @click="queryclicklist" icon="ios-search">{{$t('search')}}</Button>
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
    export default {
        data() {
            return {
                // 应用名称

                startTime: "",
                endTime: "",
                subChannel: "",
                pageIndex: 1,
                pageSize: 10,
                total: 0,
                searchchannel: "",
                searchapplication: "",
                nameOfPreferential: "",

                applicationdatalist: [],
                // loading判断
                isloading: true,
                // Table表格数据
                resultslist: [],
                //下拉框数据
                channeldatalist: [
                    {
                        clickId: 2322,
                        nameOfPreferential: "appname",
                        channelId: "ewdafs",
                        channel: "1223e",
                        subchannelParameter: "1232",
                        channelLinks: "1rwa",
                        channelClickID: "1eqqeq",
                        clickOnTheTime: "3212"
                    }
                ],
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
                        key: "subchannelParameter",
                        align: "center",
                        minWidth: 50
                    },

                    {
                        title: this.$t("channelLinks"),
                        key: "channelLinks",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("channelClickID"),
                        key: "channelClickID",
                        align: "center",
                        minWidth: 50
                    },
                    {
                        title: this.$t("clickOnTheTime"),
                        key: "clickonthetime",
                        align: "center",
                        minWidth: 50
                    }
                ]
            };
        },
        methods: {
            //分页
            changePageIndex(pageIndex) {
                this.pageIndex = pageIndex;
                this.queryclicklist();
            },

            //分页
            changePageSize(pageSize) {
                this.pageSize = pageSize;
                this.pageIndex = 1;
                this.queryclicklist();
            },

            changedatestart(data) {
                this.startTime = data;
            },
            changedateend(data) {
                this.endTime = data;
            },
            //默认请求
            queryclicklist() {
                let url = "/click/query";
                let ref = this;
                var params = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    clickId: this.searchclickID,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    channel: this.subChannel,
                    appName: this.nameOfPreferential
                };
                this.$http.post(url, params).then(res => {
                    // 如果存在进入请求
                    if (res && res.resultCode == "0") {
                        ref.resultslist = res.data;
                        ref.total = res.total;
                    }
                    //把loading改为false
                    ref.isloading = false;
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
        created() {
            this.queryclicklist();
            this.queryaplication();
        }
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