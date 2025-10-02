
(function(){
  const nativeSelects = document.querySelectorAll('.select select');
  nativeSelects.forEach(makeCustomSelect);

  function makeCustomSelect(select){
    const wrapper = select.parentElement; // .select
    wrapper.classList.add('custom-select');

    // Build button UI mirroring the selected option
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'custom-select__button';
    button.setAttribute('aria-haspopup','listbox');
    button.setAttribute('aria-expanded','false');
    button.innerHTML = `<span class="label">${select.options[select.selectedIndex]?.text || ''}</span><svg class="icon-16 chev"><use href="#icon-chevron"/></svg>`;

    // Build panel
    const panel = document.createElement('div');
    panel.className = 'custom-select__panel';
    panel.setAttribute('role','listbox');

    Array.from(select.options).forEach((opt, index)=>{
      const div = document.createElement('div');
      div.className = 'custom-select__option';
      div.setAttribute('role','option');
      div.textContent = opt.text;
      if(index === select.selectedIndex){ div.setAttribute('aria-selected','true'); }
      div.addEventListener('click', ()=>{
        select.selectedIndex = index;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        button.querySelector('.label').textContent = opt.text;
        closePanel();
      });
      panel.appendChild(div);
    });

    // Hide native select but keep it accessible for forms
    select.style.position = 'absolute';
    select.style.opacity = '0';
    select.style.pointerEvents = 'none';
    select.tabIndex = -1;

    // Insert UI
    wrapper.appendChild(button);
    wrapper.appendChild(panel);

    function openPanel(){
      wrapper.classList.add('open');
      button.setAttribute('aria-expanded','true');
    }
    function closePanel(){
      wrapper.classList.remove('open');
      button.setAttribute('aria-expanded','false');
    }

    button.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(wrapper.classList.contains('open')) closePanel(); else openPanel();
    });
    document.addEventListener('click', (e)=>{
      if(!wrapper.contains(e.target)) closePanel();
    });
  }
})();

// Chart.js: Activation Count vs Revenue
(function(){
  const el = document.getElementById('activationChart');
  if(!el || !window.Chart) return;

  const labels = ['Activation Count','Activation Revenue'];
  const dataCount = [8, 0];
  const dataRevenue = [0, 350616];

  const chart = new Chart(el, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Count', data: dataCount, xAxisID: 'x', backgroundColor: '#f3b755' },
        { label: 'Revenue', data: dataRevenue, xAxisID: 'x1', backgroundColor: '#2ec49c' }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true, title: { display: true, text: 'Count' } },
        x1: { beginAtZero: true, position: 'top', grid: { drawOnChartArea:false }, title: { display: true, text: 'Revenue (KSH)' } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()}` } }
      }
    }
  });

  // Draw value labels on bars
  Chart.register({
    id: 'valueLabels',
    afterDatasetsDraw(c){
      const {ctx} = c;
      const isHorizontal = c.config.options.indexAxis === 'y';
      c.data.datasets.forEach((ds, dsIndex)=>{
        c.getDatasetMeta(dsIndex).data.forEach((bar, i)=>{
          const value = ds.data[i];
          if(!value) return;
          ctx.save();
          ctx.fillStyle = '#223';
          ctx.font = '600 11px Inter, system-ui, sans-serif';
          if(isHorizontal){
            ctx.textAlign = 'left';
            ctx.fillText(Number(value).toLocaleString(), bar.x + 8, bar.y + 4);
          } else {
            ctx.textAlign = 'center';
            ctx.fillText(Number(value).toLocaleString(), bar.x, bar.y - 6);
          }
          ctx.restore();
        });
      });
    }
  });
})();


