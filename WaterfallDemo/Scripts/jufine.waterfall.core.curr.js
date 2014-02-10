(function (win) {
    var Z = win["Z"] || {};
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
            window.setTimeout(function () {
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
        },
        //��һ�μ�������
        LoadFirstPage: function (loadingObj, currObj) {
            PageInfo.SetInterval(function () {
                if (!Z.CheckLoading(loadingObj, currObj)) {
                    currObj.loadData();
                }
            }, function () {
                return PageInfo.GetScrollHeight() > PageInfo.GetWindowHeight();
            }, 1e3);
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
        //��һ�μ�������ʱͳһ��ִ�з���
        CoreExecute: function (options) {
            var lo = options.loadingObj;
            var co = options.currObj;
            var nbs = options.BottomScrollDetectorInfo.needBind;
            var nbw = options.WindowResizeInfo.needBind;
            //����һ������,ֱ�����ֹ�����Ϊֹ
            Z.LoadFirstPage(lo, co);
            //ÿ��30sִ��һ�Σ������ʱ����������ҳ����ײ�����������7������
            if (nbs) {
                var delay_s = options.BottomScrollDetectorInfo.delay;
                var scrollTop = options.BottomScrollDetectorInfo.scrollTop;
                Z.BindTimingBottomScrollDetector(scrollTop, delay_s);
            }
            //���ڳߴ緢���ı�ʱ�����¼�������
            if (nbw) {
                var delay_w = options.WindowResizeInfo.delay;
                var itemCountSelector = options.WindowResizeInfo.itemCountSelector;
                Z.BindWindowResize(itemCountSelector, lo, co, delay_w);
            }
        }
    };
    win.Z = Z;
})(window);
