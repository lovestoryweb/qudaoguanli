<style lang="less">
    @import './own-space.less';
</style>

<style scoped>
    .user_field {
        width: 400px;
    }
    .user_field_modal {
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
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                {{$t('personalInformation')}}
            </p>
            <div>
                <Form ref="userForm" :model="userForm" :label-width="150" label-position="right" :rules="infoValidate">
                    <FormItem :label="$t('userAccountField')">
                        <Input v-model="userForm.account" class="user_field" disabled></Input>
                    </FormItem>
                    <FormItem :label="$t('userNameCol')" prop="cpName">
                        <Input v-model="userForm.cpName" class="user_field"></Input>
                    </FormItem>
                    <FormItem :label="$t('userTelField')">
                            <Input v-model="userForm.tel" class="user_field"></Input>
                    </FormItem>
                    <FormItem :label="$t('userPasswordField')">
                        <Button type="text" size="small" @click="showEditPassword">{{$t('changePassword')}}</Button>
                    </FormItem>
                    <div style="margin-left:150px;">
                        <Button style="width: 100px;" @click="cancelEditUserInfor">{{$t('cancelBtn')}}</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">{{$t('saveBtn')}}</Button>
                    </div>
                </Form>
            </div>
            <div class="mask" v-show="save_loading"></div>
        </Card>
        <Modal v-model="editPasswordModal" :closable="false" :mask-closable="false" width="800px">
            <h3 slot="header" style="color:#2D8CF0">{{$t('changePassword')}}</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :rules="passwordValidate" :label-width="180">
                <FormItem :label="$t('oldPassword')" prop="oldPass">
                    <Input v-model="editPasswordForm.oldPass" class="user_field_modal" :placeholder="$t('currentPasswordPlaceholder')" type="password"></Input>
                </FormItem>
                <FormItem :label="$t('newPassword')" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" class="user_field_modal" :placeholder="$t('newPasswordPlaceholder')" type="password"></Input>
                </FormItem>
                <FormItem :label="$t('confirmNewPassword')" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" class="user_field_modal" :placeholder="$t('newPasswordAgainplaceholder')" type="password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancelEditPass">{{$t('cancelBtn')}}</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">{{$t('saveBtn')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'ownspaceIndex',
    data () {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error(this.$t('passwordNotSameWarning')));
            } else {
                callback();
            }
        };
        return {
            userForm: {
                cpId: '',
                account: '',
                cpName: '',
                tel: ''
            },
            save_loading: false,
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            infoValidate: {
                cpName: [
                    { required: true,message: this.$t('userNameWarning'),trigger: 'blur' }
                ]
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: this.$t('enterOldPasswordWarning'), trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: this.$t('enterNewPasswordWarning'), trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: this.$t('enterNewPasswordAgainWarning'), trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo(){
            let url = "/market/portal/cp/queryLoginCpInfo";
            let ref = this;
            var params = {};
            this.$http.post(url, params).then(
                function(res){
                    if(!!ref && res.resultCode == '0' && !!res.data){
                        ref.userForm.cpId =  res.data.cpId;
                        ref.userForm.account =  res.data.account;
                        ref.userForm.foreignCpName =  res.data.foreignCpName;
                        ref.userForm.cpName =  res.data.cpName;
                        ref.userForm.tel =  res.data.tel;
                    }
                }
            );
        },
        showEditPassword () {
            this.initEditPass ();
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspaceIndex');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.save_loading = true;
                    let url = '/market/portal/cp/modify';
                    let ref = this;
                    var params = this.userForm;
                    this.$http.post(url, params).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                ref.$Message.success(ref.$t('savedSuccess'));
                            }
                            ref.save_loading = false;
                        }
                    );
                }
            });
        },
        cancelEditPass () {
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    let url = '/market/portal/cp/modifyPwd';
                    let ref = this;
                    var params = {
                        password: this.editPasswordForm.oldPass,
                        newPassword: this.editPasswordForm.newPass
                    };
                    this.$http.post(url, params).then(
                        function(res){
                            if(!!res && res.resultCode == '0'){
                                ref.editPasswordModal = false;
                                ref.$Message.success(ref.$t('savedSuccess'));
                                Cookies.remove('user');
                            }
                            ref.savePassLoading = false;
                        }
                    );
                }
            });
        },
        initEditPass () {
            this.$refs['editPasswordForm'].resetFields();
        }
    },
    mounted () {
    }
};
</script>
