import "@lib/less/music.less";

class Music{
	constructor(o){
		this.musicBtn = document.getElementById(o.musicBtnId);
		this.audio = document.getElementById(o.audioId);
		this.musicUrl = o.musicUrl;
		this.isPlay = false;
	}
    start(){
		this.audio.src = this.musicUrl;
		this.audio.loop = true;
		this.audio.play();
	
		let playOnce = ()=>{
			this.musicBtn.classList.add("playMusic");
			this.audio.play();
			document.removeEventListener("touchend", playOnce);
			
		}
		document.addEventListener("touchend", playOnce);
		this.musicBtn.addEventListener("click", ()=>this.toggleMusic(),false)
		
	}
	toggleMusic () {
		if (this.isPlay) {
			this.musicBtn.classList.add("playMusic");
			this.audio.play();
			document.addEventListener('WeixinJSBridgeReady', function () {
				this.audio.play();
			}, false)
		} else {
			this.musicBtn.classList.remove("playMusic");
			this.audio.pause();
			document.addEventListener('WeixinJSBridgeReady', function () {
				this.audio.pause();
			}, false)
		}
		this.isPlay = !this.isPlay;
	  }
}

export default Music;