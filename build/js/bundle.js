/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Object$defineProperties = __webpack_require__(1)['default'];

	__webpack_require__(4)(function () {
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
	var query = __webpack_require__(5);

	var _query = query(location.search.substring(1));

	var access_token = _query.access_token;
	var openid = _query.openid;

	var $ = __webpack_require__(6);
	var k = 3;
	var animDuration = 500;
	var tongjiFunc = (function () {
	    var ret = {};
	    var len = 3;
	    for (var i = 1; i <= len; i++) {
	        (function () {
	            var m = i;
	            ret[m] = once(function () {
	                $.get('http://xinzhongzhu.com:13001/tongji', {
	                    type: 'g' + m,
	                    access_token: access_token, openid: openid
	                });
	            });
	        })();
	    }
	    return ret;
	})();
	var gameState = _Object$defineProperties({
	    winPos: { x: 5, y: 2 },
	    win: function win(pos) {
	        return pos.x === this.winPos.x && pos.y === this.winPos.y;
	    },
	    canPlay: true
	}, {
	    state: {
	        set: function set(val) {
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
	                    toggleClass('sg' + val);
	                }, animDuration);
	                /**
	                 * tongji start
	                 */
	                if (val > 1) {
	                    tongjiFunc[val - 1] && tongjiFunc[val - 1]();
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
	        get: function get() {
	            return this._state || 0;
	        },
	        configurable: true,
	        enumerable: true
	    },
	    left: {
	        set: function set(val) {
	            var prev = this.left;
	            this.used += prev - val || 0;
	            var pg = $('.pg');
	            if (val > -1) {
	                $('.left-steps', pg).text(val >= 10 ? val : '0' + val);
	            }
	            this._left = val;
	        },
	        get: function get() {
	            return this._left;
	        },
	        configurable: true,
	        enumerable: true
	    },
	    used: {
	        set: function set(val) {
	            var pg = $('.pg');
	            $('.now-steps', pg).text(val >= 10 ? val : '0' + val);
	            this._used = val;
	        },
	        get: function get() {
	            return this._used || 0;
	        },
	        configurable: true,
	        enumerable: true
	    }
	});

	var q = {
	    '1': {
	        left: 9,
	        bars: [[0, 2, 1, 2, true], [1, 2, 0, 4], [0, 2, 2, 0], [1, 2, 2, 3], [1, 3, 3, 3], [1, 3, 5, 0], [0, 2, 4, 4], [0, 2, 4, 5]],
	        win: { x: 5, y: 2 }
	    },
	    '2': {
	        left: 8,
	        bars: [[0, 2, 1, 2, true], [1, 3, 0, 1], [0, 3, 2, 0], [1, 3, 5, 0], [1, 2, 3, 1], [1, 2, 4, 1], [1, 2, 1, 3], [1, 2, 2, 3], [0, 2, 2, 5], [0, 3, 3, 3]],
	        win: { x: 5, y: 2 }
	    },
	    '3': {
	        left: 7,
	        bars: [[0, 2, 1, 2, true], [0, 2, 2, 0], [0, 2, 3, 1], [1, 3, 5, 0], [0, 2, 0, 3], [1, 2, 1, 4], [1, 3, 2, 3], [1, 2, 3, 3], [0, 2, 4, 3], [0, 2, 4, 5]],
	        win: { x: 5, y: 2 }
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
	    var s = '<div class="los">\n        <div class="cv"></div>\n        <div class="opt">\n        <div class="nxt" data-restart="' + restartLevel + '"></div>\n        </div>\n        </div>';
	    $(s).appendTo(document.body);
	}
	function missionComplete() {
	    /**
	     * tongji start
	     */
	    $.get('http://xinzhongzhu.com:13001/tongji', {
	        type: 'g' + k,
	        access_token: access_token, openid: openid
	    });
	    /**
	     * tongji end
	     */

	    var s = '<div class="suc fade-in">\n                <div class="cv"></div>\n                <div class="opt">\n                    <div class="nxt"></div>\n                </div>\n            </div>';
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
	            if (!gameState.canPlay) return false;
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
	            if (!gameState.canPlay) return;
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
	                    webkitTransform: 'translate(' + (gameState.winPos.x + 1) * perWidth + 'px,' + gameState.winPos.y * perHeight + 'px)'
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
	            transform: { x: perWidth * x, y: perHeight * y },
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
	                    me.css({ webkitTransition: '' });
	                }, 190);

	                ret.x = parseInt(transform.x / perWidth, 10);
	                ret.y = parseInt(transform.y / perHeight, 10);
	                stopCb.length && stopCb[0](ret);
	            }
	        });
	        dom.on('touchcancel', function () {});

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
	    return '<div class="pg">\n        <div class="logo"></div>\n        <div class="game-bg">\n        </div>\n        <div class="info">\n            <span>步数:</span>\n            <span class="now-steps">00</span>\n            <span style="margin-left: 100px">剩余:</span>\n            <span class="left-steps">03</span>\n        </div>\n        <div class="footer">\n            <div class="rules-btn"></div>\n        </div>\n    </div>';
	}

	function winPage() {
	    return '<div class="pg win fade-in">\n            <div class="code-container" style="">\n                <span style="margin-right: 80px">中奖编码:</span>\n                <span class="code"></span>\n            </div>\n            <img class="erweima" src="./build/css/erweima.png" alt="">\n            <div class="fx-btn"></div>\n        </div>';
	}

	function notLucky() {
	    return '<div class="pg not-lucky fade-in">\n            <div class="logo"></div>\n            <div class="fx-btn"></div>\n        </div>';
	}

	$(document).on('touchend', '.start-game', function () {
	    gameState.state = 1;
	});

	$(document).on('touchend', '.suc .nxt', once(function () {
	    $.get(url, {
	        access_token: access_token,
	        openid: openid
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
	            } else if (d['award'] === 0) {
	                $(notLucky()).appendTo($('.container'));
	                $('.w')[0].className = 'w bg-lost';
	            }
	        }, animDuration);
	    });

	    /**
	     * tongji start
	     */
	    $.get('http://xinzhongzhu.com:13001/tongji', {
	        type: 'all',
	        access_token: access_token, openid: openid
	    });

	    /**
	     * tongji end
	     */
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
	    };
	}

	wx.ready(function () {

	    wx.onMenuShareTimeline({
	        title: '来瓶王朝过春节', // 分享标题
	        link: 'http://wx.wine-dynasty.com/hrd/share.html', // 分享链接
	        imgUrl: 'http://wx.wine-dynasty.com/hrd/fg.jpg', // 分享图标
	        success: function success() {
	            // 用户确认分享后执行的回调函数
	        },
	        cancel: function cancel() {
	            // 用户取消分享后执行的回调函数
	        }
	    });

	    wx.onMenuShareAppMessage({
	        title: '来瓶王朝过春节', // 分享标题
	        desc: '据说智商低的人过不了关?你敢挑战吗?', // 分享描述
	        link: 'http://wx.wine-dynasty.com/hrd/share.html', // 分享链接
	        imgUrl: 'http://wx.wine-dynasty.com/hrd/fg.jpg', // 分享图标
	        type: 'link', // 分享类型,music、video或link，不填默认为link
	        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	        success: function success() {
	            // 用户确认分享后执行的回调函数
	        },
	        cancel: function cancel() {
	            // 用户取消分享后执行的回调函数
	        }
	    });
	});

	function toggleClass(cn) {
	    var classNames = ['sg1', 'sg2', 'sg3'];
	    $('.pg').removeClass(classNames.join(' ')).addClass(cn);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(3);
	module.exports = function defineProperties(T, D){
	  return $.setDescs(T, D);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (s) {
	    if (!s) return {};
	    var o = {};
	    s.split('&').forEach(function (el) {
	        o[el.split('=')[0]] = el.split('=')[1];
	    });
	    return o;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);