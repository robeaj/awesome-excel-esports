(function () {
  var pages = Array.from(document.querySelectorAll('.page'));
  var links = Array.from(document.querySelectorAll('.sidebar a'));
  var groups = Array.from(document.querySelectorAll('details[data-group]'));
  var toc = document.getElementById('toc-list');
  var sidebar = document.getElementById('sidebar');
  var menuBtn = document.getElementById('menuBtn');

  var routes = {};
  pages.forEach(function (p) {
    var r = p.dataset.route || '/';
    routes[r] = p;
  });

  function parseRoute() {
    // hash route style for GitHub Pages project sites: #/section/subpage
    var h = location.hash || '#/';
    if (!h.startsWith('#/')) return '/';
    var r = h.slice(1);
    return r || '/';
  }

  function setActiveLink(route) {
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + route;
      a.classList.toggle('active', on);
      if (on) {
        var d = a.closest('details');
        if (d) d.open = true;
      }
    });
  }

  function buildToc(page) {
    toc.innerHTML = '';
    var h2s = page.querySelectorAll('h2');
    h2s.forEach(function (h, i) {
      if (!h.id) h.id = page.id + '-h' + i;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      toc.appendChild(li);
    });
  }

  function render() {
    var route = parseRoute();
    var page = routes[route] || routes['/'] || pages[0];

    pages.forEach(function (p) {
      p.classList.toggle('active', p === page);
    });

    setActiveLink(route);
    buildToc(page);
    window.scrollTo(0, 0);

    // close mobile nav after selecting a page
    if (window.matchMedia('(max-width: 760px)').matches) {
      sidebar.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleSidebar() {
    var open = sidebar.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', toggleSidebar);

  // Optional behavior: one top-level open at a time
  groups.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      groups.forEach(function (other) {
        if (other !== d) other.open = false;
      });
    });
  });

  window.addEventListener('hashchange', render);

  if (!location.hash) {
    location.hash = '#/';
  } else {
    render();
  }
})();
