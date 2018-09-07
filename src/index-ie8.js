var jQuery = require('jquery');
var uuid4 = require('uuid/v4');
require('./index.scss');

(function ($) {
    function Topology(elem, options){
        this.elem = elem.append('<div class="ui-topology"></div>');
        this.options = $.extend({
            data: [],
            cursor: 'default',
            showCloseBtn: false,
            closeTitle: '关闭',
            collapsedTitle: '收起',
            expandedTitle: function(item){
                return item.children && item.children.length > 0 ? '展开' : '添加节点'
            },
            setType: function(){},
            onClick: function(){},
            setClassName: function(){},
            onClose: function(){},
        }, options);

        this.addUnitId(this.options.data);
        // 动态保存所有data
        this.tmpData = JSON.parse(JSON.stringify(this.options.data));
        this.init();
    }

    Topology.prototype.init = function(){
        var data = this.options.data;

        this.elem.html(
            $('<div class="ui-topology"></div>').html(this.renderDom(data, 1, false))
        );

        this.addEvent();

        this.adjustItem();
    };
    Topology.prototype.addUnitId = function(data){
        for(var i = 0; i < data.length; i++){
            data[i].__id__ = uuid4();
            if(data[i].children){
                this.addUnitId(data[i].children);
            }
        }
    };
    Topology.prototype.renderDom = function(data, level, hasParent){
        var renderLabel = this.options.renderLabel;
        var setClassName = this.options.setClassName;
        var closeTitle = this.options.closeTitle;
        var cursor = this.options.cursor;
        var showCloseBtn = this.options.showCloseBtn;
        var setType = this.options.setType;
        var collapsedTitle = this.options.collapsedTitle;
        var expandedTitle = this.options.expandedTitle;
        var closeBtn = function(item) {
            return '<a title="' + closeTitle + '" data-id="' + item.__id__ + '" class="closeBtn" href="javascript:;">' +
                '<i class="fa fa-times-circle" />' +
                '</a>';
        };
        var topology = '';
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var classnames = 'label ' +
                (item.children && item.children.length > 1 ? 'label-border-right ' : '') +
                (hasParent ? 'label-border-left ' : '') +
                (cursor === 'pointer' ? 'label-cursor ' : '') + (setType(item) ? 'label-type-' + setType(item) + ' ' : '') + (setClassName(item) || '');
            var label = renderLabel ? renderLabel(item) : item.label;
            topology += '<div class="item level-' + level + '">' +
                    '<div data-level="' + level + '" data-id="' + item.__id__ + '" class="' + classnames + '">' +
                        '<span title="' + label + '">' + label + '</span>' +
                        (typeof showCloseBtn === 'function' ? showCloseBtn(item, data) ? closeBtn(item) : '' : showCloseBtn ? closeBtn(item) : '') +
                        (!item.children || item.children.length <= 0 ? '<i title="' + (typeof expandedTitle === "function" ? expandedTitle(item) : expandedTitle) + '" class="toggleBtn fa fa-plus-circle"></i>' : '') +
                        (item.children && item.children.length > 0 ? '<i title="' + collapsedTitle + '" class="toggleBtn toggleBtn-collapse fa fa-minus-circle"></i>' : '') +
                    '</div>' +
                    (item.children && item.children.length > 0 ? '<div class="sub">' + (item.children ? this.renderDom(item.children, level + 1, true) : '') + '</div>' : '') +
                '</div>';
        }

        return topology;
    };
    Topology.prototype.addEvent = function(){
        var onClose = this.options.onClose;
        var onClick = this.options.onClick;
        var data = this.options.data;
        var onAdd = this.options.onAdd;
        var self = this;

        // 关闭按钮
        $(this.elem).on('click', '.closeBtn', function(e){
            e.stopPropagation();
            if(onClose){
                var id = $(this).data('id');

                onClose(self.find(self.tmpData, id), self.tmpData, e);
            }
        });

        // 点击事件
        $(this.elem).on('click', '.label', function(e){
            e.stopPropagation();
            var id = $(this).data('id');

            onClick(self.find(self.tmpData, id), self.tmpData, e);
        });

        // 收起或展开
        $(this.elem).on('click', '.toggleBtn', function(e){
            e.stopPropagation();
            var expandedTitle = self.options.expandedTitle;
            var collapsedTitle = self.options.collapsedTitle;
            var $sub = $(this).parent().siblings('.sub');
            var curElem = this;
            var id = $(this).parent().data('id');

            if($sub.length > 0){
                if($sub.is(":visible")){
                    $(curElem).parent().removeClass('label-border-right');
                    $sub.hide();
                }else{
                    $(curElem).parent().addClass('label-border-right');
                    $sub.show();
                }
                self.adjustItem();
            }else{
                // 触发添加事件
                var level = parseInt($(this).parent().data('level'));
                onAdd && onAdd(self.find(self.tmpData, id), function(newNodes){
                    self.addUnitId(newNodes);
                    // 添加到tmpData
                    self.find(self.tmpData, id, function(item){
                        return {
                            ...item,
                            children: newNodes,
                        }
                    });
                    $(curElem).parent().addClass('label-border-right');
                    var newHtml = self.renderDom(newNodes, level + 1, true);
                    $("<div class='sub'>" + newHtml + "</div>").insertAfter($(curElem).parent());
                    self.adjustItem();
                }, e);
            }

            if($(this).hasClass('fa-plus-circle')){
                $(this).attr('title', collapsedTitle);
            }else{
                $(this).attr('title', typeof expandedTitle === 'function' ? expandedTitle(self.find(self.tmpData, id)) : expandedTitle);
            }
            $(this).toggleClass('fa-plus-circle').toggleClass('fa-minus-circle');
        });
    };
    Topology.prototype.adjustItem = function(){
        var items = $(this.elem).find('.label');

        items.each(function(){
            var next = this.nextElementSibling;
            if(next){
                var first = next.firstElementChild;
                var last = next.lastElementChild;

                if(first && last){
                    next.style.marginBottom = (first.offsetHeight - last.offsetHeight) / 2 + 'px';
                }
            }
        });
    };
    Topology.prototype.find = function(arr, id, callback){
        for(var i = 0; i < arr.length; i++){
            if(arr[i].__id__ === id){
                if(callback){
                    arr[i] = callback(arr[i]);
                }
                return arr[i];
            }else if(arr[i].children){
                var a = this.find(arr[i].children, id, callback);
                if(a) return a;
            }
        }
    };

    $.fn.topology = function (options) {
        return new Topology(this, options);
    };
})(jQuery);