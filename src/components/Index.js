/* global Node */
// import mainVisual from './main.gif'

let Index = {
  props: ['db', 'view', 'search'],
  components: {
    WebcamVideo: () => import(/* webpackChunkName: "components/WebcamVideo" */ './WebcamVideo/WebcamVideo.vue'),
  },
  data() {
    this.$i18n.locale = this.db.config.localConfig
    return {
      // mainVisual
      // viewList: ['todo', 'completed'],
      // mainGif
    }
  },
  computed: {
    isInIframe () {
      try {
        if (window.self !== window.top) {
          return false
        }
      } catch (e) {
        return true
      }
    },
    computedVideoColumnStyle () {
      return {
        'width': `calc(100vw - ${this.db.localConfig.voteColumnWidth}px)`
      }
    },
    computedVoteColumnStyle () {
      return {
        'width': `${this.db.localConfig.voteColumnWidth}px`
      }
    },
  },
  watch: {
    'db.config.inited'(inited) {
      if (inited === false) {
        return false
      }
    },
    'view' (view) {
      this.db.config.view = view
    },
    'search' (search) {
      if (!search) {
        search = ''
      }
      this.db.config.search = search
    },
    'db.config.view' () {
      this.pushRouter()
    },
    'db.config.search' () {
      this.pushRouter()
    },
  },
  mounted() {
    if (this.view) {
      this.db.config.view = this.view
    }
    if (this.search) {
      this.db.config.search = this.search
    }

    this.initFileSystem()
    

    this.init()
    // this.initTaskUtils()

    // setTimeout(() => {
    //   location.reload()
    // }, 30000) 
    // okok

  },
  methods: {

    pushRouter: async function () {
      this.db.localConfig.showConfiguration = false
      this.db.config.focusedTask = false
      await this.$router.replace(`/${this.db.config.view}/${this.db.config.search}`, () => {}, () => {})
    },

    
    initFileSystem: async function () {
      await this.db.utils.FileSystemUtils.init(this.db.config.appNameID)
    },

    toggleFullScreen() {
      return window.close()
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },

    init: async function () {
      try {
        //let constraints = {video: {width: 9999}};
        // let constraints = {video: true, audio: true};
        let constraints = this.db.config.videoConstraints;
        this.db.config.videoObject = await navigator.mediaDevices.getUserMedia(constraints);
        this.db.config.videoDevices = await navigator.mediaDevices.enumerateDevices()
        //let tracks = this.db.config.videoObject.getTracks();
        // let tracks = this.db.config.videoObject
        // console.log(tracks); 
        console.log(this.db.config.videoDevices)
        // let videoSelectedTrack = 0
        this.db.config.videoTrackLabels = []
        for (let i = 0; i < this.db.config.videoDevices.length; i++) {
          let track = this.db.config.videoDevices[i]
  
          // if (track.kind !== 'video') {
          //   continue;
          // }

          if (track.kind !== 'videoinput') {
            continue
          }
  
          if (track.label.indexOf('USB') > -1 && track.kind === 'videoinput') {
            this.db.config.videoSelectedTracks.push(track.label)
            this.db.config.videoSelectedTrackDevicesIDs.push(track.deviceId)
            this.db.config.videoSelectedTrackIndexes.push(this.db.config.videoTrackLabels.length)
          }
          // else if (track.label.indexOf('Camera') > -1) {
          //   continue
          // }
          // else if (track.kind === 'videoinput' && this.db.config.videoSelectedTrackIndex === -1) {
          //   this.db.config.videoSelectedTracks.push(track.label)
          //   this.db.config.videoSelectedTrackDevicesIDs.push(track.deviceId)
          //   this.db.config.videoSelectedTrackIndexes.push(this.db.config.videoTrackLabels.length)
          // }
          if (track.label !== '') {
            this.db.config.videoTrackLabels.push(track.label)
          }
  
          // $(`<option value="${i}">${track.label}</option>`).appendTo('#source')
        }

        // if (this.db.config.videoSelectedTrackIndex === -1) {
        //   this.db.config.videoSelectedTrackIndex = 0
        // }

        if (this.db.config.videoSelectedTracks.length === 0 && 
            this.db.config.videoTrackLabels.length > 0) {
          this.db.config.videoSelectedTracks.push(this.db.config.videoTrackLabels[0])
        } 
        // console.log(this.db.config.videoSelectedTrack)

        console.log(this.db.config.videoSelectedTracks)
        console.log(this.db.config.videoSelectedTrackDevicesIDs)

      } catch(e) {
        console.log(e);
      }
    },
    
  }
}

export default Index