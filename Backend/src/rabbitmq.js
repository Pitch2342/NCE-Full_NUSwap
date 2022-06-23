import amqp from "amqplib"

const queue = "exchange"
// Add, Symbol, Type, Side, Quantity, Price, Owner ID, Wallet ID
export const addOrder = async ({ symbol, type, side, quantity, price, ownerId, walletId }) => {
    try {
        return await sendMessage(`add ${symbol} ${type} ${side} ${quantity} ${price} ${ownerId} ${walletId}`);
    } catch (err) { return { status: 409, error: err.detail } }
}

async function sendMessage(msg) {
    await amqp.connect('amqp://localhost').then(function (conn) {
        return conn.createChannel().then(async function (ch) {

            const ok = await ch.assertQueue(queue, { durable: false });

            if (ok) {
                ch.sendToQueue(queue, Buffer.from(msg));
                console.log(" [x] Sent '%s'", msg);
                return ch.close();
            };
        }).finally(function () { conn.close(); });
    }).catch(() => { return { status: 400, error: "Order not added" } });
    return { status: 201, response: "Order added" };
}
