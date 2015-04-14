// ==UserScript==
// @name         iTunes Artwork Grabber by Tunghsiao Liu
// @namespace    https://github.com/sparanoid/itunes-artwork-grabber
// @version      1.0.1
// @description  Yet another iTunes Artwork Grabber
// @author       Tunghsiao Liu
// @include	     *://itunes.apple.com/*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

var artworkWrap = $("#left-stack div.lockup.product");
var artworkSize = "1024x1024";
var artworkTarget = artworkWrap.find("div.artwork img.artwork");
var forcePng = true;

if (artworkWrap.hasClass("music") || artworkWrap.hasClass("tv")) {
  artworkSize = "1200x1200";
} else if (artworkWrap.hasClass("mac-application")) {
  artworkSize = "512-2x";
}

if (!artworkWrap.hasClass("application")) {
  forcePng = false;
}

// https://regex101.com/r/mG3hX6/2
var artworkUrl = artworkTarget.attr("src").replace(/(\/[a-zA-Z]+)(\d+(-\dx|x\d+)?)(\.[a-zA-Z]+)$/gim, "$1" + artworkSize + (forcePng ? ".png" : "$4") );

// Init button
$("<div style='margin-bottom: 20px;'> \
  <a id='get-app-artwork' \
  style=' \
  cursor: pointer; \
  background: linear-gradient(to bottom, #53ABEA 0%, #2F7BCD 100%); \
  padding: 3px 11px; \
  border-radius: 100px; \
  color: #FFF; \
  text-shadow: 0 -1px 0 rgba(14, 99, 165, 0.5); \
  font-weight: bold; \
  border: 1px solid #1F5898; \
  border-top-color: #4082AC; \
  border-left-color: #306DA2; \
  border-right-color: #306DA2; \
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 0 1px 0 rgba(255, 255, 255, 0.15); \
  font-size: 11px; \
  text-decoration: none !important; \
'>View artwork in new tab</a></div>").insertAfter("div.lockup.product .action");

// Margin fix for Mac App Store
$(".view-in-appstore span").css("height", "23");

// Open artwork in new tab
$("body").on("click", "#get-app-artwork", function() {
  // prompt("Press command - C to copy:", artworkUrl);
  window.open(artworkUrl, "_blank");
});
