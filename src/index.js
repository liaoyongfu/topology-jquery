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
                setType: () => {},
                setClassName: () => {},
                onClose: () => {}
            }, options);

            this.addUnitId(this.options.data);
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
            const { renderLabel, setClassName, closeTitle, cursor, showCloseBtn, setType } = this.options;
            const closeBtn = (item) => (`
                <a title="${closeTitle}" data-id="${item.__id__}" class="closeBtn" href="javascript:;">
                    <i class="fa fa-times-circle" />
                </a>
            `);
            let topology = '';
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                topology += (`
                    <div class="item ${`level-${level}`}">
                        <div class="label 
                            ${item.children && item.children.length > 1 ? 'label-border-right' : ''} 
                            ${hasParent ? 'label-border-left' : ''} 
                            ${cursor === 'pointer' ? 'label-cursor' : ''} ${setType(item) ? `label-type-${setType(item)}` : ''} ${setClassName(item) || ''}">
                            ${renderLabel ? renderLabel(item) : item.label}
                            ${typeof showCloseBtn === 'function' ? showCloseBtn(item, data) ? closeBtn(item) : '' : showCloseBtn ? closeBtn(item) : ''}
                        </div>
                        <div class="sub">
                            ${item.children ? this.renderDom(item.children, level + 1, true) : ''}
                        </div>
                    </div>
                `)
            }

            return topology;
        }

        addEvent(){
            const { onClose, data } = this.options;
            $(this.elem).on('click', '.closeBtn', function(){
                if(onClose){
                    const id = $(this).data('id');

                    const find = (arr) => {
                        for(let i = 0; i < arr.length; i++){
                            if(arr[i].__id__ === id){
                                return arr[i];
                            }else if(arr[i].children){
                                return find(arr[i].children);
                            }
                        }
                    };

                    onClose(find(data), data, this.parentNode);
                }
            });
        }

        adjustItem(){
            let items = $(this.elem).find('.label');

            items.each(function(){
                const next = this.nextElementSibling;
                const first = next.firstElementChild;
                const last = next.lastElementChild;

                if(first && last){
                    this.style.top = (first.offsetHeight - last.offsetHeight) / 4 + 'px';
                }
            });
        }
    }

    $.fn.topology = function (options) {
        return new Topology(this, options);
    };
})(jQuery);