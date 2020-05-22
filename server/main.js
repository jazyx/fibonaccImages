import { Meteor } from 'meteor/meteor';
import { Images
       , Index
       } from '/imports/api/collections';
import { images } from './images'
import '../imports/api/methods'




Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (Images.find().count() === 0) {
    images.forEach(url => Images.insert({ url }))
  }

  Index.insert({
    total: images.length
  , start: 0
  })
});
