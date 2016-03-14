var app = app || {};
(function($) {
  app.taken = [];
  var Highlighter = (function() {
    var cache = {};
    return {
      cache: cache,
      get: function(id, options) {
        if(cache[id]) {
          return cache[id];
        } else {
          var fr = new HighlighterCls(id, options);
          cache[id] = fr;
          return fr;
        }
      },
      remove: function(id) {
        if(cache[id]) {
          delete cache[id];
        }
      }
    };
  })();

  var HighlighterCls = function(id, options) {
    this.borderWidth = 2;
    this.options = {
      borderWidth: 2,
      centerborderWidth: 0,
      type: 'frame',
      hole: false,
      allowEventsOnAllSides: false,
      className: '',
      cancelClick: false,
      cancelClickOnAllSides: false,
      zIndex: 999
    };
    this.overEl = null;
    this.frame = null;
    var zIndex = options.zIndex || this.options.zIndex;
    this.options.styles = {
      defaults: {
        position: 'absolute',
        display: 'none',
        height: '2px',
        width: this.options.borderWidth + 'px',
        zIndex: zIndex
      },
      sides: {
        backgroundColor: '#343739',
        opacity: '0.4'
      },
      center: {
        backgroundColor: '#fff',
        borderWidth: this.options.centerborderWidth + 'px',
        borderColor: '#000',
        borderStyle: 'solid',
        opacity: '0.2',
        "box-sizing": "border-box"
      }
    }
    this.id = id;
    this.init(id, options);
  };

  $.extend(HighlighterCls.prototype, {
    init: function(id, options) {
      var options = options || {};
      $.extend(true, this.options, options);
      this.createNew(id);
      return this;
    },
    createNew: function(id) {
      var self = this;
      this.frame = {};
      var className = this.options.className;
      if($.trim(className).length) {
        className = ' ' + className;
      }
      this.frame.left = $('<div class="app_frame app_frame_side' + className + '"></div>').appendTo($('body'));
      this.frame.right = $('<div class="app_frame app_frame_side' + className + '"></div>').appendTo($('body'));
      this.frame.top = $('<div class="app_frame app_frame_side' + className + '"></div>').appendTo($('body'));
      this.frame.bottom = $('<div class="app_frame app_frame_side' + className + '"></div>').appendTo($('body'));
      this.frame.center = $('<div class="app_frame app_frame_center' + className + '"></div>').appendTo($('body'));
      $.each(this.frame, function(key, value) {
        var sideStyles = $.extend(self.options.styles.defaults, self.options.styles.sides);
        value.css(sideStyles);
        if(key == 'center') {
          var centerStyles = $.extend(self.options.styles.defaults, self.options.styles.center);
          value.css(centerStyles);
        }
      });
      return this;
    },
    onCancelClick: function(options) {
      var self = this;
      this.offCancelClick();
      $(document).on("mousedown.highlight", function(evt) {
        if(options.cancelClick) {
          self.frame.center.css("pointer-events", "none");
        }
        if(options.cancelClickOnAllSides == true) {
          self.frame.left.css("pointer-events", "none");
          self.frame.top.css("pointer-events", "none");
          self.frame.right.css("pointer-events", "none");
          self.frame.bottom.css("pointer-events", "none");
        }
      });
      $(document).on("mouseup.highlight", function(evt) {
        if(options.cancelClick) {
          self.frame.center.css("pointer-events", "none");
        }
        if(options.cancelClickOnAllSides == true) {
          self.frame.left.css("pointer-events", "none");
          self.frame.top.css("pointer-events", "none");
          self.frame.right.css("pointer-events", "none");
          self.frame.bottom.css("pointer-events", "none");
        }
      });
    },
    offCancelClick: function() {
      $(document).off("mousedown.highlight");
      $(document).off("mouseup.highlight");
    },
    highlight: function(overEl, runtime_options) {
      runtime_options = runtime_options || {};
      runtime_options = $.extend(true, {}, this.options, runtime_options);
      var v_offset = null;
      var ownerIframe = null;
      if(typeof overEl === 'undefined') {
        overEl = this.overEl;
        v_offset = this.v_offset;
        ownerIframe = this.ownerIframe || null;
      } else {
        if(typeof overEl.get == 'undefined') {
          this.overEl = overEl;
          this.v_offset = null;
          this.ownerIframe = null;
        } else {
          this.overEl = overEl.get(0);
          v_offset = overEl.data("v_offset") || null;
          this.v_offset = v_offset;
          ownerIframe = overEl.data("ownerIframe") || null;
          this.ownerIframe = ownerIframe;
        }
      }
      if(this.overEl == null) {
        return;
      }

      var self = this;
      if(runtime_options.type == 'frame') {
        this.setFrameElements(overEl);
      } else if(runtime_options.type == 'shine') {
        this.setShineElements(overEl);
      }

      $.each(this.frame, function(key, value) {
        if(runtime_options.bgcolor) {
          value.css("backgroundColor", runtime_options.bgcolor);
        } else {
          if(key == "center") {
            // do something eventually
          } else {
            value.css("backgroundColor", self.options.styles.sides.backgroundColor || (self.options.styles.defaults.backgroundColor || ''));
          }
        }

        value.show();
        value.css({ 'pointer-events': 'none' });
        if(runtime_options.allowEventsOnAllSides == true || (key == 'center' && runtime_options.hole == true)) {
          value.css({ 'pointer-events': 'none' });
        }
      });
      if(runtime_options.hole == true || (runtime_options.allowEventsOnAllSides == true)) {
        this.onCancelClick(runtime_options);
      }
      return this;
    },

    setShineElements: function(overEl) {

      var ownerIframeDoc = this.ownerIframe ? this.ownerIframe.contentDocument : null;
      var element = $(overEl, ownerIframeDoc);

      if(!$.isEmptyObject(element)) {
        var offset = element.offset();
        var dimensions = { height: element.outerHeight(), width: element.outerWidth() };

        if(ownerIframeDoc) {
          var iframeOffset = $(this.ownerIframe).offset();
          offset.top += iframeOffset.top;
          offset.left += iframeOffset.left;
        }

        if(this.v_offset) {
          offset = { left: this.v_offset.left, top: this.v_offset.top };
          dimensions = { height: this.v_offset.height, width: this.v_offset.width };
        }

        var viewportWidth = $(document).width() - 5;
        var viewportHeight = $(document).height() - 5;

        this.frame.left.css("left", "0px");
        this.frame.left.css("width", offset.left);
        this.frame.left.add(this.frame.right).css("top", offset.top);
        this.frame.left.add(this.frame.right).css("height", dimensions.height);
        this.frame.right.css("left", offset.left + dimensions.width);
        this.frame.right.css("width", viewportWidth - (offset.left + dimensions.width));
        this.frame.top.css("top", "0px");
        this.frame.top.css("height", offset.top);
        this.frame.top.add(this.frame.bottom).css("left", "0px");
        this.frame.top.add(this.frame.bottom).css("width", viewportWidth);
        this.frame.bottom.css("top", dimensions.height + offset.top);
        this.frame.bottom.css("height", viewportHeight - (offset.top + dimensions.height));
        this.frame.center.css({
          left: offset.left - this.options.centerborderWidth,
          top: offset.top - this.options.centerborderWidth,
          width: dimensions.width + this.options.centerborderWidth * 2,
          height: dimensions.height + this.options.centerborderWidth * 2
        });
      }

      return this;

    },

    setFrameElements: function(overEl) {
      var ownerIframeDoc = this.ownerIframe ? this.ownerIframe.contentDocument : null;
      var element = $(overEl, ownerIframeDoc);

      if(!$.isEmptyObject(element)) {

        var offset = element.offset();
        if(ownerIframeDoc) {
          var iframeOffset = $(this.ownerIframe).offset();
          offset.top += iframeOffset.top;
          offset.left += iframeOffset.left;
        }
        var dimensions = { height: element.outerHeight(), width: element.outerWidth() };

        if(this.v_offset) {
          offset = { left: this.v_offset.left, top: this.v_offset.top };
          dimensions = { height: this.v_offset.height, width: this.v_offset.width };
        }

        var viewportWidth = $(document).width();
        var viewportHeight = $(document).height();

        this.frame.left.css("left", offset.left - this.options.borderWidth);
        this.frame.left.add(this.frame.right).css("top", offset.top);
        this.frame.left.add(this.frame.right).css("height", dimensions.height);
        this.frame.right.css("left", offset.left + dimensions.width);
        this.frame.top.css("top", offset.top - this.options.borderWidth);
        this.frame.top.add(this.frame.bottom).css("left", offset.left - this.options.borderWidth);
        this.frame.top.add(this.frame.bottom).css("width", dimensions.width + 2 * this.options.borderWidth);
        this.frame.bottom.css("top", dimensions.height + offset.top);

        this.frame.center.css({
          left: offset.left,
          top: offset.top,
          width: dimensions.width,
          height: dimensions.height
        });
      }

      return this;
    },

    hide: function() {
      $.each(this.frame, function(key, value) {
        value.css({ display: 'none' });
      });
      this.offCancelClick();
      return this;
    },
    destroy: function() {
      $.each(this.frame, function(key, value) {
        value.remove();
      });
      var id = this.id;
      setTimeout(function() { _dm.Highlighter.remove(id) }, 10);
    }
  });
  app.Highlighter = Highlighter;
  var domSelector = {
    ignoreClasses: function(className) {
      var ignores = ["ui-sortable", "ui-droppable", "has-error"];
      return(ignores.indexOf(className) >= 0);
    },
    escapeJquerySpecials: function(str) {
      str = str.replace(/([\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\\\]\^\`\{\|\}\~])/g, "\\$1");
      return str;
    },
    getSelector: function(el) {
      if(el.length != 1) {
        throw 'Requires one element.';
      }
      var path, node = el;
      while(node.length) {
        var realNode = node[0],
          name = realNode.localName;
        if(!name || name.toLowerCase() == 'html') {
          break;
        }
        node_id = $(realNode).attr("id");
        name = name.toLowerCase();
        if(node_id) {
          var id_selector = name + '#' + this.escapeJquerySpecials(node_id) + (path ? '>' + path : '');
          var matches = $(id_selector);
          if(matches.length > 1) {} else {
            return id_selector;
          }
        } else if(realNode.className) {
          var classes = realNode.className.split(/\s+/);
          for(var cindex in classes) {
            if($.trim(classes[cindex]).length && !this.ignoreClasses(classes[cindex]) && $(name + "." + this.escapeJquerySpecials(classes[cindex])).length == 1) {
              var classSelector = name + "." + this.escapeJquerySpecials(classes[cindex]) + (path ? '>' + path : '');
              var matches = $(classSelector);
              if(matches.length > 1) {} else {
                return classSelector;
              }
            }
          }
        }
        var parent = node.parent();
        if(parent.length) {
          var sameTagSiblings = parent.children(name);
          if(sameTagSiblings.length > 1) {
            allSiblings = parent.children();
            var index = allSiblings.index(realNode) + 1;
            if(allSiblings.length > 1) {
              name += ':nth-child(' + index + ')';
            }
          }
          path = name + (path ? '>' + path : '');
          var parentName = parent[0].localName;
          if(parentName.toLowerCase() == 'html') {
            parent = []; //return if html node found
          }
        }
        node = parent;
      }
      return path;
    },
    getUniqueSelector: function(el) {
      el = $(el);
      var selector = this.getSelector(el);
      // var matched = $(selector);
      // if(matched.length > 1) {
      // } else {
      //   if(matched[0] != el[0]) {
      //   }
      // }
      return selector;
    },
    getLastZindex: function() {
      var maxZ = Math.max.apply(null, $.map($('body > *'), function(e, n) {
        if($(e).css('position') == 'absolute')
          return parseInt($(e).css('z-index')) || 1;
      }));
      return maxZ;
    }
  };
  app.domSelector = domSelector;
  app.isStarted = false;
  app.elementSelected = false;
  app.selectedElem = null;

  app.__HtmlTagType = {
    a: "Link",
    abbr: "Abbreviation",
    area: "Image Map Area",
    b: "Bold Text",
    big: "Big Text",
    blockquote: "Block Quote",
    br: "Line Break",
    cite: "Citation",
    col: "Column",
    colgroup: "Column Group",
    dd: "Definition List Definition",
    del: "Deleted Text",
    dfn: "Definition",
    dir: "Directory List",
    div: "Division",
    dl: "Definition List",
    dt: "Definition List Item",
    em: "Emphasized Text",
    embed: "Embedded Object",
    eventsource: "Event Source",
    figcaption: "Figure Caption",
    h1: "Headline",
    h2: "Headline",
    h3: "Headline",
    h4: "Headline",
    h5: "Headline",
    h6: "Headline",
    hgroup: "Section Header",
    hr: "Horizonal Rule",
    i: "Italic Text",
    iframe: "iFrame",
    img: "Image",
    input: "Input Field",
    ins: "Inserted Text",
    kbd: "Keyboard Text",
    li: "List Item",
    map: "Image Map",
    mark: "Marked Text",
    menu: "Menu List",
    nav: "Navigation Section",
    object: "Embedded Object",
    ol: "Ordered List",
    optgroup: "Option Group",
    option: "Selection Option",
    p: "Paragraph",
    param: "Embedded Object Parameter",
    pre: "Preformatted Text",
    q: "Quotation",
    samp: "Sample Output",
    select: "Selection List",
    small: "Small Text",
    strong: "Strong Text",
    sub: "Subscript Text",
    sup: "Superscript Text",
    tbody: "Table Body",
    td: "Table Data",
    textarea: "Text Field",
    tfoot: "Table Footer",
    th: "Table Header",
    thead: "Table Header",
    tr: "Table Row",
    tt: "Typewriter Text",
    u: "Underlined Text",
    ul: "Unordered List",
    "var": "Variable"
  };

  app.getLastZindex = function() {
    var maxZ = Math.max.apply(null, $.map($('*'), function(e, n) {
      return parseInt($(e).css('z-index')) || 1;
    }));
    return maxZ;
  };

  app.getTargetParents = function(target) {
    var parentsInfo = [];
    var parents = $(target).parents();
    for(var i = 0; i < parents.length; i++) {
      var el = parents.eq(i);
      var id = el.attr("id");
      var selector = app.domSelector.getUniqueSelector(el);
      var tagName = el.get(0).tagName;
      parentsInfo.push([selector, tagName, id]);
    }
    return parentsInfo;
  };

  app.showPickedSelector = function(target, selector) {
    selector = selector || app.domSelector.getUniqueSelector(target);
    this.elementSelected = true;
    this.selectedElem = {};
    this.selectedElem.selector = selector;
    this.selectedElem.el = target;
    this.mine_highlighter.hide();
    this.show_selected_highlighter.highlight(target);
    // this.showTooltip(selector, target);
    this.selector = selector;
  };
  app.hideTooltip = function(target) {
    $(".__root_tooltip_content").off("mousemove.parents");
    $(".__root_tooltip_content").off("click.parents");
    $(".ct-wrapper").each(function() {
      $(this).remove();
    });
  }
  app.getFriendlyTagName = function(tagName, id) {
    tagName = tagName.toLowerCase();
    var tagType = this.__HtmlTagType[tagName];
    tagType || (tagType = tagName.charAt(0).toUpperCase() + tagName.slice(1));
    return id ? tagType + " " + id : tagType + " &lt;" + tagName + "&gt;";
  };

  app.getParentsListHtml = function(target) {
    var parents = this.getTargetParents(target);
    var parentsList = [];
    for(var len = Math.min(parents.length, 10), i = 0; i < len; i++) {
      var tagName = parents[i][1];
      var id = parents[i][2];
      var selector = parents[i][0] || '';
      var li = "<li ";
      var anchor = "";
      if("HTML" === tagName || "BODY" === tagName) {
        li += " class='disabled'";
        anchor = "<span select-container='" + selector + "' tabindex='-1'>" + app.getFriendlyTagName(tagName, id) + '</span>';
      } else {
        anchor = "<a select-container='" + selector + "' href='#' tabindex='-1'>" + app.getFriendlyTagName(tagName, id) + '</a>';
      }
      li += ">" + anchor + "</li>";
      parentsList.push(li);
    }
    return "<ul class='__parents_list'>" + parentsList.join("") + "</ul>";
  };

  app.handleParentMouseMove = function(evt) {
    var el = $(evt.target).closest("a[select-container]");
    if(el.length && $(evt.target).closest("li.disabled").length == 0) {
      var selector = el.attr("select-container");
      if(selector) {
        this.show_selected_highlighter.highlight($(selector));
      } else {
        this.show_selected_highlighter.highlight($(this.selectedElem.selector));
      }
    } else {
      this.show_selected_highlighter.highlight($(this.selectedElem.selector));
    }
  };
  app.handleParentClick = function(evt) {
    evt.preventDefault();
    var el = $(evt.target).closest("a[select-container]");
    if(el.length && $(evt.target).closest("li.disabled").length == 0) {
      var selector = el.attr("select-container");
      if(selector) {
        app.hideTooltip();
        app.showPickedSelector($(selector), selector);
      }
    }
  };

  // app.showTooltip = function(selector, target) {
  //   var playerzIndex = this.domHigherIndex + 4;
  //   var position = 'most';
  //   var tooltip_content = "<div class='__root_tooltip_content'>";
  //   tooltip_content += "Selected Element Selector:<br/><div style='font-weight:bold;font-size:16px;border:1px solid #999;padding:5px;'>" + selector + "</div>";
  //   var parentsList = this.getParentsListHtml(target);
  //   tooltip_content += parentsList;
  //   tooltip_content += "</div>";
  //   $(target).ct(tooltip_content, {
  //     trigger: 'none',
  //     offsetParent: 'body',
  //     clickAnywhereToClose: false,
  //     wrapperzIndex: playerzIndex,
  //     fill: '#FFF',
  //     shrinkToFit: true,
  //     cornerRadius: 10,
  //     strokeWidth: 0,
  //     shadow: true,
  //     shadowOffsetX: 0,
  //     shadowOffsetY: 0,
  //     shadowBlur: 8,
  //     shadowColor: 'rgba(0,0,0,.9)',
  //     shadowOverlap: false,
  //     noShadowOpts: { strokeStyle: '#999', strokeWidth: 2 },
  //     positions: position
  //   });
  //   $(target).ctOn();
  //   $(".__root_tooltip_content").on("mousemove.parents", this.handleParentMouseMove.bind(this));
  //   $(".__root_tooltip_content").on("click.parents", this.handleParentClick.bind(this));
  // };

  app.stopApp = function() {
    this.isStarted = false;
    this.hideTooltip();
    this.mine_highlighter.hide();
    this.show_selected_highlighter.hide();
    this.elementSelected = false;
    this.selectedElem = null;
    $(document).off("keydown.main");
    $(document).off("mousemove.main");
    $(document).off("mouseup.main");
  };
  app.startApp = function() {
    if(this.isStarted) {
      app.stopApp();
      return false;
    }
    this.isStarted = true;
    var self = this;
    this.domHigherIndex = app.getLastZindex();
    var highlightZindex = this.domHigherIndex + 2;
    this.mine_highlighter = app.Highlighter.get('mine_highlighter', {
      type: 'frame',
      className: 'mouse_over_highlighter',
      zIndex: highlightZindex,
      styles: {
        sides: {
          backgroundColor: 'blue',
          opacity: 0.7
        },
        center: {
          backgroundColor: 'blue',
          opacity: 0.4,
          'pointer-events': 'none'
        }
      }
    });
    this.show_selected_highlighter = app.Highlighter.get('show_selected_highlighter', {
      type: 'shine',
      hole: false,
      centerxborderWidth: 0,
      className: 'show_selected_highlighter',
      zIndex: highlightZindex,
      styles: {
        sides: {
          backgroundColor: '#000',
          opacity: 0.7
        },
        center: {
          xborderWidth: '0px',
          backgroundColor: '#000',
          opacity: 0.1
        }
      }
    });

    $(document).bind("keydown.main", "shift+s", function(evt) {
      if(self.elementSelected == false) {
        evt.preventDefault();
        var target = $(self.mine_highlighter.overEl);
        self.showPickedSelector(target);
      };
    });

    $(document).on("mousemove.main", function(evt) {
      if(self.elementSelected == false) {
        var target = $(evt.target);
        var highlight_el = target;
        var highlight_options = {};
        if(evt.shiftKey) {
          highlight_options = {
            bgcolor: "green",
            hole: true,
            allowEventsOnAllSides: true,
            cancelClick: true,
            cancelClickOnAllSides: true
          };
          if(self.mine_highlighter.overEl == target.get(0)) {
            self.mine_highlighter.hide();
          }
        } else {
          self.mine_highlighter.hide();
          var target_el = document.elementFromPoint(evt.clientX, evt.clientY);
          self.mine_highlighter.highlight();
          if(highlight_el.get(0) != target_el) {
            highlight_el = target_el;
          }
        }
        self.mine_highlighter.highlight(highlight_el, highlight_options);
      }
    });

    $(document).on("mouseup.main", function(evt) {
      var target = $(evt.target);
      target.empty();
      app.taken.push(target.detach()[0].outerHTML);
      console.log(app.taken);
      $('#bottomBar').text(app.taken);

      // if($(evt.target).hasClass('show_selected_highlighter')) {
      //   self.elementSelected = false;
      //   self.selectedElem = null;
      //   self.mine_highlighter.highlight();
      //   self.show_selected_highlighter.hide();
      //   self.hideTooltip(self.show_selected_highlighter.overEl);
      //   return false;
      // } else {
      //   evt.preventDefault();
      //   if($(evt.target).hasClass('mouse_over_highlighter')) {
      //     var target = $(self.mine_highlighter.overEl);
      //     self.showPickedSelector(target);
      //   }
      // }
    });
  };
  app.startApp();
})(app_$);
