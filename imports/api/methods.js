import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'





/** Called by Activity.goActivity()
 */
export const setIndex = {
  name: 'vdvoyom.setIndex'

, call(setIndexData, callback) {
    const options = {
      returnStubValue: true
    , throwStubExceptions: true
    }

    Meteor.apply(this.name, [setIndexData], options, callback)
  }

, validate(setIndexData) {
    new SimpleSchema({
      _id:   { type: String}
    , start: { type: Number  }
    }).validate(setIndexData)
  }

, run(setIndexData) {
    const { _id, start } = setIndexData
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
  setIndex
]

methods.forEach(method => {
  Meteor.methods({
    [method.name]: function (args) {
      method.validate.call(this, args)
      return method.run.call(this, args)
    }
  })
})