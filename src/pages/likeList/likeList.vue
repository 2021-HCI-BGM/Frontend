<template>
  <!--喜欢歌曲列表-->
  <div class="likeList">
    <music-list
      :list="likeList"
      :list-type="1"
      @select="selectItem"
      @del="deleteItem"
    >
      <div slot="listBtn" class="list-btn">
        <span @click="$refs.dialog.show()">清空列表</span>
      </div>
    </music-list>
    <mm-dialog
      ref="dialog"
      body-text="是否清空喜欢歌曲列表"
      confirm-btn-text="清空"
      @confirm="clearList"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import MusicList from 'components/music-list/music-list'
import MmDialog from 'base/mm-dialog/mm-dialog'

export default {
  name: 'LikeList',
  components: {
    MusicList,
    MmDialog
  },
  computed: {
    ...mapGetters(['likeList', 'playing', 'currentMusic'])
  },
  methods: {
    // 清空列表事件
    clearList() {
      this.clearLikes()
      this.$mmToast('列表清空成功')
    },
    // 播放事件
    selectItem(item, index) {
      this.selectPlay({
        list: this.likeList,
        index
      })
    },
    // 删除事件
    deleteItem(index) {
      let list = [...this.likeList]
      list.splice(index, 1)
      this.removeLikes(list)
      this.$mmToast('删除成功')
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING'
    }),
    ...mapActions(['selectPlay', 'clearLikes', 'removeLikes'])
  }
}
</script>

<style lang="less" scoped>
.likeList {
  width: 100%;
  height: 100%;
  .musicList {
    width: 100%;
    height: 100%;
    .list-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      span {
        padding: 5px 20px;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: @text_color_active;
        }
      }
    }
  }
}
</style>
