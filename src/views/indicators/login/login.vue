<template>
  <div  class="login" :style="{backgroundImage: 'url('+getBackground+')'}">
    <div v-show="!showForm"
         style="color: darkorange;font-size: 50px;position: absolute;width: 100%;background-color: white;top:0;bottom: 0;text-align: center;padding-top: 14%">
            <img src="/images/505a6a9db11844a9f0f948cb4f0c3014.gif" >
<!--      您正在进入指标管理系统，请稍后......-->
    </div>
    <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
        :style="codeEnabled==true?'height: 445px;':''"
        v-show="showForm"
    >
      <div class="theme">
        <theme-select></theme-select>
      </div>
      <div class="title">
        <img v-if="logo" :src="logo" class="logo" alt="logo"><span class="text">{{ title }}</span>
      </div>
      <el-form-item prop="username">
            <el-input v-model="loginForm.username"
                      type="text"
                      auto-complete="off"
                      placeholder="请输入账号"
                      prefix-icon="el-icon-user"
                      size="medium">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin"
                prefix-icon="el-icon-lock"
                size="medium"
            >
        </el-input>
      </el-form-item>
      <el-form-item v-if="codeEnabled" prop="code">
        <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
                size="medium"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" alt="验证码">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" class="rememberMe">
        记住我
      </el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            size="medium"
            type="primary"
            class="loginButton"
            @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer" class="footer">
      <span v-html="$store.state.settings.footerTxt"/>
      <span> ⋅ </span>
      <a href="#" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
    <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="selectRole"
        title="选择角色"
        width="300px"
        height="200px"
    >
      <el-select v-model="currentRole" style="width: 100%;">
        <el-option v-for="item in user().roles" :value="item.id" :label="item.name"/>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button type="primary" @click="goin">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {encrypt} from '@eladmin/utils/rsaEncrypt'
import Config from '@public/config/settings'
import {getCodeImg,ssoLogin} from '@eladmin/api/login'
import Cookies from 'js-cookie'
import {mapGetters, mapActions} from 'vuex'

import ThemeSelect from '@portal/components/ThemeSelect'

export default {
  name: 'Login',
  data() {
    return {
      title: Config.title,
      codeEnabled: false,
      codeUrl: '',
      cookiePass: '',
      theme: 'default',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
        loginType: ''
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', message: '用户名不能为空'}],
        password: [{required: true, trigger: 'blur', message: '密码不能为空'}],
        code: [{required: true, trigger: 'change', message: '验证码不能为空'}]
      },
      loading: false,
      redirect: undefined,
      currentRole: {id:'',name:''},
      selectRole: false,
      showForm: false
    }
  },
  components: {
    ThemeSelect
  },
  computed: {
    logo() {
      //console.log('lllllogo>>>>>', Config.logo, typeof (Config.logo))
      return Config.logo ? Config.logo : require('@portalParent/public/themes/' + this.getStyle()['style'] + '/images/logo.png')
    },
    getBackground() {
      //return '/themes/' + this.getTheme().layout + '/' + this.getTheme().style + '/images/login_bg_' + (new Date().getDay() + 1) + '.jpg'
      return Config.loginBackground ? Config.loginBackground : require('@portalParent/public/themes/' + this.getStyle().style + '/images/login_bg_' + (new Date().getDay() + 1) + '.jpg')
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    let param = getQueryObject();
    let token = param.token;
    let type = param.type;
    console.log("login token:: " + token +",loginType :: " + type)
    if(type==='sso' && token != null) {
      this.showForm = false;
      this.autoLogin(token);
    }else {
      this.showForm = true;
    }
    this.getCode()
    this.getCookie()
  },
  mounted() {
  },
  methods: {

    getCode() {
      getCodeImg().then(res => {
        this.codeEnabled = res.enabled
        if (res.enabled) {
          this.codeUrl = res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: ''
      }
    },
    autoLogin(token) {
      console.log("autoLogin ==> " + token)
      ssoLogin(token).then(res => {
         if(res.code === '00') {
           this.loginForm.username = res.username;
           this.loginForm.password = res.password;
           this.loginForm.loginType = 'sso';
           this.handleLogin();
         }
      });
    },
    handleLogin() {
      console.log("handleLogin ==>")
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid,
          loginType: this.loginForm.loginType
        }
        console.log("handleLogin ==> user " + user.loginType)
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, {expires: Config.passCookieExpires})
            Cookies.set('password', user.password, {expires: Config.passCookieExpires})
            Cookies.set('rememberMe', user.rememberMe, {expires: Config.passCookieExpires})
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', user).then(() => {
            //console.log('======dddddd======', this.user())
            if (this.user().roles != null && this.user().roles.length > 0) {
              if (this.user().roles.length > 1) {
                 console.log('=======login=====>', this.user())

                for(var i=0;i<this.user().roles.length;i++){
                  this.currentRole.id += this.user().roles[i].id+",";
                  this.currentRole.name += this.user().roles[i].name+",";
                }
                this.currentRole.id = this.currentRole.id.substr(0,this.currentRole.id.length -1);
                this.currentRole.name = this.currentRole.name.substr(0,this.currentRole.name.length -1);
                this.selectRole = false
                this.goin()
              } else if (this.user().roles.length === 1) {
                this.currentRoleid = this.user().roles[0].id
                this.currentRole.name += this.user().roles[0].name;
                this.goin()
              }
            } else {
              this.$message('当前用户没有访问该系统的权限，请联系管理员！', 'error')
            }
          }).catch((error) => {
            console.log(error)
            this.loading = false
            this.getCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goin() {
      if (!this.currentRole) {
        this.$message('请选择角色', 'error')
        return
      }
      //console.log('======goin============', this.currentRole, this.user().roles.find(e => e.id == this.currentRole))
      this.$store.dispatch('setCurrentRole', this.currentRole)
      this.$router.push({path: this.redirect || '/'})
    },
    cancel() {
      this.selectRole = false
      this.loading = false
    },
    ...mapGetters(['user', 'getStyle']),
  }
}
function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
</script>
