(function (win) {
    var Z = win["Z"] || {};
    var _autoHiddenLoadingTimeout;
    var _windowResizeTimeout;

    Z = {
        //检查当前数据是否在加载中
        CheckLoading: function (loadingObj, currObj) {
            return loadingObj.style.display == "" || currObj.getLoading();
        },
        //隐藏数据加载中
        HiddenLoading: function (loadingObj, currObj) {
            if (!Z.CheckLoading(loadingObj, currObj)) {
                return;
            }
            currObj.setLoading(false);
            loadingObj.style.display = "none";
        },
        //显示数据加载中
        ShowLoading: function (loadingObj, currObj, delay) {
            currObj.setLoading(true);
            loadingObj.style.display = "";
            //在显示数据加载中delay秒以后，尝试自动取消掉数据加载   
            if (_autoHiddenLoadingTimeout != undefined) {
                clearTimeout(_autoHiddenLoadingTimeout);//取消掉不必要的定时器
            }
            _autoHiddenLoadingTimeout = window.setTimeout(function () {
                Z.HiddenLoading(loadingObj, currObj);
            }, delay);
        },
        //结束数据加载
        LoadCompleted: function LoadCompleted(loadingObj, currObj, setScrollTop) {
            Z.HiddenLoading(loadingObj, currObj);
            PageInfo.IsInBottom(function (inBottom) {
                if (inBottom) {
                    PageInfo.SetScrollTop(setScrollTop);
                }
            });
            X.$("waterfallDemo").style.marginTop = X.$("cb").offsetHeight + "px";
        },
        //第一次加载数据
        LoadFirstPage: function (loadingObj, currObj) {
            PageInfo.SetInterval(function () {
                if (!Z.CheckLoading(loadingObj, currObj)) {
                    currObj.loadData();
                }
            }, function () {
                return PageInfo.GetScrollHeight() > PageInfo.GetWindowHeight();
            }, 1000);
        },
        //加载一页数据
        LoadOnePage: function (success, fn) {
            var div = null;
            try {
                div = fn();
            } catch (e) { } finally {
                success && success(div);
            }
        },
        //定时检查滚动条是否处于最底部
        BindTimingBottomScrollDetector: function (scrollTop, delay) {
            PageInfo.SetInterval(function () {
                PageInfo.IsInBottom(function (inBottom) {
                    if (inBottom) {
                        PageInfo.SetScrollTop(scrollTop);
                    }
                });
            }, function () {
                return false;
            }, delay);
        },
        //窗口尺寸发生改变时执行
        BindWindowResize: function (opts) {
            var loadingObj = opts.loadingObj;
            var currObj = opts.currObj;
            var delay = opts.delay;
            var autoTryHiddenLoadingDelay = opts.autoTryHiddenLoadingDelay;
            var container = opts.container;

            //orientationchange

            X.addEvent(win, 'orientationchange', function () {
                Z.ShowLoading(loadingObj, currObj, autoTryHiddenLoadingDelay);
                if (currObj.getCurrParam().options.currItemCount > 0) {
                    clearInterval(_windowResizeTimeout);
                    _windowResizeTimeout = setTimeout(function () {
                        //window.location.reload();
                        //currObj.clearItems();
                        Z.ClearContainItems(container, loadingObj, currObj);
                        Z.LoadFirstPage(loadingObj, currObj);
                    }, delay);
                }
            });
        },
        //第一次加载数据时统一的执行方法
        CoreExecute: function (options) {
            var lo = options.loadingObj;
            var co = options.currObj;
            var nbs = options.BottomScrollDetectorInfo.needBind;
            var nbw = options.WindowResizeInfo.needBind;
            //加载一批数据,直到出现滚动条为止
            Z.LoadFirstPage(lo, co);
            //每隔30s执行一次，如果此时滚动条处于页面最底部，将其上拉n个像素
            if (nbs) {
                var delay_s = options.BottomScrollDetectorInfo.delay;
                var scrollTop = options.BottomScrollDetectorInfo.scrollTop;
                Z.BindTimingBottomScrollDetector(scrollTop, delay_s);
            }
            //窗口尺寸发生改变时，重新加载数据
            if (nbw) {
                var delay_w = options.WindowResizeInfo.delay;
                var autoTryHiddenLoadingDelay = options.WindowResizeInfo.autoTryHiddenLoadingDelay;
                var container = options.WindowResizeInfo.container;

                Z.BindWindowResize({
                    loadingObj: lo,
                    currObj: co,
                    delay: delay_w,
                    autoTryHiddenLoadingDelay: autoTryHiddenLoadingDelay,
                    container: container
                });
            }
        },
        //清空容器内现有项目
        ClearContainItems: function (container, loadingObj, currObj) {
            Z.HiddenLoading(loadingObj, currObj);
            container.innerHTML = '';
            currObj.initParam();
        },
        //获取传输参数
        GetQueryString: function (currObj) {
            var params = currObj.getCurrParam();
            var options = params.options;
            
            var queryData = new Array(4);
            queryData.push('ImageWidth=' + options.columnWidth);
            queryData.push('PageNumber=' + options.currPageNum);
            queryData.push('CurrItemCount=' + options.currItemCount);
            queryData.push('ScrollTop=' + options.currScrollTop);
            return queryData.join('&');
        }
    };
    win.Z = Z;
})(window);
