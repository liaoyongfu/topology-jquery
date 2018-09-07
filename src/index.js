const jQuery = require('jquery');
const uuid4 = require('uuid/v4');
require('./index.scss');

(function ($) {
    class Topology {
        constructor(elem, options) {
            this.elem = elem.append('<div class="ui-topology"></div>');
            this.options = $.extend({
                data: [],
                cursor: 'default',
                showCloseBtn: false,
                closeTitle: '关闭',
                collapsedTitle: '收起',
                expandedTitle: item => {
                    return item.children && item.children.length > 0 ? '展开' : '添加节点'
                },
                setType: () => {},
                onClick: () => {},
                setClassName: () => {},
                onClose: () => {},
            }, options);

            this.addUnitId(this.options.data);
            // 动态保存所有data
            this.tmpData = [...this.options.data];
            this.init();
        }

        addUnitId(data){
            for(let i = 0; i < data.length; i++){
                data[i].__id__ = uuid4();
                if(data[i].children){
                    this.addUnitId(data[i].children);
                }
            }
        }

        init() {
            const { data } = this.options;

            this.elem.html(
                $('<div class="ui-topology"></div>').html(this.renderDom(data))
            );

            this.addEvent();

            this.adjustItem();
        }

        renderDom(data, level = 1, hasParent = false) {
            const { renderLabel, setClassName, closeTitle, cursor, showCloseBtn, setType, collapsedTitle, expandedTitle } = this.options;
            const closeBtn = (item) => (`
                <a title="${closeTitle}" data-id="${item.__id__}" class="closeBtn" href="javascript:;">
                    <i class="fa fa-times-circle" />
                </a>
            `);
            let topology = '';
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                const label = renderLabel ? renderLabel(item) : item.label;
                topology += (`
                    <div class="item ${`level-${level}`}">
                        <div data-level="${level}" data-id="${item.__id__}" class="label 
                            ${item.children && item.children.length > 1 ? 'label-border-right ' : ''} 
                            ${hasParent ? 'label-border-left ' : ''} 
                            ${cursor === 'pointer' ? 'label-cursor ' : ''} ${setType(item) ? `label-type-${setType(item)} ` : ' '} ${setClassName(item) || ''}">
                            <span title="${label}">${label}</span>
                            ${typeof showCloseBtn === 'function' ? showCloseBtn(item, data) ? closeBtn(item) : '' : showCloseBtn ? closeBtn(item) : ''}
                            ${!item.children || item.children.length <= 0 ? `<i title="${typeof expandedTitle === 'function' ? expandedTitle(item) : expandedTitle}" class="toggleBtn fa fa-plus-circle"></i>` : ''}
                            ${item.children && item.children.length > 0 ? `<i title="${collapsedTitle}" class="toggleBtn toggleBtn-collapse fa fa-minus-circle"></i>` : ''}
                        </div>
                        ${item.children && item.children.length > 0 ? `
                            <div class="sub">
                                ${item.children ? this.renderDom(item.children, level + 1, true) : ''}
                            </div>
                        ` : ''}
                        
                    </div>
                `)
            }

            return topology;
        }

        find(arr, id, callback){
            for(let i = 0; i < arr.length; i++){
                if(arr[i].__id__ === id){
                    if(callback){
                        arr[i] = callback(arr[i]);
                    }
                    return arr[i];
                }else if(arr[i].children){
                    let a = this.find(arr[i].children, id, callback);
                    if(a) return a;
                }
            }
        }

        addEvent(){
            const { onClose, onClick, data, onAdd } = this.options;
            const self = this;

            // 关闭按钮
            $(this.elem).on('click', '.closeBtn', function(e){
                e.stopPropagation();
                if(onClose){
                    const id = $(this).data('id');

                    onClose(self.find(self.tmpData, id), self.tmpData, e);
                }
            });

            // 点击事件
            $(this.elem).on('click', '.label', function(e){
                e.stopPropagation();
                const id = $(this).data('id');

                onClick(self.find(self.tmpData, id), self.tmpData, e);
            });

            // 收起或展开
            $(this.elem).on('click', '.toggleBtn', function(e){
                e.stopPropagation();
                const { expandedTitle, collapsedTitle } = self.options;
                const $sub = $(this).parent().siblings('.sub');
                const curElem = this;
                const id = $(this).parent().data('id');

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
                    const level = parseInt($(this).parent().data('level'));
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
                        const newHtml = self.renderDom(newNodes, level + 1, true);
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
        }

        adjustItem(){
            let items = $(this.elem).find('.label');

            items.each(function(){
                const next = this.nextElementSibling;
                if(next){
                    const first = next.firstElementChild;
                    const last = next.lastElementChild;

                    if(first && last){
                        next.style.marginBottom = (first.offsetHeight - last.offsetHeight) / 2 + 'px';
                    }
                }
            });
        }
    }

    $.fn.topology = function (options) {
        return new Topology(this, options);
    };
})(jQuery);