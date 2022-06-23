from decimal import Decimal
import pika


class MQHelper:
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    @classmethod
    def listen_rabbitmq(cls, matchingengine):

        cls.channel.queue_declare(queue="exchange")

        def callback(ch, method, properties, body):
            matchingengine.apply(body)

        cls.channel.basic_consume(
            queue="exchange", on_message_callback=callback, auto_ack=True
        )

        print(" [*] Waiting for messages. To exit press CTRL+C")
        cls.channel.start_consuming()

    @classmethod
    def update_market_history(
        cls,
        time: str,
        symbol: str,
        open: Decimal,
        close: Decimal,
        high: Decimal,
        low: Decimal,
        volume: Decimal,
    ):
        msg = f'{{"time":"{time}","symbol":"{symbol}","open":"{open}","close":"{close}","high":"{high}","low":"{low}","volume":"{volume}"}}'
        print(msg)
        cls.channel.basic_publish(
            exchange="NEW_MARKET_HISTORY.DLQ.Exchange", routing_key="", body=msg
        )

    @classmethod
    def update_ask_order(cls, symbol):
        cls.channel.basic_publish(
            exchange="NEW_ASK_ORDER.DLQ.Exchange", routing_key="", body=f'{{"symbol":"{symbol}"}}'
        )

    @classmethod
    def update_bid_order(cls, symbol):
        cls.channel.basic_publish(
            exchange="NEW_BID_ORDER.DLQ.Exchange", routing_key="", body=f'{{"symbol":"{symbol}"}}'
        )
    
    @classmethod
    def add_order_filling(cls, symbol, price, quantity):
        cls.channel.basic_publish(
            exchange="NEW_ORDER_FILLED.DLQ.Exchange", routing_key="", body=f'{{"symbol":"{symbol}", "price":"{price}", "quantity":"{quantity}"}}'
        )
    
    # add ETHUSD limit ask 100 64000 user1 Alice1
    @classmethod
    def populate_open_orders(cls):
        for price in range(50, 110, 10):
            cls.channel.basic_publish(
                exchange="", routing_key="exchange", body=f"add btcusd limit bid 1 {price} 1 1"
            )
        for price in range(110, 160, 10):
            cls.channel.basic_publish(
                exchange="", routing_key="exchange", body=f"add btcusd limit ask 1 {price} 3 3"
            )
        
        cls.channel.basic_publish(
            exchange="", routing_key="exchange", body="add btcusd limit ask 1 100 2 2"
        )
