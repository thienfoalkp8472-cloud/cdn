(function () {
  'use strict';
  try {
    // 多个部署了 vue-app 的域名
    const domains = [
        '8dsk.ccwu.cc'
    ];
    const MAX_RETRIES = 5;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) {
      showError('参数错误');
      return;
    }

    const usedIndexes = new Set();

    function showError(message) {
      const container = document.querySelector('.loader-container');
      const html = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">' + message + '</div>';
      if (container) container.innerHTML = html;
      else document.body.innerHTML = html;
    }

    function getRandomUnusedDomain() {
      const remaining = domains.map(function (_, i) { return i; }).filter(function (i) { return !usedIndexes.has(i); });
      if (remaining.length === 0) return null;
      const idx = remaining[Math.floor(Math.random() * remaining.length)];
      usedIndexes.add(idx);
      return domains[idx];
    }

    function buildUrl(domain) {
      return '//' + domain + '/?code=' + encodeURIComponent(code);
    }

    async function loadVueApp(maxRetries) {
      let attempt = 0;
      while (attempt < maxRetries) {
        const domain = getRandomUnusedDomain();
        if (!domain) {
          showError('加载失败，请刷新重试');
          return;
        }
        const url = buildUrl(domain);
        attempt++;
        try {
          const response = await fetch(url, { method: 'GET', cache: 'no-cache', headers: { 'Accept': 'text/html' } });
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const html = await response.text();
          document.open();
          document.write(html);
          document.close();
          return;
        } catch (error) {
          if (attempt >= maxRetries) {
            showError('加载失败，请刷新重试');
          }
        }
      }
    }

    loadVueApp(MAX_RETRIES);
  } catch (e) {
    document.body.innerHTML = '<div style="text-align:center;padding:50px;color:#f56c6c;font-size:14px;">系统错误</div>';
  }
})();
