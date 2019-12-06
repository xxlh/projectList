import * as browser from "judgebrowser"

class Shake {
	constructor(o){
		this.threshold = o.threshold || 140;
		this.threshold_android = o.threshold_android || 1000;
		this.timeout = o.timeout || 300;
		this.shakeCount = 0;
		this.shakeCallback = null;
		this.isShake = false;
	}

	start(){
		if(!this.isShake){
			this.isShake = true;
			if (browser.android) {
				this.bind_android();
			} else {
				this.bind_ios();
			}
		}
	}

	stop(){
		this.isShake = false;
		if (browser.android) {
			window.removeEventListener("deviceorientation", this._androidShakeEvent, false);
		} else {
			window.removeEventListener("devicemotion", this._iosShakeEvent, false);
		}
	}

	bind_android(event){
		this.lupdate = 0;
		this.lx = 0;
		this.ly = 0;
		this.lz = 0;
		this._androidShakeEvent = (event) => {
			let nowx = 0;
			let nowy = 0;
			let nowz = 0;
			let currtime = 0;
			let difftime = 0;
			currtime = new Date().valueOf(),
			difftime = currtime - this.lupdate;
			if(difftime > this.timeout){
				this.lupdate = currtime; 
				nowz = event.alpha;
				nowx = event.beta;
				nowy = event.gamma;
				let speed=Math.abs( nowx + nowy + nowz - this.lx - this.ly -this.lz ) / difftime * 10000;
				// alert("speed--------"+this.speed)
				if(speed > this.threshold ){
					this.shakeCount++;
					typeof this.shakeCallback == 'function' ? this.shakeCallback(this.shakeCount) : null;
				}
				this.lx = nowx;
				this.ly = nowy;
				this.lz = nowz;
			}
		}
		window.addEventListener("deviceorientation", this._androidShakeEvent, false);
	}

	bind_ios() {
		this.lupdate = 0;
		this.lx = 0;
		this.ly = 0;
		this.lz = 0;
		this._iosShakeEvent = (event) => {
			let nowx = 0;
			let nowy = 0;
			let nowz = 0;
			let acceleration = event.accelerationIncludingGravity;
			let currtime = new Date().getTime();  
			if ((currtime - this.lupdate) > this.timeout) {          
				let diffTime = currtime -this.lupdate;
				this.lupdate = currtime;       
				nowx = acceleration.x;
				nowy = acceleration.y;
				nowz = acceleration.z;       
				let speed = Math.abs(nowx + nowy + nowz - this.lx - this.ly - this.lz) / diffTime * 10000;
				if (speed > this.threshold) {
					this.shakeCount++;
					typeof this.shakeCallback == 'function' ? this.shakeCallback(this.shakeCount) : null;
				}
				this.lx = nowx;
				   this.ly = nowy;
				   this.lz = nowz;
			}
		}
		window.addEventListener("devicemotion", this._iosShakeEvent, false);
	}


	onShake(fn){
		this.shakeCallback = fn;
	}
}

export default Shake