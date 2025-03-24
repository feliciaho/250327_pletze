import { createApp } from "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js";

createApp({
  // data start
  nowBg: 1,
  asideNum: 0,
  mapIndex: 0,
  npcIndex: 0,
  // data end
  // methods start
  // --------------------------
  // back top
  backTop() {
    $("html, body").animate({ scrollTop: 0 }, 500);
  },
  // aside scroll
  asideScroll(num) {
    let scrollNum = $(`#s${num}`).offset().top - 80;
    $("html,body").animate({ scrollTop: scrollNum }, 500);
    this.asideNum = num;
  },
  // scroll
  scrollEvent() {
    let timer;
    const handleScroll = () => {
      // 並不會清除setTimeout id 但是setTimeout並不執行函式
      clearTimeout(timer);
      // 100ms內沒有新滾動式件才執行
      timer = setTimeout(() => {
        const scroll = $(window).scrollTop();
        const s1 = $("#s1").offset().top - 80;
        const s2 = $("#s2").offset().top - 80;
        const s3 = $("#s3").offset().top - 100;
        if (scroll >= s1 && scroll < s2) {
          this.asideNum = 1;
        } else if (scroll >= s2 && scroll < s3) {
          this.asideNum = 2;
        } else if (scroll >= s3) {
          this.asideNum = 3;
        }
        // 控制 aside 顯示/隱藏
        if (scroll < s1) {
          $(".aside").fadeOut();
        } else {
          $(".aside").fadeIn();
        }
      }, 100);
    };
    $(window).on("scroll", handleScroll);
  },
  // map switch
  mapSwitch(num) {
    this.mapIndex = num;
    const swiper1 = $("section#s2 .swiper-container")[0];
    swiper1.swiper.slideToLoop(num, 500);
  },
  // npc switch
  npcSwitch(num) {
    this.npcIndex = num;
    const swiper2 = $("section#s3 .swiper-container")[0];
    // Swiper 會在其容器元素上創建一個 swiper 屬性，這個屬性是一個 Swiper 實例。
    swiper2.swiper.slideToLoop(num, 500);
  },
  // fetch-----------------------
  // fetchNavList
  fetchNavList(data_url, append_id) {
    $.ajax({
      url: data_url,
      type: "GET",
      success: function (data) {
        if (data) {
          let append_html = "";

          data.forEach((el) => {
            let child_str = "";

            el.items.forEach((el_2) => {
              let target = el_2.new_tab ? "_blank" : "_self";
              child_str += `<li><a href="${el_2.url}" target="${target}">${el_2.title}</a></li>`;
            });

            append_html += `
              <li>
                <p class="title">${el.title}</p>
                <ul class="list">${child_str}</ul>
              </li>
            `;
          });
          $(append_id).append(append_html);
        }
      },
    });
  },
  fetchNavListLeft(data_url, append_id) {
    $.ajax({
      url: data_url,
      type: "GET",
      success: function (data) {
        if (data) {
          let append_html = "";

          data.forEach((el) => {
            const screenWidth = screen.width;
            if (screenWidth < 768) {
              el.id = el.id2;
            }
            append_html += `
              <a id="${el.id}" href="${el.url}" target="_blank"> 
                <div class="ver_box">
                  <div class="icon">
                    <img src="${el.img}" alt="">
                  </div>

                  <div class="txt">
                    <div class="sub_title">
                      <h5>${el.sub_title}</h5>
                    </div>
                    <div class="title">
                      <h5>${el.title}</h5>
                    </div>
                  </div>

                </div>
              </a>
            `;
          });
          $(append_id).append(append_html);
        }
      },
    });
  },
  // mounted
  // --------------------------
  mounted() {
    AOS.init();
    this.scrollEvent();
    // let domain = "https://landing.mangot5.com";
    // if (document.domain == '127.0.0.1') { // for dev
    //   domain = "http://127.0.0.1:8888/landing";
    //   $('#history_list').fadeIn();
    // } else { // for live
    //   const params = new Proxy(new URLSearchParams(window.location.search), {
    //     get: (searchParams, prop) => searchParams.get(prop),
    //   });

    //   // 內部使用版本紀錄
    //   if (params.showPage && params.showPage == 'true') {
    //     $('#history_list').fadeIn();

    //   } else {  // 自動跳轉
    //     // window.location.href = "https://landing.mangot5.com/lostark/index.html";
    //     // $('#history_list').html("");
    //     // $('#nav_version').html("");
    //   }
    // }
    // load setting
    const domain_url =
      document.domain == "127.0.0.1"
        ? "http://127.0.0.1:8888/landing"
        : "https://landing.mangot5.com";

    // // load footer
    const nav_version_left_url = `${domain_url}/template/lostark/event/nav/json/nav_version_left.json`;
    this.fetchNavListLeft(nav_version_left_url, "#nav_version_left");

    // load footer
    $.ajax({
      url: `${domain_url}/template/lostark/event/nav/footer.html`,
      type: "GET",
      success: function (data) {
        $("#ft").html(data);
      },
    });

    // nav Toggler
    $(".nav-left #ver_toggler").on("click", function () {
      $(".nav-left #ver_toggler").toggleClass("open");
      $(".nav-left").toggleClass("open");
      $(".nav-right").removeClass("open");
    });

    // aside scroll active

    //*----- Youtube iframe api setting -----*//
    let player;
    function onYouTubeIframeAPIReady() {
      player = new YT.Player("videoPlayer", {
        height: "680",
        width: "1200",
        videoId: "Pmh3etmskJ8", // youtube video id
        events: {
          onReady: onPlayerReady,
        },
      });
    }

    // The API will call this function when the video player is ready.
    let playerReady = false;
    async function onPlayerReady(event) {
      playerReady = new Promise(function (resolve) {
        resolve(true);
      });
    }
    //*----- //Youtube iframe api setting -----*//

    // bootstrap modal open
    $("#videoModal").on("show.bs.modal", function () {
      if (!player) {
        onYouTubeIframeAPIReady();
      }

      if (playerReady) {
        player.playVideo();
      } else {
        setTimeout(() => {
          player.playVideo();
        }, 2000);
      }
    });

    // bootstrap modal close
    $("#videoModal").on("hide.bs.modal", function () {
      player.pauseVideo();
    });

    // open video modal
    $("#btn-video").on("click", function () {
      $("#videoModal").modal("show");
    });
    // initialize swiper for s2
    const swiper1 = new Swiper("section#s2 .swiper-container", {
      loop: true,
      navigation: {
        nextEl: "section#s2 .swiper-button-next",
        prevEl: "section#s2 .swiper-button-prev",
      },
      pagination: {
        el: "section#s2 .swiper-pagination",
        clickable: true,
      },
      on: {
        slideChange: (swiper) => {
          this.mapIndex = swiper.realIndex;
          const bullet = $("section#s2 .swiper-pagination-bullet");
          bullet.hide();
          const slideIndex = swiper.realIndex;
          if (slideIndex >= 0 && slideIndex < 3) {
            bullet.slice(0, 3).show();
          } else if (slideIndex >= 3 && slideIndex < 6) {
            bullet.slice(3, 6).show();
          }
        },
      },
    });
    // initialize swiper for s3
    const swiper2 = new Swiper("section#s3 .swiper-container", {
      loop: true,
      navigation: {
        nextEl: "section#s3 .swiper-button-next",
        prevEl: "section#s3 .swiper-button-prev",
      },
      on: {
        slideChange: (swiper) => {
          this.npcIndex = swiper.realIndex;
        },
      },
    });
  },
}).mount();
