<template >
  <div class="root">
    <!-- 点击拍照 手机拍照，浏览器选择照片,只能选择一张-->
    <h2>选择图片</h2>
    <div>
      <input type="file" accept="image/*" capture="camera" @change="imageFileChange">
    </div>
    <br>
    <br>
    <br>
    <h3>压缩之前的图片</h3>
    <img :src="compressFrondImage" alt="">
    <h3>压缩之后的图片</h3>
    <img :src="compressEndImage" alt="">
  </div>
</template>

<script>
import EXIF from 'exif-js'
export default {
  name: '',
  data () {
    return {
      compressFrondImage: '', // 压缩之前的图片
      compressEndImage: '' // 压缩之后的图片
    }
  },
  components: {},
  created () {},
  mounted () {},
  methods: {
    /**
     * 图片文件发生变化
     */
    imageFileChange (e) {
      this.file = e.target.files[0]
      console.log(this.file)
      if (this.file) {
        // FileReader
        let reader = new FileReader()
        reader.readAsDataURL(this.file)
        reader.onload = (e) => {
          console.log(e.target)
          this.compressFrondImage = e.target.result
          this.compressImages(this.compressFrondImage)
        }
      }
    },
    compressImages (res) {
      let defaultImage = {
        width: 1440,
        height: 1080,
        quality: 0.8, // 压缩图片的质量
        orientation: '' // 获取照片方向角属性，用户旋转控制
      }
      var img = new Image()
      img.src = res
      let initSize = img.src.length
      img.onload = () => {
        // 方便手机测试
        alert('压缩之前宽度： ' + img.width)
        alert('压缩之前高度： ' + img.height)
        // 方便浏览器测试
        console.log('压缩之前宽度： ' + img.width)
        console.log('压缩之前高度： ' + img.height)
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        if (img.width > defaultImage.width) {
          img.height = img.height * (defaultImage.width / img.width)
          img.width = defaultImage.width
        }
        if (img.height > defaultImage.height) {
          img.width *= defaultImage.height / img.height
          img.height = defaultImage.height
        }
        canvas.width = img.width
        canvas.height = img.height
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        EXIF.getData(this.file, () => { // IMG_FILE为图像数据
          // 是否是iPhone手机，iPhone 拍照之后的压缩是逆时针旋转90，针对iphone做一下处理
          if (navigator.userAgent.match(/iphone/i)) {
            defaultImage.orientation = EXIF.getTag(this.file, 'Orientation')
            // translate是平移变换，scale(-1,1)是向左翻转，rotate是顺时针旋转。
            // defaultImage.orientation = 6   // 测试iPhone手机
            alert('Orientation:' + defaultImage.orientation) // 拍照方向
            switch (Number(defaultImage.orientation)) {
              case 2:
                ctx.translate(img.width, 0)
                ctx.scale(-1, 1)
                ctx.drawImage(img, 0, 0, img.width, img.height)
                break
              case 3:
                ctx.rotate(180 * Math.PI / 180)
                ctx.drawImage(img, -img.width, -img.height, img.width, img.height)
                break
              case 4:
                ctx.translate(img.width, 0)
                ctx.scale(-1, 1)
                ctx.rotate(180 * Math.PI / 180)
                ctx.drawImage(img, -img.width, -img.height, img.width, img.height)
                break
              case 5:
                ctx.translate(img.width, 0)
                ctx.scale(-1, 1)
                ctx.rotate(90 * Math.PI / 180)
                ctx.drawImage(img, 0, -img.width, img.height, img.width)
                break
              case 6:
                canvas.width = img.height
                canvas.height = img.width
                ctx.rotate(90 * Math.PI / 180)
                ctx.drawImage(img, 0, 0, img.width, -img.height)
                break
              case 7:
                ctx.translate(img.width, 0)
                ctx.scale(-1, 1)
                ctx.rotate(270 * Math.PI / 180)
                ctx.drawImage(img, -img.height, 0, img.height, img.width)
                break
              case 8:
                ctx.rotate(270 * Math.PI / 180)
                ctx.drawImage(img, -img.height, 0, img.height, img.width)
                break
              default:
                ctx.drawImage(img, 0, 0, img.width, img.height)
            }
          } else {
            ctx.drawImage(img, 0, 0, img.width, img.height)
          }
          var imgUrl = canvas.toDataURL('image/jpeg', defaultImage.quality)
          // 手机端测试
          alert('压缩率：' + ~~(100 * (initSize - imgUrl.length) / initSize) + '%')
          alert('压缩之后宽度： ' + img.width)
          alert('压缩之后高度： ' + img.height)
          // 浏览器测试
          console.log('压缩前：' + initSize)
          console.log('压缩后：' + imgUrl.length)
          console.log('压缩率：' + ~~(100 * (initSize - imgUrl.length) / initSize) + '%')
          console.log('压缩之后宽度： ' + img.width)
          console.log('压缩之后高度： ' + img.height)
          console.log('压缩之后base64地址')
          console.log(imgUrl)
          // 压缩之后的base64 图片地址
          this.compressEndImage = imgUrl
          // TODO 上传图片文件
          this.uploadImage()
        })
      }
    },
    /**
     * 上传图片
     */
    uploadImage: function () {
    },
    /**
     * 瓦片压缩 正在测试
     */
    imagesCompress: function (img) {
      // 用于压缩图片的canvas
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      // 瓦片canvas
      var tCanvas = document.createElement('canvas')
      var tctx = tCanvas.getContext('2d')

      var initSize = img.src.length
      var width = img.width
      var height = img.height

      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      var ratio
      if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }

      canvas.width = width
      canvas.height = height

      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 如果图片像素大于100万则使用瓦片绘制
      var count
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1) // 计算要分成多少块瓦片

        // 计算每块瓦片的宽和高
        var nw = ~~(width / count)
        var nh = ~~(height / count)

        tCanvas.width = nw
        tCanvas.height = nh

        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)

            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }

      // 进行最小压缩
      var ndata = canvas.toDataURL('image/jpeg', 0.8)

      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')

      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    }
  }
}
</script>

<style lang="less">
.root{
  width:50%;
  margin: 0 auto;
}
.root span {
  font-size: 30px;
  font-weight: bold;
  color: rgb(245, 45, 144);
  cursor: pointer;
  &:hover {
    color: rgb(221, 70, 39);
  }
}
img{
  width:100%;
}
</style>
