
import express from 'express';
import path from 'path';
import multi from 'multiparty';
import fs from 'fs';

const router = express.Router();
const uploadDir = path.resolve(process.cwd(), 'upload');
const fileDir = path.resolve(uploadDir, 'file');
router.post('/upload', (req, res) => {
  const form = new multi.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.json({ code: 400, message: 'Error parsing form' });
    }
    try {
      const hash = fields.hash[0];      // 文件总 hash
      const chunk = fields.index[0];    // 当前分片编号
      const hashChunkDir = path.resolve(uploadDir, hash);

      // 确保目录存在
      if (!fs.existsSync(hashChunkDir)) {
        fs.mkdirSync(hashChunkDir, { recursive: true });
      }

      const filePath = path.resolve(hashChunkDir, chunk);

     if(!fs.existsSync(filePath)){
         fs.renameSync(files.file[0].path, filePath);
     }
     else {
      res.send({ code: 200, message: '文件已存在' });
     }
    } catch (err) {
      console.error('Error saving chunk:', err);
      res.status(500).send('Error saving chunk');
    }
  });
});
router.get('/checkchunk',(req,res)=>{
    try{
      const {hash} =req.query;
       const hashChunkDir = path.resolve(uploadDir, hash);
      console.log(hash);
      let chunks =[]
    if(!fs.existsSync(hashChunkDir)){
       res.json({ code: 400, chunkFiles: [] });
    }
    const chunkFiles = fs.readdirSync(hashChunkDir);

    for( let item of chunkFiles){
      chunks.push(parseInt(item))
    }
    console.log(chunks);
    res.json({ code: 0,chunkFiles: chunkFiles});
    }
    catch(err){
      console.log('Error checking chunk:', err);
      res.json({ code: 500, message: 'Error checking chunk' });
    }
})
router.post('/verity',async (req,res)=>{
    const {fileName} = req.body;
    const filepath =path.resolve(fileDir, fileName);
    if(fs.existsSync(filepath)){
        return res.json({ code: 400, message: '文件已存在' });
    }
    else {
      res.json({ code: 200, message: '文件不存在' });
    }
})
router.post('/merge', async (req, res) => {
  try{
      const { hash, fileName } = req.body;
    const hashChunkDir = path.resolve(uploadDir, hash);
    const finalFilePath = path.resolve(fileDir, fileName);
    const filehash = fs.readdirSync(hashChunkDir);
    console.log(hashChunkDir);

    if (fs.existsSync(finalFilePath)) {
        return res.json({ code: 200, message: '文件已存在' });
    }
    const writeStream = fs.createWriteStream(finalFilePath);

    for (const chunk of filehash) {
        const chunkPath = path.resolve(hashChunkDir, chunk);
        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(chunkPath);
            readStream.pipe(writeStream, { end: false });  //pipe是异步的
            readStream.on('end', () => {
                fs.unlinkSync(chunkPath);  // 删除已合并的分块
                resolve();
            });
            readStream.on('error', reject);
        });
    }

     await writeStream.end();
     await fs.rmdirSync(hashChunkDir);
     const text = fs.readFileSync(finalFilePath);
    res.json({ code: 200, message: '文件合并成功',data:text });
  }catch (err) {
    console.error('Error merging chunks:', err);
    res.json({ code: 500, message: 'Error merging chunks' });
  }
    
});


export default router;