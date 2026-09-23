/* Visor compartido de demos (GymMachine, KonCafe y los que sigan).
   Uso:
     Visor.escalar(lienzo, dispositivo)          ajusta el dispositivo (dibujado a tamaño real) al espacio libre
     Visor.observar(lienzo, () => dispositivo)   lo reajusta cuando cambia el tamaño de la ventana
     var m = Visor.azulejos(contenedor, items, alElegir)
       items: [{ icono, titulo, desc, fila }]    icono = id de un <symbol id="i-…"> en la página
       m.marcar(i)                               marca el activo y desplaza SOLO la tira, nunca la página
   Los azulejos se construyen una sola vez; cambiar de pantalla solo mueve la marca. */
(function () {
  function escalar(lienzo, el) {
    if (!lienzo || !el) return;
    el.style.transform = 'none';
    var W = el.offsetWidth, H = el.offsetHeight;
    var k = Math.min(lienzo.clientWidth / W, lienzo.clientHeight / H, 1);
    el.style.transform = 'translate(' + (-W * k / 2) + 'px,' + (-H * k / 2) + 'px) scale(' + k + ')';
  }

  function observar(lienzo, obtener) {
    var ya = function () { escalar(lienzo, obtener()); };
    ya(); // al instante, sin esperar al primer aviso del observador
    new ResizeObserver(ya).observe(lienzo);
    window.addEventListener('load', ya); // las fuentes pueden mover el diseño
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function azulejos(cont, items, alElegir) {
    cont.innerHTML = items.map(function (x, j) {
      return '<button class="azulejo' + (x.fila ? ' azulejo--fila' : '') + '" type="button" data-i="' + j + '" title="' + esc(x.titulo + (x.desc ? ' · ' + x.desc : '')) + '">'
        + '<span class="ico"><svg aria-hidden="true"><use href="#i-' + x.icono + '"/></svg></span>'
        + '<span class="txt"><b>' + esc(x.titulo) + '</b>' + (x.fila && x.desc ? '<span class="d">' + esc(x.desc) + '</span>' : '') + '</span></button>';
    }).join('');
    cont.onclick = function (ev) { var b = ev.target.closest('.azulejo'); if (b) alElegir(+b.dataset.i); };
    var primera = true;
    return {
      marcar: function (i) {
        var act = null;
        for (var k = 0; k < cont.children.length; k++) {
          var on = k === i; cont.children[k].setAttribute('aria-current', String(on)); if (on) act = cont.children[k];
        }
        if (!act) return;
        if (cont.scrollWidth > cont.clientWidth) { // tira horizontal (celular)
          var x = act.offsetLeft - (cont.clientWidth - act.offsetWidth) / 2;
          if (primera) cont.scrollLeft = x; else cont.scrollTo({ left: x, behavior: 'smooth' });
        } else if (cont.scrollHeight > cont.clientHeight) { // cuadrícula con desborde vertical
          var t = act.offsetTop, b = t + act.offsetHeight;
          if (t < cont.scrollTop) cont.scrollTop = t; else if (b > cont.scrollTop + cont.clientHeight) cont.scrollTop = b - cont.clientHeight;
        }
        primera = false;
      },
    };
  }

  window.Visor = { escalar: escalar, observar: observar, azulejos: azulejos };
})();
