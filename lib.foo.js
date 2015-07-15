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
