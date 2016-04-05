// ==UserScript==
// @name         iTunes Artwork Grabber by Tunghsiao Liu
// @namespace    https://sparanoid.com/work/itunes-artwork-grabber/
// @version      1.0.1
// @description  Yet another iTunes Artwork Grabber
// @author       Tunghsiao Liu
// @include      *://itunes.apple.com/*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

+function initiTunesArtworkGrabberTL() {

  var artworkWrap = document.querySelectorAll('#left-stack div.lockup.product')[0];
  var artworkSize = '1024x1024';
  var artworkTarget = artworkWrap.querySelectorAll('div.artwork img.artwork')[0];
  var forcePng = true;

  function hasClass(el, cls) {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  if (hasClass(artworkWrap, 'music') || hasClass(artworkWrap, 'tv')) {
    artworkSize = "1200x1200";
  } else if (hasClass(artworkWrap, 'mac-application')) {
    artworkSize = "512-2x";
  }

  if (!hasClass(artworkWrap, 'application')) {
    forcePng = false;
  }

  // https://regex101.com/r/mG3hX6/2
  var artworkUrl = artworkTarget.getAttribute('src-swap').replace(/(\/[a-zA-Z]+)(\d+(-\dx|x\d+)?)(\.[a-zA-Z]+)$/gim, "$1" + artworkSize + (forcePng ? ".png" : "$4"));

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

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  var artworkBtnInitTarget = document.querySelectorAll('div.lockup.product .action')[0];
  var artworkBtnInitElement = document.createElement('div');
  artworkBtnInitElement.innerHTML = '<a id=get-app-artwork>View artwork in new tab</a></div>';
  insertAfter(artworkBtnInitTarget, artworkBtnInitElement);

  // Margin fix for Mac App Store
  var macAppStoreBtn = document.querySelectorAll('.view-in-appstore span')[0];
  if (macAppStoreBtn) {
    macAppStoreBtn.style.height = '23px';
  }

  // Open artwork in new tab
  document.getElementById('get-app-artwork').addEventListener("click", function() {
    // prompt("Press command - C to copy:", artworkUrl);
    window.open(artworkUrl, "_blank");
  });

  alert(safari.extension.settings.forcePng);

}();
