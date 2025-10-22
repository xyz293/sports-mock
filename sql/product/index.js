import db from '../index.js'
const ProductController = {
    getProductlist : (type,sort_type)=>{
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM product WHERE type = ? or sort_type = ?', [type,sort_type], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
     },
}
export default ProductController