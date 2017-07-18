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


/**
 * 动态修改微信页面title
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

changeDocumentTitle("webclown.net");

// 计算两个日期相差有多少天
Math.abs(new Date('2017-02-01').getTime() - new Date('2017-07-31').getTime())/(1000 * 60 * 60 * 24);

// 返回指定日期是当年中的第几周
var getYearWeek = function(data) {
    /*
    date1是当前日期
    date2是当年第一天
    d是当前日期是今年第多少天
    用d + 当前年的第一天的周差距的和在除以7就是本年第几周
    */
    var _data = new Date(data);
    var date1 = new Date(_data.getFullYear(), parseInt((_data.getMonth()+1) - 1), _data.getDate()),
        date2 = new Date(_data.getFullYear(), 0, 1),
        d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return Math.ceil(
        (d + ((date2.getDay() + 1) - 1)) / 7
    );
};

// ===========================
// js如何判断一组数字是否连续
// https://segmentfault.com/q/1010000002943744
function arrange(source) {
    var t;
    var ta;
    var r = [];

    source.forEach(function(v) {
        console.log(t, v);   // 跟踪调试用
        if (t === v) {
            ta.push(t);
            t++;
            return;
        }

        ta = [v];
        t = v + 1;
        r.push(ta);
    });

    return r;
}

var arr = [3, 4, 13, 14, 15, 17, 20, 22];
console.log(arrange(arr));

// ===========================

/**
 * 合并相同单元格
 * @Author http://zhsq-java.iteye.com/blog/2021833
 * @param  {[object]}            tbl      [table对应的dom元素]
 * @param  {[number]}            beginRow [从第几行开始合并（从0开始）]
 * @param  {[number]}            endRow   [合并到哪一行，负数表示从底下数几行不合并]
 * @param  {[array]}             colIdxes [合并的列下标的数组，如[0,1]表示合并前两列，[0]表示只合并第一列]
 * @return {[type]}                     [description]
 */
function mergeSameCell(tbl,beginRow,endRow,colIdxes){  
    var colIdx = colIdxes[0];  
    var newColIdxes = colIdxes.concat();  
    newColIdxes.splice(0,1)  
    var delRows = new Array();  
    var rs = tbl.rows;  
    //endRow为0的时候合并到最后一行，小于0时表示最后有-endRow行不合并  
    if(endRow === 0){  
        endRow = rs.length - 1;  
    }else if(endRow < 0){  
        endRow = rs.length - 1 + endRow;  
    }  
    var rowSpan = 1; //要设置的rowSpan的值  
    var rowIdx = beginRow; //要设置rowSpan的cell行下标  
    var cellValue; //存储单元格里面的内容  
    for(var i=beginRow; i<= endRow + 1; i++){  
        if(i === endRow + 1){//过了最后一行的时候合并前面的单元格  
            if(newColIdxes.length > 0){  
                mergeSameCell(tbl,rowIdx,endRow,newColIdxes);  
            }  
            rs[rowIdx].cells[colIdx].rowSpan = rowSpan;
            rs[rowIdx].cells[colIdx].style.height = rowSpan * 130 + 'px';
        }else{  
            var cell = rs[i].cells[colIdx];  
            if(i === beginRow){//第一行的时候初始化各个参数  
                cellValue = cell.innerHTML;  
                rowSpan = 1;  
                rowIdx = i;  
            }else if(cellValue != cell.innerHTML){//数据改变合并前面的单元格  
                cellValue = cell.innerHTML;  
                if(newColIdxes.length > 0){  
                    mergeSameCell(tbl,rowIdx,i - 1,newColIdxes);  
                }  
                rs[rowIdx].cells[colIdx].rowSpan = rowSpan;
                rs[rowIdx].cells[colIdx].style.height = rowSpan * 130 + 'px';
                rowSpan = 1;  
                rowIdx = i;  
            }else if(cellValue === cell.innerHTML){//数据和前面的数据重复的时候删除单元格  
                rowSpan++;  
                delRows.push(i);  
            }  
        }  
    }  
    for(var j=0;j<delRows.length; j++){  
        rs[delRows[j]].deleteCell(colIdx);  
    }  
} 

mergeSameCell(document.querySelector('table'), 1, 3, 1);
