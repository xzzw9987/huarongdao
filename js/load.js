var callback;
window.addEventListener('load', function () {
    n = 100;
    $('.load-percent').text(n + '%');
    setTimeout(function () {
        callback && callback();
    }, 1000);
});
var n = 0;
function x() {
    if (n < 100) {
        $('.load-percent').text(n + '%');
        setTimeout(function () {
            n++;
            x();
        }, 300);
    }
}
x();
module.exports = function (cb) {
    callback = cb;
};
