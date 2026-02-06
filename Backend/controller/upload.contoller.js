const { getUrl } = require("../config/s3");
exports.upload=async (req,res)=>{
    try{
            const region="ap-south-1"
            const bucket=process.env.BUCKET
            const key="uploads/"+req.body.fileName;
            console.log(region,bucket,key);
            const url=await getUrl(
                {
                    region,
                    bucket,
                    key
                }
            );
            console.log(url);
            res.json(url);
        }
        catch(e){
            console.log(e);
        }
}