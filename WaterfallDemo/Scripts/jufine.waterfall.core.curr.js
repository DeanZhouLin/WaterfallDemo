(function (win) {
    var Z = win["Z"] || {};
    var _autoHiddenLoadingTimeout;
    var _windowResizeTimeout;

    Z = {
        //��鵱ǰ�����Ƿ��ڼ�����
        CheckLoading: function (loadingObj, currObj) {
            return loadingObj.style.display == "" || currObj.getLoading();
        },
        //�������ݼ�����
        HiddenLoading: function (loadingObj, currObj) {
            if (!Z.CheckLoading(loadingObj, currObj)) {
                return;
            }
            currObj.setLoading(false);
            loadingObj.style.display = "none";
        },
        //��ʾ���ݼ�����
        ShowLoading: function (loadingObj, currObj, delay) {
            currObj.setLoading(true);
            loadingObj.style.display = "";
            //����ʾ���ݼ�����delay���Ժ󣬳����Զ�ȡ�������ݼ���   
            if (_autoHiddenLoadingTimeout != undefined) {
                clearTimeout(_autoHiddenLoadingTimeout);//ȡ��������Ҫ�Ķ�ʱ��
            }
            _autoHiddenLoadingTimeout = window.setTimeout(function () {
                Z.HiddenLoading(loadingObj, currObj);
            }, delay);
        },
        //�������ݼ���
        LoadCompleted: function LoadCompleted(loadingObj, currObj, setScrollTop) {
            Z.HiddenLoading(loadingObj, currObj);
            PageInfo.IsInBottom(function (inBottom) {
                if (inBottom) {
                    PageInfo.SetScrollTop(setScrollTop);
                }
            });
            X.$("waterfallDemo").style.marginTop = X.$("cb").offsetHeight + "px";
        },
        //��һ�μ�������
        LoadFirstPage: function (loadingObj, currObj) {
            PageInfo.SetInterval(function () {
                if (!Z.CheckLoading(loadingObj, currObj)) {
                    currObj.loadData();
                }
            }, function () {
                return PageInfo.GetScrollHeight() > PageInfo.GetWindowHeight();
            }, 1000);
        },
        //����һҳ����
        LoadOnePage: function (success, fn) {
            var div = null;
            try {
                div = fn();
            } catch (e) { } finally {
                success && success(div);
            }
        },
        //��ʱ���������Ƿ�����ײ�
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
        //���ڳߴ緢���ı�ʱִ��
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
        //��һ�μ�������ʱͳһ��ִ�з���
        CoreExecute: function (options) {
            var lo = options.loadingObj;
            var co = options.currObj;
            var nbs = options.BottomScrollDetectorInfo.needBind;
            var nbw = options.WindowResizeInfo.needBind;
            //����һ������,ֱ�����ֹ�����Ϊֹ
            Z.LoadFirstPage(lo, co);
            //ÿ��30sִ��һ�Σ������ʱ����������ҳ����ײ�����������n������
            if (nbs) {
                var delay_s = options.BottomScrollDetectorInfo.delay;
                var scrollTop = options.BottomScrollDetectorInfo.scrollTop;
                Z.BindTimingBottomScrollDetector(scrollTop, delay_s);
            }
            //���ڳߴ緢���ı�ʱ�����¼�������
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
        //���������������Ŀ
        ClearContainItems: function (container, loadingObj, currObj) {
            Z.HiddenLoading(loadingObj, currObj);
            container.innerHTML = '';
            currObj.initParam();
        },
        //��ȡ�������
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
