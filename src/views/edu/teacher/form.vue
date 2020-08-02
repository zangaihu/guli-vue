<template>
  <div class="app-container">
    讲师添加
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="100"
          :height="100"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";
import ImageCropper from '@/components/ImageCropper';
import PanThumb from '@/components/PanThumb';
const defaultForm = {
  name: "",
  sort: 0,
  level: "",
  career: "",
  intro: "",
  avatar: ""
};
export default {
  components:{ImageCropper,PanThumb },
  data() {
    return {
      teacher: defaultForm,
      imagecropperShow: false,
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API, //获取baseApi
      saveBtnDisabled: false // 保存按钮是否禁用,
    };
  },
  watch: {
    $route(to, from) {
      console.log("watch $route");
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.fetchDataById(id);
      } else {
        // 使用对象拓展运算符，拷贝对象，而不是引用，
        // 否则新增一条记录后，defaultForm就变成了之前新增的teacher的值
        this.teacher = { ...defaultForm };
      }
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveData();
      } else {
        this.updateTeacher();
      }
    },

    // 保存
    saveData() {
      teacher
        .save(this.teacher)
        .then(response => {
          return this.$message({
            type: "success",
            message: "保存成功！"
          });
        })
        .then(this.$router.push({ path: "/teacher/list" }))
        .catch(response => {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },

    // 根据id查询记录
    fetchDataById(id) {
      teacher
        .getTeacherById(id)
        .then(response => {
          this.teacher = response.data.teacher;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "获取数据失败"
          });
        });
    },

    updateTeacher() {
      this.saveBtnDisabled = true;
      teacher
        .updateById(this.teacher)
        .then(response => {
          return this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .then(resposne => {
          this.$router.push({ path: "/teacher/list" });
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },

    // 上传成功后的回调函数
    cropSuccess(data) {
      console.log(data);
      this.imagecropperShow = false;
      this.teacher.avatar = data.url;
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 关闭上传组件
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    }
  }
};
</script>