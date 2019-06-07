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
            // var tableNames = getSelectedRows();
            // var packageName = vm.q.packageName;
            // if (tableNames == null) {
            //     return;
            // }
            // if (packageName == null) {
            //     return;
            // }
            // location.href = "sys/generator/code?tables=" + tableNames.join() + "&packageName=" + packageName;
            //`this` 在方法里指向当前 Vue 实例
            var data = {
                packageName: vm.q.packageName,
                moduleName: vm.q.moduleName,
                moduleChineseName: vm.q.moduleChineseName,
                author: vm.q.author,
                email: vm.q.email,
                tablePrefix: vm.q.tablePrefix,
                tables: getSelectedRows()
            }
            axios({
                url: 'sys/generator/code',
                method: 'post',
                data: data,
                responseType: 'blob'
            })
            .then(function (res) {
                var blob = new Blob([res.data], {
                    type: res.headers["content-type"]
                });
                var filename = vm.q.moduleName+"-code";
                var objectUrl = URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
});

