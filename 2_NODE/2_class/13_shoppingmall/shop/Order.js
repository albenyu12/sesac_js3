class Order {
    constructor(user) {
        this.user = user;
        this.orderList = [];
        this.totalAmount = 0;
    }

    addProduct(product, quantity) {
        // 비즈니스 로직
        if (product.checkAvailability(quantity)) {
            this.orderList.push({ product, quantity });
            this.totalAmount += product.price * quantity;
        } else {
            console.log(`${product.name}의 재고가 없습니다. ${product.name} 구매가 불가능합니다. `)
        }
    }

    getOrderSummary() {
        return {
            user: this.user.name, 
            totalAmount: this.totalAmount, 
            items: this.orderList.map(( { product, quantity }) => ({
                name: product.name, 
                quantity: quantity, 
                price: product.price
            }))
        }
    }
}

module.exports = Order;