require('./load')(function () {
    $('.loading').remove();
    $('.w').addClass('bg-index');
    $('.container').show();
    $('.container')[0].clientLeft;
    (function () {
        var containerHeight = 1878;

        function resize() {
            var c = document.querySelector('.container');
            c.style.transform = c.style.webkitTransform = 'scale(' + Math.min(1, document.querySelector('.w').scrollHeight / containerHeight) + ')';
        }

        resize();
        // window.addEventListener('resize', resize);
    })();

});
var url = 'http://xinzhongzhu.com:13001/setlottery';
var query = require('./query');
var {access_token,openid} = query(location.search.substring(1));
var $ = require('jquery');
var k = 3;
var animDuration = 500;
var gameState = {
    set state(val) {
        this.canPlay = true;
        if (val > 0 && val <= k) {
            $('.w')[0].className = 'w bg-game';
            var prev = this.state;
            var prevPage = $('.index,.game-canvas');
            prevPage.addClass('fade-out');
            setTimeout(function () {
                prevPage.remove();
                if (prev === 0) {
                    $('.container').append($(gamePage()));
                }
                game(q[val], val);
            }, animDuration);

            /**
             * tongji start
             */
            if (val > 1) {
                $.get('http://xinzhongzhu.com:13001/tongji', {
                    type: 'g' + (val - 1),
                    access_token, openid
                });
            }
            /**
             * tongji end
             */
        }
        if (val === k + 1) {
            missionComplete();
            this.canPlay = false;
        }
        this._state = val;
    },
    get state() {
        return this._state || 0;
    },
    set left(val) {
        var prev = this.left;
        this.used += ( prev - val) || 0;
        var pg = $('.pg');
        if (val > -1) {
            $('.left-steps', pg).text(val >= 10 ? val : '0' + val);
        }
        this._left = val;
    },
    get left() {
        return this._left;
    },
    set used(val) {
        var pg = $('.pg');
        $('.now-steps', pg).text(val >= 10 ? val : '0' + val);
        this._used = val;
    },
    get used() {
        return this._used || 0;
    },
    winPos: {x: 5, y: 2},
    win(pos) {
        return (pos.x === this.winPos.x && pos.y === this.winPos.y);
    },
    canPlay: true
};

var q = {
    '1': {
        left: 9,
        bars: [
            [0, 2, 1, 2, true],
            [1, 2, 0, 4],
            [0, 2, 2, 0],
            [1, 2, 2, 3],
            [1, 3, 3, 3],
            [1, 3, 5, 0],
            [0, 2, 4, 4],
            [0, 2, 4, 5]
        ],
        win: {x: 5, y: 2}
    },
    '2': {
        left: 8,
        bars: [
            [0, 2, 1, 2, true],
            [1, 3, 0, 1],
            [0, 3, 2, 0],
            [1, 3, 5, 0],
            [1, 2, 3, 1],
            [1, 2, 4, 1],
            [1, 2, 1, 3],
            [1, 2, 2, 3],
            [0, 2, 2, 5],
            [0, 3, 3, 3]
        ],
        win: {x: 5, y: 2}
    },
    '3': {
        left: 7,
        bars: [
            [0, 2, 1, 2, true],
            [0, 2, 2, 0],
            [0, 2, 3, 1],
            [1, 3, 5, 0],
            [0, 2, 0, 3],
            [1, 2, 1, 4],
            [1, 3, 2, 3],
            [1, 2, 3, 3],
            [0, 2, 4, 3],
            [0, 2, 4, 5]
        ],
        win: {x: 5, y: 2}
    }
};

function game(v, i) {
    var d = $('<div class="game-canvas stage-' + i + '"></div>');
    d.appendTo($('.game-bg'));
    gameState.left = v.left;
    gameState.used = 0;
    gameState.winPos = v.win;
    initBoard(6, 6, 960, 960, d, v.bars);
    d.on('touchmove', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
}

function over(restartLevel) {
    var s = `<div class="los">
        <div class="cv"></div>
        <div class="opt">
        <div class="nxt" data-restart="${restartLevel}"></div>
        </div>
        </div>`;
    $(s).appendTo(document.body);
}
function missionComplete() {
    /**
     * tongji start
     */
    $.get('http://xinzhongzhu.com:13001/tongji', {
        type: 'g' + (k - 1),
        access_token, openid
    });
    /**
     * tongji end
     */

    var s = `<div class="suc fade-in">
                <div class="cv"></div>
                <div class="opt">
                    <div class="nxt"></div>
                </div>
            </div>`;
    $(s).appendTo(document.body);
}

function initBoard(gridOfX, gridOfY, width, height, container, brs) {
    var perWidth = width / gridOfX;
    var perHeight = height / gridOfY;
    var b = bar(perWidth, perHeight, container);
    var initBar = b.initBar;
    var occupyMap = refreshOccupyMap();

    var bars = {
        b: [],
        push: function push(bar) {
            this.b.push(bar);
            setOccupyMap(bar, occupyMap);
        }
    };
    brs.forEach(function (c) {
        var lastPos = {
            x: c[2],
            y: c[3]
        };
        bars.push(initBar(c[0], c[1], c[2], c[3], c[4] || false).shouldMove(function (d, bar) {
            if (!gameState.canPlay)
                return false;
            return canMove(d, bar);
        }).moveEnd(function (pos, bar) {
            // 改变最终位置

            if (bar.dir === 0) {
                pos.x = Math.round(pos.x / perWidth) * perWidth;
            } else {
                pos.y = Math.round(pos.y / perHeight) * perHeight;
            }
            return pos;
        }).stop(function (bar) {
            if (!gameState.canPlay)
                return;
            occupyMap = refreshOccupyMap();
            bars.b.forEach(function (b) {
                setOccupyMap(b, occupyMap);
            });
            if (bar.x !== lastPos.x || bar.y !== lastPos.y) {
                gameState.left = gameState.left - 1;
            }
            // win
            if (bar.special && gameState.win({
                    x: bar.x + bar.num - 1,
                    y: bar.y
                }) && gameState.left > -1) {
                bar.dom.css({
                    webkitTransform: 'translate(' + ((gameState.winPos.x + 1) * perWidth) + 'px,' + (gameState.winPos.y * perHeight) + 'px)'
                });
                gameState.canPlay = false;
                setTimeout(function () {
                    gameState.state += 1;
                }, 200);
            }
            // lost
            else if (gameState.left === 0) {
                over(gameState.state);
            }
        }).moveStart(function (bar) {
            lastPos = {
                x: bar.x,
                y: bar.y
            };
            if (bar.dir === 0 && bar.x > -1 && bar.x < gridOfX - bar.num) {
                for (var i = 0; i < bar.num; i++) {
                    occupyMap[bar.y][bar.x + i] = 0;
                }

            } else if (bar.dir === 1 && bar.y > -1 && bar.y < gridOfY - bar.num) {
                for (var i = 0; i < bar.num; i++) {
                    occupyMap[bar.y + i][bar.x] = 0;
                }
            }
        }));
    });

    function refreshOccupyMap() {
        var occupyMap = [];
        for (var y = 0; y < gridOfY; y++) {
            occupyMap[y] = [];
            for (var x = 0; x < gridOfX; x++) {
                occupyMap[y][x] = 0;
            }
        }
        return occupyMap;
    }

    function setOccupyMap(bar, occupyMap) {
        if (bar.dir === 0) {
            for (var i = 0; i < bar.num; i++) {
                occupyMap[bar.y][bar.x + i] = 1;
            }

        } else {
            for (var i = 0; i < bar.num; i++) {
                occupyMap[bar.y + i][bar.x] = 1;
            }
        }
    }

    function canMove(d) {
        var pos = d.position;
        if (pos.x < 0 || pos.y < 0) {
            return false;
        }
        return occupyMap[parseInt(pos.y * gridOfY / height, 10)] && 0 === occupyMap[parseInt(pos.y * gridOfY / height, 10)][parseInt(pos.x * gridOfX / width, 10)];
    }
}

function bar(perWidth, perHeight, container) {

    // 向右 , 向下
    function initBar(dir, num, x, y, special) {
        var dom = $('<div class="game-bar t' + num + (special ? ' sp' : '') + (dir == 0 ? ' v' : ' h') + '"></div>');
        dom.data({
            transform: {x: perWidth * x, y: perHeight * y},
            lastMove: {}
        }).css({
            webkitTransform: 'translate(' + perWidth * x + 'px,' + perHeight * y + 'px)'
        });
        for (var i = 0; i < num; i++) {
            var s;
            if (dir === 0) {
                s = '<div class="game-block" style="width: ' + perWidth + 'px;height: ' + perHeight + 'px;position: absolute;left: ' + perWidth * i + 'px;top: 0px;"></div>';
            } else {
                s = '<div class="game-block" style="width: ' + perWidth + 'px;height: ' + perHeight + 'px;position: absolute;left: 0px;top: ' + perHeight * i + 'px;"></div>';
            }
            dom.append($(s)).appendTo(container);
        }
        dom.on('touchstart', function (e) {
            e.touches = e.originalEvent.touches;
            if (e.touches.length > 1) return;
            $(this).data('lastMove', {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            });
            moveStCb && moveStCb[0](ret);
        });

        dom.on('touchmove', function (e) {
            e.touches = e.originalEvent.touches;
            if (e.touches.length > 1) return;
            var prev = $(this).data('lastMove');

            var nowPosition = {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            };
            var deltaPosition = {
                x: nowPosition.x - prev.x,
                y: nowPosition.y - prev.y
            };
            $(this).data('lastMove', nowPosition);
            var passData;
            if (dir === 0) {
                // 左右移动
                passData = {
                    position: {
                        x: $(this).data('transform').x + deltaPosition.x,
                        y: $(this).data('transform').y
                    },
                    dir: 'left'
                };
                if (deltaPosition.x > 0) {
                    // 向右移动, 右上角的点
                    passData.position.x = num * perWidth + $(this).data('transform').x + deltaPosition.x;
                    passData.dir = 'right';
                }
            } else {
                // 上下移动

                passData = {
                    position: {
                        x: $(this).data('transform').x,
                        y: $(this).data('transform').y + deltaPosition.y
                    },
                    dir: 'up'
                };
                if (deltaPosition.y > 0) {
                    // 向下移动, 左下角的点
                    passData.position.y = num * perHeight + $(this).data('transform').y + deltaPosition.y;
                    passData.dir = 'down';
                }
            }
            // 判断是否应当移动 ?
            if (shouldCb.length && shouldCb[0](passData)) {
                var transform = $(this).data('transform');
                if (dir === 0) {
                    transform.x += deltaPosition.x;
                } else {
                    transform.y += deltaPosition.y;
                }
                $(this).data({
                    transform: transform
                }).css({
                    webkitTransform: 'translate(' + transform.x + 'px,' + transform.y + 'px)'
                });

                afterCb.length && afterCb[0](ret);
            }
        });

        dom.on('touchend touchcancel', function () {
            var transform = endCb.length && endCb[0]($(this).data('transform'), ret);
            if (transform) {
                $(this).data({
                    transform: transform
                }).css({
                    webkitTransform: 'translate(' + transform.x + 'px,' + transform.y + 'px)',
                    webkitTransition: 'all .2s'
                });
                var me = $(this);

                setTimeout(function () {
                    me.css({webkitTransition: ''});
                }, 190);

                ret.x = parseInt(transform.x / perWidth, 10);
                ret.y = parseInt(transform.y / perHeight, 10);
                stopCb.length && stopCb[0](ret);
            }
        });
        dom.on('touchcancel', function () {
        });

        var shouldCb = [];

        function shouldMove(callback) {
            // callback 传入像素级别单位
            // 是否应当移动 ?
            shouldCb.push(callback);
            return ret;
        }

        var afterCb = [];

        function afterMove(callback) {
            afterCb.push(callback);
            return ret;
        }

        var endCb = [];

        function moveEnd(callback) {
            endCb.push(callback);
            return ret;
        }

        var moveStCb = [];

        function moveStart(callback) {
            moveStCb.push(callback);
            return ret;
        }

        var stopCb = [];

        function stop(callback) {
            stopCb.push(callback);
            return ret;
        }

        var ret = {
            dir: dir, num: num, x: x, y: y, dom: dom, special: special,
            shouldMove: shouldMove,
            afterMove: afterMove,
            moveEnd: moveEnd,
            moveStart: moveStart,
            stop: stop
        };
        return ret;
    }

    return {
        initBar: initBar
    };
}
function sign(v) {
    if (v == 0) return 0;
    return v / Math.abs(v);
}

function gamePage() {
    return `<div class="pg">
        <div class="logo"></div>
        <div class="game-bg">
        </div>
        <div class="info">
            <span>步数:</span>
            <span class="now-steps">00</span>
            <span style="margin-left: 100px">剩余:</span>
            <span class="left-steps">03</span>
        </div>
        <div class="footer">
            <div class="rules-btn"></div>
        </div>
    </div>`;
}

function winPage() {
    /**
     * tongji start
     */
    $.get('http://xinzhongzhu.com:13001/tongji', {
        type: 'all',
        access_token, openid
    });

    /**
     * tongji end
     */

    return `<div class="pg win fade-in">
            <div class="logo"></div>
            <div class="code-container" style="">
                <span style="margin-right: 80px">中奖编码:</span>
                <span class="code"></span>
            </div>
            <img class="erweima" src="./build/css/erweima.png" alt="">
            <div class="fx-btn"></div>
        </div>`;
}

function notLucky() {
    return `<div class="pg not-lucky fade-in">
            <div class="logo"></div>
            <div class="fx-btn"></div>
        </div>`;
}

$(document).on('touchend', '.start-game', function () {
    gameState.state = 1;
});

$(document).on('touchend', '.suc .nxt', once(function () {
    $.get(url, {
        access_token,
        openid
    }, null, 'json').done(function (d) {
        $('.suc').remove();
        $('.pg').addClass('fade-out');
        setTimeout(function () {
            $('.pg').remove();
            if (d['award'] === 1) {
                var w = $(winPage());
                w.find('.code').text(d['randomCode']);
                w.appendTo($('.container'));
                $('.w')[0].className = 'w bg-win';
            }
            else if (d['award'] === 0) {
                $(notLucky()).appendTo($('.container'));
                $('.w')[0].className = 'w bg-lost';
            }
        }, animDuration);
    });
}));

$(document).on('touchend', '.los .nxt', function () {
    $('.los').remove();
    gameState.state = $(this).data('restart');
});
$(document).on('touchend', ' .rn', function () {
    $('.rules').hide();
});
$(document).on('touchend', '.rules-btn', function () {
    $('.rules').show();
});
$(document).on('touchend', '.fx,.fx-btn', function () {
    $('.fx').toggle();
});
function once(callback) {
    var done = false;
    return function () {
        if (!done) {
            callback.apply(this, Array.prototype.slice.call(arguments, 0));
        }
        done = true;
    }
}

wx.ready(function () {

    wx.onMenuShareTimeline({
        title: '来瓶王朝过春节', // 分享标题
        link: 'http://wx.wine-dynasty.com/hrd/share.html', // 分享链接
        imgUrl: 'http://wx.wine-dynasty.com/hrd/fg.jpg', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareAppMessage({
        title: '来瓶王朝过春节', // 分享标题
        desc: '快来试一试，凭你的智商，能不能从重重包围中把王朝带回家吧', // 分享描述
        link: 'http://wx.wine-dynasty.com/hrd/share.html', // 分享链接
        imgUrl: 'http://wx.wine-dynasty.com/hrd/fg.jpg', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});
