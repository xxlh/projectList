import React from "react";

var XLJZ = '下拉加载';
var SKJZ = '松开加载';
var JZ = '加载中...'
var dropDownRefreshText = XLJZ;
var dragValve = 4; // 下拉加载阀值
var scrollValve = 4; // 滚动加载阀值

class ListView extends React.Component{
    constructor(porps){
		super(porps);
		
		this.state = {
			translate: 0,//位移
            dragLoading: false,//是否在下拉刷新中
            scrollerLoading: false,//是否在加载更多中
            openDragLoading: true,//是否开启下拉刷新
            openScrollLoading: true,//是否开启下拉刷新
            data: []//默认的列表空数据
		};
	}
    componentDidMount() {//组建加载完毕，进行初始化赋值
        this.setState(
            {
                translate: 0,
                openDragLoading: this.props.openDragLoading || true,//根据外面设置的开关改变自己的状态
                openScrollLoading: this.props.openScrollLoading || true
            }
        );

        this.initRefresh();//初始化下拉刷新
        this.initScroll();//初始化滚动加载更多
    }
    initRefresh (defaults, options) {
        var self = this;//对象转存，防止闭包函数内无法访问
        var isTouchStart = false; // 是否已经触发下拉条件
        var isDragStart = false; // 是否已经开始下拉
        var startX, startY;        // 下拉方向，touchstart 时的点坐标
        var hasTouch = 'ontouchstart' in window;//判断是否是在移动端手机上
        // 监听下拉加载，兼容电脑端
        if (self.state.openDragLoading) {
            self.refs.scroller.addEventListener('touchstart', touchStart, false);
            self.refs.scroller.addEventListener('touchmove', touchMove, false);
            self.refs.scroller.addEventListener('touchend', touchEnd, false);
            self.refs.scroller.addEventListener('mousedown', touchStart, false);
            self.refs.scroller.addEventListener('mousemove', touchMove, false);
            self.refs.scroller.addEventListener('mouseup', touchEnd, false);
        }
        function touchStart(event) {
            if (self.refs.scroller.scrollTop <= 0) {
                isTouchStart = true;
                startY = hasTouch ? event.changedTouches[0].pageY : event.pageY;
                startX = hasTouch ? event.changedTouches[0].pageX : event.pageX;
            }
        }

        function touchMove(event) {
            if (!isTouchStart) return;
            var distanceY = (hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY;
            var distanceX = (hasTouch ? event.changedTouches[0].pageX : event.pageX) - startX;
            //如果X方向上的位移大于Y方向，则认为是左右滑动
            if (Math.abs(distanceX) > Math.abs(distanceY))return;
            if (distanceY > 0) {
                self.setState({
                    translate: Math.pow((hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY, 0.85)
                });
            } else {
                if (self.state.translate !== 0) {
                    self.setState({translate: 0});
                    self.transformScroller(0, self.state.translate);
                }
            }

            if (distanceY > 0) {
                if (!isDragStart) {
                    isDragStart = true;
                }
                // if (self.state.translate <= dragValve) {// 下拉中，但还没到刷新阀值
                //     if (dropDownRefreshText !== XLJZ)
                //         self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
                // } else { // 下拉中，已经达到刷新阀值
                //     if (dropDownRefreshText !== SKJZ)
                //         self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = SKJZ);
                // }
                self.transformScroller(0, self.state.translate);
            }
        }
        function touchEnd(event) {
            isDragStart = false;
            if (!isTouchStart) return;
            isTouchStart = false;
            if (self.state.translate <= dragValve) {
                self.transformScroller(0.3, 0);
            } else {
                self.setState({dragLoading: true});//设置在下拉刷新状态中
                self.transformScroller(0.1, dragValve);
                // self.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = JZ);
                self.props.onRefresh();//触发冲外面传进来的刷新回调函数
            }
        }
    }
    initScroll() {
        var self = this;

        function scrolling() {
            if (self.state.scrollerLoading) return;
            var scrollerscrollHeight = self.refs.scroller.scrollHeight; // 容器滚动总高度
            var scrollerHeight = self.refs.scroller.getBoundingClientRect().height;// 容器滚动可见高度
            var scrollerTop = self.refs.scroller.scrollTop;//滚过的高度
            // 达到滚动加载阀值
            if (scrollerscrollHeight - scrollerHeight - scrollerTop <= scrollValve) {
                self.setState({scrollerLoading: true});
                console.log('load more data...')
                // console.log()
                self.props.onLoadMore();
            }
        }
        // 监听滚动加载
        if (this.state.openScrollLoading) {
            // this.refs.scroller.addEventListener('scroll', scrolling, false);
            document.querySelector('.img-sec').addEventListener('scroll', scrolling, false);
        }
    }
    /**
     * 利用 transition 和transform  改变位移
     * @param time 时间
     * @param translate  距离
     */
    transformScroller(time, translate) {
        this.setState({translate: translate});
        var elStyle = this.refs.scroller.style;
        elStyle.webkitTransition = elStyle.MozTransition = elStyle.transition = 'all ' + time + 's ease-in-out';
        elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = 'translate3d(0, ' + translate + 'px, 0)';
    }
    /**
     * 下拉刷新完毕
     */
    dragLoadingDone() {
        this.setState({dragLoading: false});
        this.transformScroller(0.1, 0);
    }
    /**
     * 滚动加载完毕
     */
    scrollLoadingDone() {
        this.setState({scrollerLoading: false});
        // this.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
    }
    /**
     * 当有新的属性需要更新时。也就是网络数据回来之后
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        var self = this;
        this.setState({data: nextProps.article,});//把新的数据填进列表
        if (this.state.dragLoading) {//如果之前是下拉刷新状态，恢复
            setTimeout(function () {
                self.dragLoadingDone();
            }, 1000);
        }
        if (this.state.scrollerLoading) {//如果之前是滚动加载状态，恢复
            setTimeout(function () {
                self.scrollLoadingDone();
            }, 1000);
        }
    }
    render(){
        var self = this;
        return (
                <div className="scroller" ref="scroller">
                    <div className="drop-down-refresh-layer">
                        <p className="drop-down-refresh-text" ref="dropDownRefreshText">{self.props.searchkeyword}总共有{self.props.total}条</p>
                    </div>
                    <div className="scroller-content">
                        <div className="content">
                            <ul className="left_four_ul" id="list">
                                {self.state.data.map(function (item) {//通过map循环把子列表数据展示出来
                                    return self.props.getItem(item);
                                })
                                }
                            </ul>
                        </div>
                        <div className="scroll-loading">加载中...</div>
                    </div>
                </div>
        );
    }
}
export default ListView;
