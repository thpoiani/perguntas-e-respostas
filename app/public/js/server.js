(function(window, document, io, Chartist, undefined) {
  'use strict';

  var socket, data, chart, question;

  socket = io.connect(window.server);
  question = prompt("Ask a question");

  data = {
    labels: [],
    series: []
  };

  chart = Chartist.Pie('.ct-chart', data, {
    labelInterpolationFnc: function(value) {
      function sum (a, b) {
        return a + b;
      }

      var quantity = data.series[data.labels.indexOf(value)];
      var percent = Math.round(data.series[data.labels.indexOf(value)] / data.series.reduce(sum) * 100) + '%';

      return (value ? 'Yes' : 'No') + ' (' + quantity  + ' - ' + percent + ')';
    }
  });

  socket.emit('question', question);
  document.querySelector('h2').innerText = question;

  socket.on('on', function (response) {
    var label = data.labels.indexOf(response.value);

    if (label === -1) {
      data.labels.push(response.value);
      data.series.push(1);
    } else {
      ++data.series[label];
    }

    chart.update();
  });

  socket.on('off', function (response) {
    var label = data.labels.indexOf(response.value);

    if (label !== -1) {
      if (data.series[label] > 1) {
        --data.series[label];
      } else {
        data.labels.splice(label, 1);
        data.series.splice(label, 1);
      }

      chart.update();
    }
  });
})(window, document, window.io, window.Chartist);
