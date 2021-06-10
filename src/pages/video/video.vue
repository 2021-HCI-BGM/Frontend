<template>
  <v-container id="video-view" fluid tag="section">
    <v-row justify="center">
      <v-col cols="auto">
        <!-- <v-card elevation="2" outlined>
          <v-card-text> -->
        <div style="height:500px;width:750px; position: relative;background:#000;margin:0">
          <video ref="myVideo" style="width:100%">
          </video>
          <v-barrage :arr="arr" :is-pause="isPause" :percent="100" />
        </div>
        <!-- </v-card-text>
          <v-card-actions class="justify-center">
          </v-card-actions>
        </v-card> -->
      </v-col>
      <v-col>
        <div>
          <button id="btn" @click="clickVideoBtn()">
            {{ btnText }}
          </button>
        </div>
      </v-col>
      <v-dialog v-model="dialog" width="300">
        <v-card>
          <v-card-title class="text-h5">
            请为本次服务评分
          </v-card-title>
          <v-card-text>
            <v-rating v-model="rating" icon-label="custom icon label text {0} of {1}" />
            感谢您的反馈！
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-1" text @click="dialog = false">
              放弃
            </v-btn>
            <v-btn color="green darken-1" text @click="dialog = false">
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import VBarrage from '@/components/video/VBarrage'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Video',
    components: {
      VBarrage
    },
    computed: {
      ...mapGetters(['uid'])
    },

    data: () => ({
      isPlay: false,
      btnText: '开始识别',
      arr: [], // 弹幕数组
      sendContent: null,
      direction: 'default',

      dialog: false, // 对话框
      iconClick: false,

      info: null
    }),
    mounted() {
      this.initVideo()
      this.initTestData()

      this.$socket.emit('connect') // 在这里触发connect事件
    },
    sockets: {
      // 通信的name
      // 这里是监听connect事件
      connect: function () {
        this.id = this.$socket.id
        // alert('建立连接')
        this.$socket.emit('my_event', 9999)
      },

      disconnect: function () {
        alert('断开连接')
      },

      reconnect: function () {
        console.log('重新连接')
        this.$socket.emit('conect')
      },
      server_response: function (data) {
        console.log('接收数据', data)
      },
      get_num: function (data) {
        console.log('得到数字', data)
      }
    },

    methods: {
      // 初始化video
      initVideo() {
        console.log("inti videl")
        let myVideo = this.$refs.myVideo
        navigator.mediaDevices.getUserMedia({
          video: true
        }).then((stream) => {
          myVideo.srcObject = stream
          myVideo.play()
          myVideo.pause()
        }).catch((err) => {
          console.log(err)
        })
      },

      clickVideoBtn() {
        if (!this.uid) {
          this.$mmToast('未登录！请先登录！')
        } else {
          this.initTestData()
          let myVideo = this.$refs.myVideo
          if (this.isPlay) {
            myVideo.pause()
            this.isPlay = false
            this.btnText = '开始识别'
            this.dialog = true
          } else {
            myVideo.play()
            this.isPlay = true
            this.btnText = '停止识别'
          }

          this.$socket.emit('my_event', 99987)
        }

      },
      // 初始化模拟弹幕数据
      initTestData() {
        this.arr = []
        this.arr.push({
          direction: 'default',
          content: '检测到trigger,识别开始'
        })
      },
      // 发送弹幕
      sendBarrage() {
        if (this.arr.length > 1 && this.sendContent != '' && this.sendContent != null) {
          this.arr.unshift({
            content: this.sendContent,
            direction: this.direction,
            isSelf: true,
            style: {
              color: 'red',
              fontSize: '25px'
            },
            isJs: this.isJs
          })
        } else {
          this.arr.push({
            content: this.sendContent,
            direction: this.direction,
            isSelf: true,
            style: {
              color: 'red'
            },
            isJs: this.isJs
          })
        }
        this.sendContent = null
      }

    }
  }
</script>

<style lang="less">
  #video-view {
    // display: flex;
    // float: left;
    // justify-content: space-around;
  }

  #btn {
    height: 40px;
    width: 100px;
    border-style: solid;
    border-width: 1px;
    border-color: white;
  }
</style>
