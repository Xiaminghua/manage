<template>
    <el-card style="height:100%">
        <mybread firstnav="数据可视化" lastnav="资管条线规模收入大屏" />
        <el-row>
            <el-col :span="24" style="text-align:center;margin-top:15%;">
                <el-button type="warning" icon="el-icon-s-platform" class="btns" style='font-size:55px;'>
                    <el-link  :underline="false" class="text" href="http://10.158.20.135:8085/datascreen-0.0.1-SNAPSHOT/index1" target="_blank">资管条线规模收入大屏</el-link>
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
    
}
</script>
<style>
.btns{
    width: 48%;
    height: 200px;
    font-size: 60px;
}
.btns .text{
    font-size: 40px;
    color:#fff;
    margin-bottom: 10px;
}
.btns .text span{
    color: #fff;
}
</style>