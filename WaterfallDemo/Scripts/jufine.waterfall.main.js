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
          
            var t = PageInfo.GetImageWidthAndColumnSpace(container.offsetWidth);
            options.columnWidth = t.ImageWidth;
            options.columnSpace = t.ColumnSpace;
            options.columnCount = t.ColumnCount;
            hList = new Array(options.columnCount);
            hList = (hList.join(',').replace(/,/g, '0|') + '0').split('|');
        },
        setLoading: function (isLoading) {
            _this.loading = isLoading;
        },
        getLoading: function () {
            return _this.loading;
        },
        scrollHandler: function () {
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
                        hList[minIndex] = top + item.offsetHeight;
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


