const { MongoClient } = require("mongodb");
const MONGO_URL = "mongodb://localhost:27017";
const MONGODB = "airbnb";
const MONGO_COLLECTION = "listingsAndReviews";

const client = new MongoClient(MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});


const avgCleanliness = async (propertyType, client) => {

     return client
    .db(MONGODB)
    .collection(MONGO_COLLECTION)
    .aggregate([
        {
            $match: {
                property_type: propertyType,
            },
        },
        {
            $project: {
                country: "$address.country",
                cleanliness: "$review_scores.review_scores_cleanliness",
            },
        },

        {
            $group: {
                _id: "$country",
                avgClean: { $avg: "$cleanliness" }
            },
        },
        { $sort: { avgClean: -1 } },
    ])
    .toArray();

};



client.connect().then( async() => {
    const result = await avgCleanliness("Condominium", client)
    console.log(result)
});
// db.getCollection('listingsAndReviews').aggregate([
//     {
//         $match: {
//             property_type: "Condominium"
//             }
//         },
//         {
//             $project: {
//                 name:1,
            
//                 cleanliness: "$review_scores.review_scores_cleanliness"
//                 }
//             },
            
//             {    country: "$address.country",
//                $group: {
//                    _id: "$country",
//                    avgClean: {$avg: "$cleanliness"},
                 
//                    } 
//                 },
//                 {$sort: {avgClean: -1 }}
// ])


// db.getCollection("listingsAndReviews").aggregate([
// 	{
// 		$match: {
// 			property_type: "Hotel",
// 		},
// 	},
// 	{
// 		$project: {
// 			name: 1,
// 			cleanliness: "$review_scores.review_scores_cleanliness",
// 		},
// 	},

// 	{
// 		$group: {
// 			_id: "$name",
// 			avgClean: { $avg: "$cleanliness" },
// 		},
// 	},
// 	{ $sort: { avgClean: -1 } },
// ]);
