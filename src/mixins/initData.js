import _ from "lodash";
import { restore } from '@/utils/restoreModel'
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