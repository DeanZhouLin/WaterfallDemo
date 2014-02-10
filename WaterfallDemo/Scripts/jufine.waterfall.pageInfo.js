(function (win) {
    var PageInfo = {
        // ��ȡҳ��ĸ߶ȡ����
        GetPageSize: function () {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {
                xScroll = window.innerWidth + window.scrollMaxX;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else {
                if (document.body.scrollHeight > document.body.offsetHeight) {
                    // all but Explorer Mac    
                    xScroll = document.body.scrollWidth;
                    yScroll = document.body.scrollHeight;
                } else {
                    // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
                    xScroll = document.body.offsetWidth;
                    yScroll = document.body.offsetHeight;
                }
            }
            var windowWidth = 0, windowHeight = 0;
            if (self.innerHeight) {
                // all except Explorer    
                if (document.documentElement.clientWidth) {
                    windowWidth = document.documentElement.clientWidth;
                } else {
                    windowWidth = self.innerWidth;
                }
                windowHeight = self.innerHeight;
            } else {
                if (document.documentElement && document.documentElement.clientHeight) {
                    // Explorer 6 Strict Mode    
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                } else {
                    if (document.body) {
                        // other Explorers    
                        windowWidth = document.body.clientWidth;
                        windowHeight = document.body.clientHeight;
                    }
                }
            }
            // for small pages with total height less then height of the viewport    
            var pageHeight;
            if (yScroll < windowHeight) {
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport    
            var pageWidth;
            if (xScroll < windowWidth) {
                pageWidth = xScroll;
            } else {
                pageWidth = windowWidth;
            }
            var arrayPageSize = {
                pageWidth: pageWidth,
                pageHeight: pageHeight,
                windowWidth: windowWidth,
                windowHeight: windowHeight
            };
            return arrayPageSize;
        },
        //����������ʵ�ʿ�ȣ���ȡImage�Ŀ�Ⱥ�ColumnSpace��ֵ
        GetImageWidthAndColumnSpace: function (containerWidth) {
            //var ColumnSpace = containerWidth * 0.01;
            var ColumnSpace = 15;
            var ImageWidth;
            //������ͼƬ���
            var expectImageWidth = 250;
            //����������
            var expectMinObjectCount = 3;
            //�������������ͼ�����㵱ǰͼƬ���
            var desiredImageWidth = (containerWidth - (expectMinObjectCount + 1) * ColumnSpace) / expectMinObjectCount;
            //�����յ�ͼƬ�������Ϊ ����ͼƬ��� �� �������ͼƬ��� �н�С��һ��
            if (desiredImageWidth < expectImageWidth) {
                ImageWidth = desiredImageWidth;
            } else {
                ImageWidth = expectImageWidth;
            }
            //����ͼƬ��Ⱥͼ�� ��������
            var desiredObjectCount = Math.floor(containerWidth / parseFloat(ImageWidth + ColumnSpace));
            //ȷ����������
            if (desiredObjectCount < expectMinObjectCount) {
                desiredObjectCount = expectMinObjectCount;
            }
            //ȷ������ͼƬ���
            ImageWidth = Math.floor((containerWidth - (desiredObjectCount + 1) * ColumnSpace) / desiredObjectCount);
            return {
                ColumnSpace: ColumnSpace,
                ImageWidth: ImageWidth,
                ColumnCount: desiredObjectCount
            };
        },
        //�趨һ����ʱ����ִ�з������˳�������ִ�м����
        SetInterval: function (fnExec, fnOutCondition, dely) {
            var interval = window.setInterval(function () {
                if (fnOutCondition()) {
                    window.clearInterval(interval);
                } else {
                    fnExec();
                }
            }, dely);
        },
        //��������Y���ϵĹ�������
        GetScrollTop: function () {
            var bodyScrollTop = 0, documentScrollTop = 0;
            if (document.body) {
                bodyScrollTop = document.body.scrollTop;
            }
            if (document.documentElement) {
                documentScrollTop = document.documentElement.scrollTop;
            }
            return bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
        },
        //���ù�������λ��
        SetScrollTop: function (delter) {
            var bodyScrollTop = 0, documentScrollTop = 0;
            if (document.body) {
                bodyScrollTop = document.body.scrollTop;
            }
            if (document.documentElement) {
                documentScrollTop = document.documentElement.scrollTop;
            }
            if (bodyScrollTop - documentScrollTop > 0) {
                document.body.scrollTop = bodyScrollTop - delter;
            } else {
                document.documentElement.scrollTop = documentScrollTop - delter;
            }
        },
        //�ĵ����ܸ߶�
        GetScrollHeight: function () {
            var bodyScrollHeight = 0, documentScrollHeight = 0;
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight;
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight;
            }
            return bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
        },
        //������ӿڵĸ߶�
        GetWindowHeight: function getWindowHeight() {
            return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
        },
        //����Ƿ��Ѿ��������ײ�
        IsInBottom: function (fn) {
            //�ĵ����ܸ߶�
            var scrollHeight = PageInfo.GetScrollHeight();
            //��������Y���ϵĹ�������
            var scrollTop = PageInfo.GetScrollTop();
            //������ӿڵĸ߶�
            var windowHeight = PageInfo.GetWindowHeight();
            var res = false;
            if (Math.abs(scrollTop + windowHeight - scrollHeight) < 5) {
                res = true;
            }
            if (fn != null) {
                fn(res) && fn(res, scrollHeight) && fn(res, scrollHeight, scrollTop, windowHeight);
            }
            return res;
        }
    };
    win.PageInfo = PageInfo;
})(window);
