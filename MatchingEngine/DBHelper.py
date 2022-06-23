#!/usr/bin/env python
# coding: utf-8

# # Libs


from decimal import Decimal
import sqlalchemy
import pandas as pd
import datetime
# from dotenv import dotenv_values

# # DB Creator

# ## Global Tables
# - User
# - Wallet
# - Wallet_Assets
# - Symbols
#
# ## Symbol Specific Tables
# - Market History
# - OpenAsk
# - OpenBid
# - Closed
# - OrderFillings


class DBHelper:
    # url = dotenv_values(".env")["url"]
    user = 'nus'
    password = '12345678'
    host = 'localhost'
    port = 5432
    database = 'nustesting'
    url = "postgresql+psycopg2://{0}:{1}@{2}:{3}/{4}".format(user, password, host, port, database)
    engine = sqlalchemy.create_engine(url, echo=False)
    # engine = sqlalchemy.create_engine(url, echo=False)
    con = engine.connect()
    GLOBAL_TABLES_CREATION_SCRIPT = "CREATE_GLOBAL_TABLES.txt"
    old_time = {}
    cur_market = {}

    @classmethod
    def init_database(cls):
        symbol_exist = cls.check_table_existence("symbol")
        users_exist = cls.check_table_existence("users")
        wallet_exist = cls.check_table_existence("wallet")
        wallet_assets_exist = cls.check_table_existence("wallet_assets")

        if symbol_exist and users_exist and wallet_exist and wallet_assets_exist:
            inspector = sqlalchemy.inspect(cls.engine)
            table_names = inspector.get_table_names()
            print("THESE GLOBAL TABLES ALREADY EXIST")
            print(table_names)
        else:
            cls.execute_sql_script(cls.GLOBAL_TABLES_CREATION_SCRIPT)
            print("CREATED GLOBAL TABLES")
            print("ALL TABLES : ", sqlalchemy.inspect(cls.engine).get_table_names())

    @classmethod
    def execute_sql_script(cls, filepath):
        sql_file = open(filepath, "r")

        sql_command = ""
        # Iterate over all lines in the sql file
        for line in sql_file:
            # Ignore commented lines
            if not line.startswith("--") and line.strip("\n"):
                # Append line to the command string
                sql_command += line.strip("\n")

                # If the command string ends with ';', it is a full statement
                if sql_command.endswith(";"):
                    # Try to execute statement and commit it
                    try:
                        print("Executing : ", sql_command)
                        cls.con.execute(sql_command)

                    # Assert in case of error
                    except Exception as e:
                        print("Error in Execution of below SQL")
                        print(sql_command)
                        print(e)

                    # Finally, clear command string
                    finally:
                        print("==========")
                        sql_command = ""

    @classmethod
    def drop_tables(cls, table_list):
        for table_name in table_list:
            query = "DROP TABLE " + table_name
            print("Dropping ", table_name)
            try:
                cls.con.execute(query)
            except Exception as e:
                print(e)

    @classmethod
    def check_table_existence(cls, table_name):
        inspector = sqlalchemy.inspect(cls.engine)
        table_names = inspector.get_table_names()
        if table_name in table_names:
            return True
        else:
            return False

    @classmethod
    def drop_all(cls):
        inspector = sqlalchemy.inspect(cls.engine)
        a = inspector.get_table_names()
        while len(a) != 0:
            print("===>")
            try:
                cls.drop_tables(a)
            except Exception as e:
                print(e)
            inspector = sqlalchemy.inspect(cls.engine)
            a = inspector.get_table_names()

    @classmethod
    def get_all_tables(cls):
        inspector = sqlalchemy.inspect(cls.engine)
        table_names = inspector.get_table_names()
        return table_names

    @classmethod
    def add_symbol(cls, symbol_name):
        if cls.check_table_existence("symbol") == False:
            print("No global symbols table")
        if symbol_name in pd.read_sql("SELECT * FROM SYMBOL;", cls.con).symbol.values:
            print("SYMBOL ALREADY Exists")
            return
        else:
            try:
                symbol_insertion_query = (
                    "INSERT INTO SYMBOL(SYMBOL) VALUES('" + symbol_name + "');"
                )
                cls.con.execute(symbol_insertion_query)
                cls.old_time[symbol_name] = ""
            except Exception as e:
                print("Error in Execution of below SQL")
                print(symbol_insertion_query)
                print(e)

            print("Symbol Inserted, CREATING TABLES")

            # Creation Queries
            # Create Open Ask
            open_ask_query = (
                "CREATE TABLE OPEN_ASK_ORDERS_"
                + symbol_name
                + "("
                + "ORDERID  	VARCHAR(64) 		NOT NULL,"
                + "WALLETID  	INTEGER 		    NOT NULL,"
                + "OWNER  		INTEGER 			NOT NULL,"
                + "QUANTITY 	DECIMAL(15,5) 		NOT NULL,"
                + "SYMBOL  	    VARCHAR(64) 		NOT NULL,"
                + "PRICE 		DECIMAL(15,5) 		NOT NULL,"
                + "OPENQUANTITY DECIMAL(15,5) 		NOT NULL,"
                + "FILLCOST 	DECIMAL(15,5) 		NOT NULL,"
                + "CREATEDAT  	timestamp without time zone 	NOT NULL,"
                + "UPDATEDAT  	timestamp without time zone 	NOT NULL,"
                + "PRIMARY KEY(ORDERID),"
                + "FOREIGN KEY (WALLETID) REFERENCES WALLET(WALLETID),"
                + "FOREIGN KEY (OWNER) REFERENCES USERS(USERID)"
                + ");"
            )
            # Create Open Bid
            open_bid_query = (
                "CREATE TABLE OPEN_BID_ORDERS_"
                + symbol_name
                + "("
                + "ORDERID  	VARCHAR(64) 		NOT NULL,"
                + "WALLETID  	INTEGER 		    NOT NULL,"
                + "OWNER  		INTEGER 			NOT NULL,"
                + "QUANTITY 	DECIMAL(15,5) 		NOT NULL,"
                + "SYMBOL  	    VARCHAR(64) 		NOT NULL,"
                + "PRICE 		DECIMAL(15,5) 		NOT NULL,"
                + "OPENQUANTITY DECIMAL(15,5) 		NOT NULL,"
                + "FILLCOST 	DECIMAL(15,5) 		NOT NULL,"
                + "CREATEDAT  	timestamp without time zone 	NOT NULL,"
                + "UPDATEDAT  	timestamp without time zone 	NOT NULL,"
                + "PRIMARY KEY(ORDERID),"
                + "FOREIGN KEY (WALLETID) REFERENCES WALLET(WALLETID),"
                + "FOREIGN KEY (OWNER) REFERENCES USERS(USERID)"
                + ");"
            )
            # Create Closed
            closed_query = (
                "CREATE TABLE CLOSED_ORDERS_"
                + symbol_name
                + "("
                + "ORDERID  	VARCHAR(64) 		NOT NULL,"
                + "WALLETID  	INTEGER 		    NOT NULL,"
                + "OWNER  		INTEGER 			NOT NULL,"
                + "BUYSIDE  	VARCHAR(64) 		NOT NULL,"
                + "QUANTITY 	DECIMAL(15,5) 		NOT NULL,"
                + "SYMBOL  	    VARCHAR(64) 		NOT NULL,"
                + "PRICE 		DECIMAL(15,5) 		NOT NULL,"
                + "FILLCOST 	DECIMAL(15,5) 		NOT NULL,"
                + "FILLPRICE 	DECIMAL(15,5) 		NOT NULL,"
                + "CREATEDAT  	timestamp without time zone 	NOT NULL,"
                + "FILLEDAT  	timestamp without time zone 	NOT NULL,"
                + "PRIMARY KEY(ORDERID),"
                + "FOREIGN KEY (WALLETID) REFERENCES WALLET(WALLETID),"
                + "FOREIGN KEY (OWNER) REFERENCES USERS(USERID)"
                + ");"
            )
            # Create Order Fillings
            order_fillings_query = (
                "CREATE TABLE ORDER_FILLINGS_"
                + symbol_name
                + "("
                + "MATCHID 	    SERIAL 			NOT NULL,"
                + "BUYORDERID  	VARCHAR(64),"
                + "SELLORDERID  VARCHAR(64),"
                + "SYMBOL  	    VARCHAR(64) 	NOT NULL,"
                + "PRICE 		DECIMAL(15,5) 	NOT NULL,"
                + "QUANTITY 	DECIMAL(15,5) 	NOT NULL,"
                + "TIME  		timestamp without time zone 	NOT NULL,"
                + "PRIMARY KEY(MATCHID)"
                + ");"
            )
            # Create Market_History
            market_history_query = (
                "CREATE TABLE MARKET_HISTORY_"
                + symbol_name
                + "("
                + "TIME  		timestamp without time zone 	NOT NULL,"
                + "OPEN 		DECIMAL(15,5) 		NOT NULL,"
                + "CLOSE 		DECIMAL(15,5) 		NOT NULL,"
                + "HIGH 		DECIMAL(15,5) 		NOT NULL,"
                + "LOW 		    DECIMAL(15,5) 		NOT NULL,"
                + "VOLUME 		DECIMAL(15,5) 		NOT NULL,"
                + "VWAP 		DECIMAL(15,5) 		NOT NULL,"
                + "NUM_TRADES 	INTEGER 			NOT NULL	DEFAULT 0,"
                + "PRIMARY KEY(TIME)"
                + ");"
            )

            # Execute Creation
            try:
                cls.con.execute(open_ask_query)
                print("CREATED OPEN ASKS")
            except Exception as e:
                print("Error in Execution of below SQL")
                print(open_ask_query)
                print(e)

            try:
                cls.con.execute(open_bid_query)
                print("CREATED OPEN BIDS")
            except Exception as e:
                print("Error in Execution of below SQL")
                print(open_bid_query)
                print(e)

            try:
                cls.con.execute(closed_query)
                print("CREATED CLOSED ORDERS")
            except Exception as e:
                print("Error in Execution of below SQL")
                print(closed_query)
                print(e)

            try:
                cls.con.execute(order_fillings_query)
                print("CREATED ORDER FILLINGS")
            except Exception as e:
                print("Error in Execution of below SQL")
                print(order_fillings_query)
                print(e)

            try:
                cls.con.execute(market_history_query)
                print("CREATED MARKET HISTORY")
            except Exception as e:
                print("Error in Execution of below SQL")
                print(market_history_query)
                print(e)

            print("ALL TABLES FOR SYMBOL ", symbol_name, " have been created")

    @classmethod
    def create_order(
        cls,
        order_id,
        symbol_name,
        wallet,
        user,
        action,
        qty,
        price=Decimal(0),
        time="",
    ):
        insertion_order = (
            order_id,
            wallet,
            user,
            qty,
            symbol_name,
            price,
            qty,
            0,
            time,
            time,
        )
        if action.lower() == "buy":
            try:
                cls.con.execute(
                    "INSERT INTO OPEN_BID_ORDERS_"
                    + symbol_name
                    + " (ORDERID, WALLETID, OWNER, QUANTITY, SYMBOL, PRICE, OPENQUANTITY, FILLCOST, CREATEDAT, UPDATEDAT) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);",
                    insertion_order,
                )
            except Exception as e:
                print(insertion_order)
                print(e)
        elif action.lower() == "sell":
            try:
                cls.con.execute(
                    "INSERT INTO OPEN_ASK_ORDERS_"
                    + symbol_name
                    + " (ORDERID, WALLETID, OWNER, QUANTITY, SYMBOL, PRICE, OPENQUANTITY, FILLCOST, CREATEDAT, UPDATEDAT) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);",
                    insertion_order,
                )
            except Exception as e:
                print(insertion_order)
                print(e)
        return order_id

    @classmethod
    def update_order(
        cls, symbol_name, action, order_id, qty, open_qty, fill_cost, time
    ):
        insertion_order = (qty, open_qty, fill_cost, time, order_id)
        if action.lower() == "buy":
            try:
                cls.con.execute(
                    "UPDATE OPEN_BID_ORDERS_"
                    + symbol_name
                    + " SET QUANTITY = %s, OPENQUANTITY = %s, FILLCOST = %s, UPDATEDAT = %s WHERE ORDERID = %s;",
                    insertion_order,
                )
            except Exception as e:
                print(insertion_order)
                print(e)
        elif action.lower() == "sell":
            try:
                cls.con.execute(
                    "UPDATE OPEN_ASK_ORDERS_"
                    + symbol_name
                    + " SET QUANTITY = %s, OPENQUANTITY = %s, FILLCOST = %s, UPDATEDAT = %s WHERE ORDERID = %s;",
                    insertion_order,
                )
            except Exception as e:
                print(insertion_order)
                print(e)

    @classmethod
    def add_trade_record(cls, symbol_name, buy_order, sell_order, price, qty, time):
        insertion_order = (buy_order, sell_order, symbol_name, price, qty, time)
        try:
            cls.con.execute(
                "INSERT INTO ORDER_FILLINGS_"
                + symbol_name
                + " (BUYORDERID, SELLORDERID, SYMBOL, PRICE, QUANTITY, TIME) VALUES(%s, %s, %s, %s, %s, %s);",
                insertion_order,
            )

            # cur_time = datetime.datetime.now().isoformat("T")[:16]
            cur_time = time[:16]  # Assuming time is datetime.isoformat('T')
            if cur_time == cls.old_time[symbol_name]:
                cls.cur_market[symbol_name]["num_trades"] += 1
                cls.cur_market[symbol_name]["close"] = price
                if price > cls.cur_market[symbol_name]["high"]:
                    cls.cur_market[symbol_name]["high"] = price
                elif price < cls.cur_market[symbol_name]["low"]:
                    cls.cur_market[symbol_name]["low"] = price
                old_vwap = cls.cur_market[symbol_name]["vwap"]
                old_vol = cls.cur_market[symbol_name]["volume"]
                new_vwap = ((old_vwap * old_vol) + (price * qty)) / (old_vol + qty)
                new_vol = old_vol + qty
                cls.cur_market[symbol_name]["vwap"] = new_vwap
                cls.cur_market[symbol_name]["volume"] = new_vol
                market_update = (
                    cls.cur_market[symbol_name]["open"],
                    cls.cur_market[symbol_name]["close"],
                    cls.cur_market[symbol_name]["high"],
                    cls.cur_market[symbol_name]["low"],
                    cls.cur_market[symbol_name]["volume"],
                    cls.cur_market[symbol_name]["vwap"],
                    cls.cur_market[symbol_name]["num_trades"],
                    cls.cur_market[symbol_name]["time"],
                )
                try:
                    cls.con.execute(
                        "UPDATE MARKET_HISTORY_"
                        + symbol_name
                        + " SET OPEN = %s, CLOSE = %s, HIGH = %s, "
                        + "LOW = %s, VOLUME = %s, VWAP = %s, NUM_TRADES = %s "
                        + "WHERE TIME = %s;",
                        market_update,
                    )
                except Exception as e:
                    print(insertion_order)
                    print(e)
            else:
                cls.old_time[symbol_name] = cur_time
                cls.cur_market[symbol_name] = {
                    "time": cur_time,
                    "open": price,
                    "close": price,
                    "high": price,
                    "low": price,
                    "volume": qty,
                    "vwap": price,
                    "num_trades": 1,
                }
                market_insertion = (
                    cls.cur_market[symbol_name]["time"],
                    cls.cur_market[symbol_name]["open"],
                    cls.cur_market[symbol_name]["close"],
                    cls.cur_market[symbol_name]["high"],
                    cls.cur_market[symbol_name]["low"],
                    cls.cur_market[symbol_name]["volume"],
                    cls.cur_market[symbol_name]["vwap"],
                    cls.cur_market[symbol_name]["num_trades"],
                )
                try:
                    cls.con.execute(
                        "INSERT INTO MARKET_HISTORY_"
                        + symbol_name
                        + " (TIME,OPEN,CLOSE,HIGH,LOW,VOLUME,VWAP,NUM_TRADES) VALUES(%s, %s, %s, %s, %s, %s, %s, %s);",
                        market_insertion,
                    )
                except Exception as e:
                    print(insertion_order)
                    print(e)

        except Exception as e:
            print(insertion_order)
            print(e)

    @classmethod
    def get_user_balance(cls, user_id):
        return pd.read_sql(
            f"SELECT * FROM users where userid = '{user_id}';",
            cls.con,
            coerce_float=False,
        ).balance.values[0]

    @classmethod
    def get_wallet_asset(cls, wallet_id, symbol):
        return pd.read_sql(
            f"SELECT * FROM wallet_assets where (walletid = '{wallet_id}') and (symbol = '{symbol.lower()}');",
            cls.con,
            coerce_float=False,
        ).amount.values[0]

    @classmethod
    def update_user_balance(cls, user_id, balance):
        try:
            cls.con.execute(
                f"UPDATE users SET balance = {balance} WHERE userid = '{user_id}';"
            )
        except Exception as e:
            print(user_id, balance)
            print(e)

    @classmethod
    def update_wallet_asset(cls, wallet_id, symbol, amount):
        try:
            cls.con.execute(
                f"UPDATE wallet_assets SET amount = {amount} WHERE (walletid = '{wallet_id}') and (symbol = '{symbol.lower()}');"
            )
        except Exception as e:
            print(wallet_id, symbol, amount)
            print(e)

    @classmethod
    def close_order(
        cls,
        order_id,
        wallet_id,
        user_id,
        is_buy,
        quantity,
        symbol,
        price,
        fill_cost,
        created_at,
        filled_at,
    ):
        insert_close_order = (
            order_id,
            wallet_id,
            user_id,
            "BUY" if is_buy else "SELL",
            quantity,
            symbol,
            price,
            fill_cost,
            fill_cost / quantity,
            created_at,
            filled_at,
        )
        try:
            cls.con.execute(
                "DELETE FROM OPEN_"
                + ("BID" if is_buy else "ASK")
                + "_ORDERS_"
                + symbol
                + f" WHERE ORDERID = '{order_id}';"
            )
        except Exception as e:
            print(symbol, order_id)
            print(e)

        try:
            cls.con.execute(
                "INSERT INTO CLOSED_ORDERS_"
                + symbol
                + "(ORDERID, WALLETID, OWNER, BUYSIDE, QUANTITY, SYMBOL, PRICE, FILLCOST, FILLPRICE, CREATEDAT, FILLEDAT) "
                + "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);",
                insert_close_order,
            )
        except Exception as e:
            print(insert_close_order)
            print(e)

    @classmethod
    def intialise_and_populate_samples(cls, global_file = "CREATE_GLOBAL_TABLES.txt", init_file = "sample_data.txt"):
        cls.execute_sql_script(global_file)
        cls.add_symbol("btcusd")
        cls.add_symbol("ethusd")
        cls.add_symbol("xrpusd")
        cls.execute_sql_script(init_file)
