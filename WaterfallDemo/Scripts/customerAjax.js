
(function (win) {
    var $ = {
        ajax: function (opt) {
            var xhr = this.createXhrObject();
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                (xhr.status === 200 ?
                    opt.success(opt.dataType === 'json' ? $.parseJSON(xhr.responseText) : xhr.responseText, opt.dataType === 'json' ? $.parseJSON(xhr.responseXML) : xhr.responseXML) :
                    opt.error(opt.dataType === 'json' ? $.parseJSON(xhr.responseText) : xhr.responseText, opt.dataType === 'json' ? $.parseJSON(xhr.responseXML) : xhr.status));
            };
            xhr.open(opt.type, opt.url, true);
            if (opt.type !== 'post')
                opt.data = null;
            else
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            opt.data = this.parseQuery(opt.data);
            xhr.send(opt.data);
        },
        post: function (url, success, data, error) {
            var popt = {
                url: url,
                type: 'post',
                data: data,
                dataType: 'text',
                success: success,
                error: error
            };
            this.ajax(popt);
        },
        get: function (url, success, error) {
            var gopt = {
                url: url,
                type: 'get',
                dataType: 'text',
                success: success,
                error: error
            };
            this.ajax(gopt);
        },
        createXhrObject: function () {
            var methods = [
                function () { return new XMLHttpRequest(); },
                function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
                function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
            ];
            var len = methods.length;
            for (var i = 0; i < len; i++) {
                try {
                    methods[i]();
                } catch (e) {
                    continue;
                }
                this.createXhrObject = methods[i];
                return methods[i]();
            }
            throw new Error('Could not create an XHR object.');
        },
        parseQuery: function (json) {
            if (typeof json == 'object') {
                var str = '';
                for (var i in json) {
                    str += "&" + i + "=" + encodeURIComponent(json[i]);
                }
                return str.length == 0 ? str : str.substring(1);
            } else {
                return json;
            }
        },
        parseJSON: function (data) {
            if (!data || typeof data !== "string") {
                return null;
            }
            data = this.trim(data);
            if (win.JSON && win.JSON.parse) {
                return win.JSON.parse(data);
            }
            return (new Function("return " + data))();
        },
        trim: function (text) {
            return text == null ? '' : text.replace(/(^\s*)|(\s*$)/g, '');
        }
    };
    win.$ = $;
})(window);