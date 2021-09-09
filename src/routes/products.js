import { Router } from 'express';
import { isAdmin, verifyToken } from '../middleware/authJwt';
import {
	getProducts,
	getProductById,
	getRecentProducts,
	postProduct,
	makeOnSale,
	deleteProduct,
	getBestSellers,
	editProduct,
	getVPS,
	getHosts
} from '../controllers/products.controllers';

import {
	postComment,
	editComment,
	deleteComment,
	likeProduct
} from '../controllers/comment.controllers';

import {
	checkCaptcha,
	doesProductExist
} from '../middleware/products.middlewares';


import {
	doesCommentExist
} from '../middleware/comments.middleware';
const router = Router();

router.route("/all")
	.get(getProducts);

router.route("/post-product")
	.post([verifyToken, isAdmin], postProduct);

router.route("/~/:id")
	.get([doesProductExist], getProductById)
	.put([doesProductExist, verifyToken, isAdmin], editProduct)
	.delete([doesProductExist, verifyToken, isAdmin], deleteProduct);

router.route("/post-comment/:id")
	.post([verifyToken], postComment);

router.route("/edit-comment/:id")
	.put([verifyToken, doesCommentExist], editComment);

router.route("/delete-comment/:id")
	.delete([verifyToken, doesCommentExist], deleteComment);

router.route("/recents")
	.get(getRecentProducts);

router.route("/like-product/:id")
	.put([verifyToken, doesProductExist], likeProduct);

router.route("/best-sellers")
	.get(getBestSellers);

router.route("/vps")
	.get(getVPS);

router.route("/hosts")
	.get(getHosts);

router.route("/make-on-sale/:id")
	.put([verifyToken, isAdmin], makeOnSale);

module.exports = router;