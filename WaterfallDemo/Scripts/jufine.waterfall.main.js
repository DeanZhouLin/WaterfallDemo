(function (win) {
    var hList;
    var options;
    var _this;
    var container;

    var Waterfall = function (obj, opts) {
        options = opts;
        container = obj;
        this.initParam();
        this.bindEvent();
    };
    Waterfall.prototype = {
        bindEvent: function () {
            _this = this;
            _this.setLoading(false);
            X.addEvent(win, 'scroll', this.scrollHandler);
        },
        initParam: function () {
            options.currPageNum = 1;
            options.currItemCount = 0;
            options.currScrollTop = PageInfo.GetScrollTop();
            options.currScrollHeight = PageInfo.GetScrollHeight();
            options.currwindowHeight = PageInfo.GetWindowHeight();
            var t = PageInfo.GetImageWidthAndColumnSpace(container.offsetWidth);
            options.columnWidth = t.ImageWidth;
            options.columnSpace = t.ColumnSpace;
            options.columnCount = t.ColumnCount;
            hList = new Array(options.columnCount);
            hList = (hList.join(',').replace(/,/g, '0|') + '0').split('|');
        },
        getCurrParam: function () {
            return { options: options, hList: hList, container: container, currObj: _this };
        },
        setCurrOptions: function (conditions) {
            for (var item in conditions) {
                options[item] = conditions[item];
            }
        },
        setLoading: function (isLoading) {
            _this.loading = isLoading;
        },
        getLoading: function () {
            return _this.loading;
        },
        scrollHandler: function () {
            _this.setCurrOptions({
                currScrollTop: PageInfo.GetScrollTop(),
                currwindowHeight: PageInfo.GetWindowHeight(),
                currScrollHeight: PageInfo.GetScrollHeight()
            });
            var opts = options;
            X.$('lblInfo').innerHTML = opts.currPageNum + "," + opts.currItemCount + "," + opts.currScrollTop + "," + opts.currwindowHeight + "," + opts.currScrollHeight;
            X.$('lblInfo').innerHTML += "," + opts.columnCount + "," + opts.columnSpace + "," + opts.columnWidth;
            if (_this.getLoading()) {
                return;
            }
            if (PageInfo.IsInBottom(null)) {
                options.load(function (obj) {
                    _this.arrange(obj);
                });
            }
        },
        loadData: function () {
            options.load(function (obj) {
                _this.arrange(obj);
            });
        },
        arrangeAll: function () {
            options.currScrollHeight = PageInfo.GetScrollHeight();
            options.currwindowHeight = PageInfo.GetWindowHeight();
            var t = PageInfo.GetImageWidthAndColumnSpace(container.offsetWidth);
            options.columnWidth = t.ImageWidth;
            options.columnSpace = t.ColumnSpace;
            options.columnCount = t.ColumnCount;
            hList = new Array(options.columnCount);
            hList = (hList.join(',').replace(/,/g, '0|') + '0').split('|');
            container.innerHTML = container.innerHTML;
            _this.arrange(container); 
        },
        arrange: function (obj) {
            try {
                if (obj == null) {
                    return;
                }
                var columnWidth = options.columnWidth;
                var columnSpace = options.columnSpace;
                var iList = X.getByClass(options.itemSelector, obj);
                var imgList = X.getByTag('img', obj);
                this.imageUpload(imgList, function () {
                    for (var i = 0; i < iList.length; i++) {
                        var item = iList[i];
                        var minIndex = hList.min();
                        var top = parseFloat(hList[minIndex]) + columnSpace;
                        item.style.position = 'absolute';
                        item.style.left = minIndex * (columnWidth + columnSpace) + columnSpace + 'px';
                        item.style.top = top + 'px';
                        item.style.width = columnWidth + 'px';
                        imgList[i].style.width = columnWidth + 'px';
                        hList[minIndex] = top + 4 + item.offsetHeight;
                    }
                });
            } catch (e) {
                alert(e);
            } finally {
                options.complete && options.complete(obj);
            }
        },
        imageUpload: function (imgList, fn) {
            var len = imgList.length;
            if (!len) {
                fn && fn();
                return;
            }
            var count = 0;
            var plusCount = function () {
                count++;
                if (count === len) {
                    fn && fn.call(_this);
                }
            };
            imgList.each(function () {
                X.onload(this, plusCount);
                this.onerror = plusCount;
            });
        }
    };
    win.Waterfall = Waterfall;
})(window);

