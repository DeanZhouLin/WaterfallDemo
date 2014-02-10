(function (win) {
    var PageInfo = {
        // 获取页面的高度、宽度
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
        //根据容器的实际宽度，获取Image的宽度和ColumnSpace的值
        GetImageWidthAndColumnSpace: function (containerWidth) {
            //var ColumnSpace = containerWidth * 0.01;
            var ColumnSpace = 15;
            var ImageWidth;
            //期望的图片宽度
            var expectImageWidth = 250;
            //期望的列数
            var expectMinObjectCount = 3;
            //根据期望列数和间隔计算当前图片宽度
            var desiredImageWidth = (containerWidth - (expectMinObjectCount + 1) * ColumnSpace) / expectMinObjectCount;
            //将最终的图片宽度设置为 期望图片宽度 和 计算出的图片宽度 中较小的一个
            if (desiredImageWidth < expectImageWidth) {
                ImageWidth = desiredImageWidth;
            } else {
                ImageWidth = expectImageWidth;
            }
            //根据图片宽度和间隔 计算列数
            var desiredObjectCount = Math.floor(containerWidth / parseFloat(ImageWidth + ColumnSpace));
            //确定最终列数
            if (desiredObjectCount < expectMinObjectCount) {
                desiredObjectCount = expectMinObjectCount;
            }
            //确定最终图片宽度
            ImageWidth = Math.floor((containerWidth - (desiredObjectCount + 1) * ColumnSpace) / desiredObjectCount);
            return {
                ColumnSpace: ColumnSpace,
                ImageWidth: ImageWidth,
                ColumnCount: desiredObjectCount
            };
        },
        //设定一个定时器（执行方法，退出条件，执行间隔）
        SetInterval: function (fnExec, fnOutCondition, dely) {
            var interval = window.setInterval(function () {
                if (fnOutCondition()) {
                    window.clearInterval(interval);
                } else {
                    fnExec();
                }
            }, dely);
        },
        //滚动条在Y轴上的滚动距离
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
        //设置滚动条的位置
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
        //文档的总高度
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
        //浏览器视口的高度
        GetWindowHeight: function getWindowHeight() {
            return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
        },
        //检查是否已经滚动到底部
        IsInBottom: function (fn) {
            //文档的总高度
            var scrollHeight = PageInfo.GetScrollHeight();
            //滚动条在Y轴上的滚动距离
            var scrollTop = PageInfo.GetScrollTop();
            //浏览器视口的高度
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
