//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
var facepp = {
  url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
  beautify_url: 'https://api-cn.faceplusplus.com/facepp/beta/beautify',
  api_key: 'GV9wmU3MBIeOjnQqgn5qfcgJiZz5XGLl',
  api_secret: 'pzVrT9r7WfbioyDpGSUrB46kSrbLLPZM'
};
var filePath

Page({

  data: {
    unit: 0,  // rpx * unit = px

    isPopping: false,//是否已经弹出
    animPlus: {},//旋转动画
    animCollect: {},//item位移,透明度
    animTranspond: {},//item位移,透明度
    animInput: {},//item位移,透明度

    bottomPanelSlide: false,

    imgUrl: "/images/demo.jpg",
    imgWidth: null,
    imgHeight: null,

    touchStartTime: 0,  // 触摸开始时间
    touchEndTime: 0,    // 触摸结束时间
  },


  //点击弹出
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.takeback();
      this.setData({
        isPopping: false
      })
    } else {
      //弹出动画
      this.popp();
      this.setData({
        isPopping: true
      })
    }
  },
  input: function () {
    console.log("input")
  },
  transpond: function () {
    console.log("transpond")
  },
  collect: function () {
    console.log("collect")
  },

  //弹出动画
  popp: function () {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-75, -75).rotateZ(180).opacity(1).step();
    animationTranspond.translate(-105, 0).rotateZ(180).opacity(1).step();
    animationInput.translate(-75, 75).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },

  // 点空白处缩回
  unpopping: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.takeback();
      this.setData({
        isPopping: false
      })
    }
  },

  // 按钮触摸开始触发的事件 
  touchStart: function(e) { 
    this.touchStartTime = e.timeStamp

    var animationPlus = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-out'
    })
    animationPlus.scale(1.2, 1.2).step();
    this.setData({
      animPlus: animationPlus.export(),
    })
  },
  
  // 按钮触摸结束触发的事件 
  touchEnd: function(e) { 
    this.touchEndTime = e.timeStamp

    var animationPlus = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-out'
    })
    animationPlus.scale(1, 1).step();
    this.setData({
      animPlus: animationPlus.export(),
    })
  },

  /// 单击、双击 
  multipleTap: function (e) {
    var that = this 
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件 
    if (that.touchEndTime - that.touchStartTime < 350) { 
      // 当前点击的时间 
      var currentTime = e.timeStamp 
      var lastTapTime = that.lastTapTime 
      // 更新最后一次点击时间 
      that.lastTapTime = currentTime 
      // 如果两次点击时间在300毫秒内，则认为是双击事件 
      if (currentTime - lastTapTime < 300) { 
        // 成功触发双击事件时，取消单击事件的执行 
        clearTimeout(that.lastTapTimeoutFunc); 

        that.doBottomPanelSlide(that) 
      } else { 
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。 
        that.lastTapTimeoutFunc = setTimeout(function () { 

        that.doUpload() 
        }, 300); 
      } 
    } 
  },

  bottomPanelSlide: function() {
    this.doBottomPanelSlide(this) 
  },

  doBottomPanelSlide: function(that) {
    var bottomPanelSlide = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    var resultPanelSlide = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-out'
    })

    if (that.data.bottomPanelSlide) {
      // 滑下
      bottomPanelSlide.translateY(0).step()
      // 淡出
      resultPanelSlide.scale(1.05, 1.05).opacity(0).step()
      resultPanelSlide.scale(1, 1).step()
      that.setData({
        bottomPanelSlide: false,
        animBottomPanel: bottomPanelSlide.export(),
        animResultPanel: resultPanelSlide.export(),
      })
    } else {
      // 滑上
      bottomPanelSlide.translateY(-210 * that.data.unit).step()
      // 淡入
      resultPanelSlide.scale(1.05, 1.05).opacity(1).step()
      resultPanelSlide.scale(1, 1).step()
      that.setData({
        bottomPanelSlide: true,
        animBottomPanel: bottomPanelSlide.export(),
        animResultPanel: resultPanelSlide.export(),
      })
    }

  },

  detect: function (filePath) {
    var that = this

    that.setData({
      imgUrl: filePath,
      gender: null,
      age: null,
      beauty: null,
      emotionText: null,
      health: null
    })

    // 性别
    that.detectGender(filePath)

  },

  // 性别
  detectGender: function(filePath) {
    var that = this
    wx.uploadFile({
      url: facepp.url,
      filePath: filePath,
      name: 'image_file',
      formData: {
        "api_key": facepp.api_key,
        "api_secret": facepp.api_secret,
        "return_attributes": "gender"
      },
      success: function (res) {
        if (res.statusCode == 200) {

          var faceData = JSON.parse(res.data).faces
          if (faceData.length == 0) {
            that.setData({
              errMsg: "异次元生物"
            })
            
            return
          } else {
            that.setData({
              errMsg: null
            })
          }

          var gender = faceData[0].attributes["gender"].value

          if (gender == "Female") {
            that.setData({
              gender: "女"
            })
          } else if (gender == "Male") {
            that.setData({
              gender: "男"
            })
          }

          // 年龄
          that.detectAge(filePath, gender)

        } else {
          wx.showToast({
            title: '颜值掉进黑洞了',
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      }
    })
  },

  // 年龄
  detectAge: function (filePath, gender) {
    var that = this
    wx.uploadFile({
      url: facepp.url,
      filePath: filePath,
      name: 'image_file',
      formData: {
        "api_key": facepp.api_key,
        "api_secret": facepp.api_secret,
        "return_attributes": "age"
      },
      success: function (res) {

        if (res.statusCode == 200) {

          var faceData = JSON.parse(res.data).faces[0]
          var age = faceData.attributes["age"].value

          that.setData({
            age: age
          })


          // 颜值
          that.detecBeauty(filePath, gender)

        }
      }
    })
  },

  // 颜值
  detecBeauty: function (filePath, gender) {
    var that = this
    wx.uploadFile({
      url: facepp.url,
      filePath: filePath,
      name: 'image_file',
      formData: {
        "api_key": facepp.api_key,
        "api_secret": facepp.api_secret,
        "return_attributes": "beauty"
      },
      success: function (res) {
        if (res.statusCode == 200) {

          var faceData = JSON.parse(res.data).faces[0]
          var beauty = faceData.attributes["beauty"].male_score

          if (gender == "Female") {
            beauty = faceData.attributes["beauty"].female_score
          }

          that.setData({
            beauty: beauty
          })

          // 情绪
          that.detectEmotion(filePath)
        }
      }
    })
  },

  // 情绪
  detectEmotion: function (filePath) {
    var that = this
    wx.uploadFile({
      url: facepp.url,
      filePath: filePath,
      name: 'image_file',
      formData: {
        "api_key": facepp.api_key,
        "api_secret": facepp.api_secret,
        "return_attributes": "emotion"
      },
      success: function (res) {

        if (res.statusCode == 200) {

          var faceData = JSON.parse(res.data).faces[0]
          var emotion = faceData.attributes["emotion"]

          var maxValue = 0
          var maxKey = ""
          for (var key in emotion) {
            var value = emotion[key]
            if (maxValue < value) {
              maxValue = value
              maxKey = key
            }
          }

          var emotionText = "";
          if (maxKey == "sadness") {
            emotionText = "伤心"
          } else if (maxKey == "anger") {
            emotionText = "愤怒"
          } else if (maxKey == "disgust") {
            emotionText = "厌恶"
          } else if (maxKey == "fear") {
            emotionText = "恐惧"
          } else if (maxKey == "happiness") {
            emotionText = "高兴"
          } else if (maxKey == "neutral") {
            emotionText = "平静"
          } else if (maxKey == "surprise") {
            emotionText = "惊讶"
          }

          that.setData({
            emotionText: emotionText
          })

          // 皮肤
          that.detectSkinstatus(filePath)
        }
      }
    })
  },

  // 皮肤
  detectSkinstatus: function (filePath) {
    var that = this
    wx.uploadFile({
      url: facepp.url,
      filePath: filePath,
      name: 'image_file',
      formData: {
        "api_key": facepp.api_key,
        "api_secret": facepp.api_secret,
        "return_attributes": "skinstatus"
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var faceData = JSON.parse(res.data).faces[0]
          var skinstatus = faceData.attributes["skinstatus"]
          that.setData({
            health: skinstatus.health,
            stain: skinstatus.stain,
            acne: skinstatus.acne,
            dark_circle: skinstatus.dark_circle
          })

        }
      }
    })
  },

  // 美颜
  beautify: function () {
    var that = this

    wx.uploadFile({
      url: facepp.beautify_url,
      filePath: that.data.imgUrl,
      name: 'image_file',
      formData: {
        "api_key": facepp.api_key,
        "api_secret": facepp.api_secret
      },
      success: function (res) {
        if (res.statusCode == 200) {

          var image_base64 = JSON.parse(res.data).result

          that.setData({
            imgUrl: "data:image/png;base64," + image_base64
          })

        }
      }
    })
  },

  // 上传图片接口
  doUpload: function (e) {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        // util.showBusy('正在上传')
        filePath = res.tempFilePaths[0]

        // 文件小于2M
        wx.getFileInfo({
          filePath: filePath,
          success(res) {
            if (res.size > (2 * 1024 * 1024)) {
              wx.showToast({
                title: '照片太大了哦',
                icon: 'none',
                duration: 3000,
                mask: true
              })

            } else {
              // 图片像素4096 * 4096
              wx.getImageInfo({
                src: filePath,
                success: function (res) {
                  if ((res.height > 4096) || (res.width > 4096)) {
                    wx.showToast({
                      title: '照片像素太高了哦',
                      icon: 'none',
                      duration: 3000,
                      mask: true
                    })                    

                  } else {
                    that.setData({
                      imgWidth: res.width,
                      imgHeight: res.height,
                    })
            
                    // 检测图片
                    that.detect(filePath)
                  }
                }
              })
            }
          }
        })

      },
      fail: function (e) {
        
      }
    })
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var res = wx.getSystemInfoSync()
    this.setData({
      unit: res.screenWidth / 750
    })

    var anim = wx.createAnimation({
      timingFunction: 'step-start'
    })

    anim.translateY(-210 * this.data.unit).step()
    this.setData({
      bottomPanelSlide: true,
      animBottomPanel: anim.export(),
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    // this.detect(this.data.imgUrl)
    this.setData({
      gender: "女",
      age: 29,
      beauty: 79.228,
      emotionText: "高兴",
      health: 71.157,
      stain: 2.453,
      acne: 1.934,
      dark_circle: 5.737
    })
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function (res) {
    // 用户点击右上角分享
    return {
      title: '颜吉忑忑忑', // 分享标题
      desc: '', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },

    
})
