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
swiper.on("navigationShow", ()=>swiper.$el.removeClass("ui-hidden"))
swiper.on("navigationHide", ()=>swiper.$el.addClass("ui-hidden"))
function h(type, props, ...children) {
  let ele = Object.assign(document.createElement(type), props);
  ele.append(...children);
  return ele;
}
const html = htm.bind(h);
let next = "https://t.me/s/tilliegaystuff", scrollTo;
try{
  let m=location.hash.match(/\#post-(\d+)-(\d)/);
  scrollTo={post:parseInt(m[1]), offset: parseInt(m[2]), id: decodeURIComponent(m.slice(1))};
  next="https://lesmbian.easrng.workers.dev/?before="+(scrollTo.post-(scrollTo.post%20)+20);
}catch(e){}
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
    let images = Array.from(d.querySelectorAll(".tgme_widget_message")).map(m=>Array.from(m.querySelectorAll(".tgme_widget_message_photo_wrap")).map((e, i)=>({src:e.style.backgroundImage.match(/url\(['"](.+)['"]\)/)[1],id:"post-"+m.dataset.post.split("/")[1]+"-"+i, caption: m.querySelector(".tgme_widget_message_text")?.innerText.trim()}))).flat();
    next = d.querySelector(".tme_messages_more").href;
    swiper.appendSlide(
      images.map(
        i => html`
          <div className=${"swiper-slide "+i.id}><img src=${i.src} />${i.caption?html`<div className="caption">${i.caption}</div>`:""}</div>
        `
      )
    );
    }catch(e){}
    loading=false;
    if(scrollTo) {
      swiper.slideTo(swiper.slides.indexOf(document.querySelector("."+scrollTo.id)))
      scrollTo=null;
    }
  }
}
swiper.on("slideChange", load);
swiper.on("slideChange", ()=>history.replaceState(document.title,null,"#"+encodeURIComponent(Array.from(swiper.slides[swiper.activeIndex].classList).filter(e=>e.startsWith("post-"))[0])));
load();
