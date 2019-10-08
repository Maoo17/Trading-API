const mongo = require("mongodb").MongoClient;

module.exports = {
    insertIntoCollection: async function (dsn, colName, doc) {
        const client = await mongo.connect(dsn, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = await client.db();
        const col = await db.collection(colName);

        await col.insertMany(doc);
        await client.close();
    },

    replaceAllInCollection: async function (dsn, colName, doc) {
        const client = await mongo.connect(dsn, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = await client.db();
        const col = await db.collection(colName);

        await col.deleteMany();
        await col.insertMany(doc);
        await client.close();
    },

    findInCollection: async function (dsn, colName, filter, projection, limit) {
        const client = await mongo.connect(dsn, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        const db = await client.db();
        const col = await db.collection(colName);
        const res = await col.find(filter, projection).limit(limit).toArray();

        await client.close();
        return res;
    },

    editOneInCollection: async function (dsn, colName, filter, update) {
        const client = await mongo.connect(dsn, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = await client.db();
        const col = await db.collection(colName);

        await col.updateOne(filter, { $set: update }, false);
        await client.close();
    },
};