from DBHelper import DBHelper

DBHelper.drop_all()
print("DROPPED")
DBHelper.intialise_and_populate_samples()
print("DONE")