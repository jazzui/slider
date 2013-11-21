
var events = require('events')
  , event = require('event')
  , position = require('position')
  , query = require('query')
  , Tip = require('tip')
  , _ = require('lodash')

  , template = require('./template')

module.exports = Slider

function domify(txt) {
  var d = document.createElement('div')
  d.innerHTML = txt
  return d.firstChild
}

function Slider(initial, scale) {
  Tip.call(this, template)
  this.sliding = false
  this.initial = initial || 0
  this.value = initial || 0
  this.scale = scale || 1
  this.sliderContainer = query('.slider-container', this.el)
  this.sliderInner = query('.slider-inner', this.el)
  this.sliderHandle = query('.slider-handle', this.el)
  event.bind(this.sliderHandle, 'mousedown', this.slideDown.bind(this))
  this.winEvents.bind('mousemove', 'slideMove')
  this.winEvents.bind('mouseup', 'slideUp')
}

Slider.prototype = new Tip

_.extend(Slider.prototype, {
  set: function (value, silent) {
    this.value = this.initial = value
    if (!this.silent) this.emit('change', value)
  },
  slideMove: function (e) {
    if (!this.sliding) return
    e.preventDefault()
    e.stopPropagation()
    var pos = position(this.sliderContainer)
      , num = (e.pageX - pos.left - 15)
    this.sliderInner.style.marginLeft = num + 'px'
    this.value = this.initial + num*this.scale
    this.emit('change', this.value)
    return false
  },
  slideDown: function (e) {
    this.sliding = true
    this.value = this.initial
    e.preventDefault()
    e.stopPropagation()
    return false
  },
  slideUp: function (e) {
    if (!this.sliding) return
    this.sliding = false
    this.initial = this.value
    this.sliderInner.style.marginLeft = '0px'
    e.preventDefault()
    e.stopPropagation()
    return false
  }
})


  



