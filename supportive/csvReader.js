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
        var onValidate = (data,next) =>{
            if(!data.customerId){
                console.error('customerId does not exist');
                this.cusNotExistCount++;
                next(null);
            }
            else if(!data.orderId){
                console.error('orderId does not exist');
                this.insertErrorCount++;
                next(null);
            }
            else{
                db.checkCustomerId(data.customerId,(result)=>{
                    if(result){
                        next(null,true)
                    }
                    else{
                        this.cusNotExistCount++;
                        console.error(`${data.customerId} does not exist`)
                        next(null);
                    }
                })
            }
            
        }


        var onData=(data)=>{
            var order = {
                orderId: data.orderId,
                customerId:data.customerId,
                item: data.item,
                quantity:data.quantity,
            }
            db.createOrder(order,error => {
                if(error){
                    this.insertErrorCount++;
                    console.error(error.errmsg);
                }
                else{
                    this.successCount++;
                }
        
            })
        }
        var onEnd=()=>{
            console.log('Finish read csv file after 2 seconds');
            if(callBack){
                setTimeout(()=>{callBack(this.successCount,this.insertErrorCount,this.cusNotExistCount)},2000)
                
            }

        }

        //start processing csv
        csv
            .fromStream(this.stream,{headers:true,ignoreEmpty:true})
            .validate(onValidate)
            .on("data", onData)
            .on("end", onEnd);
    }



}

module.exports.CsvReader=CsvReader;

