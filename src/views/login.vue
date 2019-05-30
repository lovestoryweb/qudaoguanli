<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    {{ $t('loginPlease') }}
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" :placeholder="$t('userNamePlaceholder')">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" :placeholder="$t('passwordPlaceholder')">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>{{loginBtnName}}</Button>
                            {{form.userName}}
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            loginBtnName: this.$t('loginBtn'),
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: this.$t('userAccountWarning'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('passwordWarning'), trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // this.loginBtnName = this.$t('loggingInBtn');
                    // let url = '/market/portal/user/signIn';
                    // let ref = this;
                    // var params = {
                    //     "account":this.form.userName,
                    //     "password":this.form.password
                    // };
                    // this.$http.post(url, params).then(
                    //     function(res){
                    //         ref.loginBtnName = ref.$t('loginBtn');
                    //         if(!!res && res.resultCode == '0'){
                    //             Cookies.set('user', ref.form.userName);
                    //             ref.$router.push({
                    //                 name: 'home_index'
                    //             });
                    //         }else if(!!res && res.resultCode == '999997'){
                    //             ref.$Message.error(ref.$t('accountOrPwdErrorMsg'));
                    //         }
                    //     }
                    // );
            console.log(1111)
             Cookies.set('user', this.form.userName);
             this.$router.push({
                name: 'home_index'
             });


                }
            });  
        }
    }
};

//         // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
            //         // if (this.form.userName === 'iview_admin') {
            //             // Cookies.set('access', 1);
            //             // Cookies.remove('access');
            //         // } else {
            //         //     Cookies.set('access', 1);
            //         // }



//  Cookies.set('user', this.form.userName);
//             this.$router.push({
//                 name: 'home_index'
//              });

</script>

<style>

</style>
