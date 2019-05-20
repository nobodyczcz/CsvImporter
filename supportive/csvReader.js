var csv = require('fast-csv')
var request = require('request');


/**
 * This class open the target csv file as stream using request.
 * Then it process the csv stream, read data row by row and write data to mongodb connection 
 * 
 */
class CsvReader {
    /**
    * @param {string} url the url to the csv file
    */
    constructor(url){
        this.url = url;
        this.successCount=0;
        this.cusNotExistCount=0;
        this.insertErrorCount=0;
        this.collections = {}
    }

    /**
     * This function setup reading the url as stream
    * @param {function} callBack the callback function that will be called after create file stream successful
    */
    setUpReader(callBack){
        try {
            this.stream = request(this.url)// Open file as stream to handle large file
            .on('response', function(response) {
                if(response.statusCode==200){
                    callBack(true)
                }
                else{
                    callBack(false)
                }
            })
            .on('error', (error) => { 
                callBack(false,error)
            });
        }
        catch (error){
            callBack(false,error) //handle error if url is invalid
        }
    }

    /**
     * This function will start loading and process steamed csv file, and process the data,
    * @param {object} db the mangodb connection
    * @param {function} callBack callBack function after finish processing csv
    */
    processCsv(db,callBack=null){
        //define callback functions for fast-csv


        var onData=(data)=>{
            var order = {
                orderId: data.orderId,
                customerId:data.customerId,
                item: data.item,
                quantity:data.quantity,
            }
            if (!this.collections[data.customerId]){
                this.collections[data.customerId] = []
            }
            this.collections[data.customerId].push(order)

            if(this.collections[data.customerId].length>=100){
                var orders = this.collections[data.customerId]
                db.collectionInsert(
                    data.customerId,
                    orders,
                    this.insertCallBack.bind(this),
                    this.curIdErr.bind(this)
                    )
                    this.collections[data.customerId]=[]
            }
        }
        var onEnd=()=>{
            for (var id in this.collections){
                if (this.collections[id].length>0){
                    db.collectionInsert(
                        id,
                        this.collections[id],
                        this.insertCallBack.bind(this),
                        this.curIdErr.bind(this)
                        )
                }
            }
            if(callBack){
             setTimeout(()=>{callBack(this.successCount,this.insertErrorCount,this.cusNotExistCount)},200)
            }
            

        }

        //start processing csv
        csv
            .fromStream(this.stream,{headers:true,ignoreEmpty:true})
            .on("data", onData)
            .on("end", onEnd);
    }

    insertCallBack(err,id){
        if(err){
            this.insertErrorCount=this.insertErrorCount+this.collections[id].length
        }
        else{
            this.successCount=this.successCount+this.collections[id].length
        }

    }

    curIdErr(id){
        this.cusNotExistCount=this.cusNotExistCount+this.collections[id].length;
    }




}

module.exports.CsvReader=CsvReader;

