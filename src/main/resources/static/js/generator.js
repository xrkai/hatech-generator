$(function () {
    $("#jqGrid").jqGrid({
        url: 'sys/generator/list',
        datatype: "json",
        colModel: [
            {label: '表名', name: 'tableName', width: 100, key: true},
            {label: 'Engine', name: 'engine', width: 70},
            {label: '表备注', name: 'tableComment', width: 100},
            {label: '创建时间', name: 'createTime', width: 100}
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50, 100, 200],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        multiboxonly: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            //隐藏全选按钮
            $("#cb_jqGrid").hide();
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            tableName: null,
            packageName: null
        }
    },
    methods: {
        query: function () {
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {'tableName': vm.q.tableName},
                page: 1
            }).trigger("reloadGrid");
        },
        generator: function () {
            var packageName = vm.q.packageName;
            var moduleName = vm.q.moduleName;
            var moduleChineseName = vm.q.moduleChineseName;
            var author = vm.q.author;
            var email = vm.q.email;
            var tablePrefix = vm.q.tablePrefix;
            var tables = getSelectedRows();
            // 勾选的内容
            var entity = vm.q.entity;
            var mapper = vm.q.mapper;
            var service = vm.q.service;
            var controller = vm.q.controller;
            // 勾选的tables不能为空
            if (tables == null) {
                return;
            }
            // 下列为必填项
            if (!(packageName && moduleName && moduleChineseName && author && email && tablePrefix)) {
                alert("请填写完整信息");
                return
            }
            // 至少勾选一种模块
            if (!(entity || mapper || service || controller)) {
                alert("至少勾选一种需要生成的模块");
                return
            }
            var data = {
                packageName: packageName,
                moduleName: moduleName,
                moduleChineseName: moduleChineseName,
                author: author,
                email: email,
                tablePrefix: tablePrefix,
                tables: tables,
                entity: entity ? entity : false,
                mapper: mapper ? mapper : false,
                service: service ? service : false,
                controller: controller ? controller : false
            }
            axios({
                url: 'sys/generator/code',
                method: 'post',
                data: data,
                responseType: 'blob'
            }).then(function (res) {
                var blob = new Blob([res.data], {
                    type: res.headers["content-type"]
                });
                var filename = vm.q.moduleName + "-code.zip";
                var objectUrl = URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});

