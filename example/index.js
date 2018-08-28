const $ = require('jquery');
// 这里可以测试编译完的文件
// import '../dist/topology';
// import '../dist/topology.css';
// 这里可以测试开发时的文件；
require('../src');
require('bootstrap/dist/css/bootstrap.min.css');
require('font-awesome/css/font-awesome.min.css');

let data = [
    {
        label: '业务事项名称业务事项名称',
        children: [
            {
                label: '我要显示关闭按钮',
                children: [
                    {
                        label: '数据库名称',
                        children: [
                            {
                                label: '数据表名称1'
                            },
                            {
                                label: '我是成功类型',
                                type: 'success'
                            },
                            {
                                label: '数据表名称3',
                                children: [
                                    {
                                        label: '表字段已建'
                                    }
                                ]
                            },
                            {
                                label: '数据表名称3',
                                children: [
                                    {
                                        label: '表字段已建'
                                    }
                                ]
                            },
                            {
                                label: '数据表名称3'
                            },
                            {
                                label: '数据表名称3',
                                children: [
                                    {
                                        label: '表字段已建'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                label: '应用系统2',
                children: [
                    {
                        label: '我是失败类型',
                        type: 'error'
                    }
                ]
            },
            {
                label: '信息资源1',
                children: [
                    {
                        label: '信息项已建'
                    },
                    {
                        label: '应用系统1'
                    },
                    {
                        label: '共享资源1'
                    },
                    {
                        label: '共享资源2'
                    }
                ]
            },
            {
                label: '信息资源2'
            }
        ]
    }
];
let tmp = [...data];

// 基本示例
$('#topology').topology({
    data: data,
    setType: (item) => item.type,
    setClassName: item => 'customClassName',
    showCloseBtn: item => item.label === '我要显示关闭按钮',
    closeTitle: '删除',
    onClose: (item, data, e) => {
        console.info(item);
        // console.info(data);
        // console.info(e);
    },
    onClick: (item, data, e) => {
        console.info(item);
        // console.info(data);
        // console.info(e);
    },
    onAdd: (item, callback, e) => {
        // console.info('点击的数据：', item);
        callback([
            {
                label: '新增的节点1'
            },
            {
                label: '新增的节点2'
            }
        ])
    }
});

// 添加节点
$('#add').on('click', function(){
    tmp = [
        {
            ...tmp[0],
            children: [
                ...tmp[0].children,
                {
                    label: '新增的节点'
                }
            ]
        }
    ];
    $('#topology').topology({
        data: tmp
    });
});

// 自定义item
$('#topology-custom').topology({
    data: [
        {
            label: '业务事项名称',
            children: [
                {
                    label: '我要显示关闭按钮',
                    children: [
                        {
                            label: '数据库名称',
                            children: [
                                {
                                    label: '数据表名称1'
                                },
                                {
                                    label: '我是成功类型',
                                    type: 'success'
                                },
                                {
                                    label: '数据表名称3',
                                    children: [
                                        {
                                            label: '表字段已建'
                                        }
                                    ]
                                },
                                {
                                    label: '数据表名称3',
                                    children: [
                                        {
                                            label: '表字段已建'
                                        }
                                    ]
                                },
                                {
                                    label: '数据表名称3'
                                },
                                {
                                    label: '数据表名称3',
                                    children: [
                                        {
                                            label: '表字段已建'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    label: '应用系统2',
                    children: [
                        {
                            label: '我是失败类型',
                            type: 'error'
                        }
                    ]
                },
                {
                    label: '信息资源1',
                    children: [
                        {
                            label: '信息项已建'
                        },
                        {
                            label: '应用系统1'
                        },
                        {
                            label: '共享资源1'
                        },
                        {
                            label: '共享资源2'
                        }
                    ]
                },
                {
                    label: '信息资源2'
                }
            ]
        }
    ],
    renderLabel: item => `自定义：${item.label}`
});