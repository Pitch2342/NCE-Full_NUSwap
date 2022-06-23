from datetime import datetime
from multimap import MultiMap
from order import Order
from ordertracker import OrderTracker
from decimal import Decimal
from price import Price
from DBHelper import DBHelper
from MQHelper import MQHelper

MAX_QUANTITY = 4294967295  # UINT32_MAX
MARKET_ORDER_PRICE = 0


class OrderBook:
    def __init__(self, symbol) -> None:
        self._symbol = symbol
        self._asks = MultiMap()
        self._bids = MultiMap()
        # These two are reserved for market stop orders
        self._stopAsks = MultiMap()
        self._stopBids = MultiMap()
        self._pendingTrackers = []
        self._marketPrice = Decimal(0)
        # DBHelper.add_symbol(symbol)

    def marketPrice(self) -> Decimal:
        return self._marketPrice

    def set_market_price(self, price: Decimal) -> None:
        oldMarketPrice = self._marketPrice
        self._marketPrice = price
        # db_update_market_price(self._db["types"], self._symbol, price)
        if price > oldMarketPrice or oldMarketPrice == 0:
            self.check_stop_orders(True, price, self._stopBids)
        elif price < oldMarketPrice or oldMarketPrice == 0:
            self.check_stop_orders(False, price, self._stopAsks)

    def check_stop_orders(
        self, buySide: bool, price: Decimal, current_orders: MultiMap
    ) -> None:
        until = Price(price, buySide)
        temp = []
        for price, order_list in current_orders:
            if until < price:
                break
            current_price = price.price()
            # current_price: Decimal, current_order: OrderTracker
            for current_order in order_list:
                self._pendingTrackers.append(current_order)
                temp.append((current_price, current_order))
        for (current_price, current_order) in temp:
            current_orders.remove(current_price, current_order)

    def submit_pending_orders(self) -> None:
        self._pendingTrackers, pending = [], self._pendingTrackers
        for order_tracker in pending:
            self.submit_order(order_tracker)

    def submit_order(self, inbound: OrderTracker) -> bool:
        order_price = inbound.order().price()
        return self.add_order(inbound, order_price)

    # We will use order tracker to process the order, record the history and update the database

    def add_order(self, inbound: OrderTracker, inbound_price: Decimal) -> bool:
        matched = False
        order = inbound.order()
        # inbound = OrderTracker(order)
        # inbound_price = order.price()
        buy = order.isBuy()
        match_history = []

        if buy:
            matched = self.match_order(
                inbound, inbound_price, self._asks, match_history
            )
        else:
            matched = self.match_order(
                inbound, inbound_price, self._bids, match_history
            )

        for order_tracker, cross_price, fill_qty in match_history:
            id = order_tracker.orderId()
            print(f"order {id} filled {fill_qty} @ {cross_price}")
            print(f"order {inbound.orderId()} filled {fill_qty} @ {cross_price}")
            # reserved for database update

        if not inbound.filled():
            if buy:
                self._bids.add(Price(inbound_price, buy), inbound)
            else:
                self._asks.add(Price(inbound_price, buy), inbound)
        return matched, match_history

    #  Try to match order at 'price' against 'current' orders
    #  If successful
    #    generate trade(s)
    #    if any current order is complete, remove from 'current' orders

    def match_order(
        self,
        inbound: OrderTracker,
        inbound_price: Decimal,
        current_orders: MultiMap,
        match_history: list,
    ) -> bool:
        return self.match_regular_order(
            inbound, inbound_price, current_orders, match_history
        )

    def match_regular_order(
        self,
        inbound: OrderTracker,
        inbound_price: Decimal,
        current_orders: MultiMap,
        match_history: list,
    ) -> bool:
        matched = False
        filled_list = []
        openQuantity = inbound.openQuantity()
        for price, order_list in current_orders:
            if not price.matches(inbound_price):
                break
            current_price = price.price()
            # current_price: Decimal, current_order: OrderTracker
            for current_order in order_list:
                if inbound.filled():
                    break
                # reserved for all or none logic
                if False:
                    pass
                else:
                    cross_price, traded = self.create_trade(
                        inbound, current_order, inbound_price, current_price
                    )
                    if traded:
                        matched = True
                        match_history.append((current_order, cross_price, traded))
                        if current_order.filled():
                            filled_list.append((current_price, current_order))
                        openQuantity -= traded
        for (current_price, current_order) in filled_list:
            current_orders.remove(current_price, current_order)
        return matched

    def create_trade(
        self,
        inbound_tracker: OrderTracker,
        current_tracker: OrderTracker,
        inbound_price: Decimal,
        current_price: Decimal,
        max_quantity: int = MAX_QUANTITY,
    ):
        cross_price = current_price
        if cross_price == MARKET_ORDER_PRICE:
            cross_price = inbound_price
        if cross_price == MARKET_ORDER_PRICE:
            cross_price = self._marketPrice
        if cross_price == MARKET_ORDER_PRICE:
            return 0, 0
        fill_qty = min(
            max_quantity,
            min(inbound_tracker.openQuantity(), current_tracker.openQuantity()),
        )
        if fill_qty > 0:
            buyer, seller = (
                (inbound_tracker, current_tracker)
                if inbound_tracker.order().isBuy()
                else (current_tracker, inbound_tracker)
            )

            # check buyer balance
            balance = DBHelper.get_user_balance(buyer.order().ownerId())

            if balance < cross_price * fill_qty:
                fill_qty = balance / cross_price
                if fill_qty <= 0:
                    return 0, 0
            # check seller asset
            quantity = DBHelper.get_wallet_asset(
                seller.order().walletId(),
                seller.order().symbol(),
            )

            fill_qty = min(fill_qty, quantity)

            inbound_tracker.fill(cross_price, fill_qty)
            current_tracker.fill(cross_price, fill_qty)

            curr = datetime.now().isoformat("T")

            # symbol_name, buy_order, sell_order, price, qty, time
            DBHelper.add_trade_record(
                inbound_tracker.order().symbol(),
                buyer.orderId(),
                seller.orderId(),
                cross_price,
                fill_qty,
                curr,
            )

            DBHelper.update_order(
                current_tracker.order().symbol(),
                "BUY" if current_tracker.order().isBuy() else "SELL",
                current_tracker.orderId(),
                current_tracker.order().quantity(),
                current_tracker.openQuantity(),
                current_tracker.fillCost(),
                curr,
            )

            DBHelper.update_order(
                inbound_tracker.order().symbol(),
                "BUY" if inbound_tracker.order().isBuy() else "SELL",
                inbound_tracker.orderId(),
                inbound_tracker.order().quantity(),
                inbound_tracker.openQuantity(),
                inbound_tracker.fillCost(),
                curr,
            )

            DBHelper.update_user_balance(
                buyer.order().ownerId(),
                DBHelper.get_user_balance(buyer.order().ownerId())
                - cross_price * fill_qty,
            )
            DBHelper.update_user_balance(
                seller.order().ownerId(),
                DBHelper.get_user_balance(seller.order().ownerId())
                + cross_price * fill_qty,
            )
            DBHelper.update_wallet_asset(
                buyer.order().walletId(),
                buyer.order().symbol(),
                DBHelper.get_wallet_asset(
                    buyer.order().walletId(), buyer.order().symbol()
                )
                + fill_qty,
            )
            DBHelper.update_wallet_asset(
                seller.order().walletId(),
                seller.order().symbol(),
                DBHelper.get_wallet_asset(
                    seller.order().walletId(), seller.order().symbol()
                )
                - fill_qty,
            )

            if buyer.filled():
                DBHelper.close_order(
                    buyer.orderId(),
                    buyer.order().walletId(),
                    buyer.order().ownerId(),
                    buyer.order().isBuy(),
                    buyer.order().quantity(),
                    buyer.order().symbol(),
                    buyer.order().price(),
                    buyer.fillCost(),
                    buyer.order().creationTime(),
                    curr,
                )

            if seller.filled():
                DBHelper.close_order(
                    seller.orderId(),
                    seller.order().walletId(),
                    seller.order().ownerId(),
                    seller.order().isBuy(),
                    seller.order().quantity(),
                    seller.order().symbol(),
                    seller.order().price(),
                    seller.fillCost(),
                    seller.order().creationTime(),
                    curr,
                )
            self.set_market_price(cross_price)

        # Add the trade to the trade history
        return cross_price, fill_qty

    def __str__(self) -> str:
        return f"symbol:{self._symbol}\nasks:\n{self._stopAsks}\n{self._asks}\nbids:\n{self._stopBids}\n{self._bids}\n"

    def add(self, order: Order) -> bool:
        matched = False
        inbound = OrderTracker(order)
        # order_id,
        # symbol_name,
        # wallet,
        # user,
        # action,
        # qty,
        # price=0,
        # time=0,
        DBHelper.create_order(
            order.orderId(),
            order.symbol(),
            order.walletId(),
            order.ownerId(),
            "BUY" if order.isBuy() else "SELL",
            order.quantity(),
            order.price(),
            order.creationTime(),
        )
        if not (inbound.order().stopPrice() != 0 and self.add_stop_order(inbound)):
            matched = self.submit_order(inbound)
        while self._pendingTrackers:
            self.submit_pending_orders()
        return matched

    def add_stop_order(self, orderTracker: OrderTracker) -> bool:
        isBuy = orderTracker.order().isBuy()
        key = Price(orderTracker.order().stopPrice(), isBuy)

        isStopped = key < self._marketPrice
        if isStopped:
            if isBuy:
                self._stopBids.add(key, orderTracker)
            else:
                self._stopAsks.add(key, orderTracker)
        return isStopped

    def cancel(self, order: Order) -> bool:
        found = False
        order_map = self._bids if order.isBuy() else self._asks
        key = Price(order.price(), order.isBuy())
        tracker = self.find_on_market(order, order_map)
        if tracker:
            order_map.remove(key, tracker)
            found = True
        if not found:
            order_map = self._stopBids if order.isBuy() else self._stopAsks
            tracker = self.find_on_market(order, order_map)
            if tracker:
                order_map.remove(key, tracker)
                found = True

    def replace(
        self, order: Order, size_delta: int, new_price: Decimal, time: str
    ) -> bool:
        matched = False

        market = self._bids if order.isBuy() else self._asks
        tracker = self.find_on_market(order, market)

        old_price = order.price()

        price_change = new_price and new_price != order.price()

        if price_change:
            if order.orderType() == "LIMIT":
                price = new_price
                order.modify_price(new_price, time)
            elif order.orderType() == "MARKET":
                print("Cannot change market order price")
                return
        else:
            price = order.price()

        if tracker:
            if size_delta < 0 and tracker.openQuantity() + size_delta < 0:
                size_delta = -tracker.openQuantity()
                if size_delta == 0:
                    print("--order is already filled")
                    return
            new_open_quantity = tracker.openQuantity() + size_delta
            tracker.change_qty(size_delta)
            order.modify_quantity(order.quantity() + size_delta, time)

            market.remove(Price(old_price, order.isBuy()), tracker)
            if new_open_quantity:
                matched = self.add_order(tracker, price)

            while self._pendingTrackers:
                self.submit_pending_orders()
        else:
            print("--order not found")
        return matched

    def find_on_market(self, order: Order, order_map: MultiMap) -> OrderTracker:
        price_list = order_map.get(Price(order.price(), order.isBuy()))
        if price_list:
            for order_tracker in price_list:
                if order_tracker.orderId() == order.orderId():
                    return order_tracker
        print("--order not found")
        return None