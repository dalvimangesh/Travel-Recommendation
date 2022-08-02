import pyspark as ps
from pyspark.sql import SQLContext
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
from pyspark.ml import pipeline
from pyspark.sql import Row
from pyspark.ml.recommendation import ALS
from pyspark.sql.functions import udf,col, when
import numpy as np
from matplotlib import use
from pyspark.sql import SQLContext, functions, types
from torch import le
import copy
import findspark
findspark.add_packages('mysql:mysql-connector-java:8.0.11')
from pyspark.ml.feature import StringIndexer
from pyspark.sql import SQLContext, functions, types
sc=ps.SparkContext(appName="Mangesh")
spark = SQLContext(sc)
import pandas as pd
import tkinter as tk
from ast import If
import random
from math import ceil
from difflib import SequenceMatcher
from pyspark.sql.functions import desc




def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()



def setint(a):
    return int(a)



def getAmenityLength(a):
    a = str(a)
    res1 = a.strip('][').split(',')
    if(len(res1)>=0):
        res = 0
        cnt = 0
        for item in PredictFor:
            for i in res1:
                if(similar(i,item)>=0.5):
                    cnt+=1
        return (res + cnt)
    return 0



def setfloat(a,b,c,d,e):
    if(a!="5.0" and a!="4.5" and a!="3.0" and a!="3.5" and a!="2.5" and a!="2.0" and a!="0.5" and a!="1.0" and a!="1.5" and a!="4.0"):
        return 0
    res = 0
    if b == "Excellent":
        res+=4
    elif b=="Very good":
        res+=3
    elif b=="Average":
        res+=2
    elif b=="Poor":
        res+=1
    num = (int(float(c)))
    res += int((1/num)*(100))
    res += int(d/10)
    res += int(ceil(float(a)))
    e = str(e)
    res1 = e.strip('][').split(',')
    for i in range(1,len(res1)):
        res1[i] = res1[i][4:-2]
    res1[0] = res1[0][3:-2]

    for item in PredictFor:
        for i in res1:
            if(similar(item,i)>=0.5):
                res+=1
    if(res>=0):
        return res
    return 0



def readDataset(n):

    print('\n',"Reading Dataset",'\n')

    hotel_df = spark.read.json('hotel').limit(n)
    amenity_df = spark.read.json('amenity').limit(n)
    amenity_df = amenity_df.withColumnRenamed("amenities","amenity")
    return hotel_df,amenity_df



def getInput(Amenity):
    
    print('\n',"Getting User Input",'\n')

    app = tk.Tk()
    app.title('List box')

    PredictFor = list()

    def clicked():
        print("clicked")
        selected = box.curselection()  # returns a tuple
        for idx in selected:
            PredictFor.append(box.get(idx))

    box = tk.Listbox(app, selectmode=tk.MULTIPLE, height=20, width=70)
    values = list(set(Amenity))
    for val in values:
        box.insert(tk.END, val)
    box.pack()

    button = tk.Button(app, text='DONE', width=25, command=clicked)
    button.pack()

    app.mainloop()
    
    print('\n',"You Selected : ",PredictFor,'\n')

    return PredictFor


def CreateFinalDataFrame(PredictFor,hotel_df,amenity_df):
    
    print('\n',"Creating Final DataFrame",'\n')

    user_df = pd.DataFrame(PredictFor,columns=["amenityUserWant"])
    user_df = spark.createDataFrame(user_df)
    user_df.createOrReplaceTempView('user_df')

    hotel_df.createOrReplaceTempView('hotel_df')
    amenity_df.createOrReplaceTempView('amenity_df')
    user_df.createOrReplaceTempView('user_df')

    temp_df  = spark.sql("SELECT * FROM amenity_df INNER JOIN user_df WHERE amenity_df.amenity=user_df.amenityUserWant ORDER BY id")
    temp_df = temp_df.withColumnRenamed("amenity","_AMENITY").withColumnRenamed('id',"_ID").drop(col('amenityUserWant'))
    temp_df.createOrReplaceTempView('temp_df')

    final_df = spark.sql("SELECT * FROM temp_df INNER JOIN amenity_df WHERE amenity_df.id=temp_df._ID")

    final_df = final_df.drop(col('_ID')).drop('_AMENITY')
    training_df = final_df.join(hotel_df,'id')

    find_rating = functions.udf(lambda a: setint(a), types.IntegerType())
    training_df = training_df.withColumn("USERID",find_rating("id"))

    find_rating = functions.udf(lambda a: getAmenityLength(a), types.IntegerType())
    training_df = training_df.withColumn("AMENITY",find_rating("amenities"))

    find_rating = functions.udf(lambda a,b,c,d,e: setfloat(a,b,c,d,e), types.IntegerType())
    training_df = training_df.withColumn("HOTELRATING",find_rating("hotel_rating","hotel_experience","price","AMENITY","amenities"))

    return training_df




def training(training_df):

    interations = 3
    regularization_parameter = 0.1 #lamba
    Rank = 4
    errors = []
    err = 0

    train,validation = training_df.randomSplit([0.7,0.3],seed=16)

    als = ALS(maxIter=interations, regParam= regularization_parameter, rank=Rank , userCol='USERID', itemCol='AMENITY', ratingCol='HOTELRATING')
    
    print('\n',"Creating Model",'\n')
    
    model = als.fit(train)
    model.setColdStartStrategy("drop")
    
    new_predictions = model.transform(validation)

    return new_predictions




def Evaluate(new_predictions):
    evaluator = RegressionEvaluator(metricName="rmse",labelCol="HOTELRATING", predictionCol="prediction")
    rmse = evaluator.evaluate(new_predictions)
    return rmse


def getRecc(new_predictions):

    print('\n')
    
    numbers = int(input("How many Hotel recommendations you want : "))

    print('\n',"Getting Hotel recommendations",'\n')

    new_predictions = new_predictions.orderBy(desc("AMENITY"))
    hotel_name = new_predictions.select('hotel_name').rdd.flatMap(lambda x: x).collect()
    hotel_rating = new_predictions.select('hotel_rating').rdd.flatMap(lambda x: x).collect()
    location = new_predictions.select('location').rdd.flatMap(lambda x: x).collect()
    price = new_predictions.select('price').rdd.flatMap(lambda x: x).collect()
    amenities = new_predictions.select('amenities').rdd.flatMap(lambda x: x).collect()

    res = [list()]

    print('\n')

    cnt = 0
    l = list()
    for i in range(1,150):
        if hotel_name[i] in l:
            continue
        cnt+=1
        print("HOTEL",cnt)
        print("HOTEL NAME : ",hotel_name[i])
        print("HOTEL RATING : ",hotel_rating[i])
        print("LOCATION : ",location[i])
        print("PRICE : ", price[i])
    
        print("AMENITIES PRESENT : ")
        for item in amenities[i]:
            cur = item
            while(True):
                if(cur[0]=='[' or cur[0]=='"'):
                    cur = cur[1:]
                else:
                    break
            while(True):
                n = len(cur)
                if(cur[n-1]=='[' or cur[n-1]=='"'):
                    cur = cur[:n-1]
                else:
                    break
            print(item,end=" ")
        if(cnt==numbers):
            print("\n \n Thank you !\n \n")
            return
        print('\n')
        print('\n')
        l.append(hotel_name[i])
        
    print("Sorry, we got only ", cnt ,"recommendations for you \nThank you ! \n" ) 


'''   *************************      Main CODE   *************************** '''

print('\n',"Spark Session Created",'\n')


some = input("Press Enter to continue")

hotel_df,amenity_df = readDataset(500)

Amenity = amenity_df.select('amenity').rdd.flatMap(lambda x: x).collect()

PredictFor = getInput(Amenity)

final_df = CreateFinalDataFrame(PredictFor,hotel_df,amenity_df)

results = training(final_df)

getRecc(results)

print('\n');





