import Product from '../models/Products';

export const saleTimeout = async () => {
	const products = await Product.find({onSale: true});
	
	setInterval(async function() { 
	    const date = new Date();
	    date.setSeconds(0, 0);
	    products.map(async p => {
	    	console.log(p.onSaleUntil + " | " + p.onSaleText);
	    	if (
	    		p.onSaleUntil.getMinutes() === date.getMinutes() && 
	    		p.onSaleUntil.getHours() === date.getHours() &&
	    		p.onSaleUntil.getDay() === date.getDay() &&
	    		p.onSaleUntil.getMonth() === date.getMonth() &&
	    		p.onSaleUntil.getYear() === date.getYear()
	    	) {
	    		p.onSale = false;
	    		p.onSaleText = null;
	    		p.onSaleUntil = null;
	    		console.log("Se ha quitado de oferta el producto: " + p.name);
	    		await p.save();
	    	}
	    }); 
	    console.log(date);   
	}, 60 * 1000);
}
