//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var facepp = {
  url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
  api_key: 'GV9wmU3MBIeOjnQqgn5qfcgJiZz5XGLl',
  api_secret: 'pzVrT9r7WfbioyDpGSUrB46kSrbLLPZM'
};

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },

    // 用户登录示例
    login: function() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success: function(res){
                // util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]
                
                that.setData({
                  imgUrl: filePath,
                  gender: null,
                  age: null,
                  beauty: null,
                  emotionText: null,
                  health: null
                })

                // 性别
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
                      console.info(res)
                      
                      var faceData = JSON.parse(res.data).faces
                      if (faceData.length == 0) {
                        that.setData({
                          errMsg: "异次元生物"
                        })
                        return
                      }

                      var gender = faceData[0].attributes["gender"].value


                      if (gender == "Female") {
                        that.setData({
                          gender: "女性"
                        })
                      } else if (gender == "Male"){
                        that.setData({
                          gender: "男性"
                        })
                      }
                      
                      // 年龄
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
                            console.info(res)

                            var faceData = JSON.parse(res.data).faces[0]
                            var age = faceData.attributes["age"].value

                            that.setData({
                              age: age
                            })


                            // 颜值
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
                                  console.info(res)

                                  var faceData = JSON.parse(res.data).faces[0]
                                  var beauty = faceData.attributes["beauty"].male_score

                                  if (gender == "Female") {
                                    beauty = faceData.attributes["beauty"].female_score
                                  }

                                  console.info(beauty)
                                  that.setData({
                                    beauty: beauty
                                  })

                                  // 情绪
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
                                        console.info(res)

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
                                        if (key == "sadness") {
                                          emotionText = "伤心"
                                        } else if (key == "anger") {
                                          emotionText = "愤怒"
                                        } else if (key == "disgust") {
                                          emotionText = "厌恶"
                                        } else if (key == "fear") {
                                          emotionText = "恐惧"
                                        } else if (key == "happiness") {
                                          emotionText = "高兴"
                                        } else if (key == "neutral") {
                                          emotionText = "平静"
                                        } else if (key == "surprise") {
                                          emotionText = "惊讶"
                                        }

                                        that.setData({
                                          emotionText: emotionText
                                        })

                                        // 皮肤
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
                                              console.info(res)

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
                                      }
                                    }
                                  })
                                }
                              }
                            })


                          }
                        }
                      })

                      

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
                  
                

                // // 上传图片
                // wx.uploadFile({
                //     url: config.service.uploadUrl,
                //     filePath: filePath,
                //     name: 'file',

                //     success: function(res){
                //         util.showSuccess('上传图片成功')
                //         console.log(res)
                //         res = JSON.parse(res.data)
                //         console.log(res)
                //         that.setData({
                //             imgUrl: res.data.imgUrl
                //         })
                //     },

                //     fail: function(e) {
                //         util.showModel('上传图片失败')
                //     }
                // })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    }
})
