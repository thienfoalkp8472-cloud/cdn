(function () {
  'use strict';
  try {
    var domains = ['8dsk.ccwu.cc'];
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');
    if (!code) {
      document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">参数错误</div>';
      return;
    }
    var idx = Math.floor(Math.random() * domains.length);
    var src = '//' + domains[idx] + '/?code=' + encodeURIComponent(code);
    document.open();
    document.write('<style>*{margin:0;padding:0}iframe{width:100%;height:100vh;border:none;display:block}</style><iframe src="' + src + '" allowfullscreen></iframe>');
    document.close();
  } catch (e) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">系统错误</div>';
  }
})();
