const express = require('express')
const app = express()
const router = express.Router()
const {makeQuery, pool, mongoClient} = require('./db_utils')

const MONGO_DB = "bgg2";
const MONGO_COLLECTION = "bgg-15m";

const SQL_GETGAME =
    "select gid, name, year, url, image from game where gid = ?";
    const getGameById = makeQuery(SQL_GETGAME, pool);   
    router.get("/game/:id", async (req, res) => {
        const gid = parseInt(req.params["id"])
        const p0 = await getGameById(gid);
        const p1 = await mongoClient
            .db(MONGO_DB)
            .collection(MONGO_COLLECTION)
            .aggregate([
                {$limit: 100},
                { $match: { ID: gid } },
    
                {
                    $group: {
                        _id: "$ID",
                        ratings: { $push: "$rating" },
                        reviewIds: { $push: "$_id" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        reviewIds: 1,
                        avgRating: { $avg: "$ratings" },
                    },
                },
            ]).toArray();
            
        const [sqlR, mongoR ] =await Promise.all([p0,p1])
        console.log(sqlR)
        console.log(mongoR)
    
        res.type("json");
        res.status(200)
        res.json({
            name: sqlR[0].name,
            year: sqlR[0].year,
            url: sqlR[0].url,
            image: sqlR[0].image,
            avgRating: mongoR[0].avgRating,
            reviewIds: mongoR[0].reviewIds
    
        })
    });
    

    module.exports = router