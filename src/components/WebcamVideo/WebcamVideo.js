let verticalHeight = 768
let verticalWidth = 1024

let app = {
  props: ['db', 'input_id', 'right', 'top', 'vertical', ],
  components: {
    // DataTaskManager: () => import(/* webpackChunkName: "components/DataTaskManager" */ './DataTaskManager/DataTaskManager.vue')
  },
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      width: 0,
      height: 0,
      cursorHidden: false,
      hideCursorTimer: null
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    'db.config.videoSelectedTrackDevicesIDs' () {
      // console.log(this.db.config.videoSelectedTrackIndex)
      // console.log(this.db.config.videoObject)
      setTimeout(() => {
        this.init()
      }, (1000 + (1000 * this.inputID)))
    },
  },
  computed: {
    computedStyle () {
      if (this.input_id !== '0') {
        return {
          width: this.width + 'px',
          height: this.height + 'px',
        }
      }
      else {
        return {
          width: verticalWidth + 'px',
          height: verticalHeight + 'px',
        }
      }
    },
    computedVideoClass () {
      let classList = ['video']

      if (this.cursorHidden) {
        classList.push('hide-cursor')
      }

      return classList
    },
    computedWebcamStyle () {
      // let inputID = Number(this.input_id)

      // if (inputID % 2 === 1) {1
      //   return {right: 0}
      // }
      let outputStyle = {}
      if (this.right === 'true') {
        outputStyle.right = 0
      }
      else {
        outputStyle.left = 0
      }

      // console.log(this.top, this.top === 'true')
      if (this.top === 'true') {
        outputStyle.top = 0
      }
      else {
        outputStyle.bottom = 0
      }

      if (this.vertical === 'true') {
        delete outputStyle.bottom
        delete outputStyle.left

        outputStyle.top = ((verticalWidth - verticalHeight) / 2) + "px"
        outputStyle.width = verticalWidth + "px"
        outputStyle.height = verticalHeight + "px"
        outputStyle.right = "calc(50vw - " + ((verticalWidth - verticalHeight) / 2) + "px)"
      }


      return outputStyle
    },
    inputID () {
      return Number(this.input_id)
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 500)
      
  },
  methods: {
    init: async function () {
      let inputID = this.inputID
      console.log({inputID})

      // console.log(this.db.config.videoObject, this.$refs.Video)
      if (!this.$refs.Video || this.db.config.videoSelectedTrackDevicesIDs.length === 0 ) {
        console.log(inputID, 'wait...')
        return setTimeout(() => {
          this.init()
        }, 3000)
        // return false
      }

      // let index = this.db.config.videoSelectedTrackIndex
      // let track = this.db.config.videoObject.getTracks()[index];
      
      if (this.db.config.videoSelectedTrackDevicesIDs.length < inputID) {
        console.log(inputID, 'not found', this.db.config.videoSelectedTrackDevicesIDs.length, inputID)
        return false
      }
      let deviceId = this.db.config.videoSelectedTrackDevicesIDs[inputID]
      
      console.log(this.db.config.videoSelectedTrackDevicesIDs)
      console.log(this.input_id, deviceId, this.db.config.videoSelectedTrackDevicesIDs.length)

      let videoObject
      try {
        let constraints = JSON.parse(JSON.stringify(this.db.config.videoConstraints))
        if (this.input_id === '0') {
          constraints.video.width = verticalWidth
          this.width = verticalWidth
          constraints.video.height = verticalHeight
          // delete constraints.video.frameRate
          this.height = verticalHeight
        }

        constraints.video.deviceId = deviceId
        console.log(this.input_id, {constraints}) 
        videoObject = await navigator.mediaDevices.getUserMedia(constraints)
      }
      catch (e) {
        console.error(e)
        return setTimeout(() => {
          this.init()
        }, 3000)
      }
        
      let track = videoObject.getTracks()[0]
      // console.log(track, this.db.config.videoSelectedTrackDevicesID)
      let video = this.$refs.Video
      video.srcObject = videoObject
      // video = track
      console.log(inputID, track.getSettings)
      
      if (track.getSettings) {
        let {width, height} = track.getSettings()
        if (width === 640 && height === 480) {
          width = 1920
          height = 1080
        }
        console.log(`${width}x${height}`);
        // video.style.width = width+'px';
        // video.style.height = height+'px'
        this.width = width
        this.height = height

        // $('body').removeClass('allow')
      }
      await new Promise(resolve => video.onloadedmetadata = resolve);
      // playAudioFromUSB()
      console.log(inputID,`${video.videoWidth}x${video.videoHeight}`);
    },
    toggleFullscreen (e) {
      console.log('close')
      window.close()
      return false

      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        return false
      }

      let video = e.target
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } 
      else if (video.mozRequestFullScreen) { 
        video.mozRequestFullScreen();
      } 
      else if (video.webkitRequestFullscreen) { 
        video.webkitRequestFullscreen();
      } 
      else if (video.msRequestFullscreen) { 
        video.msRequestFullscreen();
      }
    },
    hideCursor () {
      this.hideCursor = false

      clearTimeout(this.hideCursorTimer)
      this.hideCursorTimer = setTimeout(() => {
        this.hideCursor = true
      }, 3000)
    }
  }
}

export default app