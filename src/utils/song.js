import { toHttps } from './util'
import { cloudList } from '@/assets/musicData/cloudMusic'

function filterSinger(singers) {
  let arr = []
  singers.forEach(item => {
    arr.push(item.name)
  })
  return arr.join('/')
}

export class Song {
  constructor({ id, name, singer, album, image, duration, url }) {
    this.id = id
    this.name = name
    this.singer = singer
    this.album = album
    this.image = image
    this.duration = duration
    this.url = url
  }
}

export function createPlayList(music) {
  return new Song({
    id: music.id,
    name: music.name,
    singer: music.artists.length > 0 && filterSinger(music.artists),
    album: music.album.name,
    image: toHttps(music.album.picUrl) || null,
    duration: music.duration / 1000,
    url: `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`
  })
}

export function createCloudMusic(music) {
  return new Song({
    id: music.songId,
    name: music.simpleSong.name,
    singer: music.artist,
    album: music.album,
    image: music.simpleSong.al.picUrl,
    duration: music.simpleSong.dt / 1000,
    url: music.url,
  })
}

export function createTopList(music) {
  return new Song({
    id: music.id,
    name: music.name,
    singer: music.ar.length > 0 && filterSinger(music.ar),
    album: music.al.name,
    image: toHttps(music.al.picUrl),
    duration: music.dt / 1000,
    url: `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`
  })
}

// 歌曲数据格式化
const formatSongs = function formatPlayList(list) {
  let Songs = []
  list.forEach(item => {
    const musicData = item
    if (musicData.id) {
      Songs.push(createPlayList(musicData))
    }
  })
  return Songs
}

// 云盘歌曲数据格式化
export function getCloudSongs() {
  let Songs = []
  cloudList.data.forEach(item => {
    Songs.push(createCloudMusic(item))
  })
  return Songs
}

export function formatTopSongs(list) {
  let Songs = []
  list.forEach(item => {
    const musicData = item
    if (musicData.id) {
      Songs.push(createTopList(musicData))
    }
  })
  return Songs
}

export default formatSongs
