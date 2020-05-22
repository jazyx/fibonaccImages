import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data'
import styled, { css } from 'styled-components'

import { Images
       , Index
       } from '/imports/api/collections';
import { setStart } from '../api/methods'


const phi   = (1 + Math.sqrt(5)) / 2
const thick = 100 / phi
const thin  = (100 - thick)



const StyledMain = styled.main`
  position: relative;
  border: 1px solid #fff;
  box-sizing: border-box;

  width: 100vw;
  height: ${thick}vw;

  @media (min-aspect-ratio: 1618/1000) {
    height: 100vh;
    width: ${phi * 100}vh;
  }

  @media (max-aspect-ratio: 1/1) {
    height: 100vh;
    width: ${thick}vh;
  }

  @media (max-aspect-ratio: 1000/1618) {
    width: 100vw;
    height: ${phi * 100}vw;
  }
`


const StyledFrame = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: ${props => props.left};
  top: ${props => props.top};

  width: ${props => props.width || "100%"};
  height: ${props => props.height || "50%"};
  background-image: url("${props => props.src}");
  background-position: ${props => props.place};
  background-size: contain;
  background-repeat: no-repeat;

  ${props => {
    if (props.lead) {
      return ""
    }
    switch (props.position) {
      case "top":
        return "border-bottom: 1px solid #fff"
      case "left":
        return "border-right: 1px solid #fff"
      case "right":
        return "border-left: 1px solid #fff"
      case "bottom":
        return "border-top: 1px solid #fff"
    }
  }}
`



const Frame = (props) => (   
  <StyledFrame
    className={"aspect-"+props.aspect + " " + "position-"+props.position}
    top={props.top}
    lead={props.lead}
    left={props.left}
    place={props.place}
    width={props.width}
    height={props.height}
    aspect={props.aspect}
    position={props.position}
    src={props.src}
  >   
    {props.children}
  </StyledFrame>
)



class App extends Component {
  constructor(props) {
    super(props)

    this.levels = 14

    this.resize = this.resize.bind(this)
    this.setStart = this.setStart.bind(this)

    window.addEventListener("resize", this.resize, false)
    this.state = { ...this.resize(), righthanded: true }
  }


  resize(event) {
    // ratio > 1 means landscape
    const { width, height } = document.body.getBoundingClientRect()
    const ratio = height
                ? width / height
                : 0
    const landscapeMode = ratio > 1

    if (event && this.state.landscapeMode !== landscapeMode) {
      this.setState({ landscapeMode })
    } else {
      return { landscapeMode }
    }
  }


  setStart(event) {
    const index = this.props.index
    let start = 0
    let element = event.target

    while(element = element.parentNode){
      if (element.tagName === "MAIN") {
        break
      }
      start += 1
    }

    if (!start) {
       start += (index.start + index.total - 1) % index.total
    } else {
      start += index.start % index.total
    }

    index.start = start
    setStart.call(index)
  }


  getImages() {
    const images = []

    const source = this.props.images
    const total  = source.length
    const start  = this.props.index.start
    let ii = this.levels

    for ( ii ; ii-- ; ) {
      const index = (start + ii) % total
      images.push(this.props.images[index])
    }

    return images
  }


  cycle(array) {
    const item = array.shift()
    array.push(item)
    return item
  }


  getLoc(aspect, position, lead) {
    let top
      , left

    if (aspect === "landscape") {
      switch (position) {
        case "top":
          top = "0;"
          left = "0;"
        break
        case "bottom":
          left = "0;"
          top = lead
              ? 0
              : thick +"%"
      }

    } else { // right-handed portrait
      switch (position) {
        case "right":
          top = "0;"
          left = lead
               ? 0
               : thick + "%"
        break
        case "left":
          left = "0;"
          top = "0;"
      }
    }

    return {
      top
    , left
    }
  }


  getFrames() {  
    const images = this.getImages()
    const last   = images.length - 1
    let aspects
      , positions
      , places
    if ( this.state.landscapeMode) { // landscape
      aspects   = ["portrait", "landscape"]
      if (this.state.righthanded) {
        positions = ["right", "bottom", "left", "top"]
        places    = ["bottom", "left", "top", "right"]
      } else {
        positions = ["left", "bottom", "right", "top"]
        places    = ["bottom", "right", "top", "left"]
      }
    } else {
      aspects = ["landscape", "portrait"]
      if (this.state.righthanded) {
        positions = ["bottom", "right", "top", "left"]
        places    = ["right", "top", "left", "bottom"]

      } else {
        positions = ["bottom", "left", "top", "right"]
        places    = ["left", "top", "right", "bottom"]
      }
    }

    let frame = ""

    images.forEach((imageData, index) => {
       const src      = imageData.url
       const aspect   = this.cycle(aspects)
       const position = this.cycle(positions)
       const place    = this.cycle(places)
       const lead = (index ===  last)

       const { top, left } = this.getLoc(aspect, position, lead)
       const width  = (aspect === "landscape")
                    ? "100%"
                    : ( lead )
                      ? "100%"
                      : thin + "%"
       const height = (aspect === "landscape")
                    ? ( lead )
                      ? "100%"
                      : thin + "%"
                    : "100%"
       frame = <Frame
         src={src}
         top={top}
         left={left}
         lead={lead}
         width={width}
         height={height}
         aspect={aspect}
         position={position}
         place={place}
       >
         {frame}
       </Frame>
    })

    return frame
  }


  getMain() {
    const frames = this.getFrames()
    const main = <StyledMain
      onMouseUp={this.setStart}
    >
      {frames}
    </StyledMain>

    return main
  }


  render() {
    if (!this.props.images.length) {
      return <p>Loading...</p>
    }

    const main = this.getMain()
    return main
  }
}


export default withTracker(() => {
  const images = Images.find().fetch()
  const index = Index.findOne() || {}

  console.log(index)

  return {
    images
  , index
  }
})(App)
