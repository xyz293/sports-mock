import db from '../index.js'
const ProductController = {
    getProductlist : ()=>{
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM product ', [], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
     },
     SearchProduct: (keyword) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM product WHERE name LIKE or description LIKE ?', [`%${keyword}%`,`%${keyword}%`], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getType: (type) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM product WHERE type = ?', [type], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getDetail: (id)=>{
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product WHERE id = ?', [id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
    })
}}
export default ProductController