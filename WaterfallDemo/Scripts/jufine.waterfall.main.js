/*
 *project: Waterfall Layout
 *version: 1.0
 *create: 2013-7-2
 *update: 2013-7-3 12:00
 *author: F2E xiechengxiong
 */

(function (win, doc) {
    var hList;
    var options;
    var _this;
    var Waterfall = function (obj, opts) {
        options = opts;
        obj.style.position = 'relative';
        var column = parseInt(obj.offsetWidth / (opts.columnWidth + opts.columnSpace));
        hList = new Array(column);
        hList = (hList.join(',').replace(/,/g, '0|') + '0').split('|');
        this.bindEvent();
    };
    Waterfall.prototype = {
        bindEvent: function () {
            _this = this;
            _this.setLoading(false);
            X.addEvent(win, 'scroll', this.scrollHandler);

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

            //var hListMin = hList.min();
            //var hListMinObj = hList[hListMin];
            //var scrollTop = (doc.documentElement.scrollTop || doc.body.scrollTop);
            //var clientHeight = doc.documentElement.clientHeight;

            //var flag = hListMinObj < (scrollTop + clientHeight);

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
                options.complete && options.complete(obj);
            });
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
})(window, document);


