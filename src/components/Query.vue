<template>
  <div class="query">
    <!-- 信息框 -->
    <el-row class="company-info">
      <el-row type="flex" justify="center">
        <el-image class="company-icon" :src="imageUrl" :fit="'fill'"></el-image>
      </el-row>
      <el-row type="flex" justify="center">
        <h3>{{ companyInfo.companyName }}</h3>
      </el-row>
    </el-row>
    <!-- 输入框 -->
    <el-row class="query-form">
      <!-- 注意这里的ref和:rules属性 -->
      <el-form :rules="rulesQuery" :label-position="labelPosition" :model="submitForm" ref="submitForm" label-width="80px">
        <el-form-item label="税号">
          <el-input v-model="submitForm.taxId"></el-input>
          <!-- <span>{{ submitForm.taxId }}</span> -->
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input clearable style="max-width: 220px" v-model="submitForm.clientName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="submitForm.queryTime" type="date" placeholder="请输入交易时间"></el-date-picker>
        </el-form-item>
        <!-- 表单验证的时候除了在el-form里面设置:rules属性和ref属性（注册组件，用于核对输入是否正确），还需要设置el-form-item对应需要检查属性的prop为rules内对应检查方法的名字 -->
        <el-form-item label="金额" prop="queryAmount">
          <el-input clearable style="max-width: 220px" v-model="submitForm.queryAmount" placeholder="请输入交易金额"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button style="width: 80vw;" type="primary" @click="handleSubmit">查询</el-button>
      </el-row>
    </el-row>
  </div>
</template>
<script>
  import { fetchOrder, fetchCompanyInfo } from '../api'
  export default {
    name: 'Query',
    data: function () {
      return {
        labelPosition: 'right',
        companyInfo: {
          companyName: ''
        },
        submitForm: {
          taxId: '',
          clientName: '',
          queryTime: '',
          queryAmount: ''
        },
        imageUrl: require('static/icon.png'),      // webpack打包的原因，如果直接写url会当做字符串处理
        rulesQuery: {
          queryAmount: [
            {pattern: /^[\d\.]*$/, message: '金额只能是数字', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 递交查询请求
      handleSubmit: function () {
        const that = this;
        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            let params = {
              payerAcctName: that.submitForm.clientName,
              taxNumber: that.submitForm.taxId,
              transAmount: that.submitForm.queryAmount,
              transTime: (this.submitForm.queryTime).pattern('yyyy-MM-dd')
            }
            fetchOrder(params).then((res) => {
              if (res.status == 200) {
                let retData = res.data
                if (retData.code == 1) {
                  // 储存公司信息与查询获得的开票信息数组，待跳转到开票页面后继续使用
                  let sesData = {
                    data: retData.data,
                    name: that.companyInfo.companyName
                  }
                  this.$store.dispatch('setOrderData', sesData)
                  that.$message({
                    type: 'success',
                    message: retData.message
                  })
                  this.$router.push('/submit')
                } else {
                  that.$message({
                    type: 'error',
                    message: retData.message
                  })
                }
              } else {
                that.$message({
                  type: 'error',
                  message: res.statusText
                })
              }
            })
          } else {
            that.$message({
              type: 'error',
              message: '请检查输入项是否正确！'
            })
          }
        })

      },
      // 根据提供的URL地址截取税号并用其查询获得公司信息
      loadCompanyInfo: function (path) {
        // 用正则匹配taxCode后面的数字串
        let e = /(?:taxCode=)(\d+)/
        let taxCode = e.exec(path)[1]
        let params = {
          taxCode: taxCode
        }
        fetchCompanyInfo(params).then(res => {
          if (res.data.code == 1) {
            let retData = res.data.data
            this.companyInfo.companyName = retData.sellerName
            this.submitForm.taxId = retData.sellerTaxCode
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }
    },
    mounted: function () {
      // 根据URL获取税号并加载公司信息
      // 另外，获取URL的方法暂时是个谜（截止0916）
      this.loadCompanyInfo('http://ip:port/xxx/?taxCode=913301050609810663')
      // console.log('当前完整路径：', this.$route.path)
      // 日期选择器的默认输入是当天的日期
      this.submitForm.queryTime = new Date()
    }
  }
</script>
<style lang="less">
  .query {
    height: 100%;
    width: 100%;

    .company-info {
      //max-height: calc(~'343px');
      width: 100%;
      padding: 3vh 0vh 5vh 0vh;
      //背景图
      background-image: url('~static/bg.png');
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;

      // 公司名称文字
      h3 {
        font-weight: normal;
        margin: 0;
      }

      // 公司图标头像
      .company-icon {
        height: 100px;
        width: 100px;
        margin: 0vh 0vh 2vh 0vh;
        // 头像框设置为圆形
        border-radius: 50%;
        overflow: hidden;
      }
    }

    .query-form {
      // margin-left: 10px;
      padding: 3vh 8vw 0 8vw;

      .el-form-item__label {
        padding: 0 14px 0 0;
        // 两端文字对齐
        text-align: justify;
        max-height: 40px;
        color: black;
      }
      // 两端文字对齐
      .el-form-item__label:after {
        display: inline-block;
        width: 100%;
        content: '';
        height: 0;
      }
      // 隐藏输入框的边框
      .el-input__inner {
        border: hidden;
      }
      // 设置提交表单按钮样式
      .el-button {
        // margin-top: 5vh;
        text-align: center;
        //line-hight: calc(7vh - 2vw);
        border-radius: 30px;
        max-width: 280px;
        //height: calc(7vh - 2vw);
      }
    }

  }
</style>