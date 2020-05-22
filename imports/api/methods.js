import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

import { Index } from './collections'



export const setStart = {
  name: 'vdvoyom.setStart'

, call(setStartData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [setStartData], options, callback)
  }

, validate(setStartData) {
    new SimpleSchema({
      _id:   { type: String}
    , start: { type: Number  }
    , total: { type: Number  }
    }).validate(setStartData)
  }

, run(setStartData) {
    const { _id, start } = setStartData
    const select = { _id }
    const set    = { $set: { start } }
    Index.update(select, set)

    // console.log(
    //   'db.index.update('
    // + JSON.stringify(select)
    // + ", "
    // + JSON.stringify(set)
    // + ")"
    // // , setIndexData
    // )
  }
}



// To register a new method with Meteor's DDP system, add it here
const methods = [
  setStart
]

methods.forEach(method => {
  Meteor.methods({
    [method.name]: function (args) {
      method.validate.call(this, args)
      return method.run.call(this, args)
    }
  })
})