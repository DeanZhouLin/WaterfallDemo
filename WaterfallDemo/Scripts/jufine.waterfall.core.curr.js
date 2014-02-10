(function (win) {
    var Z = win["Z"] || {};
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
            window.setTimeout(function () {
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
        },
        //第一次加载数据
        LoadFirstPage: function (loadingObj, currObj) {
            PageInfo.SetInterval(function () {
                if (!Z.CheckLoading(loadingObj, currObj)) {
                    currObj.loadData();
                }
            }, function () {
                return PageInfo.GetScrollHeight() > PageInfo.GetWindowHeight();
            }, 1e3);
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
        BindWindowResize: function (currItemCountID, loadingObj, currObj, delay) {
            window.onresize = function () {
                Z.ShowLoading(loadingObj, currObj, delay);
                if (parseInt(X.$(currItemCountID).value) > 0) {
                    setTimeout(function () {
                        window.location.reload();
                    }, delay);
                }
            };
        },
        //第一次加载数据时统一的执行方法
        CoreExecute: function (options) {
            var lo = options.loadingObj;
            var co = options.currObj;
            var nbs = options.BottomScrollDetectorInfo.needBind;
            var nbw = options.WindowResizeInfo.needBind;
            //加载一批数据,直到出现滚动条为止
            Z.LoadFirstPage(lo, co);
            //每隔30s执行一次，如果此时滚动条处于页面最底部，将其上拉7个像素
            if (nbs) {
                var delay_s = options.BottomScrollDetectorInfo.delay;
                var scrollTop = options.BottomScrollDetectorInfo.scrollTop;
                Z.BindTimingBottomScrollDetector(scrollTop, delay_s);
            }
            //窗口尺寸发生改变时，重新加载数据
            if (nbw) {
                var delay_w = options.WindowResizeInfo.delay;
                var itemCountSelector = options.WindowResizeInfo.itemCountSelector;
                Z.BindWindowResize(itemCountSelector, lo, co, delay_w);
            }
        }
    };
    win.Z = Z;
})(window);
