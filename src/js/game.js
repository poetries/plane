window.onload = function() {
    Game.init();
};
var Game = {
    'box': document.getElementById('box'),

    'fenshu': 0,

    //图片预加载
    'img': function() {
        this.oPlane = new Image();
        this.oPlane.src = 'images/plane.png';
        this.oPlane.className = 'plane';
    },

    //场景初始化
    'init': function() {
				var that = this;
        setTimeout(function() {
            that.box.style.background = 'url(images/1.jpg)';
            var oTitle = that.ctE('h3');
            oTitle.innerHTML = '飞机战斗机';
            var oDiv = that.ctE('div');
            oDiv.innerHTML = '<p class="ac">简单</p><p class="ac">一般</p><p class="ac">困难</p>';
            that.box.appendChild(oTitle);
            that.box.appendChild(oDiv);
            that.img();
            var oP = oDiv.children;
            for (var i = 0; i < oP.length; i++) {
                oP[i].index = i;
                oP[i].onmouseover = function() {
                    this.className = 'on';
                };
                oP[i].onmouseout = function() {
                    this.className = 'ac';
                };
                oP[i].onclick = that.start;
            };
        }, 300);
    },

    //开始游戏
    'start': function(ev) {
				var that = this;
        ev = ev || event;
        var s = 0; //s是背景移动速度
        var t = 0; //t是子弹生成速度
        var c = 0; //c是子弹运行速度
        var d = 0; //敌机生成速度

        function bg(i) {
            Game.box.style.background = 'url(images/' + i + '.jpg)';
            setInterval(function() {
                s += 1;
                Game.box.style.backgroundPosition = '0px' + ' ' + s + 'px';
            }, 30);
        };
        if (this.index == 0) {
            bg(3);
            t = 100;
            c = 6;
            d = 500;
        } else if (this.index == 1) {
            bg(4);
            t = 150;
            c = 15;
            d = 400;
        } else if (this.index == 2) {
            bg(5);
            t = 200;
            c = 20;
            d = 300;
        };
        Game.box.innerHTML = '';
        Game.plane(ev, t, c);
        Game.start.timer = setInterval(function() {
            Game.enemy();
        }, d);
        Game.score();
    },

    //我方站机
    'plane': function(ev, t, c) {
				var that = this;
        this.box.appendChild(this.oPlane);
        var bT = this.box.offsetTop + this.oPlane.clientHeight / 2 + (this.box.offsetHeight - Game.getstyle(Game.box, 'height')) / 2;
        var bL = this.box.offsetLeft + this.oPlane.clientWidth / 2 + (this.box.offsetWidth - Game.getstyle(Game.box, 'width')) / 2;
        var top = ev.pageY - bT;
        var left = ev.pageX - bL;
        this.oPlane.style.cssText = 'top:' + top + 'px;left:' + left + 'px;';

        var topMax = this.getstyle(this.box, 'height') - this.oPlane.clientHeight / 2;
        var leftMin = -this.oPlane.clientWidth / 2;
        var leftMax = this.getstyle(this.box, 'width') - this.oPlane.clientWidth / 2;
        document.onmousemove = function(ev) {
            ev = ev || event;
            top = ev.pageY - bT;
            left = ev.pageX - bL;
            if (top < 0) {
                top = 0;
            } else if (top > topMax) {
                top = topMax;
            };
            if (left < leftMin) {
                left = leftMin;
            } else if (left > leftMax) {
                left = leftMax;
            };
            that.oPlane.style.cssText = 'top:' + top + 'px;left:' + left + 'px;';
        };

        /*子弹生成速度 */
        this.bTimer = setInterval(function() {
            that.bullet(top, left, c);
        }, t);

    },

    //子弹
    'bullet': function(pTop, pLeft, c) {
        var oB = this.ctE('img');
        oB.src = 'images/bullet.png';
        oB.className = 'bullet';
        this.box.appendChild(oB);
        var top = (pTop - this.getstyle(oB, 'height') + 5);
        var left = (pLeft + this.oPlane.clientWidth / 2 - this.getstyle(oB, 'width') / 2);
        oB.style.cssText = 'top:' + top + 'px;left:' + left + 'px;';
        oB.timer = setInterval(function() {
            /*子弹运行速度*/
            if (!oB.parentNode) {
                clearInterval(oB.timer);
                return;
            }
            top -= c;
            oB.style.top = top + 'px';
            if (top < -22) {
                clearInterval(oB.timer);
                oB.parentNode.removeChild(oB);
            };

        }, 30);
    },

    //敌方战机
    'enemy': function() {
				var that = this;
        var oEnemy = this.ctE('img');
        oEnemy.src = 'images/enemy.png';
        oEnemy.className = 'enemy';
        this.box.appendChild(oEnemy);
        var left = Math.random() * (this.box.clientWidth - this.getstyle(oEnemy, 'width') / 2);
        var top = this.getstyle(oEnemy, 'top');
        oEnemy.style.left = left + 'px';
        oEnemy.timer = setInterval(function() {
            /*敌军下落速度*/
            top += 3;
            oEnemy.style.top = top + 'px';
            if (top > that.box.clientHeight) {
                clearInterval(oEnemy.tiamr);
                if (!oEnemy.parentNode) {
                    return;
                } else {
                    oEnemy.parentNode.removeChild(oEnemy);
                };
            } else {
                var allB = that.getclass(that.box, 'img', 'bullet');
                for (var i = 0; i < allB.length; i++) {
                    if (that.pz(oEnemy, allB[i])) {
                        allB[i].parentNode.removeChild(allB[i]);
                        oEnemy.src = 'images/boom.png';
                        clearInterval(oEnemy.timer);
                        setTimeout(function() {
                            if (!oEnemy.parentNode) {
                                return;
                            } else {
                                oEnemy.parentNode.removeChild(oEnemy);
                            };
                        }, 500);
                        that.num += 10;
                        that.oScore.innerHTML = that.num + '分';
                        that.fenshu = that.oScore.innerHTML;
                    };
                };
                if (that.pz(oEnemy, that.oPlane)) {
                    oEnemy.src = 'images/boom.png';
                    clearInterval(oEnemy.timer);
                    setTimeout(function() {
                        if (!oEnemy.parentNode) {
                            return;
                        } else {
                            oEnemy.parentNode.removeChild(oEnemy);
                        };
                    }, 500);
                    that.oPlane.src = 'images/boom2.png';
                    clearInterval(that.bTimer);
                    clearInterval(that.start.timer);
                    document.onmousemove = null;
                    setTimeout(function() {
                        that.over();
                    }, 3000);
                };
            };
        }, 30);
    },

    //游戏结束
    'over': function() {
        this.box.innerHTML = '';
				var score = this.num;
				console.log(score);
				var rate = this.ctE("p");
				var grate = '';
				if (score < 100)
				{
					 grate = "你太年轻了";
				}else if(score < 1000){
					 grate = "渐入佳境";
				}else if(score < 3000){
					 grate = "江湖老手";
				}else if(score < 6000){
				   grate = "玩的很6";
				}
				rate.innerHTML = '获得称号:'+grate;
        var oOvar = this.ctE('div');
        var oP1 = this.ctE('p');
        var reStart = this.ctE('p');
        var oSpan = this.ctE('p');
        oP1.innerHTML = 'Game Over!';
        oSpan.innerHTML = '最后得分:' + this.fenshu;
        reStart.innerHTML = '重新开始';
				rate.className = "rate";
        oP1.className = 'op1';
        oOvar.className = 'over';
        oSpan.className = 'oSpan';
        reStart.className = 'reStart';
        reStart.id = 'reStart';
        this.box.appendChild(oOvar);
        oOvar.appendChild(oP1);
        oOvar.appendChild(oSpan);
        oOvar.appendChild(reStart);
				this.insertAfter(rate,oSpan);
        document.getElementById('reStart').onclick = function() {
            oOvar.parentNode.removeChild(oOvar);
            window.open('index.html', '_self');
        };
    },

    //游戏分数
    'score': function() {
        this.oScore = this.ctE('span');
        this.oScore.className = 'score';
        this.num = 0;
        this.oScore.innerHTML = this.num + '分';
        this.box.appendChild(this.oScore);
    },

    //碰撞检测
    'pz': function(obj1, obj2) {
        var T1 = this.getstyle(obj1, 'top');
        var B1 = T1 + this.getstyle(obj1, 'height');
        var L1 = this.getstyle(obj1, 'left');
        var R1 = L1 + this.getstyle(obj1, 'width');

        var T2 = this.getstyle(obj2, 'top');
        var B2 = T2 + this.getstyle(obj2, 'height');
        var L2 = this.getstyle(obj2, 'left');
        var R2 = L2 + this.getstyle(obj2, 'width');

        if (T1 > B2 || L1 > R2 || B1 < T2 || R1 < L2) {
            return false;
        } else {
            return true;
        };
    },

    'getclass': function(Element, TagName, className) {
        var aElements = Element.getElementsByTagName(TagName);
        var arr = [];
        var aClass = '';

        for (var i = 0; i < aElements.length; i++) {
            aClass = aElements[i].className.split(' ');
            for (var j = 0; j < aClass.length; j++) {
                if (aClass[j] == className) {
                    arr.push(aElements[i]);
                    break;
                };
            };
        };
        return arr;
    },

		//DOM没有提供insertAfter()方法
		insertAfter:	function (newElement, targetElement){
				var parent = targetElement.parentNode;
					if (parent.lastChild == targetElement) {
							// 如果最后的节点是目标元素，则直接添加。因为默认是最后
							parent.appendChild(newElement);
					}
					else {
						parent.insertBefore(newElement, targetElement.nextSibling);
						//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
					}
			},
    'ctE': function(tagName) {
        return document.createElement(tagName);
    },

    'getstyle': function(obj, attr) {
        return obj.currentstyle ? parseInt(obj.currentstyle[attr]) : parseInt(getComputedStyle(obj)[attr]);
    }
};
