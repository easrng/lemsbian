/* global htm Swiper */

const swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
    hideOnClick: true
  },
  runCallbacksOnInit: false,
  keyboard: {
    enabled: true,
    onlyInViewport: false
  }
});
function h(type, props, ...children) {
  let ele = Object.assign(document.createElement(type), props);
  ele.append(...children);
  return ele;
}
const html = htm.bind(h);
let next = "https://t.me/s/tilliegaystuff";
console.log("init");
let loading=false;
async function load() {
  if (swiper.activeIndex > swiper.slides.length - 3 && next && (!loading)) {
    loading=true;
    try{
    let index = swiper.activeIndex;
    let d = new DOMParser().parseFromString(
      await (await fetch(
        "https://lesmbian.easrng.workers.dev/" + new URL(next).search
      )).json(),
      "text/html"
    );
    let images = Array.from(
      d.querySelectorAll(".tgme_widget_message_photo_wrap")
    ).map(e => e.style.backgroundImage.match(/url\(['"](.+)['"]\)/)[1]);
    next = d.querySelector(".tme_messages_more").href;
    //next = json.next;
    swiper.appendSlide(
      images.map(
        i => html`
          <div className="swiper-slide"><img src=${i} /></div>
        `
      )
    );
    }catch(e){}
    loading=false;
  }
}
swiper.on("slideChange", load);
load();
