
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

function Slider(opts) {
  Tip.call(this, template)
  this.sliding = false
  opts = opts || {}
  this.initial = this.value = opts.value || 0
  if ('undefined' !== typeof opts.min &&
      'undefined' !== typeof opts.max && !opts.scale) {
    opts.scale = (opts.max - opts.min) / 200
  }
  opts.scale = opts.scale || 1
  this.opts = opts
  this.sliderContainer = query('.slider-container', this.el)
  this.sliderInner = query('.slider-inner', this.el)
  this.sliderHandle = query('.slider-handle', this.el)
  event.bind(this.sliderHandle, 'mousedown', this.slideDown.bind(this))
  this.winEvents.bind('mousemove', 'slideMove')
  this.winEvents.bind('mouseup', 'slideUp')
}

Slider.prototype = new Tip()

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
      , val = this.initial + num * this.opts.scale
    if ('undefined' !== typeof this.opts.min && this.opts.min > val) {
      val = this.opts.min
      num = (val - this.initial)/this.opts.scale
    }
    if ('undefined' !== typeof this.opts.max && this.opts.max < val) {
      val = this.opts.max
      num = (val - this.initial)/this.opts.scale
    }
    this.sliderInner.style.marginLeft = num + 'px'
    this.value = val
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


  



