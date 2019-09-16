<template>
  <div class="submit">
    <!-- 顶端提示（不知是否固定，暂时做成固定在顶端） -->
    <el-row class="submit-header" type="flex" justify="space-between">
      <el-col :span="17">{{ companyInfo.companyName }}</el-col>
      <el-col :span="7" style="text-align: right">共{{ itemNum }}条数据</el-col>
    </el-row>
    <!-- 数据页 -->
    <el-row class="gray-border submit-check-list" v-for="item in orderDataList" :key="item.label" v-bind:class="{ gray: item.disabled == true, extended: item.label == itemNum, extendedAhead: item.label == 1}">
      <!-- 单选 -->
      <el-col class="submit-radio" :span="3">
        <!-- 如果流水号是唯一的，那可以用流水号做key，不过还没有格式下来所以暂时随便写一个label作为key -->
        <!-- 单选框按钮样式根据是否选中来切换背景图 -->
        <el-radio v-bind:class="{ radioIsChecked: submitForm.radioMain == item.label, radioNotChecked: submitForm.radioMain != item.label }" class="radio-circle radio-no-label" v-model="submitForm.radioMain" :label="item.label" :disabled="item.disabled" @change="handleRadioChange"></el-radio>
      </el-col>
      <!-- 信息，如果信息数量多的话做成v-for会更好 -->
      <el-col class="submit-info" :span="21">
        <el-row>
          <el-col :sm="3" :span="7" class="submit-info-label">流水号</el-col>
          <el-col :xs="15" :offset="2" :span="15" class="submit-info-text">{{ item.id }}</el-col>
        </el-row>
        <el-row>
          <el-col :sm="3" :span="7" class="submit-info-label">客户姓名</el-col>
          <el-col :xs="15" :offset="2" :span="15" class="submit-info-text">{{ item.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :sm="3" :span="7" class="submit-info-label">时间</el-col>
          <el-col :xs="15" :offset="2" :span="15" class="submit-info-text">{{ item.date }}</el-col>
        </el-row>
        <el-row>
          <el-col :sm="3" :span="7" class="submit-info-label">金额</el-col>
          <el-col :xs="15" :offset="2" :span="15" class="submit-info-text">{{ item.number }}</el-col>
        </el-row>
        <el-row>
          <el-col :sm="3" :span="7" class="submit-info-label">项目名称</el-col>
          <el-col :xs="15" :offset="2" :span="15" class="submit-info-text">
            <el-row v-for="(key, value) in item.prjName" :key="value">
              <!-- 单选框按钮样式根据是否选中来切换背景图 -->
              <el-radio v-bind:class="{ radioIsChecked: submitForm.radioSub == value, radioNotChecked: submitForm.radioSub != value }" @change="handleRadioSubChange()" v-model="submitForm.radioSub" :label="value" :disabled="item.disabled" :checked="true"></el-radio>
              <span class="submit-radio-text">{{ key }}</span>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 固定在底端的开票按钮 -->
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="handleSubmit">开票</el-button>
    </el-row>
  </div>
</template>
<script>
  import { fetchOrderIssue } from '../api'
  export default {
    name: 'Submit',
    data: function () {
      return {
        companyInfo: {
          companyName: ''
        },
        orderDataList: [],                                   // 页面展示的数据
        goodsCodeTemp: {'1': '临床研究费', '2': '伦理费'},    // 产品编号以及对应的标签名，目前只有这两种
        // orderDataListTemp: [                             // 测试用，页面展示数据的格式
        //   {label: '1', id: '12132312312312', name: '张三', date: '2019-03-21', number: '1232.00', prjName: { '1-1': '临床研究费', '1-2': '伦理费'}, disabled: false},
        //   {label: '2', id: '12132312312313', name: '张三', date: '2019-03-22', number: '1236.00', prjName: { '2-1': '临床研究费', '2-2': '伦理费'}, disabled: false},
        //   {label: '3', id: '12132312312314', name: '张三', date: '2019-03-23', number: '12377.00', prjName: { '3-1': '临床研究费', '3-2': '伦理费'}, disabled: true},
        // ],
        submitForm: {                                        // 页面内选择器的选项内容
          radioMain: '',
          radioSub: ''
        }
      }
    },
    methods: {
      // 准备优化成点击整个开票数据项的时候都能切换选择项
      // 但是可能因为点击点难以判断的原因，此处理方法无法生效，暂时搁置
      clickRow: function (label) {
        console.log(label)
        this.submitForm.radioMain = label
      },
      // 在传回数据的基础上处理成页面显示的数据
      loadOrderData: function () {
        let orderData = this.$store.getters.getOrderData
        if (orderData) {
          for (let i = 0; i < orderData.length; i++) {
            let item = {
              label: (i + 1).toString(),                                // 开票序号
              id: orderData[i].id,                                      // 流水号
              name: orderData[i].payerAcctName,                         // 纳税人名字
              date: orderData[i].transTime.substr(0, 11),               // 时间字段里面的日期的部分
              number: orderData[i].transAmount,                         // 金额
              prjName: {},                                              // 产品编号，待根据完整数据调整
              disabled: orderData[i].invoiceStatus == 2 ? true : false  // 是否已经开票
            }
            // 添加项目名，因为测试数据传回来的没有goodsCode，所以只能按照设计图的设计强行加进来
            // 如果在查询过程中得到的结果中就包含了完整的数据标号的话，这里会有不同的添加方法
            for (var good in this.goodsCodeTemp) {
              let label = (i + 1).toString() + '-' + good
              item['prjName'][label] = this.goodsCodeTemp[good]
            }
            this.orderDataList.push(item)
          }
        } else {
          this.$message({
            type: 'error',
            message: '请重新查询'
          })
        }
      },
      // 跟随主项目的选择对辅选择项目内容进行更变
      // 主项目变化的时候，默认选择产品编号为1的辅选项
      handleRadioChange: function () {
        this.submitForm.radioSub = this.submitForm.radioMain + '-1'
      },
      handleRadioSubChange: function () {
        this.submitForm.radioMain = this.submitForm.radioSub.substr(0, 1)
      },
      // 递交开票申请
      handleSubmit: function () {
        let that = this;
        if (that.submitForm.radioMain != '') {
          let params = {
            goodsCode: that.submitForm.radioSub.split('-')[1],
            id: that.orderDataList[parseInt(that.submitForm.radioMain) - 1]['id']
          }
          fetchOrderIssue(params).then((res) => {
            if (res.status == 200) {
            let retData = res.data
              if (retData.code == 1) {
                let url = retData.data
                // // 考虑到可能需要连续提交同一天内多张票据，不移除数据。
                // that.$store.dispatch('removeOrderData')
                // // 提示成功信息
                // that.$message({
                //   type: 'success',
                //   message: retData.message
                // })
                // // 跳转网页
                window.location.href = url
              }
            } else {
              that.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        } else {
          that.$message({
            type: 'error',
            message: '请选择开票项目！'
          });
        }
      }
    },
    computed: {
      // 一共有多少条开票数据
      itemNum: function () {
        return this.orderDataList.length
      }
    },
    mounted: function () {
      this.companyInfo.companyName = this.$store.getters.getCompanyName
      this.loadOrderData()
    }
  }
</script>
<style lang="less">
  .gray {
    color: #E4E4E4;
  }
  .extended {
    margin-bottom: 100px;
  }
  .extendedAhead {
    margin-top: 40px;
  }
  .gray-border {
    border: 1px #E4E4E4 solid;
    border-top: 0px;
  }

  .submit {
    // radio内部样式
    .el-radio__inner {
      border: 1px solid #539BFD;
      border-radius: 100%;
    }
    .el-radio__inner::after {
      width: 0px;
      height: 0px;
      // 清除原本样式
      content: "";
    }

    .submit-header {
      z-index: 5;
      position: fixed;
      width: 100%;
      top: 0;
      padding: 10px 20px 10px 20px;
      color: white;
      background: linear-gradient(to right, #539BFD, #8BCBFF);
      .submit-header > .el-col {
        text-align: right;
      }
    }

    .submit-check-list {
      min-height: 180px;

      // 关于单选框的样式设置见下
      .el-radio__label {
        display: none;
      }
      .el-radio__inner {
        border: 0px;
        background-color: transparent;
      }
      .el-radio__input {
        overflow: hidden;
        height: 100%;
        width: 100%;
      }
      .radioIsChecked {
        background: url('../assets/blue.png') no-repeat;
        background-size: 100%;
      }
      .radioNotChecked {
        background: url('../assets/gray.png') no-repeat;
        background-size: 100%;
      }

      .submit-radio {
        // 总单选框栏的高度
        height: 30vh;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-radio {
        }
        .el-radio__inner {
          height: 7vw;
          width: 7vw;
        }
        .el-radio__inner::after {
          left: 27%;
          top: 18%;
        }
      }

      .submit-info {
        // 信息栏的内边距
        padding: 5vw;
        border: 1px #E4E4E4 solid;
        border-top: 0;
        border-bottom: 0;

        .submit-info-label {
          // width: 23vw;
          // padding: 0 16px 0 0;
          // 两端文字对齐
          text-align: justify;
          max-height: 40px;
        }
        .submit-info-label:after {
          display: inline-block;
          width: 100%;
          content: '';
          height: 0;
        }
        .el-radio {
          margin-right: 10px;
        }
        .el-radio__inner {
          height: 5vw;
          width: 5vw;
        }
        
      }
      
    }
  
    .el-button {
      position: fixed;
      bottom: 30px;
      border-radius: 30px;
      //max-width: 280px;
      width: 85vw;
    }
  }
</style>