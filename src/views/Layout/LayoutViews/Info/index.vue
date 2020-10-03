<template>
  <div id="info">
    <!-- 顶部的信息框 -->
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">分类：</label>
          <div class="warp-content">
            <el-select
              v-model="category_value"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for="">日期：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-date-picker
              style="width: 100%;"
              v-model="date_value"
              type="datetimerange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="label-wrap key-word">
          <label for="">关键字：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-select
              v-model="key_value"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in keyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="search_value"
          placeholder="请输入内容"
          style="width: 100%;"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width: 100%;" @click="getList"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="3">&nbsp;</el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%;"
          @click="dialog_info = true"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <div class="black-space-30"></div>
    <el-table
      :data="table_data.item"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="750"></el-table-column>
      <el-table-column
        prop="categoryId"
        label="类型"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="237"
      ></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)"
            >删除</el-button
          >
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--底部分页-->
    <div class="black-space-30"></div>
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <DialogInfo
      :flag.sync="dialog_info"
      :category="options.category"
      @getListEmit="getList"
    />
    <DialogEditInfo
      :flag.sync="dialog_info_edit"
      :id="infoId"
      :category="options.category"
      @getListEmit="getList"
    />
  </div>
</template>
<script>
import {
  reactive,
  ref,
  watch,
  onMounted,
  onActivated,
  onBeforeMount
} from "@vue/composition-api";
import { global } from "@/utils/global_V3.0";
import DialogInfo from "@c/dialog/info.vue";
import DialogEditInfo from "@c/dialog/edit.vue";
import { GetList, GetCategory, DeleteInfo } from "@/network/api/news.js";
export default {
  name: "info",
  components: { DialogInfo, DialogEditInfo },
  setup(props, { root }) {
    const { confirm } = global();
    /**data */

    const category_value = ref("");
    const key_value = ref("id");
    const date_value = reactive([]);
    const search_value = ref("");
    const total = ref(1);
    const deleteInfoId = ref("");
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    const options = reactive({
      category: []
    });
    const keyOptions = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);

    const table_data = reactive({
      item: []
    });

    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    const infoId = ref("1");

    /**
     * 搜索条件处理
     */
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类ID
      if (category_value.value) {
        requestData.categoryId = category_value.value;
      }
      // 日期
      if (date_value.length > 0) {
        requestData.startTiem = date_value[0];
        requestData.endTime = date_value[1];
      }
      // 关键字
      if (search_value.value) {
        requestData[key_value.value] = search_value.value;
      }
      return requestData;
    };

    /**methods */
    const getList = () => {
      const requestData = formatData();
      console.log(requestData);
      GetList(requestData).then(response => {
        console.log(response);
        let data = response.data.data;
        table_data.item = data.data;
        console.log(table_data.item);
        total.value = table_data.item.length;
      });
    };
    const getCategory = () => {
      const requestData = {};
      GetCategory(requestData).then(response => {
        console.log(response);
        options.category = response.data.data.data;
      });
    };
    const handleSelectionChange = val => {
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };
    const handleSizeChange = () => {
      page.pageSize = val;
    };
    const handleCurrentChange = () => {
      page.pageNumber = val;
      getList();
    };
    const editInfo = id => {
      infoId.value = id;
      dialog_info_edit.value = true;
    };
    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "确认删除当前信息，确认后将无法恢复！！",
        tip: "警告",
        fn: confirmDelete
      });
    };

    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        root.$message({
          message: "请选择要删除的数据！！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        tip: "警告",
        fn: confirmDelete
      });
    };

    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value }).then(response => {
        deleteInfoId.value = "";
        getList();
      });
    };

    onBeforeMount(() => {
      getList();
      getCategory();
    });
    return {
      options,
      keyOptions,
      category_value,
      date_value,
      key_value,
      search_value,
      table_data,
      getList,
      total,
      handleSelectionChange,
      deleteAll,
      handleSizeChange,
      handleCurrentChange,
      dialog_info,
      dialog_info_edit,
      infoId,
      editInfo,
      deleteItem,
      page,
      deleteInfoId
    };
  }
};
</script>
<style lang="scss" scoped>
#info {
  padding: 10px 10px 0;
}
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-word {
    @include labelDom(right, 99, 40);
  }
}

.el-table {
  /deep/ .el-table__row td {
    text-align: center;
  }
  /deep/ .el-table__header-wrapper th {
    text-align: center;
  }
}
</style>
