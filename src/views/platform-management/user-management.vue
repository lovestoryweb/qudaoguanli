<style>
/*    body .ivu-modal .ivu-select-dropdown{
        position: fixed !important;
    }*/
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
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div slot="title">
                        <Button type="primary" @click="showAdd">
                            <Icon type="plus-round"></Icon>&nbsp;{{$t('addBtn')}}  
                        </Button>
                        <div style="float:right;">
                            <Select :placeholder="$t('selectPlaceholder')" v-model="type" style="width:200px;">
                                <Option value="">{{$t('selectPlaceholder')}}</Option>
                                <Option v-for="item in typeList" :value="item.key" :key="item.key">{{ item.value }}</Option>
                            </Select>
                            <Button type="primary" icon="ios-search" @click="searchUserByType">{{$t('search')}}</Button>
                        </div>
                    </div>
                    <div>
                        <Table border :columns="columns" :data="data" :loading="loadingTable" :no-data-text="$t('noResult')"></Table>
                        <Row>
                            <Page class-name="page" :current="1" :total="total" @on-change="changePageIndex"></Page>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <!-- 新增弹窗 -->
            <Modal
                v-model="isShowAdd"
                :title="$t('addUserTitle')"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <Form ref="newUser" :model="newUser" :rules="ruleNewUser" :label-width="180">
                        <FormItem :label="$t('userAccountField')" prop="account">
                            <Input v-model="newUser.account" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('userNameCol')" prop="cpName">
                            <Input v-model="newUser.cpName" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('userPasswordField')" prop="password">
                            <Input v-model="newUser.password" class="user_field" type="password"></Input>
                        </FormItem>
                        <FormItem :label="$t('userConfirmPasswordField')" prop="confirmPassword">
                            <Input v-model="newUser.confirmPassword" class="user_field" type="password"></Input>
                        </FormItem>
                        <FormItem :label="$t('userTelField')">
                            <Input v-model="newUser.tel" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('userTypeField')" prop="type">
                            {{newUser.type}}
                            <Select v-model="newUser.type" class="user_field" :placeholder="$t('selectPlaceholder')">
                                <!-- <Option value="0">{{$t('channelEmployee')}}</Option> -->
                                <Option v-for="item in typeList" :value="item.key" :key="item.key">
                                    {{item.value}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem :label="$t('userEnableCol')" prop="cpStatus" v-show="newUser.type==1">
                            <i-switch v-model="newUser.cpStatus" true-value="0" false-value="1" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                        </FormItem>
                    </Form>
                    <div class="mask" v-show="isClickedAdd"></div>
                </Card>
               <div slot="footer">
                    <Button @click="cancelAdd()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedAdd" @click="add()">{{$t('saveBtn')}}</Button>
                </div>
            </Modal>
            <!-- 编辑弹窗 -->
            <Modal
                v-model="isShowEdit"
                :title="$t('editUserTitle')"
                width="800px">
                <Card :bordered="false" dis-hover>
                    <Form ref="user" :model="user" :rules="ruleUser" :label-width="180">
                        <FormItem :label="$t('userAccountField')" prop="account">
                            <Input v-model="user.account" class="user_field" disabled></Input>
                        </FormItem>
                        <FormItem :label="$t('userNameCol')" prop="cpName">
                            <Input v-model="user.cpName" class="user_field"></Input>
                        </FormItem>
                        </FormItem>
                        <FormItem :label="$t('userTelField')">
                            <Input v-model="user.tel" class="user_field"></Input>
                        </FormItem>
                        <FormItem :label="$t('userTypeField')" prop="type">
                            <Select v-model="user.type" class="user_field" :placeholder="$t('selectPlaceholder')" disabled>
                                <!-- <Option value="0">{{$t('channelEmployee')}}</Option> -->
                                <Option v-for="item in typeList" :value="item.key" :key="item.key">
                                    {{item.value}}
                                </Option>
                            </Select>
                        </FormItem>
                        <!-- <FormItem :label="$t('userEnableCol')" prop="cpStatus">
                            <i-switch v-model="user.cpStatus" true-value="0" false-value="1" size="large">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem> -->
                    </Form>
                    <div class="mask" v-show="isClickedEdit"></div>
                </Card>
               <div slot="footer">
                    <Button @click="cancelEdit()">{{$t('cancelBtn')}}</Button>
                    <Button type="primary" :loading="isClickedEdit" @click="edit()">{{$t('saveBtn')}}</Button>
                </div>
            </Modal>
        </Row>
    </div>
    
</template>

<script>
export default {
    name: 'userManagement',
    data () {
        const valideAccount = (rule, value, callback) => {
            if (!!value) {
                let reg = /^[0-9a-zA-Z!@#$%^&*]+$/;
                if(!reg.test(value))
                {
                    callback(new Error(this.$t('accountValidateMsg')));
                    return;
                }    
                //包含中文正则
                // let cnPattern = /[\u4E00-\u9FA5]/;
                // if(cnPattern.test(value))
                // {
                //     callback(new Error(this.$t('accountValidateCnMsg')));
                //     return;
                // }    
                
                let url = '/market/portal/cp/queryCpByAccount';
                let ref = this;
                var params = {
                    account: value
                };
                this.$http.post(url, params).then(
                    function(res){
                        if(!!res && res.resultCode == '0'){
                            var data = res.data;
                            if(data){
                                callback(new Error(ref.$t('accountWarning')));
                            }else{
                                callback();
                            }
                            return;
                        }else{
                            callback(new Error(ref.$t('accountFailedWarning')));
                        }
                    }
                );
            }else{
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('passwordWarning')));
            } else {
                if (this.newUser.confirmPassword !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.newUser.validateField('confirmPassword');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('enterPasswordAgainWarning')));
            } else if (value !== this.newUser.password) {
                callback(new Error(this.$t('passwordNotSameWarning')));
            } else {
                callback();
            }
        };
        return {
            pageIndex: 1,   //查询页码
            pageSize: 10,   //查询大小
            total: 0, //总数  
            type: null, //用户类型检索条件
            loadingTable: true,    //表格是否loading
            isLoadingEdits: [],   //是否loading编辑按钮数组
            isLoadingenableDisables: [],    //是否loading启用禁用按钮数组
            isShowEdit: false,  //是否展示编辑弹窗
            isClickedEdit: false,   //是否正在发送编辑请求
            isShowDel: false,   //是否展示删除弹窗
            isShowAdd: false,   //是否展示新增弹窗
            isClickedAdd: false,   //是否正在发送新增请求
            typeList:[
                {
                    key: 1,
                    value: this.$t('CPStaff')
                },{
                    key: 2,
                    value: this.$t('admin')
                }
            ],
            user:{
                cpId: '',
                account: '',
                cpName: '',
                tel: '',
                type: ''
                // cpStatus: '0'   //启用
            },  //选中编辑的用户对象
            ruleUser:{
                account: [
                    { required: true,message: this.$t('userAccountWarning'),trigger: 'blur' }
                ],
                cpName: [
                    { required: true,message: this.$t('userNameWarning'),trigger: 'blur' }
                ],
                type: [
                    { required: true, message: this.$t('userTypeWarning'),type:'number',trigger: 'change'}
                ]/*,
                cpStatus: [
                    { required: true, message: "", trigger: 'click' }
                ]*/
            },
            newUser:{
                account: '',
                cpName: '',
                password: '',
                confirmPassword: '',
                tel: '',
                type: '',
                cpStatus: '0'   //启用
            },  //新增用户对象
            ruleNewUser:{
                account: [
                    { required: true,message: this.$t('userAccountWarning'),trigger: 'blur' },
                    { validator: valideAccount,trigger: 'blur' }
                ],
                cpName: [
                    { required: true,message: this.$t('userNameWarning'),trigger: 'blur' }
                ],
                password: [
                    { required: true,validator: validatePass, trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true,validator: validatePassCheck, trigger: 'blur' }
                ],
                type: [
                    { required: true, message: this.$t('userTypeWarning'),type:'number', trigger: 'change' }
                ],
                cpStatus: [
                    { required: true, message: "", trigger: 'click' }
                ]
            },
            columns: [
                    {
                        name: '',
                        key: 'index',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('span',params.index+1+(this.pageIndex-1)*this.pageSize)
                        }
                    },
                    {
                        title: this.$t('accountCol'),
                        key: 'account',
                        align:"center"
                    },
                    {
                        title: this.$t('userNameCol'),
                        key: 'cpName',
                        align:"center"
                    },
                    {
                        title: this.$t('userTypeCol'),
                        key: 'type',
                        align:"center",
                        render: (h, params) => {
                            // if(params.row.userType == '0'){
                            //     return h('span',this.$t('channelEmployee'))
                            // }
                            if(params.row.type == '1'){
                                return h('span',this.$t('CPStaff'))
                            }
                            if(params.row.type == '2'){
                                return h('span',this.$t('admin'))
                            }
                        }
                    },
                    {
                        title: this.$t('userEnableCol'),
                        key: 'cpStatus',
                        align:"center",
                        render: (h, params) => {
                            if(params.row.cpStatus == '0'){
                                return h('span',this.$t('Yes'))
                            }else{
                                return h('span',this.$t('No'))
                            }
                        }
                    },
                    {
                        title: this.$t('operateCol'),
                        key: 'operate',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            console.log(params);
                            var enableDisableBtnName;
                            var status;
                            if(params.row.cpStatus == '1'){
                                enableDisableBtnName = this.$t('enableBtn');
                                status = '0';
                            }else if(params.row.cpStatus == '0'){
                                enableDisableBtnName = this.$t('disableBtn');
                                status = '1';
                            }
                            var enableDisableBtn = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    loading: this.isLoadingenableDisables[params.index]
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.changeStatus(params.row.cpId,params.index,status)
                                    }
                                }
                            }, enableDisableBtnName);
                           var editBtn = h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        loading: this.isLoadingEdits[params.index]
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showEdit(params.row.cpId,params.index)
                                        }
                                    }
                                }, this.$t('editBtn'));
                            var  resetPasswordBtn = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.resetPassword(params.row.cpId)
                                        }
                                    }
                                }, this.$t('resetPasswordBtn'));
                            var deleteBtn = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeUser(params.row.cpId)
                                        }
                                    }
                                }, this.$t('deleteBtn'));
                            var btns = [];                       
                            if(params.row.type==1){
                                btns.push(enableDisableBtn);
                            }
                            btns.push(editBtn);
                            btns.push(resetPasswordBtn);
                            btns.push(deleteBtn);
                            return h('div',btns);
                        }
                    }
                ],
            data: [],
        };
    },
    created() {
        this.queryUsers();
    },
    computed: {
        
    },
    watch: {
       
    },
    methods: {
        queryUsers(){
            if(!!!this.type){
                this.type = null;
            }
            let url = '/market/portal/cp/queryCpList';
            let ref = this;
            //需要传递的参数
            var params = {
                type: this.type,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$http.post(url, params).then(
                function(res){
                    ref.isLoadingEdits = [];
                    ref.isLoadingenableDisables = [];
                    ref.data = [];
                    if(!!res && res.resultCode == '0'){
                        var userList = res.data;
                        if(!!userList){
                            for(var i=0;i<userList.length;i++){
                                ref.data.push(userList[i]);
                                ref.isLoadingEdits.push(false); 
                                ref.isLoadingenableDisables.push(false);
                            }
                        }
                        ref.total = res.totalCount;
                    }
                    ref.loadingTable = false;
                }
            );
        },
        searchUserByType(){
            this.pageIndex = 1;
            this.total = 0;
            this.loadingTable = true;
            this.queryUsers();
        },
        changePageIndex(pageIndex){
            this.pageIndex = pageIndex;
            this.loadingTable = true;
            this.queryUsers();
        },
        changeStatus(cpId,index,status){
            this.isLoadingenableDisables.splice(index,1,true);
            let url = '/market/portal/cp/modifyCpStatus';
            let ref = this;
            var params = {
                cpId: cpId,
                cpStatus: status
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        if(status == '0'){
                            ref.$Message.success(ref.$t('enableSuccess'));
                        }else if(status == '1'){
                            ref.$Message.success(ref.$t('disableSuccess'));
                        }
                        ref.queryUsers();
                    }
                    ref.isLoadingenableDisables.splice(index,1,false);
                }
            );
        },
        showEdit(cpId,index){
            this.initUser();
            this.isLoadingEdits.splice(index,1,true);
            let url = '/market/portal/cp/queryCpById';
            let ref = this;
            var params = {
                cpId: cpId
            };
            this.$http.post(url, params).then(
                function(res){
                    if(!!res && res.resultCode == '0'){
                        var userData = res.data;
                        if(!!userData){
                            ref.user = userData;
                            /*ref.user.cpId = userData.cpId;
                            ref.user.account = userData.account;
                            ref.user.foreignCpName = userData.foreignCpName;
                            ref.user.cpName = userData.cpName;
                            ref.user.password = userData.password;
                            ref.user.tel = userData.tel;
                            ref.user.type = userData.type;
                            ref.user.cpStatus = userData.cpStatus;*/
                        }
                    }
                    ref.isLoadingEdits.splice(index,1,false);
                    ref.isShowEdit = true;
                }
            );
        },
        edit(){
            this.$refs['user'].validate((valid) => {
                if (valid) {
                    this.isClickedEdit = true;
                    let url = '/market/portal/cp/modify';
                    let ref = this;
                    var params = this.user;
                    this.$http.post(url, params).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('savedSuccess'));
                                ref.queryUsers();
                                ref.isShowEdit = false;
                            }
                            ref.isClickedEdit = false;
                        }
                    );
                }
            })
        },
        cancelEdit(){
           this.isShowEdit = false; 
        },
        removeUser(cpId){
            this.$Modal.confirm({
                title: this.$t('deleteConfirmationTitle'),
                content: '<p>'+this.$t('deleteConfirmContent')+'</p>',
                loading: true,
                okText: this.$t('confirmBtn'),
                cancelText: this.$t('cancelBtn'),
                onOk: () => {
                    let url = '/market/portal/cp/remove';
                    let ref = this;
                    var params = {
                        cpId: cpId
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            ref.$Modal.remove();
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('deletedSuccess'));
                                ref.queryUsers();
                            }
                        }
                    );
                }
            });
        },
        resetPassword(cpId){
            this.$Modal.confirm({
                    title: this.$t('resetPasswordConfirmationTitle'),
                    content: '<p>'+this.$t('resetPasswordContent')+'</p>',
                    loading: true,
                    okText: this.$t('confirmBtn'),
                    cancelText: this.$t('cancelBtn'),
                    onOk: () => {
                        let url = '/market/portal/cp/resetPwd';
                        let ref = this;
                        var params = {
                            cpId: cpId
                        };
                        this.$http.post(url, params).then(
                            function(res){
                                ref.$Modal.remove();
                                if(!!res && res.resultCode == '0'){
                                    //remove 方法会影响另一个弹窗，故用定时器以防止
                                    /*setTimeout(() => {
                                        ref.$Modal.success({
                                            okText: ref.$t('confirmBtn'),
                                            content: '<p>'+ref.$t('newPasswordMsg')+'&nbsp;223123</p>'
                                        });
                                    },500);*/
                                    ref.$Message.success(ref.$t('resetPasswordSuccess'));
                                }
                            }
                        );
                    }
                });
        },
        showAdd(){
            this.initNewUser();
            this.isShowAdd = true;
        },
        add(){
            this.$refs['newUser'].validate((valid) => {
                if (valid) {
                    this.isClickedAdd = true;
                    let url = '/market/portal/cp/add';
                    let ref = this;
                    var params = {
                        cpName: this.newUser.cpName,
                        account: this.newUser.account,
                        password: this.newUser.password,
                        cpStatus: this.newUser.cpStatus,
                        tel: this.newUser.tel,
                        type: this.newUser.type
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                ref.isShowAdd = false;
                                ref.$Message.success(ref.$t('savedSuccess'));
                                ref.queryUsers();
                            }
                            ref.isClickedAdd = false;
                        }
                    );
                }
            })
        },
        cancelAdd(){
            this.isShowAdd = false;
        },
        initNewUser(){
            this.$refs['newUser'].resetFields();
            this.newUser.account = '';
            this.newUser.cpName = '';
            this.newUser.foreignCpName = '';
            this.newUser.cpName = '';
            this.newUser.password = '';
            this.newUser.confirmPassword = '';
            this.newUser.tel = '';
            this.newUser.type = '';
            this.newUser.cpStatus = '0';
        },
        initUser(){
            this.$refs['user'].resetFields();
            this.user.cpId = '';
            this.user.account = '';
            this.user.foreignCpName = '';
            this.user.cpName = '';
            this.user.password = '';
            this.user.tel = '';
            this.user.type = '';
            this.user.cpStatus = '0';
        }
    }
};
</script>
