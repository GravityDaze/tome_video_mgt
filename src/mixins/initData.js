/*
    此混入为Tables的分页功能提供了一个统一函数
*/
import _ from "lodash";

const initData = {
    data() {
        return {
            tableData: [],
            searchForm: {},
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
export default initData;