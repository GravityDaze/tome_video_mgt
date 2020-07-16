/*
    混入Tables组件分页相关功能
*/
import _ from "lodash";

const initPagination = {
    data() {
        return {
            tableData: [], // 表格数据
            searchData: {}, // 搜索框表单数据
            pagination: {
                num: 1,
                size: 10,
                total: 0
            },

        }
    },

    methods: {
        // Tables组件的分页功能
        sizeChange(val) {
            this.pagination.size = val;
            this.getTableData();
        },
        numChange(val) {
            this.pagination.num = val;
            this.getTableData();
        }
    }
}
export default initPagination;