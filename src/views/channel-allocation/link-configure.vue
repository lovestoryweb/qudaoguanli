<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <!-- <div slot="title">
                         <span>{{$t('country')}}</span>
                         <Select v-model="model3" class="theme_searchfield">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <span>{{$t('operator')}}</span>
                         <Select v-model="model3" class="theme_searchfield">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <span>{{$t('gameName')}}</span>
                         <Select v-model="model3" class="theme_searchfield">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <span>{{$t('platform')}}</span>
                         <Select v-model="model3" class="theme_searchfield">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div style="float:right;">
                            <Button type="primary" icon="ios-search" @click="searchUserByType">{{$t('search')}}</Button>
                        </div>
                    </div> -->
                    <div>
                        <div class="btndiv">
                            <Button type="primary" @click="showAdd()">
                                <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
                            </Button>
                            {{isonoff}}
                        </div>
                        <Table border :columns="columns1" :data="data1" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="1" :total="total" @on-change="changePageIndex"></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped lang='less'>

</style>