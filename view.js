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
    let images = Array.from(d.querySelectorAll(".tgme_widget_message")).map(m=>Array.from(m.querySelectorAll(".tgme_widget_message_photo_wrap")).map(e=>({src:e.style.backgroundImage.match(/url\(['"](.+)['"]\)/)[1],id:m.dataset.post, caption: m.querySelector(".tgme_widget_message_text")?.innerText.trim()}))).flat();
    next = d.querySelector(".tme_messages_more").href;
    swiper.appendSlide(
      images.map(
        i => html`
          <div className="swiper-slide" data-id=${i.id}><img src=${i.src} />${i.caption?html`<div class="caption">${i.caption}</div>`:""}</div>
        `
      )
    );
    }catch(e){}
    loading=false;
  }
}
swiper.on("slideChange", load);
swiper.on("slideChange", ()=>history.replaceState(document.title,null,"#"+encodeURIComponent(swiper.slides[swiper.activeIndex].dataset.id)));
load();
