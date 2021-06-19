<template>
  <v-container id="video-view" fluid tag="section">
    <v-row justify="center">
      <v-col cols="auto">
        <div style="height:500px;width:750px; position: relative;background:#000;margin:0">
          <video ref="myVideo" style="width:100%">
          </video>
          <v-barrage :arr="barrageArray" :is-pause="isPause" :percent="100" />
        </div>
      </v-col>
      <v-col>
        <div>
          <button id="btn" @click="clickVideoBtn()">
            {{ btnText }}
          </button>
        </div>
      </v-col>
      <v-dialog v-model="dialogShow" width="300">
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
            <v-btn color="green darken-1" text @click="dialogShow = false">
              放弃
            </v-btn>
            <v-btn color="green darken-1" text @click="dialogShow = false">
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
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { getCloudSongs } from '@/utils/song'

  export default {
    name: 'Video',
    components: {
      VBarrage
    },
    computed: {
      ...mapGetters(['uid', 'playing', 'currentMusic', 'historyList'])
    },

    data: () => ({
      isPlay: false,
      btnText: '开始识别',
      barrageArray: [], // 弹幕数组
      barrageStart: '检测到trigger,识别开始',  //开始时的弹幕
      barrageEnd: '检测到trigger，识别结束',   //结束的弹幕

      dialogShow: false, // 对话框

      cloudList: [],
    }),
    mounted() {
      this.cloudList=getCloudSongs();  //初始化云端歌曲列表

      this.initVideo()
      this.$socket.emit('connect') // 在这里触发connect事件
    },
    sockets: {
      // 通信的name
      //这里是监听connect事件
      connect: function () {
        this.id = this.$socket.id
        alert('建立连接')
      },

      disconnect: function () {
        alert('断开连接')
      },

      reconnect: function () {
        console.log('重新连接')
        this.$socket.emit('connect')
      },

      trigger: function(data){  //监听后端trigger事件
        if(data==true){
          this.sendBarrage(this.barrageStart);
        }else{
          this.sendBarrage(this.barrageEnd);
        }
      },

      url: function(id){   //监听后端url事件，播放歌曲
        let music=this.cloudList.find((item,index)=>{
          return item.id==id
        })

        console.log("song")
        console.log(music)
        this.selectAddPlay(music)

        
      }

    },


    methods: {
      // 初始化video
      initVideo() {
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
          this.$socket.emit('begin', this.isPlay)

          let myVideo = this.$refs.myVideo
          if (this.isPlay) {
            // myVideo.pause()
            this.isPlay = false
            this.btnText = '开始识别'
            this.dialogShow = true
          } else {
            // myVideo.play()
            this.isPlay = true
            this.btnText = '停止识别'
          }
        }
      },
      // 发送弹幕,barrageText是this.barrageStart或者this.barrageEnd
      sendBarrage(barrageText) {
        this.barrageArray = []
        this.barrageArray.push({
          direction: 'default',
          content: barrageText
        })
      },
      ...mapMutations({
        setPlaying: 'SET_PLAYING'
      }),
      ...mapActions(['selectPlay','selectAddPlay','setCloud'])

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
