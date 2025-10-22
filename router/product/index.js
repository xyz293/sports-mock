import express from 'express'
import ProductController from '../../sql/product/index.js'
const router = express.Router()
router.get('/list',async (req,res)=>{
   try{
     const {type,sort_type} = req.query
    const productlist = await ProductController.getProductlist(type,sort_type)
    res.json({
        code:200,
        message:'获取成功',
        data:productlist
    })
   }catch(err){
    res.json({
        success:false,
        message:'获取失败',
        data:err
    })
   }
})
export default router