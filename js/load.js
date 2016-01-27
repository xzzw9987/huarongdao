var callback;
window.addEventListener('load', function () {
    $('.load-percent').text('100%');
    callback && callback();
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
