(function($) {
    $.fn.jupload = function(options) {
        var defaults = {
            id: '',//页面元素ID
            session_id: '',//会话ID
            jupload_server: '',//上传服务器地址
            params: {//上传参数
                'project': '',
                'table': '',
                'objectId': '',
                'group': '',
                'priority': '',
                'batch':'',
                'thumb':'',
                'cover': false
            },
            but_name: '上传文件',//按钮名称
            file_size: 1024 * 100,//文件大小
            types: "*",//文件类型
            pattern: "win", //上传模式 win 窗口模式 direct 页面直接上传模式;
            limit: 10,//配置上传个数 默认10个
            upload_complete_fun: function() {}//回调函数 function(serverFileDataArray){}
        };
        //默认值
        var opts = $.extend(defaults, options);
        return this.each(function() {
            var $this = $(this); //获取当前对象
            var ids = {
                domId:opts.id
            }
            initDirectUploadHtml($this, opts, ids);
            initDirectJqueryUplod(opts, ids);

        });
    };

    //初始化直接上传HTML
    function initDirectUploadHtml($this, opts, ids) {

    };
    //--初始化直接上传HTML

    //初始化直接上传SWFUPLOAD
    function initDirectJqueryUplod(opts, ids) {

        $('#'+ids.domId+'').fileupload({
            url: opts.jupload_server+'/upload',
            type:"POST",
            dataType:"json",
            autoUpload : true,
            forceIframeTransport: true,
            formData: opts.params,
            add: function (e, data) {
                var uploadErrors = [];
                var maxSize=opts.file_size;
                if(opts.types!="*"){
                    var acceptFileTypes = eval("/(\.|\/)("+opts.types+")$/i");
                    if(data.originalFiles[0]['name'].length && !acceptFileTypes.test(data.originalFiles[0]['name'])) {
                        // uploadErrors.push('类型错误');
                        Notify('类型错误', 'top-right', '5000', 'danger', 'fa-bolt', true);
                        return;
                    }
                }
                /*if (data.originalFiles[0]['size'] > maxSize) {
                    Notify('本地上传图片大小不能大于'+formatFileSize(maxSize), 'top-right', '5000', 'danger', 'fa-bolt', true);
                    // uploadErrors.push('文件超过大小限制'+formatFileSize(maxSize));
                    return;
                }*/
                if(uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                    data.submit();
                }
            },
            done: function (e, data) {
                //跨域请求
                $.ajax({
                    type: "post",
                    url: opts.jupload_server + '/object-file-json',
                    dataType: "jsonp",
                    jsonp: "jsoncallback",
                    data: opts.params,
                    async: false,
                    success: function(data) {
                        opts.upload_complete_fun(data);
                    }
                });
            },
            fail: function () {
                alert('文件传输失败！');
            }
        });


    };
    //--初始化直接上传SWFUPLOAD
})(jQuery);

function formatFileSize(size) {
    var unit = "B";
    if (size > (1024 * 1024 * 1024)) {
        unit = "GB";
        size /= (1024 * 1024 * 1024);
    } else if (size > (1024 * 1021)) {
        unit = "MB";
        size /= (1024 * 1024);
    } else if (size > 1024) {
        unit = "KB";
        size /= 1024;
    }
    var fsize = size.toFixed(2) + " " + unit;
    return fsize;
}

//HELPER
var FilesHelper = {
    getFilesIdArray: function(objectId, groupCode, fun) {
        var url = UPLOAD_SERVER + '/ufile/' + objectId + "/file-json";
        $.ajax({
            type: "post",
            url: url,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: {
                'groupCode': groupCode
            },
            async: false,
            success: function(data) {
                var filesIdArray = new Array();
                for (var i = 0; i < data.length; i++) {
                    filesIdArray[i] = data[i].filesId;
                }
                fun(filesIdArray);
            }
        });
    },
    getFileUrlArray: function(objectId, groupCode, fun) {
        var url = UPLOAD_SERVER + '/ufile/' + objectId + "/file-json";
        $.ajax({
            type: "post",
            url: url,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: {
                'groupCode': groupCode
            },
            async: false,
            success: function(data) {
                var fileUrlArray = new Array();
                for (var i = 0; i < data.length; i++) {
                    fileUrlArray[i] = data.url;
                }
                fun(fileUrlArray);
            }
        });
    },

    getIndexFileUrl: function(objectId, groupCode, fun) {

        var url = UPLOAD_SERVER + '/ufile/' + objectId + "/file-json";
        $.ajax({
            type: "post",
            url: url,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: {
                'groupCode': groupCode
            },
            async: false,
            success: function(data) {
                var fileUrl = "";
                if (data.length > 0) {
                    fileUrl = data[0].url;
                }
                fun(fileUrl);
            }
        });
    },

    getFileUrl: function(fileId, fun) {
        var url = UPLOAD_SERVER + '/ufile/' + fileId + "/url";
        $.ajax({
            type: "post",
            url: url,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            async: false,
            success: function(data) {
                var imgurl = data.fileUrl;
                fun(imgurl);
            }
        });
    },
    getIndexUploadFileVO: function(objectId,groupCode, fun) {
        var url = UPLOAD_SERVER + '/ufile/' + objectId + "/vo";
        $.ajax({
            type: "post",
            url: url,
            data:{"groupCode":groupCode},
            dataType: "jsonp",
            jsonp: "jsoncallback",
            async: false,
            success: function(data) {
                fun(data);
            }
        });
    }
}

//util
var PathUtil = {
    toWebPath: function(path) {
        var regex = new RegExp("/{1,}|\\\\{1,}", "g");
        var separator = "/";
        var replacement = "/";
        path = path.replace(regex, replacement);
        if (path.indexOf(separator) == 0) {
            path = path.substring(1, path.length());
        }
        path = path.replace("http:/", "http://");
        return path;
    },
    joinWebPath: function(pathArray) {
        var newPath = "";
        for (var i = 0; i < pathArray.length; i++) {
            var path = pathArray[i];
            path = PathUtil.toWebPath(path);
            if ((path.lastIndexOf("/") + 1) != path.length && i != (pathArray.length - 1)) {
                path = path + "/";
            }
            newPath = newPath + path;
        }
        return newPath;
    }
}
