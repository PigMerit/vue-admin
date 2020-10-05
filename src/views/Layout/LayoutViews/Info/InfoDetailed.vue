<template>
  <div id="info">
   <el-form ref="form" :model="form" label-width="120px">
     <el-form-item label="信息分类：">
      <el-select v-model="form.categoryId">
        <el-option v-for="item in data.category" :key="item.id" :value="item.id" :label="item.category_name"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="新闻标题：">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图：">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>
    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled></el-date-picker>
    </el-form-item>
    <el-form-item label="详细内容：">
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="submit" :loading="data.submitLoading">保存</el-button>
    </el-form-item>
   </el-form>
  </div>
</template>
<script>
import {
  reactive,
  ref,
  watch,
  onMounted,
  onBeforeMount
} from "@vue/composition-api";
import { GetList, GetCategory,EdidInfo } from "@/network/api/news.js";
import { timestampToTime } from "@/utils/common";
import UploadImg from "@c/UploadImg/index.vue"
import { quillEditor } from "vue-quill-editor"; 
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  name: 'info',
  components: { quillEditor,UploadImg},
  setup(props,{root}){
    const form = reactive({
      categoryId:'',
      title:'',
      createDate:''
    })

    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml",
    });

    const data = reactive({
      category:[],
      submitLoading:false,
      editorOption:{},
      imgUrl:'',
      id:root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
    })
    const getCategory = () => {
      const requestData = {};
      GetCategory(requestData).then(response => {
        data.category = response.data.data.data;
      });
    };

    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      }
      GetList(requestData).then(response => {
        let responseData = response.data.data.data[0]
        form.categoryId = responseData.categoryId;
        form.title = responseData.title;
        form.createDate = timestampToTime(responseData.createDate);
        form.content = responseData.content;
        form.imgUrl = responseData.imgUrl;
      })
    }

    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl
      }
      data.submitLoading = true
      EdidInfo(requestData).then(response => {
        let responseData = response.data
        root.$message({
          message: responseData.message,
          type: 'success'
        })
        data.submitLoading = false
      }).catch(error => {
          data.submitLoading = false
      })
    }

    onBeforeMount(()=>{
      getCategory()
      getInfo()
    })

    return {
      data,
      uploadImgConfig,
      form,
      submit
    }
  }
}
</script>
<style lang="scss" scoped>
#info {
  width: 80%;
  margin: auto;
  padding-top: 50px;
}
</style>
