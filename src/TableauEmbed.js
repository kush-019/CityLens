import React, { useEffect, useRef } from 'react';

export default function TableauEmbed() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const placeholder = document.createElement('div');
    placeholder.className = 'tableauPlaceholder';
    placeholder.id = 'viz1771762086764';
    placeholder.style.position = 'relative';
    placeholder.style.width = '100%';

    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.alt = 'CityLens Dashboard';
    img.src = 'https://public.tableau.com/static/images/ci/citylens_1/CityLensDashboard/1_rss.png';
    img.style.border = 'none';
    noscript.appendChild(img);
    placeholder.appendChild(noscript);

    const obj = document.createElement('object');
    obj.className = 'tableauViz';
    obj.style.display = 'none';

    const params = [
      ['host_url',             'https%3A%2F%2Fpublic.tableau.com%2F'],
      ['embed_code_version',   '3'],
      ['site_root',            ''],
      ['name',                 'citylens_1/CityLensDashboard'],
      ['tabs',                 'no'],
      ['toolbar',              'yes'],
      ['static_image',         'https://public.tableau.com/static/images/ci/citylens_1/CityLensDashboard/1.png'],
      ['animate_transition',   'yes'],
      ['display_static_image', 'yes'],
      ['display_spinner',      'yes'],
      ['display_overlay',      'yes'],
      ['display_count',        'yes'],
      ['language',             'en-GB'],
      ['filter',               'publish=yes'],
    ];

    params.forEach(([name, value]) => {
      const param = document.createElement('param');
      param.name = name;
      param.value = value;
      obj.appendChild(param);
    });

    placeholder.appendChild(obj);
    containerRef.current.appendChild(placeholder);

    const w = containerRef.current.offsetWidth;
    if (w > 800) {
      obj.style.width = '1366px';
      obj.style.height = '1327px';
    } else if (w > 500) {
      obj.style.width = '1366px';
      obj.style.height = '1327px';
    } else {
      obj.style.width = '100%';
      obj.style.height = '2627px';
    }

    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    script.type = 'text/javascript';
    obj.parentNode.insertBefore(script, obj);
  }, []);

  return (
    <div style={{ width: '100%', overflowX: 'auto', background: '#fff', borderRadius: '0 0 12px 12px' }}>
      <div ref={containerRef} />
    </div>
  );
}
