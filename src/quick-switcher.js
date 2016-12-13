if (typeof module === 'undefined') {
  module = {};
}

if (typeof module.exports === 'undefined') {
  module.exports = {};
}

if (typeof module.exports.jQuery === 'undefined') {
  module.exports.jQuery = jQuery;
}

(function(exports) {
  var QuickSwitcher = {
    init: function($parentDom, options) {
      this.$liCollection = null;
      this.valueObjects = null;
      this.selectedIndex = null;
      this.$results = null;
      this.$search = null;
      this.searchText = '';

      this.initDomElement($parentDom);
      this.options = options;

      this.renderList();
    },

    initDomElement: function($parentDom) {
      var qSwitcher = this;

      this.$domElement = $(
        '<div class="lstr-qswitcher-overlay">' +
        '<div class="lstr-qswitcher-container">' +
        '  <form class="lstr-qswitcher-popup">' +
        '    <span class="lstr-qswitcher-help">' +
        '      <ul>' +
        '        <li>↵ to navigate</li>' +
        '        <li>↵ to select</li>' +
        '        <li>↵ to clear</li>' +
        '        <li>↵ to dismiss</li>' +
        '      </ul>' +
        '    </span>' +
        '    <span class="lstr-qswitcher-category">' +
        '      People' +
        '    </span>' +
        '    <input type="text" class="lstr-qswitcher-search" />' +
        '    <div class="lstr-qswitcher-results">' +
        '    </div>' +
        '  </form>' +
        '</div>' +
        '</div>'
      );

      $parentDom.append(this.$domElement);

      this.$search = this.$domElement.find('.lstr-qswitcher-search');
      this.$results = this.$domElement.find('.lstr-qswitcher-results');

      this.$search.focus();

      $('.lstr-qswitcher-noscroll').on('keydown', function (event) {
        if (event.which === 38) { // up arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex - 1);
          qSwitcher.scrollToSelectedItem();
          event.preventDefault();
        } else if (event.which === 40) { // down arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex + 1);
          qSwitcher.scrollToSelectedItem();
          event.preventDefault();
        }
      });
      this.$search.on('keydown', function (event) {
        if (13 === event.keyCode) {
          var $li = $(this);
          qSwitcher.options.selectCallback(
            qSwitcher.valueObjects[qSwitcher.selectedIndex].value
          );

          event.preventDefault();
        }
      });
      this.$search.on('keyup', function (event) {
        var searchText = qSwitcher.$search.val();
        if (searchText !== qSwitcher.searchText) {
          qSwitcher.searchText = searchText;
          qSwitcher.renderList();
        }
      });
      this.$domElement.on('hover', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.selectIndex($li.data('lstr-qswitcher').index);
      });
      this.$domElement.on('click', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.options.selectCallback(
          qSwitcher.valueObjects[$li.data('lstr-qswitcher').index].value
        );
      });

      this.$domElement.find('.lstr-qswitcher-search').focus();
    },

    renderList: function() {
      var qSwitcher = this;
      var $results = this.$results;

      var items = this.options.searchCallback(this.searchText);

      if (items.length == 0) {
        $results.html('');
        return;
      }

      this.valueObjects = [];

      var $ul = $('<ul>');

      items.forEach(function(value, index) {
        var $li = $('<li>');
        $ul.append($li);
        $li.text(value);
        $li.data('lstr-qswitcher', {'index': index});

        qSwitcher.valueObjects[index] = {
          'index': index,
          'value': value,
          '$li': $li
        };
      });

      $results.html($ul);

      this.selectIndex(0);
    },

    selectIndex: function(selectedIndex) {
      if (this.selectedIndex !== null) {
        this.valueObjects[this.selectedIndex].$li.removeClass('lstr-qswitcher-result-selected');
      }

      this.selectedIndex = selectedIndex % this.valueObjects.length;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.valueObjects.length - 1;
      }

      this.valueObjects[this.selectedIndex].$li.addClass('lstr-qswitcher-result-selected');
    },

    scrollToSelectedItem: function() {
      var $li = this.valueObjects[this.selectedIndex].$li;
      var $results = this.$results;

      var topOfLi = $li.offset().top - $li.parent().offset().top;
      var bottomOfLi = topOfLi + $li.outerHeight(true);
      var scrollTop = $results.scrollTop();
      var scrollBottom = scrollTop + $results.outerHeight(true);

      if (bottomOfLi > scrollBottom || topOfLi < scrollTop) {
        $results.scrollTop(topOfLi);
      }
    }
  };

  exports.lstrQuickSwitcher = function(searchCallback, selectCallback) {
    var $parentDom = $('body');

    var options = {
      'searchCallback': searchCallback,
      'selectCallback': selectCallback
    };

    quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, options);
  };
}(module.exports));
