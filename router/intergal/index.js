import IntergalController from '../../sql/intergal/index.js'
import express from 'express'
const router = express.Router()
router.post('/create',async (req,res)=>{
   try{
     const {user_id,intergal} = req.body
    const result = await IntergalController.CreateIntergal(user_id,intergal)
    res.json({
        code:200,
        message:result
    })
   }catch(err){
    console.log(err)
    res.status(500).json({
        code:500,
        message:'服务器错误'
    })
   }
})
router.get('/find',async (req,res)=>{
    try{
        const {user_id} = req.query
        const result = await IntergalController.findIntergal(user_id)
        res.json({
            code:200,
            message:result
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            code:500,
            message:'服务器错误'
        })
    }
})
router.post('/update',async (req,res)=>{
    try{
        const {user_id,intergal} = req.body
        const result = await IntergalController.updateIntergal(user_id,intergal)
        res.json({
            code:200,
            message:result
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            code:500,
            message:'服务器错误'
        })
    }
})
export default router