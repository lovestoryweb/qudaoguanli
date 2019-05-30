    <style  scoped>
    .rankingList_line{
    padding-bottom: 1.1%;
    color:#585657;
    font-size: 1em;
    font-weight: 600;
    padding: 0 0 8px 10px;
    }
    .rankingList_col_line{
    border-right:1px solid #e9eaec;
    }
    .ivu-card-body
    {
    padding:0px !important;
    }
    .rankingList_left{
        width: 49.5%;
        padding: 0;
    }
    .rankingList_right{
        width: 50%;
        padding: 0 0 0 2%;
    }
    .rankingList_col_left{
        width: 48.5%;
        padding: 1.1%;
        border-top: 1px solid #e9eaec;
    }
    .rankingList_col_left2{
        width: 51%;
        padding: 1.1%;
        border-top: 1px solid #e9eaec;
    }
    .rankingList_col_right{
        width: 48%;
        padding: 1.1%;
        border-top: 1px solid #e9eaec;
    }
    .rankingList_col_right2{
        width: 49%;
        padding: 1.1%;
        border-top: 1px solid #e9eaec;
    }
    .rankingList_col_img{
        width: 27.5px;
    }
    .rankingList_col_tabel{
    }
    .rankingList_col_tabel div{
        vertical-align: middle;
        text-align: center;
    }
    .rankingList_col_index_table
    {
        width: 100%;
    }
    .rankingList_col_index
    {
        width: 20px;
    }
    .rankingList_col_pic
    {
        width: 25px;
    }
    .rankingList_col_name{
        text-align: center;
        width: 120px; 
    }
    .rankingList_col_name_input{
        max-width: 120px; 
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;/*文本不换行*/
        text-align: left;
        padding-left: 5px;
    }
    .rankingList_col_download{
        width: 30%;
        text-align: center;

    }
    .clear{
        clear:both;
    }
</style>
<template>
    <div style="width:100%;height:100%;">
        <Row>
            <i-col span="2" class="rankingList_left rankingList_col_line">
                <div class="rankingList_line" v-text="$t('TotalAPPdownloadsranking')"></div>
                <div>
                    <i-col span="2" class="rankingList_col_left rankingList_col_line">
                        <table class="rankingList_col_index_table">
                        <tr v-for="(item,index) in appDownloadRankingList1" class="rankingList_col_tabel">
                        <td class="rankingList_col_index"  v-text="index+1"></td>
                        <td class="rankingList_col_pic" ><img :src="downPath+item.appIcon" class="rankingList_col_img" :onerror="defaultImg"/></td>
                        <td class="rankingList_col_name" ><p class="rankingList_col_name_input"  v-text="item.appName"></p></td>
                        <td class="rankingList_col_download"  v-text="item.total"></td>
                        </tr>
                        </table>
                    </i-col>
                    <i-col span="2" class="rankingList_col_right">
                        <table class="rankingList_col_index_table">
                        <tr v-for="(item,index) in appDownloadRankingList2" class="rankingList_col_tabel">
                        <td class="rankingList_col_index"  v-text="index+6"></td>
                        <td class="rankingList_col_pic" ><img :src="downPath+item.appIcon" class="rankingList_col_img" :onerror="defaultImg"></td>
                        <td class="rankingList_col_name" ><p class="rankingList_col_name_input"  v-text="item.appName"></p></td>
                        <td class="rankingList_col_download"  v-text="item.total"></td>
                        </tr>
                        </table>
                    </i-col>
                </div>
            </i-col>
            <i-col span="2" class="rankingList_right">
                <div class="rankingList_line" v-text="$t('RankingoftotalAPPlaunches')"></div>
                <div>
                    <i-col span="2" class="rankingList_col_left2 rankingList_col_line">
                        <table class="rankingList_col_index_table">
                        <tr v-for="(item,index) in appStartingRankingList1" class="rankingList_col_tabel">
                        <td class="rankingList_col_index"  v-text="index+1"></td>
                        <td class="rankingList_col_pic" ><img :src="downPath+item.appIcon" class="rankingList_col_img" :onerror="defaultImg"></td>
                        <td class="rankingList_col_name" ><p class="rankingList_col_name_input"  v-text="item.appName"></p></td>
                        <td class="rankingList_col_download"  v-text="item.total"></td>
                        </tr>
                        </table>
                    </i-col>
                    <i-col span="2" class="rankingList_col_right2">
                        <table class="rankingList_col_index_table">
                        <tr v-for="(item,index) in appStartingRankingList2" class="rankingList_col_tabel">
                        <td class="rankingList_col_index"  v-text="index+6"></td>
                        <td class="rankingList_col_pic" ><img :src="downPath+item.appIcon" class="rankingList_col_img" :onerror="defaultImg"></td>
                        <td class="rankingList_col_name" ><p class="rankingList_col_name_input"  v-text="item.appName"></p></td>
                        <td class="rankingList_col_download"  v-text="item.total"></td>
                        </tr>
                        </table>
                    </i-col>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
import util from '../../../libs/util';
export default {
    name: 'rankingList',
    data () {
        return {
            appDownloadRankingList1:[],
            appDownloadRankingList2:[],
            appStartingRankingList1:[],
            appStartingRankingList2:[],
            downPath:util.fileHeaherUrl,//图片路径
            defaultImg: 'this.src="' + require('../../../images/default_icon.png') + '"'

        };
    },
    mounted () {
        let url1 = '/market/portal/report/queryAppInTimeDownload';
        let url2 = '/market/portal/report/queryAppInTimeLanuch';
        let ref = this;
        this.$http.get(url1, null).then(function(res){
           if(!!res && res.resultCode=='0'){
                var list = res.data;
                if(!!list){
                    for (var i = 0; i < list.length; i++) {
                        if (i<5)
                         {
                            ref.appDownloadRankingList1.push(list[i]);
                         }else{
                            ref.appDownloadRankingList2.push(list[i]);
                         }
                        
                    }
                }
            } 
        });
        this.$http.get(url2, null).then(function(res){
           if(!!res && res.resultCode=='0'){
                 var list = res.data;
                if(!!list){
                    for (var i = 0; i < list.length; i++) {
                        if (i<5)
                         {
                            ref.appStartingRankingList1.push(list[i]);
                         }else{
                            ref.appStartingRankingList2.push(list[i]);
                         }
                        
                    }
                }
            } 
        });
    },
    methods:{
    loadErrorImg(tarEle, url) {
      tarEle.src = url;
    },
    }
};
</script>