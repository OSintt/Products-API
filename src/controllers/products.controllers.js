import Product from '../models/Products';
import ProductType, { TYPES } from '../models/ProductType';

const getProducts = async (req, res) => {
	let products = await Product.find();
	products = products.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});
	return res.json({status: 200, products: products});
}

const getProductById = async (req, res) => {
	const product = await Product.findById(req.params.id).populate("comments");
	return res.json({status: 200, products: product});
}

const getRecentProducts = async (req, res) => {
	const products = await Product.find().sort({date: -1}).limit(5);
	return res.json({status: 200, message: "Lista de productos recientes", products: recentProducts});
}

const getBestSellers = async (req, res) => {
	const bestSellers = await Product.find().sort({likes: -1}).limit(10);
	return res.json({status: 200, message: "Lista de best sellers", products: bestSellers});
}

const getOnSale = async (req, res) => {
	const products = await products.find({onSale: true});
	return res.json({status: 200, message: "Lista de productos en oferta", products: products});
}

const getVPS = async (req, res) => {
	const vps = await ProductType.findOne({name: "VPS"}).populate("products");
	return res.json({status: 200, message: "Lista de VPS", products: vps});
}

const getHosts = async (req, res) => {
	const hosts = await ProductType.findOne({name: "Host"}).populate("products");
	return res.json({status: 200, message: "Lista de Hosts", products: hosts});
}

const postProduct = async (req, res) => {
	const { name, description, stock, type, price, image, onSale, onSaleText } = req.body;
	if (!type) return res.status(400).json({status: 400, message: "Hacen falta parámetros"});
	

	if (!TYPES.includes(type)) {
		return res.status(409).json({status: 409, message: `El tipo ${type} no existe`});
	}

	const product = new Product({
		name,
		description,
		stock,
		price,
		image,
		stock,
		onSale,
		onSaleText
	});

	const types = await ProductType.findOne({ name: type });
	product.type = types._id;
	try {
		types.products.push(product);
		await types.save();
		await product.save();
	} catch(e) {
		return res.status(502).json({status: 502, message: "Error: " + e});
	}
	return res.status(201).json({status: 201, message: "Se ha guardado un nuevo producto en el servidor", products: product}); 
}

const editProduct = async (req, res) => {
	const { name, description, stock, price, image } = req.body;
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, {
			name,
			description,
			stock,
			price,
			image
		});
		return res.status(201).json({status: 201, message: "Se ha editado con éxito el producto " + name, products: productSaved});
	} catch(e) {
		return res.status(502).json({status: 502, message: "Ha ocurrido un error guardando este producto"});
	}
}

const makeOnSale = async (req, res) => {
	const { onSaleText, year, month, day, hours, minutes } = req.body;
	
	const product = await Product.findById(req.params.id);

	let message = "Se ha puesto en ";
	if (product.onSale === false) {
		if (!year || !month || !day || !hours || !onSaleText) return res.status(409).json({status: 409, message: "Todas las ofertas necesitan un plazo máximo y un texto de información"});
	
		if (
			isNaN(year) || 
			isNaN(month) || 
			isNaN(day) || 
			isNaN(hours) || 
			isNaN(minutes)
		) return res.status(409).json({status: 409, message: "La fecha ingresada es inválida"});

		product.onSaleUntil = new Date(year, month - 1, day, hours, minutes);
		
		if (onSaleText.length < 1) return res.status(409).json({status: 409, message: "Ingresa un texto de oferta más largo"});
		if (onSaleText.length > 60) return res.status(409).json({status: 409, message: "Ingresa un texto de oferta más corto"});
		if (new Date().setSeconds(0, 0) >= product.onSaleUntil) return res.status(409).json({status: 409, message: "La fecha ingresada es antigua"});

		product.onSaleText = onSaleText;
	} else {
		message = "Se ha quitado de ";
		product.onSaleText = null;
		product.onSaleUntil = null;
	}

	product.onSale = !product.onSale;
	try {
		await product.save();
		return res.status(201).json({status: 201, message: message + "oferta el producto " + product.name + " con éxito", product});
	} catch(e) {
		console.log(e);
		return res.status(502).json({status: 502, message: "Ha ocurrido un error guardando este producto"});
	}
}

const deleteProduct = async (req, res) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	return res.status(201).json({status: 201, message: "Se ha eliminado un producto del servidor"});
}

module.exports = {
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
}