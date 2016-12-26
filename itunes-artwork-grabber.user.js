// ==UserScript==
// @name         iTunes Artwork Grabber by Tunghsiao Liu
// @namespace    https://sparanoid.com/work/itunes-artwork-grabber/
// @version      1.0.4
// @description  Yet another iTunes Artwork Grabber
// @author       Tunghsiao Liu
// @include      *://itunes.apple.com/*/*
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
//     iTunes U: https://itunes.apple.com/us/itunes-u/id593073857
//    Audiobook: https://itunes.apple.com/us/audiobook/id404237394

(function initiTunesArtworkGrabberTL() {

  // Try a large enough size for artwork due to there's no way to get the
  // actual largest size available through the web page.
  var artworkSize = '9000x9000';
  var artworkFormat = '.png';
  var artworkWrap = document.querySelectorAll('#left-stack div.lockup.product')[0];
  var artworkTarget = artworkWrap.querySelectorAll('div.artwork img.artwork')[0];

  function hasClass(el, cls) {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  // Always use jpg for non-app artwork
  if (!hasClass(artworkWrap, 'application')) {
    artworkFormat = '.jpg';
  }

  // https://regex101.com/r/mG3hX6/5
  var artworkUrl = artworkTarget.getAttribute('src-swap').replace(/(\/[a-zA-Z]+\/)(\d+(?:-\dx|x\d+)?([a-zA-Z]+))(\.[a-zA-Z]+)$/gim, "$1" + artworkSize + artworkFormat);

  // Init button
  var btnCss = '#get-app-artwork { \
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
  var head = document.head || document.getElementsByTagName('head')[0];
  var btnStyle = document.createElement('style');

  btnStyle.type = 'text/css';

  if (btnStyle.styleSheet){
    btnStyle.styleSheet.cssText = btnCss;
  } else {
    btnStyle.appendChild(document.createTextNode(btnCss));
  }

  head.appendChild(btnStyle);

  var artworkBtnInitTarget = document.querySelectorAll('div.lockup.product .action')[0] || document.querySelectorAll('.atv-only-get-or-buy-blurb')[0];
  var artworkBtnInitElement = document.createElement('div');
  artworkBtnInitElement.innerHTML = '<a id="get-app-artwork" href="' + artworkUrl + '" target="_blank">View artwork in new tab</a></div>';
  insertAfter(artworkBtnInitTarget, artworkBtnInitElement);

  // Margin fix for Mac App Store
  var macAppStoreBtn = document.querySelectorAll('.view-in-appstore span')[0];
  if (macAppStoreBtn) {
    macAppStoreBtn.style.height = '23px';
  }

}());
