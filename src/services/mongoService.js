const { ObjectId } = require("mongodb");

// Retrieves a document by its ID.
async function findOneById(collection, id) {
  try {
    return await collection.findOne({ _id: new ObjectId(`${id}`) });
  } catch (err) {
    console.error('Error finding document by ID:', err);
    throw err;
  }
}

// Retrieves all documents.
async function findAll(collection) {
  try {
    return await collection.find().toArray();
  } catch (err) {
    console.error('Error finding all documents:', err);
    throw err;
  }
}

// Creates a new document.
async function createDocument(collection, document) {
  try {
    return await collection.insertOne(document);
  } catch (err) {
    console.error('Error creating document:', err);
    throw err;
  }
}

// Updates an existing document.
async function updateDocument(collection, id, update) {
  try {
    return await collection.findOneAndUpdate(
      { _id: new ObjectId(`${id}`) },
      { $set: update },
      { returnDocument: "after" }
    );
  } catch (err) {
    console.error('Error updating document:', err);
    throw err;
  }
}

// Deletes a document by its ID.
async function deleteDocument(collection, id) {
  try {
    return await collection.deleteOne({ _id: new ObjectId(`${id}`) });
  } catch (err) {
    console.error('Error deleting document:', err);
    throw err;
  }
}

module.exports = {
  findOneById,
  findAll,
  createDocument,
  updateDocument,
  deleteDocument
};
