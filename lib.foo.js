/**
 * 随机数 
 * @param  {[type]} under 下限 必填
 * @param  {[type]} over  上限
 * @return {[type]}       返回结果 
 *                        ①.如果over为空，返回（0-under）区间随机数
 *                        ②.如果over && under均不为空，返回（over-under）区间随机数
 */
function randomNum(under, over) {
    switch(arguments.length){ 
        case 1: return parseInt(Math.random() * under + 1); 
        case 2: return parseInt(Math.random() * (over - under + 1) + under);
        default: return 0; 
    }
}
/**
 * 动态修改微信页面title
 * @param  {[type]} argument title
 * @return {[type]}          [description]
 */
function changeDocumentTitle (argument) {
    var $body = $('body');
    document.title = argument;
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe style="display:none;" src="/favicon.ico"></iframe>').on('load', function() {
        setTimeout(function() {
            $iframe.off('load').remove()
        }, 0)
    }).appendTo($body);
}

// 将当前时间换成时间格式字符串
var timestamp3 = 1403058804;
var newDate = new Date();

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
// 获取referrer
function getReferrer() {
    var referrer = '';
    
    try {
        referrer = window.top.document.referrer;
    } catch(e) {
        if(window.parent) {
            try {
                referrer = window.parent.document.referrer;
            } catch(e2) {
                referrer = '';
            }
        }
    }
    if(referrer === '') {
        referrer = document.referrer;
    }
    return referrer;
};


/* =========== 其他 =========== */
// Popup
function popup(event) {
    // Prevent the link opening
    if(event.target.nodeName.toLowerCase() == "a") {
        if(event.preventDefault) { 
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }
    }

    var link    = event.target,
        url     = link.href,
        width   = link.getAttribute("data-window-width") || 600,
        height  = link.getAttribute("data-window-height") || 600,
        name    = link.getAttribute("data-window-name") || "popup";

    // If window exists, just focus it
    if(window["window-"+name] && !window["window-"+name].closed) {
        window["window-"+name].focus();
    }
    else {
        // Get position
        var left = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var top = window.screenTop !== undefined ? window.screenTop : screen.top;

        // Open in the centre of the screen
        var x = (screen.width / 2) - (width / 2) + left,
            y = (screen.height / 2) - (height / 2) + top;

        // Open that window
        window["window-"+name] = window.open(url, name, "top=" + y +",left="+ x +",width=" + width + ",height=" + height);

        // Focus new window
        window["window-"+name].focus();
    }
}

// Trigger popups
document.querySelector(".js-popup").addEventListener("click", popup);

// Get JSONP
function getJSONP(url, callback) {
    var name = "jsonp_callback_" + Math.round(100000 * Math.random());

    // Cleanup to prevent memory leaks and hit original callback
    window[name] = function(data) {
        delete window[name];
        document.body.removeChild(script);
        callback(data);
    };

    // Create a faux script
    var script = document.createElement("script");
    script.setAttribute("src", url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + name);

    // Inject to the body
    document.body.appendChild(script);
}

// Get star count
var storageSupported = ("sessionStorage" in window),
    selectors = {
        github: ".js-stargazers-count",
        twitter: ".js-tweet-count"
    };

// Display the count next to the button
function displayCount(selector, count) {
    document.querySelector(selector).innerHTML = count;
}

// Add star
function formatGitHubCount(count) {
    return "&#9733; " + count;
}

// Check if it's in session storage first
if (storageSupported && "github_stargazers" in window.sessionStorage) {
    displayCount(selectors.github, formatGitHubCount(window.sessionStorage.github_stargazers));
} else {
    getJSONP("https://api.github.com/repos/selz/plyr?access_token=a46ac653210ba6a6be44260c29c333470c3fbbf5", function(json) {
        if (json && typeof json.data.stargazers_count !== "undefined") {
            // Update UI 
            displayCount(selectors.github, formatGitHubCount(json.data.stargazers_count));

            // Store in session storage
            window.sessionStorage.github_stargazers = json.data.stargazers_count;
        }
    });
}

// Get tweet count
if (storageSupported && "tweets" in window.sessionStorage) {
    displayCount(selectors.twitter, window.sessionStorage.tweets);
} else {
    getJSONP("https://cdn.api.twitter.com/1/urls/count.json?url=plyr.io", function(json) {
        if (json && typeof json.count !== "undefined") {
            // Update UI 
            displayCount(selectors.twitter, json.count);

            // Store in session storage
            window.sessionStorage.tweets = json.count;
        }
    });
}

// js从数组中删除指定值
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var _arr = ['a', 'b', 'c'];

_arr.remove('b');  // ['a', 'c']


//获取浏览器参数 函数
//作用：抓取浏览器URL传递的参数 name为参数名称
//调用实例：http://www.uis.cc/index.html?page=1&active=158   抓取 page = getQueryString('page');
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}


/**
 * 组合字符串 zu-he-zi-fu-chuan
 * @param  {[type]} string zu-he-zi-fu-chuan
 * @return {[type]}        zuHeZiFuChuan
 */
function getCombo (string) {
    var arr = string.split("-");
    var len = arr.length;
    for (var i = 1; i < len; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase()+arr[i].substr(1, arr[i].length-1)
    }
    string = arr.join("");
    return string;
}

getCombo("zu-he-zi-fu-chuan");
