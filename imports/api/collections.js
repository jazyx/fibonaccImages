import { Mongo } from 'meteor/mongo';

export const Images = new Mongo.Collection('images');
export const Index = new Mongo.Collection('index');


const collections = {
  Images
, Index
}


const publishQueries = {
  Images: {}
, Index: {}
}



if (Meteor.isServer) {
  for (name in collections) {
    const select = publishQueries[name]
    const collection = collections[name]

    name = collection._name // name.toLowerCase()

    // The publication method is run each time a client subscribes to
    // the named collection. The subscription may be made directly or
    // through the /imports/api/methods.js script

    Meteor.publish(name, function public(caller, ...more) {
      // We need to use the classic function () syntax so that we can
      // use this to access the Meteor connection and use this.user_id

      let items = collection.find(select) // (customSelect || select)

      if (typeof caller === "string") {
        console.log(
          "Publishing", collection._name, "for", caller, ...more
        )
        console.log(
          "Items 1 - 4 /"
        , collection.find(select).count()
        , collection.find(select, { limit: 4 }).fetch()
        )
      }

      return items
    })
  }
}



if (Meteor.isClient) {
  for (let collectionName in collections) {
    // this.unReady.push(collectionName)

    const collection = collections[collectionName]
    // We can send (multiple) argument(s) to the server publisher
    // for debugging purposes
    const callback = () => {} // this.ready(collectionName, "Share")
    const handle   = Meteor.subscribe(collection._name, callback)
    // this.subscriptions[collectionName] = handle
  }
}