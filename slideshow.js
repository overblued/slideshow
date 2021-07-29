export default (className, intval = 3000) => {
  const slideshows = Array.from(document.querySelectorAll(className))
  return slideshows.map(slideshow => {

    const turn = (pageNum) => {
      if (pageNum == 0) { return }
      pageNum = pageNum || 1
      // addOrRemoveClassBeforeTurningPages
      slideshow.classList.remove("forward", "backward")
      slideshow.classList.add(pageNum < 0 ? "backward" : "forward")

      const inputs = Array.from(slideshow.querySelectorAll("input"))
      const index = inputs.reduce((p, c, i) => c.checked ? i + pageNum : p, 0) % inputs.length
      inputs[index >= 0 ? index : (index + inputs.length)].checked = true
    }

    const isHovering = () => {
      return slideshow.parentElement.querySelector(className + ":hover") === slideshow
    }

    let _intval = intval
    const setTime = t => { _intval = t }

    let _running
    const run = on => {
      if (on === false) {
        clearTimeout(_running)
        return
      }
      _running = setTimeout(run, _intval)
      if (isHovering()) { return }
      turn()
    }

    // click any child element with a data-number attribute will turn the page
    slideshow.addEventListener('click', e => turn(Number(e.target.dataset.number || 0)))

    
    // prepare for load
    slideshow.classList.add("loading")
    slideshow.querySelector("img").addEventListener("load", () => {
      slideshow.classList.remove("loading")
      turn()
      setTimeout(run, _intval)
    })

    // expose some methods
    return { turn, run, setTime }
  })
}
