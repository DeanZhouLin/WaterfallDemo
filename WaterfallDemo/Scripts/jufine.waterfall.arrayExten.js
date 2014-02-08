(function () {
    Array.prototype.distinct = function () {
        var sameObj = function (a, b) {
            var tag = true;
            if (!a || !b) {
                return false;
            }
            for (var x in a) {
                if (!b[x]) {
                    return false;
                }
                if (typeof (a[x]) === 'object') {
                    tag = sameObj(a[x], b[x]);
                } else {
                    if (a[x] !== b[x]) {
                        return false;
                    }
                }
            }
            return tag;
        };
        var newArr = [], obj = {};
        for (var i = 0, len = this.length; i < len; i++) {
            if (!sameObj(obj[typeof (this[i]) + this[i]], this[i])) {
                newArr.push(this[i]);
                obj[typeof (this[i]) + this[i]] = this[i];
            }
        }
        return newArr;
    };
    Array.prototype.indexOf = function (item) {
        var index = -1;
        for (var i = 0; i < this.length; i++) {
            if (this[i] == item) {
                index = i;
                break;
            }
        }
        return index;
    };
    Array.prototype.min = function () {
        var min = Math.min.apply(null, this);
        return this.indexOf(min);
    };
    Array.prototype.max = function () {
        var max = Math.max.apply(null, this);
        return this.indexOf(max);
    };
})();