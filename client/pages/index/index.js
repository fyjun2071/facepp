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

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
          success: function(res){
            // util.showBusy('正在上传')
            filePath = res.tempFilePaths[0]
            
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

                              var faceData = JSON.parse(res.data).faces[0]
                              var beauty = faceData.attributes["beauty"].male_score

                              if (gender == "Female") {
                                beauty = faceData.attributes["beauty"].female_score
                              }

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
                                  console.info(res)
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

                                    console.info(maxKey)
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

          },
          fail: function(e) {
              console.error(e)
          }
        })
    },

    beautify: function () {
      var that = this

      wx.uploadFile({
        url: facepp.beautify_url,
        filePath: filePath,
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
    }

    
})
