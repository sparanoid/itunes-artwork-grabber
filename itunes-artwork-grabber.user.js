// ==UserScript==
// @name         Artwork Grabber by Tunghsiao Liu
// @namespace    https://sparanoid.com/work/itunes-artwork-grabber/
// @version      1.0.9
// @description  Yet another artwork grabber
// @author       Tunghsiao Liu
// @include      *://*.apple.com/*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

// Test URLs
//      iOS app: https://itunes.apple.com/us/app/id284882215
//    macOS app: https://itunes.apple.com/us/app/id824171161
// Apple TV app: https://itunes.apple.com/us/app/id902062673
//        Music: https://itunes.apple.com/gb/album/id965610909
//  Music Video: https://itunes.apple.com/us/music-video/id1169103502
//         Book: https://itunes.apple.com/us/book/id936502684
//        Movie: https://itunes.apple.com/us/movie/id929423754
//           TV: https://itunes.apple.com/us/tv-season/id849050573
//      Podcast: https://itunes.apple.com/us/podcast/id415535037
//     iTunes U: https://itunes.apple.com/us/course/id951932247
//    Audiobook: https://itunes.apple.com/us/audiobook/id1450427914

window.addEventListener('load', function() {

  // Try a large enough size for artwork due to there's no way to get the
  // actual largest size available through the web page.
  var isNewLayout = false;
  var artworkSize = '9000x9000';
  var artworkFormat = '.png';
  var artworkWrap = document.querySelectorAll('#left-stack div.lockup.product')[0];
  var artworkRegex = /(\/)(\d+(?:-\dx|x\d+)?([a-zA-Z]+))(\.[a-zA-Z]+)$/gim; // https://regex101.com/r/mG3hX6/6
  var artworkTarget;
  var artworkUrl;
  var btnCss;
  var artworkBtnInitTarget;
  var artworkBtnInitElement;

  var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback) {

      if (MutationObserver) {
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer) {
          if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
            callback();
        });
        // have the observer observe foo for changes in children
        obs.observe(obj, {childList:true, subtree:true});
      }
      else if(eventListenerSupported) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();

  function hasClass(el, cls) {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function insertStyle(style) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var btnStyle = document.createElement('style');

    btnStyle.type = 'text/css';

    if (btnStyle.styleSheet){
      btnStyle.styleSheet.cssText = style;
    } else {
      btnStyle.appendChild(document.createTextNode(style));
    }

    head.appendChild(btnStyle);
  }

  function removeLink() {
    var el = document.getElementById('get-app-artwork');
    el.parentNode.removeChild(el);
  }

  // Check if Apple uses new layout for current page
  if (typeof artworkWrap === 'undefined') {
    isNewLayout = true;
    artworkWrap =
      document.querySelectorAll('picture.product-artwork')[0] ||
      document.querySelectorAll('picture.we-video-thumbnail__artwork')[0] ||
      document.querySelectorAll('picture.product-hero__artwork')[0];
  }

  function initArtwork() {

    if (isNewLayout) {
      artworkTarget = artworkWrap.querySelectorAll('img')[0];
      artworkUrl = artworkTarget.getAttribute('src').replace(artworkRegex, "$1" + artworkSize + artworkFormat);

      btnCss = '';
      insertStyle(btnCss);

      artworkBtnInitElement.innerHTML = '<a id="get-app-artwork" class="link" href="' + artworkUrl + '" target="_blank">View artwork in new tab</a>';
    } else {
      artworkTarget = artworkWrap.querySelectorAll('div.artwork img.artwork')[0];

      // Always use jpg for non-app artwork
      if (!hasClass(artworkWrap, 'application')) {
        artworkFormat = '.jpg';
      }

      artworkUrl = artworkTarget.getAttribute('src-swap').replace(artworkRegex, "$1" + artworkSize + artworkFormat);

      // Init button
      btnCss = '#get-app-artwork { \
        display: inline-block; \
        cursor: pointer; \
        background: linear-gradient(to bottom, #53abea 0%, #2f7bcd 100%); \
        padding: 4px 11px; \
        margin-bottom: 20px; \
        border-radius: 100px; \
        color: #fff !important; \
        line-height: 1; \
        text-shadow: 0 -1px 0 rgba(14, 99, 165, 0.5); \
        font-weight: bold; \
        border: 1px solid #1f5898; \
        border-top-color: #4082ac; \
        border-left-color: #306da2; \
        border-right-color: #306da2; \
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 0 1px 0 rgba(255, 255, 255, 0.15); \
        font-size: 11px; \
        text-decoration: none !important; \
      }';

      insertStyle(btnCss);

      artworkBtnInitElement.innerHTML = '<a id="get-app-artwork" href="' + artworkUrl + '" target="_blank">View artwork in new tab</a>';
    }
  }

  function createDom() {

    if (isNewLayout) {
      artworkBtnInitTarget = document.querySelectorAll('.product-header__list > li:last-child')[0];
      artworkBtnInitElement = document.createElement('li');
    } else {
      artworkBtnInitTarget = document.querySelectorAll('div.lockup.product .action')[0] || document.querySelectorAll('.atv-only-get-or-buy-blurb')[0];
      artworkBtnInitElement = document.createElement('div');
    }

    insertAfter(artworkBtnInitTarget, artworkBtnInitElement);
  }

  createDom();
  initArtwork();

  if (isNewLayout) {
    observeDOM(artworkWrap ,function() {
      console.log('Artwork update!');
      initArtwork();
    });
  }
}, false);
