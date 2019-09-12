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
          <el-input style="max-width: 220px" v-model="submitForm.clientName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="submitForm.queryTime" type="date" placeholder="请输入交易时间"></el-date-picker>
        </el-form-item>
        <!-- 表单验证的时候除了在el-form里面设置:rules属性和ref属性（注册组件，用于核对输入是否正确），还需要设置el-form-item对应需要检查属性的prop为rules内对应检查方法的名字 -->
        <el-form-item label="金额" prop="queryAmount">
          <el-input style="max-width: 220px" v-model="submitForm.queryAmount" placeholder="请输入交易金额"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button style="width: 80vw;" type="primary" @click="handleSubmit">查询</el-button>
      </el-row>
    </el-row>
  </div>
</template>
<script>
  import { fetchOrder } from '../api'
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
        imageUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
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
                  that.$message({
                    type: 'success',
                    message: retData.message
                  })
                  this.$store.dispatch('setOrderData', retData.data)
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

      }
    },
    mounted: function () {
      this.companyInfo.companyName = '浙江省肿瘤医院'     // 暂时写死
      this.submitForm.taxId = '913301050609810663'       // 暂时写死
      this.submitForm.queryTime = new Date()             // 默认输入是当天的日期
    }
  }
</script>
<style lang="less">
  .query {
    height: 100%;
    width: 100%;

    .company-info {
      max-height: 30%;
      width: 100%;
      padding: 5vh 0vh 8vh 0vh;
      //背景图
      //background: linear-gradient(lightblue, #FFF), url('../assets/bg.png');
      background-image: url('../assets/bg.png');
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
        margin: 0vh 0vh 5vh 0vh;
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