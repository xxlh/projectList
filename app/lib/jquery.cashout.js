/**
 *
 * Cash Out
 * 
 * @name Cash Out
 * @description Lottery with cashout.
 * @author Esone (http://it.ee01.me)
 * @version 1.3 (2013.3.29 updated)
 * @copyright (c) 2012 Sina
 *
 */


 /**
 * Cash Out, Fruit Machine, Slots Machine, Roulette.
 *
 * @constructor Cash Out
 *
 * @extends jquery
 *
 * @param String start_selector - The dom clicked to start cashout.
 * @param String result_url - Get result json.
 * @param Json result_data - Data posted for result_url.
 * @param Function callback - When done, do something.
 *
 * @example
	$(content).cashout({
		start_selector: "a#cashout_start_btn",
		result_url: "http://...json",
		result_data: {uid:1},
		callback: function(){}
	});
	
	
	Default Callback JSON = {
		prize_id: -1,	// -1: no prize
		prize_name: ""
	}	// Or change function result_get_prizeid,result_get_prizename
	
	Default HTML
		<ul class="cashout_main clearfix">				// content
			<li id="prize_1" prize_id="0"><img /></li>	// id: index, prize_id: prize_id
			...
			<li><a id="cashout_start_btn"></a></li>		// start_selector
			<li id="prize_2" prize_id="-1"><img /></li>
			...
		</ul>
	// Or change start_selector and function result_get_index
 *
 **/
import jQuery from "jquery";

(function($) {
	$.fn.cashout = function(options) {
		/* Initialization */
		var defaults = {
			start_selector: "a#cashout_start_btn",
			prize_selector: function(index) {
				return '#prize_' + index;
			},
			select_bg: "orangered",
			prize_num: 10,
			speed: 100,
			result_url: '',
			result_data: {},
			result_datatype: 'json',
			result_get_error: function(json) {
				return json.error;
			},
			result_get_msg: function(json) {
				return json.msg;
			},
			result_get_data: function(json) {
				return json.data;
			},
			result_get_prizeid: function(json) {
				if (_this.setting.result_get_error(json) == 0) {
					return _this.setting.result_get_data(json).prize_id;
				}else{
					return -1;
				}
			},
			result_get_prizename: function(json) {
				if (_this.setting.result_get_error(json) == 0) {
					return _this.setting.result_get_data(json).prize_name;
				}else{
					return "";
				}
			},
			result_get_index: function(json) {
				if (_this.setting.result_get_error(json) == 0) {
					var prize_id = _this.setting.result_get_prizeid(json);
					var prize_dom_selector = "li.prize[prize_id="+prize_id+"]";
					var prize_domid = _this.find(prize_dom_selector + ":eq(" + Math.floor(Math.random()*_this.find(prize_dom_selector).length) + ")").attr("id");
					if (!prize_domid) return 1;
					var prize_index = parseInt(prize_domid.split("prize_")[1]);
					return prize_index;
				}else{
					return 1;
				}
			},
			alert: function(msg) { alert(msg); },
			before: null,
			callback: function(id, name, json) {
				if (id != -1) {
					_this.alert("恭喜！！\n您中了大奖 " + name);
				}else{
					_this.alert(name);
				}
			}
        }, _this=this;
		this.setting = $.extend(true, defaults, options);
		
		/* Only Cash Out once */
		if (this.attr("cashout")) {
			return false;
		}
		this.attr("cashout", true);
		
		/* Create Hidden Divs */
		let _run = $('<div id="cashout_run" index="0">');
		$("body").append(_run);
		_run.css({
			"position": "absolute",
			"display": "none",
			"background": _this.setting.select_bg,
			"opacity": 0.6,
			"z-index": 9999
		});
		
		/* Functions */
		this.alert = function(msg) {
			typeof _this.setting.alert !== "undefined" ? _this.setting.alert(msg) : alert(msg);
		};
		this.cycle_time = function(index) {
			switch (index) {
				case 1:
					return parseInt(_this.setting.speed * 3 + 200);
				case 2:
					return parseInt(_this.setting.speed * 2.2 + 150);
				case 3:
					return parseInt(_this.setting.speed * 1 + 100);
				case 4:
					return parseInt(_this.setting.speed * 0 + 80);
				case _this.jump_max - 1:
					return parseInt(_this.setting.speed * 4 + 500);
				case _this.jump_max - 2:
					return parseInt(_this.setting.speed * 3 + 450);
				case _this.jump_max - 3:
					return parseInt(_this.setting.speed * 2.2 + 300);
				case _this.jump_max - 4:
					return parseInt(_this.setting.speed * 2 + 200);
				case _this.jump_max - 5:
					return parseInt(_this.setting.speed * 1.5 + 200);
				case _this.jump_max - 6:
					return parseInt(_this.setting.speed * 1.2 + 100);
				case _this.jump_max - 7:
					return parseInt(_this.setting.speed * 0.5 + 100);
				case _this.jump_max - 8:
					return parseInt(_this.setting.speed * 0 + 0);
				default:
					return parseInt(_this.setting.speed);
			}
		};
		
		// Result when ending
		this.result = function(index) {
			var prize_id, prize_name;
			if (_this.setting.result_url) {
				prize_id = _this.setting.result_get_prizeid(_this.ajax_json);
				prize_name = _this.setting.result_get_prizename(_this.ajax_json);
			}else{
				prize_id = $(_this.setting.prize_selector(index)).attr("prize_id");
				prize_name = $(_this.setting.prize_selector(index)).attr("prize_name");
			}
			
			$(_this.setting.start_selector).bind("click.cashout", _this.start);
			
			//Callback function
			typeof _this.setting.callback === 'function'
				? _this.setting.callback(prize_id, prize_name, _this.ajax_json ? _this.ajax_json : null)
				: null;
		};
		
		// Step of running
		this.runstep = function() {
			let index = parseInt(_run.attr("index"));
			let next_index = parseInt(index % _this.setting.prize_num) + 1;
			let next_selector = _this.setting.prize_selector(next_index);
			if (_run.not(":visible")) {
				_run.show();
			}
			_run.css({
				"top": $(next_selector).offset().top,
				"left": $(next_selector).offset().left,
				"width": $(next_selector).width(),
				"height": $(next_selector).height()
			});
			_run.attr("index", next_index);
		};
		
		// Start running
		this.run = function() {
			var time = 500,
				jump_index = 1,
				timer = null;
			function timerdo() {
				time = _this.cycle_time(jump_index);
				_this.runstep();
				jump_index++;
				if (_this.setting.result_url) {
					if (jump_index > _this.jump_max-8 && !_this.ajax_json) {
						_this.jump_max += _this.setting.prize_num;
						if (_this.jump_max > _this.setting.prize_num * 10) {
							clearTimeout(timer);
							_run.hide();
							_this.alert('恭喜！中了“再来一次”~');
							$(_this.setting.start_selector).bind("click.cashout", _this.start);
							return false;
						}
					}
					if (_this.ajax_json && _this.setting.result_get_error(_this.ajax_json) != 0) {
						clearTimeout(timer);
						_run.hide();
						_this.alert(_this.setting.result_get_msg(_this.ajax_json));
						$(_this.setting.start_selector).bind("click.cashout", _this.start);
						return false;
					}
				}
				if (jump_index > _this.jump_max) {
					clearTimeout(timer);
					setTimeout(function() { _this.result(jump_index); }, 200);
				} else {
					timer = setTimeout(timerdo, time);
				}
			}
			timerdo();
		};
		
		// Click start
		this.start = function() {
			//Before function
			if (typeof _this.setting.before === 'function' && _this.setting.before() === false) {
				return false;
			}
			
			$(_this.setting.start_selector).unbind("click.cashout");
			var start_index = parseInt(_run.attr("index"));
			_this.round_num = 3 + parseInt( 4*Math.random() );
			_this.jump_max = _this.setting.prize_num;
			if (!_this.setting.result_url) {
				var stop_index = Math.ceil( Math.random()*_this.setting.prize_num );
				var step = (stop_index - start_index) > 0 ? stop_index - start_index : _this.setting.prize_num - start_index + stop_index;
				_this.jump_max = step + _this.setting.prize_num * _this.round_num;
			}else{
				_this.ajax_json = "";
				var get_result = function(json) {
					var stop_index = _this.setting.result_get_index(json);
					var step = (stop_index - start_index) > 0 ? stop_index - start_index : _this.setting.prize_num - start_index + stop_index;
					_this.jump_max = step + _this.setting.prize_num * _this.round_num;
					_this.ajax_json = json;
				};
				var link_char = _this.setting.result_url.indexOf('?') != '-1' ? '&' : '?';
				if (_this.setting.result_datatype == 'jsonp') {
					$.getJSON(_this.setting.result_url + link_char + "callback=?", _this.setting.result_data, get_result);
				}else{
					$.ajax({
						url: _this.setting.result_url + link_char + "_t=" + Math.random(),
						data: _this.setting.result_data,
						type: "GET",
						xhrFields: {
							withCredentials: true
						},
						crossDomain: true,
						success: function (json) {
							json = eval('(' + json + ")");
							get_result(json);
						}
					});
				}
			}
			_this.run();
		};
		
		/* Bind Events */
		$(_this.setting.start_selector).bind("click.cashout", _this.start);
		
		/* Controller Outside */
		this.controller = {
			start: _this.start
		}
		
		return this.controller;
    };
})(jQuery);

export default jQuery.fn.cashout;