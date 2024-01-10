(function ($) {
  var $ = jQuery = $;

  var cc = {
    sections: [] };


  theme.cartNoteMonitor = {
    load: function load($notes) {
      $notes.on('change.themeCartNoteMonitor paste.themeCartNoteMonitor keyup.themeCartNoteMonitor', function () {
        theme.cartNoteMonitor.postUpdate($(this).val());
      });
    },

    unload: function unload($notes) {
      $notes.off('.themeCartNoteMonitor');
    },

    updateThrottleTimeoutId: -1,
    updateThrottleInterval: 500,

    postUpdate: function postUpdate(val) {
      clearTimeout(theme.cartNoteMonitor.updateThrottleTimeoutId);
      theme.cartNoteMonitor.updateThrottleTimeoutId = setTimeout(function () {
        $.post(theme.routes.cart_url + '/update.js', {
          note: val },
        function (data) {}, 'json');
      }, theme.cartNoteMonitor.updateThrottleInterval);
    } };

  theme.Shopify = {
    formatMoney: function formatMoney(t, r) {
      function e(t, r) {
        return void 0 === t ? r : t;
      }
      function a(t, r, a, o) {
        if (r = e(r, 2),
        a = e(a, ","),
        o = e(o, "."),
        isNaN(t) || null == t)
        return 0;
        t = (t / 100).toFixed(r);
        var n = t.split(".");
        return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) + (n[1] ? o + n[1] : "");
      }
      "string" == typeof t && (t = t.replace(".", ""));
      var o = "",
      n = /\{\{\s*(\w+)\s*\}\}/,
      i = r || this.money_format;
      switch (i.match(n)[1]) {
        case "amount":
          o = a(t, 2);
          break;
        case "amount_no_decimals":
          o = a(t, 0);
          break;
        case "amount_with_comma_separator":
          o = a(t, 2, ".", ",");
          break;
        case "amount_with_space_separator":
          o = a(t, 2, " ", ",");
          break;
        case "amount_with_period_and_space_separator":
          o = a(t, 2, " ", ".");
          break;
        case "amount_no_decimals_with_comma_separator":
          o = a(t, 0, ".", ",");
          break;
        case "amount_no_decimals_with_space_separator":
          o = a(t, 0, " ", "");
          break;
        case "amount_with_apostrophe_separator":
          o = a(t, 2, "'", ".");
          break;
        case "amount_with_decimal_separator":
          o = a(t, 2, ".", ".");}

      return i.replace(n, o);
    },
    formatImage: function formatImage(originalImageUrl, format) {
      return originalImageUrl ? originalImageUrl.replace(/^(.*)\.([^\.]*)$/g, '$1_' + format + '.$2') : '';
    },
    Image: {
      imageSize: function imageSize(t) {
        var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
        return null !== e ? e[1] : null;
      },
      getSizedImageUrl: function getSizedImageUrl(t, e) {
        if (null == e)
        return t;
        if ("master" == e)
        return this.removeProtocol(t);
        var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
        if (null != o) {
          var i = t.split(o[0]),
          r = o[0];
          return this.removeProtocol(i[0] + "_" + e + r);
        }
        return null;
      },
      removeProtocol: function removeProtocol(t) {
        return t.replace(/http(s)?:/, "");
      } } };


  theme.Disclosure = function () {
    var selectors = {
      disclosureList: '[data-disclosure-list]',
      disclosureToggle: '[data-disclosure-toggle]',
      disclosureInput: '[data-disclosure-input]',
      disclosureOptions: '[data-disclosure-option]' };


    var classes = {
      listVisible: 'disclosure-list--visible' };


    function Disclosure($disclosure) {
      this.$container = $disclosure;
      this.cache = {};
      this._cacheSelectors();
      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();
    }

    Disclosure.prototype = $.extend({}, Disclosure.prototype, {
      _cacheSelectors: function _cacheSelectors() {
        this.cache = {
          $disclosureList: this.$container.find(selectors.disclosureList),
          $disclosureToggle: this.$container.find(selectors.disclosureToggle),
          $disclosureInput: this.$container.find(selectors.disclosureInput),
          $disclosureOptions: this.$container.find(selectors.disclosureOptions) };

      },

      _connectToggle: function _connectToggle() {
        this.cache.$disclosureToggle.on(
        'click',
        function (evt) {
          var ariaExpanded =
          $(evt.currentTarget).attr('aria-expanded') === 'true';
          $(evt.currentTarget).attr('aria-expanded', !ariaExpanded);

          this.cache.$disclosureList.toggleClass(classes.listVisible);
        }.bind(this));

      },

      _connectOptions: function _connectOptions() {
        this.cache.$disclosureOptions.on(
        'click',
        function (evt) {
          evt.preventDefault();
          this._submitForm($(evt.currentTarget).data('value'));
        }.bind(this));

      },

      _onFocusOut: function _onFocusOut() {
        this.cache.$disclosureToggle.on(
        'focusout',
        function (evt) {
          var disclosureLostFocus =
          this.$container.has(evt.relatedTarget).length === 0;

          if (disclosureLostFocus) {
            this._hideList();
          }
        }.bind(this));


        this.cache.$disclosureList.on(
        'focusout',
        function (evt) {
          var childInFocus =
          $(evt.currentTarget).has(evt.relatedTarget).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(
          classes.listVisible);


          if (isVisible && !childInFocus) {
            this._hideList();
          }
        }.bind(this));


        this.$container.on(
        'keyup',
        function (evt) {
          if (evt.which !== 27) return; // escape
          this._hideList();
          this.cache.$disclosureToggle.focus();
        }.bind(this));


        this.bodyOnClick = function (evt) {
          var isOption = this.$container.has(evt.target).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(
          classes.listVisible);


          if (isVisible && !isOption) {
            this._hideList();
          }
        }.bind(this);

        $('body').on('click', this.bodyOnClick);
      },

      _submitForm: function _submitForm(value) {
        this.cache.$disclosureInput.val(value);
        this.$container.parents('form').submit();
      },

      _hideList: function _hideList() {
        this.cache.$disclosureList.removeClass(classes.listVisible);
        this.cache.$disclosureToggle.attr('aria-expanded', false);
      },

      unload: function unload() {
        $('body').off('click', this.bodyOnClick);
        this.cache.$disclosureOptions.off();
        this.cache.$disclosureToggle.off();
        this.cache.$disclosureList.off();
        this.$container.off();
      } });


    return Disclosure;
  }();
  (function () {
    function throttle(callback, threshold) {
      var debounceTimeoutId = -1;
      var tick = false;

      return function () {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(callback, threshold);

        if (!tick) {
          callback.call();
          tick = true;
          setTimeout(function () {
            tick = false;
          }, threshold);
        }
      };
    }

    var scrollEvent = document.createEvent('Event');
    scrollEvent.initEvent('throttled-scroll', true, true);

    window.addEventListener("scroll", throttle(function () {
      window.dispatchEvent(scrollEvent);
    }, 200));

  })();
  // Source: https://davidwalsh.name/javascript-debounce-function
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  theme.debounce = function (func) {var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 700;var immediate = arguments.length > 2 ? arguments[2] : undefined;
    var timeout;
    return function () {
      var context = this,args = arguments;
      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
  // requires: throttled-scroll, debouncedresize

  /*
    Define a section by creating a new function object and registering it with the section handler.
    The section handler manages:
      Instantiation for all sections on the current page
      Theme editor lifecycle events
      Deferred initialisation
      Event cleanup
  
    There are two ways to register a section.
    In a theme:
      theme.Sections.register('slideshow', theme.SlideshowSection);
      theme.Sections.register('header', theme.HeaderSection, { deferredLoad: false });
      theme.Sections.register('background-video', theme.VideoManager, { deferredLoadViewportExcess: 800 });
  
    As a component:
      cc.sections.push({ name: 'faq', section: theme.Faq });
  
    Assign any of these to receive Shopify section lifecycle events:
      this.onSectionLoad
      this.afterSectionLoadCallback
      this.onSectionSelect
      this.onSectionDeselect
      this.onBlockSelect
      this.onBlockDeselect
      this.onSectionUnload
      this.afterSectionUnloadCallback
      this.onSectionReorder
  
    If you add any events using the manager's registerEventListener,
    e.g. this.registerEventListener(element, 'click', this.functions.handleClick.bind(this)),
    these will be automatically cleaned up after onSectionUnload.
   */

  theme.Sections = new function () {
    var _ = this;

    _._instances = [];
    _._deferredSectionTargets = [];
    _._sections = [];
    _._deferredLoadViewportExcess = 300; // load defferred sections within this many px of viewport
    _._deferredWatcherRunning = false;

    _.init = function () {
      $(document).on('shopify:section:load', function (e) {
        // load a new section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
        if (target) {
          _.sectionLoad(target);
        }
      }).on('shopify:section:unload', function (e) {
        // unload existing section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
        if (target) {
          _.sectionUnload(target);
        }
      }).on('shopify:section:reorder', function (e) {
        // unload existing section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
        if (target) {
          _.sectionReorder(target);
        }
      });
      $(window).on('throttled-scroll.themeSectionDeferredLoader debouncedresize.themeSectionDeferredLoader', _._processDeferredSections);
      _._deferredWatcherRunning = true;
    };

    // register a type of section
    _.register = function (type, section, options) {
      _._sections.push({
        type: type,
        section: section,
        afterSectionLoadCallback: options ? options.afterLoad : null,
        afterSectionUnloadCallback: options ? options.afterUnload : null });


      // load now
      $('[data-section-type="' + type + '"]').each(function () {
        if (Shopify.designMode || options && options.deferredLoad === false || !_._deferredWatcherRunning) {
          _.sectionLoad(this);
        } else {
          _.sectionDeferredLoad(this, options);
        }
      });
    };

    // prepare a section to load later
    _.sectionDeferredLoad = function (target, options) {
      _._deferredSectionTargets.push({
        target: target,
        deferredLoadViewportExcess: options && options.deferredLoadViewportExcess ? options.deferredLoadViewportExcess : _._deferredLoadViewportExcess });

      _._processDeferredSections(true);
    };

    // load deferred sections if in/near viewport
    _._processDeferredSections = function (firstRunCheck) {
      if (_._deferredSectionTargets.length) {
        var viewportTop = $(window).scrollTop(),
        viewportBottom = viewportTop + $(window).height(),
        loopStart = firstRunCheck === true ? _._deferredSectionTargets.length - 1 : 0;
        for (var i = loopStart; i < _._deferredSectionTargets.length; i++) {
          var target = _._deferredSectionTargets[i].target,
          viewportExcess = _._deferredSectionTargets[i].deferredLoadViewportExcess,
          sectionTop = $(target).offset().top - viewportExcess,
          doLoad = sectionTop > viewportTop && sectionTop < viewportBottom;
          if (!doLoad) {
            var sectionBottom = sectionTop + $(target).outerHeight() + viewportExcess * 2;
            doLoad = sectionBottom > viewportTop && sectionBottom < viewportBottom;
          }
          if (doLoad || sectionTop < viewportTop && sectionBottom > viewportBottom) {
            // in viewport, load
            _.sectionLoad(target);
            // remove from deferred queue and resume checks
            _._deferredSectionTargets.splice(i, 1);
            i--;
          }
        }
      }

      // remove event if no more deferred targets left, if not on first run
      if (firstRunCheck !== true && _._deferredSectionTargets.length === 0) {
        _._deferredWatcherRunning = false;
        $(window).off('.themeSectionDeferredLoader');
      }
    };

    // load in a section
    _.sectionLoad = function (target) {
      var target = target,
      sectionObj = _._sectionForTarget(target),
      section = false;

      if (sectionObj.section) {
        section = sectionObj.section;
      } else {
        section = sectionObj;
      }

      if (section !== false) {
        var instance = {
          target: target,
          section: section,
          $shopifySectionContainer: $(target).closest('.shopify-section'),
          thisContext: {
            functions: section.functions,
            registeredEventListeners: [] } };


        instance.thisContext.registerEventListener = _._registerEventListener.bind(instance.thisContext);
        _._instances.push(instance);

        //Initialise any components
        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(component => {
            $(document).trigger('cc:component:load', [component, target]);
          });
        }

        _._callSectionWith(section, 'onSectionLoad', target, instance.thisContext);
        _._callSectionWith(section, 'afterSectionLoadCallback', target, instance.thisContext);

        // attach additional UI events if defined
        if (section.onSectionSelect) {
          instance.$shopifySectionContainer.on('shopify:section:select', function (e) {
            _._callSectionWith(section, 'onSectionSelect', e.target, instance.thisContext);
          });
        }
        if (section.onSectionDeselect) {
          instance.$shopifySectionContainer.on('shopify:section:deselect', function (e) {
            _._callSectionWith(section, 'onSectionDeselect', e.target, instance.thisContext);
          });
        }
        if (section.onBlockSelect) {
          $(target).on('shopify:block:select', function (e) {
            _._callSectionWith(section, 'onBlockSelect', e.target, instance.thisContext);
          });
        }
        if (section.onBlockDeselect) {
          $(target).on('shopify:block:deselect', function (e) {
            _._callSectionWith(section, 'onBlockDeselect', e.target, instance.thisContext);
          });
        }
      }
    };

    // unload a section
    _.sectionUnload = function (target) {
      var sectionObj = _._sectionForTarget(target);
      var instanceIndex = -1;
      for (var i = 0; i < _._instances.length; i++) {
        if (_._instances[i].target == target) {
          instanceIndex = i;
        }
      }
      if (instanceIndex > -1) {
        var instance = _._instances[instanceIndex];
        // remove events and call unload, if loaded
        $(target).off('shopify:block:select shopify:block:deselect');
        instance.$shopifySectionContainer.off('shopify:section:select shopify:section:deselect');
        _._callSectionWith(instance.section, 'onSectionUnload', target, instance.thisContext);
        _._unloadRegisteredEventListeners(instance.thisContext.registeredEventListeners);
        _._callSectionWith(sectionObj, 'afterSectionUnloadCallback', target, instance.thisContext);
        _._instances.splice(instanceIndex);

        //Destroy any components
        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(component => {
            $(document).trigger('cc:component:unload', [component, target]);
          });
        }
      } else {
        // check if it was a deferred section
        for (var i = 0; i < _._deferredSectionTargets.length; i++) {
          if (_._deferredSectionTargets[i].target == target) {
            _._deferredSectionTargets[i].splice(i, 1);
            break;
          }
        }
      }
    };

    _.sectionReorder = function (target) {
      var instanceIndex = -1;
      for (var i = 0; i < _._instances.length; i++) {
        if (_._instances[i].target == target) {
          instanceIndex = i;
        }
      }
      if (instanceIndex > -1) {
        var instance = _._instances[instanceIndex];
        _._callSectionWith(instance.section, 'onSectionReorder', target, instance.thisContext);
      }
    };

    // Helpers
    _._registerEventListener = function (element, eventType, callback) {
      element.addEventListener(eventType, callback);
      this.registeredEventListeners.push({
        element,
        eventType,
        callback });

    };

    _._unloadRegisteredEventListeners = function (registeredEventListeners) {
      registeredEventListeners.forEach(rel => {
        rel.element.removeEventListener(rel.eventType, rel.callback);
      });
    };

    _._callSectionWith = function (section, method, container, thisContext) {
      if (typeof section[method] === 'function') {
        try {
          if (thisContext) {
            section[method].bind(thisContext)(container);
          } else {
            section[method](container);
          }
        } catch (ex) {
          var sectionType = container.dataset['sectionType'];
          console.warn("Theme warning: '".concat(method, "' failed for section '").concat(sectionType, "'"));
          console.debug(container, ex);
        }
      }
    };

    _._themeSectionTargetFromShopifySectionTarget = function (target) {
      var $target = $('[data-section-type]:first', target);
      if ($target.length > 0) {
        return $target[0];
      } else {
        return false;
      }
    };

    _._sectionForTarget = function (target) {
      var type = $(target).attr('data-section-type');
      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return _._sections[i];
        }
      }
      return false;
    };

    _._sectionAlreadyRegistered = function (type) {
      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return true;
        }
      }
      return false;
    };
  }();
  // Loading third party scripts
  theme.scriptsLoaded = {};
  theme.loadScriptOnce = function (src, callback, beforeRun, sync) {
    if (typeof theme.scriptsLoaded[src] === 'undefined') {
      theme.scriptsLoaded[src] = [];
      var tag = document.createElement('script');
      tag.src = src;

      if (sync || beforeRun) {
        tag.async = false;
      }

      if (beforeRun) {
        beforeRun();
      }

      if (typeof callback === 'function') {
        theme.scriptsLoaded[src].push(callback);
        if (tag.readyState) {// IE, incl. IE9
          tag.onreadystatechange = function () {
            if (tag.readyState == "loaded" || tag.readyState == "complete") {
              tag.onreadystatechange = null;
              for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
                theme.scriptsLoaded[this][i]();
              }
              theme.scriptsLoaded[this] = true;
            }
          }.bind(src);
        } else {
          tag.onload = function () {// Other browsers
            for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
              theme.scriptsLoaded[this][i]();
            }
            theme.scriptsLoaded[this] = true;
          }.bind(src);
        }
      }

      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      return true;
    } else if (typeof theme.scriptsLoaded[src] === 'object' && typeof callback === 'function') {
      theme.scriptsLoaded[src].push(callback);
    } else {
      if (typeof callback === 'function') {
        callback();
      }
      return false;
    }
  };

  theme.loadStyleOnce = function (src) {
    var srcWithoutProtocol = src.replace(/^https?:/, '');
    if (!document.querySelector('link[href="' + encodeURI(srcWithoutProtocol) + '"]')) {
      var tag = document.createElement('link');
      tag.href = srcWithoutProtocol;
      tag.rel = 'stylesheet';
      tag.type = 'text/css';
      var firstTag = document.getElementsByTagName('link')[0];
      firstTag.parentNode.insertBefore(tag, firstTag);
    }
  }; /// Show a short-lived text popup above an element
  theme.showQuickPopup = function (message, $origin) {
    var $popup = $('<div class="simple-popup"/>');
    var offs = $origin.offset();
    $popup.html(message).css({ 'left': offs.left, 'top': offs.top }).hide();
    $('body').append($popup);
    $popup.css({ marginTop: -$popup.outerHeight() - 10, marginLeft: -($popup.outerWidth() - $origin.outerWidth()) / 2 });
    $popup.fadeIn(200).delay(3500).fadeOut(400, function () {
      $(this).remove();
    });
  };
  class ccComponent {
    constructor(name) {var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      var _this = this;
      this.instances = [];

      // Initialise any instance of this component within a section
      $(document).on('cc:component:load', function (event, component, target) {
        if (component === name) {
          $(target).find("".concat(cssSelector, ":not(.cc-initialized)")).each(function () {
            _this.init(this);
          });
        }
      });

      // Destroy any instance of this component within a section
      $(document).on('cc:component:unload', function (event, component, target) {
        if (component === name) {
          $(target).find(cssSelector).each(function () {
            _this.destroy(this);
          });
        }
      });

      // Initialise any instance of this component
      $(cssSelector).each(function () {
        _this.init(this);
      });
    }

    init(container) {
      $(container).addClass('cc-initialized');
    }

    destroy(container) {
      $(container).removeClass('cc-initialized');
    }

    registerInstance(container, instance) {
      this.instances.push({
        container,
        instance });

    }

    destroyInstance(container) {
      this.instances = this.instances.filter(item => {
        if (item.container === container) {
          if (typeof item.instance.destroy === 'function') {
            item.instance.destroy();
          }

          return item.container !== container;
        }
      });
    }}

  /**
   * Use with template literals to build HTML with correct escaping.
   *
   * Example:
   *
   * const tve = theme.createTemplateVariableEncoder();
   * tve.add('className', className, 'attribute');
   * tve.add('title', title, 'html');
   * tve.add('richText', richText, 'raw');
   * const template = `
   *   <div class="${tve.values.className}">
   *     <h1>${tve.values.title}</h1>
   *     <div class="rte">${tve.values.richText}</div>
   *   </div>
   * `;
   */
  theme.createTemplateVariableEncoder = function () {
    return {
      utilityElement: document.createElement('div'),
      values: {},
      /**
       * Add a new value to sanitise.
       * @param {String} key - key used to retrieve this value
       * @param {String} value - the value to encode and store
       * @param {String} type - possible values: [attribute, html, raw] - the type of encoding to use
       */
      add: function add(key, value, type) {
        switch (type) {
          case 'attribute':
            this.utilityElement.innerHTML = '';
            this.utilityElement.setAttribute('util', value);
            this.values[key] = this.utilityElement.outerHTML.match(/util="([^"]*)"/)[1];
            break;
          case 'html':
            this.utilityElement.innerText = value;
            this.values[key] = this.utilityElement.innerHTML;
            break;
          case 'raw':
            this.values[key] = value;
            break;
          default:
            throw "Type '".concat(type, "' not handled");}

      } };

  };
  theme.suffixIds = function (container, suffix) {
    var refAttrs = ['aria-describedby', 'aria-controls'];
    suffix = '-' + suffix;
    container.querySelectorAll('[id]').forEach(el => {
      var oldId = el.id,
      newId = oldId + suffix;
      el.id = newId;
      refAttrs.forEach(attr => {
        container.querySelectorAll("[".concat(attr, "=\"").concat(oldId, "\"]")).forEach(refEl => {
          refEl.setAttribute(attr, newId);
        });
      });
    });
  };
  theme.renderUnitPrice = function (unit_price, unit_price_measurement, money_format) {
    if (unit_price && unit_price_measurement) {
      var unitPriceHtml = '<div class="unit-price">';
      unitPriceHtml += "<span class=\"unit-price__price theme-money\">".concat(theme.Shopify.formatMoney(unit_price, money_format), "</span>");
      unitPriceHtml += "<span class=\"unit-price__separator\">".concat(theme.strings.products_product_unit_price_separator, "</span>");
      var unit = unit_price_measurement.reference_unit;
      if (unit_price_measurement.reference_value != 1) {
        unit = unit_price_measurement.reference_value + unit;
      }
      unitPriceHtml += "<span class=\"unit-price__unit\">".concat(unit, "</span>");
      unitPriceHtml += '</div>';
      return unitPriceHtml;
    } else {
      return '';
    }
  };
  class ccPopup {
    constructor($container, namespace) {
      this.$container = $container;
      this.namespace = namespace;
      this.cssClasses = {
        visible: 'cc-popup--visible',
        bodyNoScroll: 'cc-popup-no-scroll',
        bodyNoScrollPadRight: 'cc-popup-no-scroll-pad-right' };

    }

    /**
     * Open popup on timer / local storage - move focus to input ensure you can tab to submit and close
     * Add the cc-popup--visible class
     * Update aria to visible
     */
    open(callback) {
      // Prevent the body from scrolling
      if (this.$container.data('freeze-scroll')) {
        clearTimeout(theme.ccPopupRemoveScrollFreezeTimeoutId);
        $('body').addClass(this.cssClasses.bodyNoScroll);

        // Add any padding necessary to the body to compensate for the scrollbar that just disappeared
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'popup-scrollbar-measure';
        document.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        if (scrollbarWidth > 0) {
          $('body').css('padding-right', scrollbarWidth + 'px').addClass(this.cssClasses.bodyNoScrollPadRight);
        }
      }

      // Add reveal class
      this.$container.addClass(this.cssClasses.visible);

      // Track previously focused element
      this.previouslyActiveElement = document.activeElement;

      // Focus on the close button after the animation in has completed
      setTimeout(() => {
        this.$container.find('.cc-popup-close')[0].focus();
      }, 500);

      // Pressing escape closes the modal
      $(window).on('keydown' + this.namespace, event => {
        if (event.keyCode === 27) {
          this.close();
        }
      });

      if (callback) {
        callback();
      }
    }

    /**
     * Close popup on click of close button or background - where does the focus go back to?
     * Remove the cc-popup--visible class
     */
    close(callback) {
      // Remove reveal class
      this.$container.removeClass(this.cssClasses.visible);

      // Revert focus
      if (this.previouslyActiveElement) {
        $(this.previouslyActiveElement).focus();
      }

      // Destroy the escape event listener
      $(window).off('keydown' + this.namespace);

      // Allow the body to scroll and remove any scrollbar-compensating padding, if no other scroll-freeze popups are visible
      var $visibleFreezePopups = $('.' + this.cssClasses.visible).filter(() => {return this.$container.data('freeze-scroll');});
      if ($visibleFreezePopups.length === 0) {
        var transitionDuration = 500;

        var $innerModal = this.$container.find('.cc-popup-modal');
        if ($innerModal.length) {
          transitionDuration = parseFloat(getComputedStyle($innerModal[0])['transitionDuration']);
          if (transitionDuration && transitionDuration > 0) {
            transitionDuration *= 1000;
          }
        }

        theme.ccPopupRemoveScrollFreezeTimeoutId = setTimeout(() => {
          $('body').removeClass(this.cssClasses.bodyNoScroll).removeClass(this.cssClasses.bodyNoScrollPadRight).css('padding-right', '0');
        }, transitionDuration);
      }

      if (callback) {
        callback();
      }
    }}
  ;
  (() => {
    theme.initAnimateOnScroll = function () {
      if (document.body.classList.contains('cc-animate-enabled') && window.innerWidth >= 768) {
        var animationTimeout = typeof document.body.dataset.ccAnimateTimeout !== "undefined" ? document.body.dataset.ccAnimateTimeout : 200;

        if ('IntersectionObserver' in window) {
          var intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              // In view and hasn't been animated yet
              if (entry.isIntersecting && !entry.target.classList.contains("cc-animate-complete")) {
                setTimeout(() => {
                  entry.target.classList.add("-in", "cc-animate-complete");
                }, animationTimeout);

                setTimeout(() => {
                  //Once the animation is complete (assume 5 seconds), remove the animate attribute to remove all css
                  entry.target.classList.remove("data-cc-animate");
                  entry.target.style.transitionDuration = null;
                  entry.target.style.transitionDelay = null;
                }, 5000);

                // Remove observer after animation
                observer.unobserve(entry.target);
              }
            });
          });

          document.querySelectorAll('[data-cc-animate]:not(.cc-animate-init)').forEach(elem => {
            //Set the animation delay
            if (elem.dataset.ccAnimateDelay) {
              elem.style.transitionDelay = elem.dataset.ccAnimateDelay;
            }

            ///Set the animation duration
            if (elem.dataset.ccAnimateDuration) {
              elem.style.transitionDuration = elem.dataset.ccAnimateDuration;
            }

            //Init the animation
            if (elem.dataset.ccAnimate) {
              elem.classList.add(elem.dataset.ccAnimate);
            }

            elem.classList.add("cc-animate-init");

            //Watch for elem
            intersectionObserver.observe(elem);
          });
        } else {
          //Fallback, load all the animations now
          var elems = document.querySelectorAll('[data-cc-animate]:not(.cc-animate-init)');
          for (var i = 0; i < elems.length; i++) {
            elems[i].classList.add("-in", "cc-animate-complete");
          }
        }
      }
    };

    theme.initAnimateOnScroll();

    document.addEventListener('shopify:section:load', () => {
      setTimeout(theme.initAnimateOnScroll, 100);
    });

    //Reload animations when changing from mobile to desktop
    try {
      window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
        if (event.matches) {
          setTimeout(theme.initAnimateOnScroll, 100);
        }
      });
    } catch (e) {}
  })();


  class AccordionInstance {
    constructor(container) {
      this.accordion = container;
      this.itemClass = '.cc-accordion-item';
      this.titleClass = '.cc-accordion-item__title';
      this.panelClass = '.cc-accordion-item__panel';
      this.allowMultiOpen = this.accordion.dataset.allowMultiOpen === 'true';

      // If multiple open items not allowed, set open item as active (if there is one)
      if (!this.allowMultiOpen) {
        this.activeItem = this.accordion.querySelector("".concat(this.itemClass, "[open]"));
      }

      this.bindEvents();
    }

    /**
     * Adds inline 'height' style to a panel, to trigger open transition
     * @param {HTMLDivElement} panel - The accordion item content panel
     */
    static addPanelHeight(panel) {
      panel.style.height = "".concat(panel.scrollHeight, "px");
    }

    /**
     * Removes inline 'height' style from a panel, to trigger close transition
     * @param {HTMLDivElement} panel - The accordion item content panel
     */
    static removePanelHeight(panel) {
      panel.getAttribute('style'); // Fix Safari bug (doesn't remove attribute without this first!)
      panel.removeAttribute('style');
    }

    /**
     * Opens an accordion item
     * @param {HTMLDetailsElement} item - The accordion item
     * @param {HTMLDivElement} panel - The accordion item content panel
     */
    open(item, panel) {
      panel.style.height = '0';

      // Set item to open. Blocking the default click action and opening it this way prevents a
      // slight delay which causes the panel height to be set to '0' (because item's not open yet)
      item.open = true;

      AccordionInstance.addPanelHeight(panel);

      // Slight delay required before starting transitions
      setTimeout(() => {
        item.classList.add('is-open');
      }, 10);

      if (!this.allowMultiOpen) {
        // If there's an active item and it's not the opened item, close it
        if (this.activeItem && this.activeItem !== item) {
          var activePanel = this.activeItem.querySelector(this.panelClass);
          this.close(this.activeItem, activePanel);
        }

        this.activeItem = item;
      }
    }

    /**
     * Closes an accordion item
     * @param {HTMLDetailsElement} item - The accordion item
     * @param {HTMLDivElement} panel - The accordion item content panel
     */
    close(item, panel) {
      AccordionInstance.addPanelHeight(panel);

      item.classList.remove('is-open');
      item.classList.add('is-closing');

      if (this.activeItem === item) {
        this.activeItem = null;
      }

      // Slight delay required to allow scroll height to be applied before changing to '0'
      setTimeout(() => {
        panel.style.height = '0';
      }, 10);
    }

    /**
     * Handles 'click' event on the accordion
     * @param {Object} e - The event object
     */
    handleClick(e) {
      // Ignore clicks outside a toggle (<summary> element)
      var toggle = e.target.closest(this.titleClass);
      if (!toggle) return;

      // Prevent the default action
      // We'll trigger it manually after open transition initiated or close transition complete
      e.preventDefault();

      var item = toggle.parentNode;
      var panel = toggle.nextElementSibling;

      if (item.open) {
        this.close(item, panel);
      } else {
        this.open(item, panel);
      }
    }

    /**
     * Handles 'transitionend' event in the accordion
     * @param {Object} e - The event object
     */
    handleTransition(e) {
      // Ignore transitions not on a panel element
      if (!e.target.matches(this.panelClass)) return;

      var panel = e.target;
      var item = panel.parentNode;

      if (item.classList.contains('is-closing')) {
        item.classList.remove('is-closing');
        item.open = false;
      }

      AccordionInstance.removePanelHeight(panel);
    }

    bindEvents() {
      // Need to assign the function calls to variables because bind creates a new function,
      // which means the event listeners can't be removed in the usual way
      this.clickHandler = this.handleClick.bind(this);
      this.transitionHandler = this.handleTransition.bind(this);

      this.accordion.addEventListener('click', this.clickHandler);
      this.accordion.addEventListener('transitionend', this.transitionHandler);
    }

    destroy() {
      this.accordion.removeEventListener('click', this.clickHandler);
      this.accordion.removeEventListener('transitionend', this.transitionHandler);
    }}


  class Accordion extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'accordion';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new AccordionInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new Accordion();
  class CustomSelectInstance {
    constructor(el) {
      this.el = el;
      this.button = el.querySelector('.cc-select__btn');
      this.listbox = el.querySelector('.cc-select__listbox');
      this.options = el.querySelectorAll('.cc-select__option');
      this.selectedOption = el.querySelector('[aria-selected="true"]');
      this.nativeSelect = document.getElementById("".concat(el.id, "-native"));
      this.swatches = 'swatch' in this.options[this.options.length - 1].dataset;
      this.focusedClass = 'is-focused';
      this.searchString = '';
      this.listboxOpen = false;

      // Set the selected option
      if (!this.selectedOption) {
        this.selectedOption = this.listbox.firstElementChild;
      }

      this.bindEvents();
      this.setButtonWidth();
    }

    bindEvents() {
      this.el.addEventListener('keydown', this.handleKeydown.bind(this));
      this.el.addEventListener('selectOption', this.handleSelectOption.bind(this));
      this.button.addEventListener('mousedown', this.handleMousedown.bind(this));
    }

    /**
     * Adds event listeners when the options list is visible
     */
    addListboxOpenEvents() {
      this.mouseoverHandler = this.handleMouseover.bind(this);
      this.mouseleaveHandler = this.handleMouseleave.bind(this);
      this.clickHandler = this.handleClick.bind(this);
      this.blurHandler = this.handleBlur.bind(this);

      this.listbox.addEventListener('mouseover', this.mouseoverHandler);
      this.listbox.addEventListener('mouseleave', this.mouseleaveHandler);
      this.listbox.addEventListener('click', this.clickHandler);
      this.listbox.addEventListener('blur', this.blurHandler);
    }

    /**
     * Removes event listeners added when the options list was visible
     */
    removeListboxOpenEvents() {
      this.listbox.removeEventListener('mouseover', this.mouseoverHandler);
      this.listbox.removeEventListener('mouseleave', this.mouseleaveHandler);
      this.listbox.removeEventListener('click', this.clickHandler);
      this.listbox.removeEventListener('blur', this.blurHandler);
    }

    /**
     * Handles a 'keydown' event on the custom select element
     * @param {Object} e - The event object
     */
    handleKeydown(e) {
      if (this.listboxOpen) {
        this.handleKeyboardNav(e);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.showListbox();
      }
    }

    /**
     * Handles a 'mousedown' event on the button element
     * @param {Object} e - The event object
     */
    handleMousedown(e) {
      if (!this.listboxOpen && e.button === 0) {
        this.showListbox();
      }
    }

    /**
     * Handles a 'mouseover' event on the options list
     * @param {Object} e - The event object
     */
    handleMouseover(e) {
      if (e.target.matches('li')) {
        this.focusOption(e.target);
      }
    }

    /**
     * Handles a 'mouseleave' event on the options list
     */
    handleMouseleave() {
      this.focusOption(this.selectedOption);
    }

    /**
     * Handles a 'click' event on the options list
     * @param {Object} e - The event object
     */
    handleClick(e) {
      if (e.target.matches('.js-option')) {
        this.selectOption(e.target);
      }
    }

    /**
     * Handles a 'blur' event on the options list
     */
    handleBlur() {
      if (this.listboxOpen) {
        this.hideListbox();
      }
    }

    /**
     * Handles a 'keydown' event on the options list
     * @param {Object} e - The event object
     */
    handleKeyboardNav(e) {
      var optionToFocus;

      // Disable tabbing if options list is open (as per native select element)
      if (e.key === 'Tab') {
        e.preventDefault();
      }

      switch (e.key) {
        // Focus an option
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();

          if (e.key === 'ArrowUp') {
            optionToFocus = this.focusedOption.previousElementSibling;
          } else {
            optionToFocus = this.focusedOption.nextElementSibling;
          }

          if (optionToFocus && !optionToFocus.classList.contains('is-disabled')) {
            this.focusOption(optionToFocus);
          }
          break;

        // Select an option
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.selectOption(this.focusedOption);
          break;

        // Cancel and close the options list
        case 'Escape':
          e.preventDefault();
          this.hideListbox();
          break;

        // Search for an option and focus the first match (if one exists)
        default:
          optionToFocus = this.findOption(e.key);

          if (optionToFocus) {
            this.focusOption(optionToFocus);
          }
          break;}

    }

    /**
     * Sets the button width to the same as the longest option, to prevent
     * the button width from changing depending on the option selected
     */
    setButtonWidth() {
      // Get the width of an element without side padding
      var getUnpaddedWidth = el => {
        var elStyle = getComputedStyle(el);
        return parseFloat(elStyle.paddingLeft) + parseFloat(elStyle.paddingRight);
      };

      var buttonPadding = getUnpaddedWidth(this.button);
      var optionPadding = getUnpaddedWidth(this.selectedOption);
      var buttonBorder = this.button.offsetWidth - this.button.clientWidth;
      var optionWidth = Math.ceil(this.selectedOption.getBoundingClientRect().width);

      this.button.style.width = "".concat(optionWidth - optionPadding + buttonPadding + buttonBorder, "px");
    }

    /**
     * Shows the options list
     */
    showListbox() {
      this.listbox.hidden = false;
      this.listboxOpen = true;

      this.el.classList.add('is-open');
      this.button.setAttribute('aria-expanded', 'true');
      this.listbox.setAttribute('aria-hidden', 'false');

      // Slight delay required to prevent blur event being fired immediately
      setTimeout(() => {
        this.focusOption(this.selectedOption);
        this.listbox.focus();

        this.addListboxOpenEvents();
      }, 10);
    }

    /**
     * Hides the options list
     */
    hideListbox() {
      if (!this.listboxOpen) return;

      this.listbox.hidden = true;
      this.listboxOpen = false;

      this.el.classList.remove('is-open');
      this.button.setAttribute('aria-expanded', 'false');
      this.listbox.setAttribute('aria-hidden', 'true');

      if (this.focusedOption) {
        this.focusedOption.classList.remove(this.focusedClass);
        this.focusedOption = null;
      }

      this.button.focus();
      this.removeListboxOpenEvents();
    }

    /**
     * Finds a matching option from a typed string
     * @param {string} key - The key pressed
     * @returns {?HTMLElement}
     */
    findOption(key) {
      this.searchString += key;

      // If there's a timer already running, clear it
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // Wait 500ms to see if another key is pressed, if not then clear the search string
      this.searchTimer = setTimeout(() => {
        this.searchString = '';
      }, 500);

      // Find an option that contains the search string (if there is one)
      var matchingOption = [...this.options].find(option => {
        var label = option.innerText.toLowerCase();
        return label.includes(this.searchString) && !option.classList.contains('is-disabled');
      });

      return matchingOption;
    }

    /**
     * Focuses an option
     * @param {HTMLElement} option - The <li> element of the option to focus
     */
    focusOption(option) {
      // Remove focus on currently focused option (if there is one)
      if (this.focusedOption) {
        this.focusedOption.classList.remove(this.focusedClass);
      }

      // Set focus on the option
      this.focusedOption = option;
      this.focusedOption.classList.add(this.focusedClass);

      // If option is out of view, scroll the list
      if (this.listbox.scrollHeight > this.listbox.clientHeight) {
        var scrollBottom = this.listbox.clientHeight + this.listbox.scrollTop;
        var optionBottom = option.offsetTop + option.offsetHeight;

        if (optionBottom > scrollBottom) {
          this.listbox.scrollTop = optionBottom - this.listbox.clientHeight;
        } else if (option.offsetTop < this.listbox.scrollTop) {
          this.listbox.scrollTop = option.offsetTop;
        }
      }
    }

    /**
     * Handles a 'selectOption' event on the custom select element
     * @param {Object} e - The event object (pass value in detail.value)
     */
    handleSelectOption(e) {
      var matchingOption = [...this.options].find(option => option.dataset.value === e.detail.value);
      if (matchingOption) {
        this.selectOption(matchingOption);
      }
    }

    /**
     * Selects an option
     * @param {HTMLElement} option - The option <li> element
     */
    selectOption(option) {
      if (option !== this.selectedOption) {
        // Switch aria-selected attribute to selected option
        option.setAttribute('aria-selected', 'true');
        this.selectedOption.setAttribute('aria-selected', 'false');

        // Update swatch colour in the button
        if (this.swatches) {
          if (option.dataset.swatch) {
            this.button.dataset.swatch = option.dataset.swatch;
          } else {
            this.button.removeAttribute('data-swatch');
          }
        }

        // Update the button text and set the option as active
        this.button.firstChild.textContent = option.firstElementChild.textContent;
        this.listbox.setAttribute('aria-activedescendant', option.id);
        this.selectedOption = document.getElementById(option.id);

        // If a native select element exists, update its selected value and trigger a 'change' event
        if (this.nativeSelect) {
          this.nativeSelect.value = option.dataset.value;
          this.nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          // Trigger a 'change' event on the custom select element
          var detail = { selectedValue: option.dataset.value };
          this.el.dispatchEvent(new CustomEvent('change', { bubbles: true, detail }));
        }
      }

      this.hideListbox();
    }}


  class CustomSelect extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'custom-select';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-select";
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new CustomSelectInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new CustomSelect();
  /**
   * Display a modal window on-click. It's a lightbox.
   * To use:
   * Add 'cc-modal' class to a clickable element.
   *
   * Configure with:
   * - data-cc-modal-contentelement - selector for element containing content to show, innerHTML of element is copied into the modal
   * - data-cc-modal-size (optional) - 'small' or 'medium', defaults to 'medium'
   * - data-cc-modal-launch (optional) - 'true' if we want to open the modal immediately
   *
   * Example:
   * <a href="#password-login" class="cc-modal" data-cc-modal-contentelement="#password-login" data-cc-modal-size="small">
   * <div id="password-login" class="js-hidden">
  */
  class ModalInstance {
    constructor(container) {
      this.container = container;
      this.size = container.dataset.ccModalSize || 'medium';
      this.contentElement = document.querySelector(container.dataset.ccModalContentelement);

      this.container.addEventListener('click', this.handleClick.bind(this));

      if (container.dataset.ccModalLaunch === 'true') {
        setTimeout(this.open.bind(this), 10);
      }
    }

    /**
     * Handles 'click' event on the container
     * @param {Object} e - The event object
     */
    handleClick(e) {
      e.preventDefault();
      this.open();
      this.opener = e.target;
    }

    /**
     * Create the modal and add it to the page.
     */
    open() {
      var tve = theme.createTemplateVariableEncoder();
      tve.add('size', this.size, 'attribute');
      tve.add('content', this.contentElement.innerHTML, 'raw');
      tve.add('button_close_label', theme.strings.general_accessibility_labels_close, 'attribute');
      tve.add('button_close_icon', theme.icons.close, 'raw');

      var html = "\n      <div class=\"cc-modal-window cc-modal-window--pre-reveal cc-modal-window--size-".concat(
      tve.values.size, "\">\n        <div class=\"cc-modal-window__background\"></div>\n        <div class=\"cc-modal-window__foreground\" role=\"dialog\" aria-modal=\"true\">\n          <div class=\"cc-modal-window__content-container\">\n            <button class=\"cc-modal-window__close\" aria-label=\"").concat(



      tve.values.button_close_label, "\">").concat(tve.values.button_close_icon, "</button>\n            <div class=\"cc-modal-window__content\">").concat(
      tve.values.content, "</div>\n          </div>\n        </div>\n      </div>\n    ");





      var modalElementFragment = document.createRange().createContextualFragment(html);
      document.body.appendChild(modalElementFragment);

      document.body.classList.add('cc-modal-visible');
      this.modalElement = document.body.lastElementChild;

      this.modalElement.querySelector('.cc-modal-window__background').addEventListener('click', this.close.bind(this));
      this.modalElement.querySelector('.cc-modal-window__close').addEventListener('click', this.close.bind(this));

      setTimeout(() => {
        this.modalElement.classList.remove('cc-modal-window--pre-reveal');
        this.modalElement.querySelector('.cc-modal-window__close').focus();
      }, 10);
    }

    close() {
      this.modalElement.classList.add('cc-modal-window--closing');
      if (!document.querySelector('.cc-modal-window:not(.cc-modal-window--closing)')) {
        document.body.classList.remove('cc-modal-visible');
      }

      if (this.opener) {
        setTimeout(() => {
          this.opener.focus();
        }, 10);
      }

      // give transitions 5s to do their thing before we tidy up (note: this.modalElement may be reassigned during this timeout)
      setTimeout(function () {
        this.remove();
      }.bind(this.modalElement), 5000);
    }}


  class Modal extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modal';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new ModalInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new Modal();
  class PriceRangeInstance {
    constructor(container) {
      this.container = container;
      this.selectors = {
        inputMin: '.cc-price-range__input--min',
        inputMax: '.cc-price-range__input--max',
        control: '.cc-price-range__control',
        controlMin: '.cc-price-range__control--min',
        controlMax: '.cc-price-range__control--max',
        bar: '.cc-price-range__bar',
        activeBar: '.cc-price-range__bar-active' };

      this.controls = {
        min: {
          barControl: container.querySelector(this.selectors.controlMin),
          input: container.querySelector(this.selectors.inputMin) },

        max: {
          barControl: container.querySelector(this.selectors.controlMax),
          input: container.querySelector(this.selectors.inputMax) } };


      this.controls.min.value = parseInt(this.controls.min.input.value === '' ? this.controls.min.input.placeholder : this.controls.min.input.value);
      this.controls.max.value = parseInt(this.controls.max.input.value === '' ? this.controls.max.input.placeholder : this.controls.max.input.value);
      this.valueMin = this.controls.min.input.min;
      this.valueMax = this.controls.min.input.max;
      this.valueRange = this.valueMax - this.valueMin;

      [this.controls.min, this.controls.max].forEach(item => {
        item.barControl.setAttribute('aria-valuemin', this.valueMin);
        item.barControl.setAttribute('aria-valuemax', this.valueMax);
        item.barControl.setAttribute('tabindex', 0);
      });
      this.controls.min.barControl.setAttribute('aria-valuenow', this.controls.min.value);
      this.controls.max.barControl.setAttribute('aria-valuenow', this.controls.max.value);

      this.bar = container.querySelector(this.selectors.bar);
      this.activeBar = container.querySelector(this.selectors.activeBar);
      this.inDrag = false;
      this.rtl = document.querySelector('html[dir=rtl]');

      this.bindEvents();
      this.render();
    }

    getPxToValueRatio() {
      var r = this.bar.clientWidth / (this.valueMax - this.valueMin);
      if (this.rtl) {
        return -r;
      } else {
        return r;
      }
    }

    getPcToValueRatio() {
      return 100.0 / (this.valueMax - this.valueMin);
    }

    setActiveControlValue(value) {
      // only accept valid numbers
      if (isNaN(parseInt(value))) return;

      // clamp & default
      if (this.activeControl === this.controls.min) {
        if (value === '') {
          value = this.valueMin;
        }
        value = Math.max(this.valueMin, value);
        value = Math.min(value, this.controls.max.value);
      } else {
        if (value === '') {
          value = this.valueMax;
        }
        value = Math.min(this.valueMax, value);
        value = Math.max(value, this.controls.min.value);
      }

      // round
      this.activeControl.value = Math.round(value);

      // update input
      if (this.activeControl.input.value != this.activeControl.value) {
        if (this.activeControl.value == this.activeControl.input.placeholder) {
          this.activeControl.input.value = '';
        } else {
          this.activeControl.input.value = this.activeControl.value;
        }
        this.activeControl.input.dispatchEvent(new CustomEvent('change', { bubbles: true, cancelable: false, detail: { sender: 'theme:component:price_range' } }));
      }

      // a11y
      this.activeControl.barControl.setAttribute('aria-valuenow', this.activeControl.value);
    }

    render() {
      this.drawControl(this.controls.min);
      this.drawControl(this.controls.max);
      this.drawActiveBar();
    }

    drawControl(control) {
      var x = (control.value - this.valueMin) * this.getPcToValueRatio() + '%';
      if (this.rtl) {
        control.barControl.style.right = x;
      } else {
        control.barControl.style.left = x;
      }
    }

    drawActiveBar() {
      var s = (this.controls.min.value - this.valueMin) * this.getPcToValueRatio() + '%',
      e = (this.valueMax - this.controls.max.value) * this.getPcToValueRatio() + '%';
      if (this.rtl) {
        this.activeBar.style.left = e;
        this.activeBar.style.right = s;
      } else {
        this.activeBar.style.left = s;
        this.activeBar.style.right = e;
      }
    }

    handleControlTouchStart(e) {
      e.preventDefault();
      this.startDrag(e.target, e.touches[0].clientX);
      this.boundControlTouchMoveEvent = this.handleControlTouchMove.bind(this);
      this.boundControlTouchEndEvent = this.handleControlTouchEnd.bind(this);
      window.addEventListener('touchmove', this.boundControlTouchMoveEvent);
      window.addEventListener('touchend', this.boundControlTouchEndEvent);
    }

    handleControlTouchMove(e) {
      this.moveDrag(e.touches[0].clientX);
    }

    handleControlTouchEnd(e) {
      e.preventDefault();
      window.removeEventListener('touchmove', this.boundControlTouchMoveEvent);
      window.removeEventListener('touchend', this.boundControlTouchEndEvent);
      this.stopDrag();
    }

    handleControlMouseDown(e) {
      e.preventDefault();
      this.startDrag(e.target, e.clientX);
      this.boundControlMouseMoveEvent = this.handleControlMouseMove.bind(this);
      this.boundControlMouseUpEvent = this.handleControlMouseUp.bind(this);
      window.addEventListener('mousemove', this.boundControlMouseMoveEvent);
      window.addEventListener('mouseup', this.boundControlMouseUpEvent);
    }

    handleControlMouseMove(e) {
      this.moveDrag(e.clientX);
    }

    handleControlMouseUp(e) {
      e.preventDefault();
      window.removeEventListener('mousemove', this.boundControlMouseMoveEvent);
      window.removeEventListener('mouseup', this.boundControlMouseUpEvent);
      this.stopDrag();
    }

    startDrag(target, startX) {
      if (this.controls.min.barControl === target) {
        this.activeControl = this.controls.min;
      } else {
        this.activeControl = this.controls.max;
      }
      this.dragStartX = startX;
      this.dragStartValue = this.activeControl.value;
      this.inDrag = true;
    }

    moveDrag(moveX) {
      if (this.inDrag) {
        var value = this.dragStartValue + (moveX - this.dragStartX) / this.getPxToValueRatio();
        this.setActiveControlValue(value);
        this.render();
      }
    }

    stopDrag() {
      this.inDrag = false;
    }

    handleControlKeyDown(e) {
      if (e.key === 'ArrowRight') {
        this.incrementControlFromKeypress(e.target, 10.0);
      } else if (e.key === 'ArrowLeft') {
        this.incrementControlFromKeypress(e.target, -10.0);
      }
    }

    incrementControlFromKeypress(control, pxAmount) {
      if (this.controls.min.barControl === control) {
        this.activeControl = this.controls.min;
      } else {
        this.activeControl = this.controls.max;
      }
      this.setActiveControlValue(this.activeControl.value + pxAmount / this.getPxToValueRatio());
      this.render();
    }

    handleInputChange(e) {
      // strip out non numeric values
      e.target.value = e.target.value.replace(/\D/g, '');

      if (!e.detail || e.detail.sender != 'theme:component:price_range') {
        if (this.controls.min.input === e.target) {
          this.activeControl = this.controls.min;
        } else {
          this.activeControl = this.controls.max;
        }
        this.setActiveControlValue(e.target.value);
        this.render();
      }
    }

    handleInputKeyup(e) {
      // enforce numeric chars in the input
      setTimeout(function () {
        this.value = this.value.replace(/\D/g, '');
      }.bind(e.target), 10);
    }

    bindEvents() {
      [this.controls.min, this.controls.max].forEach(item => {
        item.barControl.addEventListener('touchstart', this.handleControlTouchStart.bind(this));
        item.barControl.addEventListener('mousedown', this.handleControlMouseDown.bind(this));
        item.barControl.addEventListener('keydown', this.handleControlKeyDown.bind(this));
        item.input.addEventListener('change', this.handleInputChange.bind(this));
        item.input.addEventListener('keyup', this.handleInputKeyup.bind(this));
      });
    }

    destroy() {
    }}


  class PriceRange extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'price-range';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new PriceRangeInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new PriceRange();


  // Manage videos
  theme.VideoManager = new function () {
    var _ = this;

    _._permitPlayback = function (container) {
      return !($(container).hasClass('video-container--background') && $(window).outerWidth() < 768);
    };

    // Youtube
    _.youtubeVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="youtube"]:not(.video--init)' };


    _.youtubeApiReady = function () {
      _.youtubeVars.apiReady = true;
      _._loadYoutubeVideos();
    };

    _._loadYoutubeVideos = function (container) {
      if ($(_.youtubeVars.toProcessSelector, container).length) {
        if (_.youtubeVars.apiReady) {

          // play those videos
          $(_.youtubeVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.youtubeVars.incrementor++;
              var containerId = 'theme-yt-video-' + _.youtubeVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
              appendTo($('.video-container__video', this));
              var autoplay = $(this).data('video-autoplay');
              var loop = $(this).data('video-loop');
              var player = new YT.Player(containerId, {
                height: '360',
                width: '640',
                videoId: $(this).data('video-id'),
                playerVars: {
                  iv_load_policy: 3,
                  modestbranding: 1,
                  autoplay: 0,
                  loop: loop ? 1 : 0,
                  playlist: $(this).data('video-id'),
                  rel: 0,
                  showinfo: 0 },

                events: {
                  onReady: _._onYoutubePlayerReady.bind({ autoplay: autoplay, loop: loop, $container: $(this) }),
                  onStateChange: _._onYoutubePlayerStateChange.bind({ autoplay: autoplay, loop: loop, $container: $(this) }) } });


              _.youtubeVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player };

            }
          });
        } else {
          // load api
          theme.loadScriptOnce('https://www.youtube.com/iframe_api');
        }
      }
    };

    _._onYoutubePlayerReady = function (event) {
      event.target.setPlaybackQuality('hd1080');
      if (this.autoplay) {
        event.target.mute();
        event.target.playVideo();
      }

      _._initBackgroundVideo(this.$container);
    };

    _._onYoutubePlayerStateChange = function (event) {
      if (event.data == YT.PlayerState.PLAYING) {
        this.$container.addClass('video--play-started');

        if (this.autoplay) {
          event.target.mute();
        }

        if (this.loop) {
          // 4 times a second, check if we're in the final second of the video. If so, loop it for a more seamless loop
          var finalSecond = event.target.getDuration() - 1;
          if (finalSecond > 2) {
            function loopTheVideo() {
              if (event.target.getCurrentTime() > finalSecond) {
                event.target.seekTo(0);
              }
              setTimeout(loopTheVideo, 250);
            }
            loopTheVideo();
          }
        }
      }
    };

    _._unloadYoutubeVideos = function (container) {
      for (var dataKey in _.youtubeVars.videoData) {
        var data = _.youtubeVars.videoData[dataKey];
        if ($(container).find(data.container).length) {
          data.player.destroy();
          delete _.youtubeVars.videoData[dataKey];
          return;
        }
      }
    };

    // Vimeo
    _.vimeoVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="vimeo"]:not(.video--init)' };


    _.vimeoApiReady = function () {
      _.vimeoVars.apiReady = true;
      _._loadVimeoVideos();
    };

    _._loadVimeoVideos = function (container) {
      if ($(_.vimeoVars.toProcessSelector, container).length) {
        if (_.vimeoVars.apiReady) {
          // play those videos

          $(_.vimeoVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.vimeoVars.incrementor++;
              var $this = $(this);
              var containerId = 'theme-vi-video-' + _.vimeoVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
              appendTo($('.video-container__video', this));
              var autoplay = !!$(this).data('video-autoplay');
              var player = new Vimeo.Player(containerId, {
                url: $(this).data('video-url'),
                width: 640,
                loop: $(this).data('video-autoplay'),
                autoplay: autoplay,
                muted: $this.hasClass('video-container--background') || autoplay });

              player.on('playing', function () {
                $(this).addClass('video--play-started');
              }.bind(this));
              player.ready().then(function () {
                if (autoplay) {
                  player.setVolume(0);
                  player.play();
                }
                if (player.element && player.element.width && player.element.height) {
                  var ratio = parseInt(player.element.height) / parseInt(player.element.width);
                  $this.find('.video-container__video').css('padding-bottom', ratio * 100 + '%');
                }
                _._initBackgroundVideo($this);
              });
              _.vimeoVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player,
                autoPlay: autoplay };

            }
          });
        } else {
          // load api
          if (window.define) {
            // workaround for third parties using RequireJS
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;
              _._loadVimeoVideos();
              window.define = window.tempDefine;
            }, function () {
              window.tempDefine = window.define;
              window.define = null;
            });
          } else {
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;
              _._loadVimeoVideos();
            });
          }
        }
      }
    };

    _._unloadVimeoVideos = function (container) {
      for (var dataKey in _.vimeoVars.videoData) {
        var data = _.vimeoVars.videoData[dataKey];
        if ($(container).find(data.container).length) {
          data.player.unload();
          delete _.vimeoVars.videoData[dataKey];
          return;
        }
      }
    };

    // Init third party apis - Youtube and Vimeo
    _._loadThirdPartyApis = function (container) {
      //Don't init youtube or vimeo background videos on mobile
      if (_._permitPlayback($('.video-container', container))) {
        _._loadYoutubeVideos(container);
        _._loadVimeoVideos(container);
      }
    };

    // Mp4
    _.mp4Vars = {
      incrementor: 0,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="mp4"]:not(.video--init)' };


    _._loadMp4Videos = function (container) {
      if ($(_.mp4Vars.toProcessSelector, container).length) {
        // play those videos
        $(_.mp4Vars.toProcessSelector, container).addClass('video--init').each(function () {
          _.mp4Vars.incrementor++;
          var $this = $(this);
          var containerId = 'theme-mp-video-' + _.mp4Vars.incrementor;
          $(this).data('video-container-id', containerId);
          var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
          appendTo($('.video-container__video', this));

          var $video = $('<video playsinline>');
          if ($(this).data('video-loop')) {
            $video.attr('loop', 'loop');
          }
          if (!$(this).hasClass('video-container--background')) {
            $video.attr('controls', 'controls');
          }
          if ($(this).data('video-autoplay')) {
            $video.attr({ autoplay: 'autoplay', muted: 'muted' });
            $video[0].muted = true; // required by Chrome - ignores attribute
            $video.one('loadeddata', function () {
              this.play();
            });
          }
          $video.on('playing', function () {
            $(this).addClass('video--play-started');
          }.bind(this));
          $video.attr('src', $(this).data('video-url')).appendTo(videoElement);
          _.mp4Vars.videoData[containerId] = {
            element: $video[0] };

        });
      }
    };

    _._unloadMp4Videos = function (container) {
    };

    // background video placement for iframes
    _._initBackgroundVideo = function ($container) {
      if ($container.hasClass('video-container--background') && $container.find('.video-container__video iframe').length) {
        function assessBackgroundVideo() {
          var $media = $('.video-container__media', this),
          $container = $media.length ? $media : this,
          cw = $container.width(),
          ch = $container.height(),
          cr = cw / ch,
          $frame = $('.video-container__video iframe', this),
          vr = $frame.attr('width') / $frame.attr('height'),
          $pan = $('.video-container__video', this),
          vCrop = 75; // pushes video outside container to hide controls
          if (cr > vr) {
            var vh = cw / vr + vCrop * 2;
            $pan.css({
              marginTop: (ch - vh) / 2 - vCrop,
              marginInlineStart: '',
              height: vh + vCrop * 2,
              width: '' });

          } else {
            var vw = cw * vr + vCrop * 2 * vr;
            $pan.css({
              marginTop: -vCrop,
              marginInlineStart: (cw - vw) / 2,
              height: ch + vCrop * 2,
              width: vw });

          }
        }
        assessBackgroundVideo.bind($container)();
        $(window).on('debouncedresize.' + $container.data('video-container-id'), assessBackgroundVideo.bind($container));
      }
    };

    // Compatibility with Sections
    this.onSectionLoad = function (container) {
      // url only - infer type
      $('.video-container[data-video-url]:not([data-video-type])').each(function () {
        var url = $(this).data('video-url');

        if (url.indexOf('.mp4') > -1) {
          $(this).attr('data-video-type', 'mp4');
        }

        if (url.indexOf('vimeo.com') > -1) {
          $(this).attr('data-video-type', 'vimeo');
          $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
        }

        if (url.indexOf('youtu.be') > -1 || url.indexOf('youtube.com') > -1) {
          $(this).attr('data-video-type', 'youtube');
          if (url.indexOf('v=') > -1) {
            $(this).attr('data-video-id', url.split('v=').pop().split('&')[0]);
          } else {
            $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
          }
        }
      });

      _._loadThirdPartyApis(container);
      _._loadMp4Videos(container);

      $(window).on('debouncedresize.video-manager-resize', function () {
        _._loadThirdPartyApis(container);
      });

      // play button
      $('.video-container__play', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container');
        // reveal
        $container.addClass('video-container--playing');

        // broadcast a play event on the section container
        $(container).trigger("cc:video:play");

        // play
        var id = $container.data('video-container-id');
        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.playVideo();
        } else if (id.indexOf('theme-vi-video') === 0) {
          _.vimeoVars.videoData[id].player.play();
        } else if (id.indexOf('theme-mp-video') === 0) {
          _.mp4Vars.videoData[id].element.play();
        }
      });

      // modal close button
      $('.video-container__stop', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container');
        // hide
        $container.removeClass('video-container--playing');

        // broadcast a stop event on the section container
        $(container).trigger("cc:video:stop");

        // play
        var id = $container.data('video-container-id');
        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.stopVideo();
        } else {
          _.vimeoVars.videoData[id].player.pause();
          _.vimeoVars.videoData[id].player.setCurrentTime(0);
        }
      });
    };

    this.onSectionUnload = function (container) {
      $('.video-container__play, .video-container__stop', container).off('click');
      $(window).off('.' + $('.video-container').data('video-container-id'));
      $(window).off('debouncedresize.video-manager-resize');
      _._unloadYoutubeVideos(container);
      _._unloadVimeoVideos(container);
      _._unloadMp4Videos(container);
      $(container).trigger("cc:video:stop");
    };
  }();

  // Youtube API callback
  window.onYouTubeIframeAPIReady = function () {
    theme.VideoManager.youtubeApiReady();
  };

  // Register the section
  cc.sections.push({
    name: 'video',
    section: theme.VideoManager });

  theme.MapSection = new function () {
    var _ = this;
    _.config = {
      zoom: 14,
      styles: {
        default: [],
        silver: [{ "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }],
        retro: [{ "elementType": "geometry", "stylers": [{ "color": "#ebe3cd" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#523735" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f1e6" }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#c9b2a6" }] }, { "featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [{ "color": "#dcd2be" }] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#ae9e90" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#93817c" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#a5b076" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#447530" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#f5f1e6" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#fdfcf8" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#f8c967" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#e9bc62" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#e98d58" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{ "color": "#db8555" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#806b63" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [{ "color": "#8f7d77" }] }, { "featureType": "transit.line", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ebe3cd" }] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#b9d3c2" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#92998d" }] }],
        dark: [{ "elementType": "geometry", "stylers": [{ "color": "#212121" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] }, { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }, { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }],
        night: [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }],
        aubergine: [{ "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] }, { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#64779e" }] }, { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e87" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#023e58" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#6f9ba5" }] }, { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#023e58" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#3C7680" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#2c6675" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#255763" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#b0d5ce" }] }, { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{ "color": "#023e58" }] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] }, { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#283d6a" }] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#3a4762" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4e6d70" }] }] } };


    _.apiStatus = null;

    this.geolocate = function ($map) {
      var deferred = $.Deferred();
      var geocoder = new google.maps.Geocoder();
      var address = $map.data('address-setting');

      geocoder.geocode({ address: address }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          deferred.reject(status);
        }

        deferred.resolve(results);
      });

      return deferred;
    };

    this.createMap = function (container) {
      var $map = $('.map-section__map-container', container);

      return _.geolocate($map).
      then(
      function (results) {
        var mapOptions = {
          zoom: _.config.zoom,
          styles: _.config.styles[$(container).data('map-style')],
          center: results[0].geometry.location,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          disableDefaultUI: true,
          zoomControl: !$map.data('hide-zoom') };


        _.map = new google.maps.Map($map[0], mapOptions);
        _.center = _.map.getCenter();

        var marker = new google.maps.Marker({
          map: _.map,
          position: _.center,
          clickable: false });


        google.maps.event.addDomListener(window, 'resize', function () {
          google.maps.event.trigger(_.map, 'resize');
          _.map.setCenter(_.center);
        });
      }.bind(this)).

      fail(function () {
        var errorMessage;

        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = theme.strings.addressNoResults;
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = theme.strings.addressQueryLimit;
            break;
          default:
            errorMessage = theme.strings.addressError;
            break;}


        // Only show error in the theme editor
        if (Shopify.designMode) {
          var $mapContainer = $map.parents('.map-section');

          $mapContainer.addClass('page-width map-section--load-error');
          $mapContainer.
          find('.map-section__wrapper').
          html(
          '<div class="errors text-center">' + errorMessage + '</div>');

        }
      });
    };

    this.onSectionLoad = function (target) {
      var $container = $(target);
      // Global function called by Google on auth errors
      window.gm_authFailure = function () {
        if (!Shopify.designMode) return;

        $container.addClass('page-width map-section--load-error');
        $container.
        find('.map-section__wrapper').
        html(
        '<div class="errors text-center">' + theme.strings.authError + '</div>');

      };

      // create maps
      var key = $container.data('api-key');

      if (typeof key !== 'string' || key === '') {
        return;
      }

      // load map
      theme.loadScriptOnce('https://maps.googleapis.com/maps/api/js?key=' + key, function () {
        _.createMap($container);
      });
    };

    this.onSectionUnload = function (target) {
      if (typeof window.google !== 'undefined' && typeof google.maps !== 'undefined') {
        google.maps.event.clearListeners(_.map, 'resize');
      }
    };
  }();

  // Register the section
  cc.sections.push({
    name: 'map',
    section: theme.MapSection });

  theme.FaqHeader = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.container = container;

      this.classNames = {
        questionContainerInactive: 'faq-search-item-inactive',
        sectionWithIndexStatus: 'section-faq-header--with-index' };


      this.searchInput = this.container.querySelector('.faq-search__input');
      if (this.searchInput) {
        this.registerEventListener(this.searchInput, 'change', this.functions.performSearch.bind(this));
        this.registerEventListener(this.searchInput, 'keyup', this.functions.performSearch.bind(this));
        this.registerEventListener(this.searchInput, 'paste', this.functions.performSearch.bind(this));
      }

      this.functions.debouncedBuildIndex = theme.debounce(this.functions.buildIndex.bind(this), 50);
      this.registerEventListener(document, 'theme:faq-header-update', this.functions.debouncedBuildIndex);
      this.functions.debouncedBuildIndex();

      if (this.container.querySelector('.faq-index')) {
        this.registerEventListener(this.container, 'click', this.functions.handleIndexClick.bind(this));
        this.container.closest('.section-faq-header').classList.add(this.classNames.sectionWithIndexStatus);
        this.functions.resizeIndex.call(this);
        this.registerEventListener(window, 'resize', theme.debounce(this.functions.resizeIndex.bind(this), 250));
      }
    };

    this.onSectionReorder = function (container) {
      this.functions.debouncedBuildIndex();
    };

    this.functions = {
      buildIndex: function buildIndex() {
        var faqHeaderSection = this.container.closest('.section-faq-header'),
        indexContainer = this.container.querySelector('.faq-index__item-container');

        if (indexContainer) {
          indexContainer.querySelectorAll('.faq-index-item').forEach(element => {
            element.parentNode.removeChild(element);
          });
        }

        this.linkedCollapsibleTabs = [];
        this.linkedQuestionContainers = [];
        this.linkedContent = [];

        var currentElement = faqHeaderSection;
        while (currentElement.nextElementSibling && currentElement.nextElementSibling.classList.contains('section-collapsible-tabs')) {
          currentElement = currentElement.nextElementSibling;

          // build list of searchable content
          this.linkedCollapsibleTabs.push(currentElement);
          currentElement.querySelectorAll('.collapsible-tabs__tab').forEach(element => this.linkedQuestionContainers.push(element));
          currentElement.querySelectorAll('.collapsible-tabs__content').forEach(element => this.linkedContent.push(element));

          // build index UI
          if (indexContainer) {
            var currentElementHeading = currentElement.querySelector('.collapsible-tabs__heading');
            if (currentElementHeading) {
              var tve = theme.createTemplateVariableEncoder();
              tve.add('title_id', currentElementHeading.id, 'attribute');
              tve.add('title', currentElementHeading.innerHTML, 'raw');

              var html = "\n              <div class=\"faq-index-item\">\n                <a class=\"faq-index-item__link\" href=\"#".concat(

              tve.values.title_id, "\">").concat(tve.values.title, "</a>\n              </div>");

              var htmlFragment = document.createRange().createContextualFragment(html);
              indexContainer.appendChild(htmlFragment);
            }
          }
        }

        if (indexContainer) {
          this.functions.resizeIndex.call(this);
        }
      },

      resizeIndex: function resizeIndex() {
        var stickyContainer = this.container.querySelector('.faq-index__sticky-container'),
        faqHeaderSection = this.container.closest('.section-faq-header');

        var currentElement = faqHeaderSection;
        while (currentElement.nextElementSibling && currentElement.nextElementSibling.classList.contains('section-collapsible-tabs')) {
          currentElement = currentElement.nextElementSibling;
        }

        var stickyContainerRect = stickyContainer.getBoundingClientRect(),
        currentElementRect = currentElement.getBoundingClientRect();

        stickyContainer.style.height = currentElementRect.bottom - stickyContainerRect.top + 'px';
      },

      performSearch: function performSearch() {
        // defer to avoid input lag
        setTimeout(() => {
          var splitValue = this.searchInput.value.split(' ');

          // sanitise terms
          var terms = [];
          splitValue.forEach(t => {
            if (t.length > 0) {
              terms.push(t.toLowerCase());
            }
          });

          // search
          this.linkedQuestionContainers.forEach(element => {
            if (terms.length) {
              var termFound = false;
              var matchContent = element.textContent.toLowerCase();
              terms.forEach(term => {
                if (matchContent.indexOf(term) >= 0) {
                  termFound = true;
                }
              });
              if (termFound) {
                element.classList.remove(this.classNames.questionContainerInactive);
              } else {
                element.classList.add(this.classNames.questionContainerInactive);
              }
            } else {
              element.classList.remove(this.classNames.questionContainerInactive);
            }
          });

          // hide non-question content if doing a search
          this.linkedContent.forEach(element => {
            if (terms.length) {
              element.classList.add(this.classNames.questionContainerInactive);
            } else {
              element.classList.remove(this.classNames.questionContainerInactive);
            }
          });
        }, 10);
      },

      handleIndexClick: function handleIndexClick(evt) {
        if (evt.target.classList.contains('faq-index-item__link')) {
          evt.preventDefault();
          var id = evt.target.href.split('#')[1];
          var scrollTarget = document.getElementById(id);
          var scrollTargetY = scrollTarget.getBoundingClientRect().top + window.pageYOffset - 50;

          // sticky header offset
          var stickyHeight = getComputedStyle(document.documentElement).getPropertyValue('--theme-sticky-header-height');
          if (stickyHeight) {
            scrollTargetY -= parseInt(stickyHeight);
          }

          window.scrollTo({
            top: scrollTargetY,
            behavior: 'smooth' });

        }
      } };

  }();

  // Register section
  cc.sections.push({
    name: 'faq-header',
    section: theme.FaqHeader,
    deferredLoad: false });

  theme.CollapsibleTabs = new function () {
    this.onSectionLoad = function (container) {
      this.functions.notifyFaqHeaderOfChange();
    };

    this.onSectionReorder = function (container) {
      this.functions.notifyFaqHeaderOfChange();
    };

    this.onSectionUnload = function (container) {
      this.functions.notifyFaqHeaderOfChange();
    };

    this.functions = {
      notifyFaqHeaderOfChange: function notifyFaqHeaderOfChange() {
        document.dispatchEvent(
        new CustomEvent('theme:faq-header-update', { bubbles: true, cancelable: false }));

      } };

  }();

  // Register section
  cc.sections.push({
    name: 'collapsible-tabs',
    section: theme.CollapsibleTabs,
    deferredLoad: false });

  /**
   * StoreAvailability Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace StoreAvailability
   */

  theme.StoreAvailability = function (container) {
    var loadingClass = 'store-availability-loading';
    var initClass = 'store-availability-initialized';
    var storageKey = 'cc-location';

    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.productId = this.$container.data('store-availability-container');
      this.sectionUrl = this.$container.data('section-url');
      this.$modal;

      this.$container.addClass(initClass);
      this.transitionDurationMS = parseFloat(getComputedStyle(container).transitionDuration) * 1000;
      this.removeFixedHeightTimeout = -1;

      // Handle when a variant is selected
      $(window).on("cc-variant-updated".concat(this.namespace).concat(this.productId), (e, args) => {
        if (args.product.id === this.productId) {
          this.functions.updateContent.bind(this)(
          args.variant ? args.variant.id : null,
          args.product.title,
          this.$container.data('has-only-default-variant'),
          args.variant && typeof args.variant.available !== "undefined");

        }
      });

      // Handle single variant products
      if (this.$container.data('single-variant-id')) {
        this.functions.updateContent.bind(this)(
        this.$container.data('single-variant-id'),
        this.$container.data('single-variant-product-title'),
        this.$container.data('has-only-default-variant'),
        this.$container.data('single-variant-product-available'));

      }
    };

    this.onSectionUnload = function () {
      $(window).off("cc-variant-updated".concat(this.namespace).concat(this.productId));
      this.$container.off('click');
      if (this.$modal) {
        this.$modal.off('click');
      }
    };

    this.functions = {
      // Returns the users location data (if allowed)
      getUserLocation: function getUserLocation() {
        return new Promise((resolve, reject) => {
          var storedCoords;

          if (sessionStorage[storageKey]) {
            storedCoords = JSON.parse(sessionStorage[storageKey]);
          }

          if (storedCoords) {
            resolve(storedCoords);

          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
              function (position) {
                var coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude };


                //Set the localization api
                fetch('/localization.json', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json' },

                  body: JSON.stringify(coords) });


                //Write to a session storage
                sessionStorage[storageKey] = JSON.stringify(coords);

                resolve(coords);
              }, function () {
                resolve(false);
              }, {
                maximumAge: 3600000, // 1 hour
                timeout: 5000 });


            } else {
              resolve(false);
            }
          }
        });
      },

      // Requests the available stores and calls the callback
      getAvailableStores: function getAvailableStores(variantId, cb) {
        return $.get(this.sectionUrl.replace('VARIANT_ID', variantId), cb);
      },

      // Haversine Distance
      // The haversine formula is an equation giving great-circle distances between
      // two points on a sphere from their longitudes and latitudes
      calculateDistance: function calculateDistance(coords1, coords2, unitSystem) {
        var dtor = Math.PI / 180;
        var radius = unitSystem === 'metric' ? 6378.14 : 3959;

        var rlat1 = coords1.latitude * dtor;
        var rlong1 = coords1.longitude * dtor;
        var rlat2 = coords2.latitude * dtor;
        var rlong2 = coords2.longitude * dtor;

        var dlon = rlong1 - rlong2;
        var dlat = rlat1 - rlat2;

        var a =
        Math.pow(Math.sin(dlat / 2), 2) +
        Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;
      },

      // Updates the existing modal pickup with locations with distances from the user
      updateLocationDistances: function updateLocationDistances(coords) {
        var unitSystem = this.$modal.find('[data-unit-system]').data('unit-system');
        var self = this;

        this.$modal.find('[data-distance="false"]').each(function () {
          var thisCoords = {
            latitude: parseFloat($(this).data('latitude')),
            longitude: parseFloat($(this).data('longitude')) };


          if (thisCoords.latitude && thisCoords.longitude) {
            var distance = self.functions.calculateDistance(
            coords, thisCoords, unitSystem).toFixed(1);

            $(this).html(distance);

            //Timeout to trigger animation
            setTimeout(() => {
              $(this).closest('.store-availability-list__location__distance').addClass('-in');
            }, 0);
          }

          $(this).attr('data-distance', 'true');
        });
      },

      // Requests the available stores and updates the page with info below Add to Basket, and append the modal to the page
      updateContent: function updateContent(variantId, productTitle, isSingleDefaultVariant, isVariantAvailable) {
        this.$container.off('click', '[data-store-availability-modal-open]');
        this.$container.off('click' + this.namespace, '.cc-popup-close, .cc-popup-background');
        $('.store-availabilities-modal').remove();

        if (!isVariantAvailable) {
          //If the variant is Unavailable (not the same as Out of Stock) - hide the store pickup completely
          this.$container.addClass(loadingClass);
          if (this.transitionDurationMS > 0) {
            this.$container.css('height', '0px');
          }
        } else {
          this.$container.addClass(loadingClass);
          if (this.transitionDurationMS > 0) {
            this.$container.css('height', this.$container.outerHeight() + 'px');
          }
        }

        if (isVariantAvailable) {
          this.functions.getAvailableStores.call(this, variantId, response => {
            if (response.trim().length > 0 && !response.includes('NO_PICKUP')) {
              this.$container.html(response);
              this.$container.html(this.$container.children().first().html()); // editor bug workaround

              this.$container.find('[data-store-availability-modal-product-title]').html(productTitle);

              if (isSingleDefaultVariant) {
                this.$container.find('.store-availabilities-modal__variant-title').remove();
              }

              this.$container.find('.cc-popup').appendTo('body');

              this.$modal = $('body').find('.store-availabilities-modal');
              var popup = new ccPopup(this.$modal, this.namespace);

              this.$container.on('click', '[data-store-availability-modal-open]', () => {
                popup.open();

                //When the modal is opened, try and get the users location
                this.functions.getUserLocation().then(coords => {
                  if (coords && this.$modal.find('[data-distance="false"]').length) {
                    //Re-retrieve the available stores location modal contents
                    this.functions.getAvailableStores.call(this, variantId, response => {
                      this.$modal.find('.store-availabilities-list').html($(response).find('.store-availabilities-list').html());
                      this.functions.updateLocationDistances.bind(this)(coords);
                    });
                  }
                });

                return false;
              });

              this.$modal.on('click' + this.namespace, '.cc-popup-close, .cc-popup-background', () => {
                popup.close();
              });

              this.$container.removeClass(loadingClass);

              if (this.transitionDurationMS > 0) {
                var newHeight = this.$container.find('.store-availability-container').outerHeight();
                this.$container.css('height', newHeight > 0 ? newHeight + 'px' : '');
                clearTimeout(this.removeFixedHeightTimeout);
                this.removeFixedHeightTimeout = setTimeout(() => {
                  this.$container.css('height', '');
                }, this.transitionDurationMS);
              }
            }
          });
        }
      } };


    // Initialise the section when it's instantiated
    this.onSectionLoad(container);
  };

  // Register section
  cc.sections.push({
    name: 'store-availability',
    section: theme.StoreAvailability });

  /**
   * Popup Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Popup
   */

  theme.Popup = new function () {
    /**
     * Popup section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    var dismissedStorageKey = 'cc-theme-popup-dismissed';

    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.popup = new ccPopup(this.$container, this.namespace);

      var dismissForDays = this.$container.data('dismiss-for-days'),
      delaySeconds = this.$container.data('delay-seconds'),
      showPopup = true,
      testMode = this.$container.data('test-mode'),
      lastDismissed = window.localStorage.getItem(dismissedStorageKey);

      // Should we show it during this page view?
      // Check when it was last dismissed
      if (lastDismissed) {
        var dismissedDaysAgo = (new Date().getTime() - lastDismissed) / (1000 * 60 * 60 * 24);
        if (dismissedDaysAgo < dismissForDays) {
          showPopup = false;
        }
      }

      // Check for error or success messages
      if (this.$container.find('.cc-popup-form__response').length) {
        showPopup = true;
        delaySeconds = 1;

        // If success, set as dismissed
        if (this.$container.find('.cc-popup-form__response--success').length) {
          this.functions.popupSetAsDismissed.call(this);
        }
      }

      // Prevent popup on Shopify robot challenge page
      if (document.querySelector('.shopify-challenge__container')) {
        showPopup = false;
      }

      // Show popup, if appropriate
      if (showPopup || testMode) {
        setTimeout(() => {
          this.popup.open();
        }, delaySeconds * 1000);
      }

      // Click on close button or modal background
      this.$container.on('click' + this.namespace, '.cc-popup-close, .cc-popup-background', () => {
        this.popup.close(() => {
          this.functions.popupSetAsDismissed.call(this);
        });
      });
    };

    this.onSectionSelect = function () {
      this.popup.open();
    };

    this.functions = {
      /**
       * Use localStorage to set as dismissed
       */
      popupSetAsDismissed: function popupSetAsDismissed() {
        window.localStorage.setItem(dismissedStorageKey, new Date().getTime());
      } };


    /**
     * Event callback for Theme Editor `section:unload` event
     */
    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
    };
  }();

  // Register section
  cc.sections.push({
    name: 'newsletter-popup',
    section: theme.Popup });



  /*================ General =================*/
  theme.owlCarouselEventList = ['to', 'next', 'prev', 'destroy', 'initialized', 'resized', 'refreshed'].join('.owl.carousel ') + '.owl.carousel';
  theme.beforeCarouselLoadEventBlockFix = function (carouselEls) {
    $(carouselEls).on(theme.owlCarouselEventList, function (evt) {
      evt.stopPropagation();
    });
  };

  theme.beforeCarouselUnloadEventBlockFix = function (carouselEls) {
    $(carouselEls).off(theme.owlCarouselEventList);
  };

  theme.loadCarousels = function (container) {
    return $('.carousel', container).each(function () {
      var $this = $(this);

      function getTotalProductBlockWidth() {
        var productBlockTotalWidth = 0;
        $this.find($this.hasClass('owl-loaded') ? '.owl-item:not(.cloned)' : '.product-block').each(function () {
          productBlockTotalWidth += $(this).outerWidth(true);
        });
        return productBlockTotalWidth;
      }

      // next & prev arrows
      $this.closest('.collection-slider').on('click.themeCarousel', '.prev, .next', function (e) {
        e.preventDefault();
        var carousel = $(this).closest('.collection-slider').find('.owl-carousel').data('owl.carousel');
        if ($(this).hasClass('prev')) {
          carousel.prev();
        } else {
          carousel.next();
        }
      });

      // create options
      var carouselOptions, isLooping;
      var fixedMode = !$(this).closest('.container--no-max').length;
      $this.toggleClass('carousel--fixed-grid-mode', fixedMode);
      if (fixedMode) {
        var desktopNumPerRow = parseInt($(this)[0].className.match(/per-row-(.)/)[1]);
        carouselOptions = {
          margin: 0,
          loop: false,
          autoWidth: false,
          items: 5,
          center: false,
          nav: false,
          dots: false,
          responsive: {
            0: {
              items: desktopNumPerRow < 4 ? 1 : 2 },

            480: {
              items: Math.min(2, desktopNumPerRow - 2) },

            767: {
              items: desktopNumPerRow - 1 },

            1000: {
              items: desktopNumPerRow } } };



      } else {
        isLooping = getTotalProductBlockWidth() > $this.width();
        carouselOptions = {
          margin: 0,
          loop: isLooping,
          autoWidth: true,
          items: Math.min($this.children().length, 8),
          center: true,
          nav: false,
          dots: false };

      }

      carouselOptions.rtl = document.querySelector('html[dir=rtl]') ? true : false;

      // init carousel
      var loadCarousel = function loadCarousel() {
        // remove data-src as not in correct format for Owl to parse
        $this.find('[data-src]').each(function () {
          $(this).attr('data-src-temp', $(this).attr('data-src')).removeAttr('data-src');
        });

        // fix for event propagation in nested owl carousels
        theme.beforeCarouselLoadEventBlockFix($this);

        // run after carousel is initialised
        $this.on('initialized.owl.carousel', function () {
          // restore data-src
          $this.find('[data-src-temp]').each(function () {
            $(this).attr('data-src', $(this).attr('data-src-temp')).removeAttr('data-src-temp');
          });
          // lazysizes on primary images
          $this.find('.product-block__image--primary .lazyload--manual, .product-block__image--secondary[data-image-index="1"] .lazyload--manual, .product-block-options__item.lazyload--manual').removeClass('lazyload--manual').addClass('lazyload');
          // ensure clones are processed from scratch
          theme.ProductBlockManager.loadImages($this.closest('[data-section-type]'));
          // recalculate widths, after the above's async calls
          setTimeout(function () {
            $this.data('owl.carousel').invalidate('width');
            $this.trigger('refresh.owl.carousel');
          }, 10);
        });

        // run after carousel is initialised or resized
        $this.on('initialized.owl.carousel resized.owl.carousel', function (evt) {
          // only loop if items do not all fit on screen, in non-fixed mode
          if (!fixedMode && evt.type == 'resized') {
            var shouldLoop = getTotalProductBlockWidth() > $this.width();
            if (shouldLoop != isLooping) {
              // destroy and rebuild carousel with appropriate loop setting
              carouselOptions.loop = shouldLoop;
              isLooping = shouldLoop;

              // destroy function
              $(evt.target).data('owl.carousel').destroy();

              // build again
              $(evt.target).owlCarousel(carouselOptions);

              // do no more in this callback
              return;
            }
          }

          // layout fixes
          setTimeout(function () {
            // fixes
            var currentWidth = $this.find('.owl-stage').width();
            var stageIsPartiallyOffScreen = currentWidth > $this.width();
            if (stageIsPartiallyOffScreen) {
              // more elements than fit in viewport
              // resize stage to avoid rounding-error wrapping
              var newWidth = 0;
              $this.find('.owl-item').each(function () {
                newWidth += $(this).outerWidth(true) + 1;
              });
              $this.find('.owl-stage').css({}).
              removeClass('owl-stage--items-fit');
            } else {
              // all elements fit inside viewport
              // centre-align using css, if not full
              $this.find('.owl-stage').addClass('owl-stage--items-fit').css({});

            }
            // previous/next button visibility
            $this.closest('.collection-slider').find('.prev, .next').toggleClass('owl-btn-disabled', !stageIsPartiallyOffScreen);
          }, 10);
        });

        // run when the contents change, for any reason
        theme.carouselInputIncrementer = theme.carouselInputIncrementer || 0;
        $this.on('refreshed.owl.carousel', function () {
          // set a11y attrs to avoid clone items giving duplication errors
          $('.owl-item', this).removeAttr('aria-hidden');
          $('.owl-item.cloned', this).attr('aria-hidden', 'true').each(function () {
            theme.carouselInputIncrementer++;
            var uniquenessSuffix = '_' + theme.carouselInputIncrementer;
            $(this).find('form[id]:not([data-id-altered]), :input[id]:not([data-id-altered])').each(function () {
              $(this).attr('id', $(this).attr('id') + uniquenessSuffix);
            }).attr('data-id-altered', true);

            $(this).find('label[for]:not([data-id-altered])').each(function () {
              $(this).attr('for', $(this).attr('for') + uniquenessSuffix);
            }).attr('data-id-altered', true);
          });
        }).addClass('owl-carousel').owlCarousel(carouselOptions);
      };
      loadCarousel();
    });
  };

  theme.unloadCarousels = function (container) {
    $('.collection-slider', container).off('.themeCarousel');
    $('.slick-slider', container).slick('unslick');
    theme.beforeCarouselUnloadEventBlockFix($('.owl-carousel', container));
    $('.owl-carousel', container).each(function () {
      $(this).data('owl.carousel').destroy();
    });
  };

  theme.icons = {
    left: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>' + theme.strings.icon_labels_left + '</title><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
    right: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>' + theme.strings.icon_labels_right + '</title><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><title>' + theme.strings.icon_labels_close + '</title><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left ltr-icon"><title>' + theme.strings.icon_labels_left + '</title><polyline points="15 18 9 12 15 6"></polyline></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right ltr-icon"><title>' + theme.strings.icon_labels_right + '</title><polyline points="9 18 15 12 9 6"></polyline></svg>',
    chevronDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>' + theme.strings.icon_labels_down + '</title><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
    tick: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    label: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><title>Label</title><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7" y2="7"></line></svg>' };


  // Get Shopify feature support
  try {
    theme.Shopify.features = JSON.parse(document.documentElement.querySelector('#shopify-features').textContent);
  } catch (e) {
    theme.Shopify.features = {};
  }

  theme.namespaceFromSection = function (container) {
    return ['.', $(container).data('section-type'), $(container).data('section-id')].join('');
  };

  theme.toggleLinkDropdownButton = function (evt) {
    evt.stopPropagation();
    var $btn = $(evt.currentTarget),
    doExpand = $btn.attr('aria-expanded') == 'false';
    $btn.attr('aria-expanded', doExpand);
    $btn.css('width', $btn.outerWidth() + 'px');
    var newWidth = null,
    $optsBox = $btn.next(),
    isLeftAligned = $btn.closest('.link-dropdown').hasClass('link-dropdown--left-aligned');
    if (!isLeftAligned) {
      if (doExpand) {
        newWidth = $optsBox.outerWidth();
        // rtl - could be either side
        if (document.querySelector('html[dir=rtl]')) {
          newWidth += parseInt($optsBox.css('left'));
        } else {
          newWidth += parseInt($optsBox.css('right'));
        }
        newWidth -= parseInt($optsBox.find('.link-dropdown__link:first').css('padding-inline-start'));
      } else {
        newWidth = parseInt($btn.css('padding-inline-end')) + $btn.find('.link-dropdown__button-text').width() + 1;
      }
      setTimeout(function () {
        $btn.css('width', newWidth + 'px');
      }, 10);
    }
  };

  // Enables any images inside a container
  theme.awakenImagesFromSlumber = function ($cont) {
    $cont.find('.lazyload--manual:not(.lazyload)').addClass('lazyload');
  };

  theme.measureTextInsideElement = function (text, element) {
    theme.measureTextInsideElementCanvas = theme.measureTextInsideElementCanvas || document.createElement("canvas");
    var context = theme.measureTextInsideElementCanvas.getContext("2d");
    var font = getComputedStyle(element).font;
    context.font = font;
    return context.measureText(text);
  };

  // Use non-breaking space to attempt to avoid orphans
  theme.avoidUnecessaryOrphans = function (element) {
    if (theme.settings.avoid_orphans) {
      var innerTextSplit = element.innerText.split(' ');
      if (
      innerTextSplit.length >= 4 && // 4 or more words
      innerTextSplit[innerTextSplit.length - 1].length + innerTextSplit[innerTextSplit.length - 2].length < 20 // last two words aren't particularly long together
      ) {
          var html = element.innerHTML;
          if (html.indexOf('<span class="orphan-join">') < 0) {
            html = html.replace(/<[^>]*?>/g, match => {
              return match.replace(/ /g, 'ΩΩ');
            });
            var splitHtml = html.split(' '),
            lastItem = splitHtml.pop();

            // ensure length of text will be smaller than container, excluding HTML
            if (theme.measureTextInsideElement(splitHtml[splitHtml.length - 1].replace(/<[^>]*?>/g, '') + ' ' + lastItem.replace(/<[^>]*?>/g, ''), element).width > element.clientWidth) {
              return;
            }

            html = splitHtml.join(' ') + '<span class="orphan-join"> </span>' + lastItem;
            html = html.replace(/ΩΩ/g, ' ');
            element.innerHTML = html;
          }
        }
    }
  };

  theme.stickyHeaderHeight = function () {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--theme-sticky-header-height');
    if (v) {
      return parseInt(v) || 0;
    } else {
      return 0;
    }
  };

  theme.getOffsetTopFromDoc = el => {
    return el ? theme.getOffsetTopFromDoc(el.offsetParent) + el.offsetTop : 0;
  };

  theme.getScrollParent = function (node) {
    var isElement = node instanceof HTMLElement;
    var overflowY = isElement && window.getComputedStyle(node).overflowY;
    var isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (!node) {
      return null;
    } else if (isScrollable && node.scrollHeight > node.clientHeight) {
      return node;
    }

    return theme.getScrollParent(node.parentNode) || document.scrollingElement || window;
  };

  theme.scrollToRevealElement = function (el) {
    var scrollContainer = theme.getScrollParent(el);
    var scrollTop = scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
    var scrollVisibleHeight = scrollContainer === window ? window.innerHeight : scrollContainer.clientHeight;
    var elTop = theme.getOffsetTopFromDoc(el),
    elBot = elTop + el.offsetHeight,
    inViewTop = scrollTop + theme.stickyHeaderHeight(),
    inViewBot = scrollTop + scrollVisibleHeight - 50;

    if (elTop < inViewTop || elBot > inViewBot) {
      scrollContainer.scrollTo({
        top: elTop - 100 - theme.stickyHeaderHeight(),
        left: 0,
        behavior: 'smooth' });

    }
  };

  theme.getEmptyOptionSelectors = function ($formContainer) {
    var emptySections = [];

    $formContainer.find('[data-selector-type="dropdown"].option-selector').each(function () {
      if (!$(this).find('[aria-selected="true"]').filter(function () {
        return this.dataset && this.dataset.value;
      }).length) {
        emptySections.push(this);
      }
    });

    $formContainer.find('[data-selector-type="listed"].option-selector').each(function () {
      if (!$(this).find('input:checked').length) {
        emptySections.push(this);
      }
    });

    return emptySections;
  };

  theme.validateProductForm = function ($formContainer) {
    $formContainer.find('.option-selector--empty').
    removeClass('option-selector--empty').
    find('.label__prefix').
    remove();

    if (!$formContainer.find('.original-selector').val()) {
      var emptySections = theme.getEmptyOptionSelectors($formContainer);

      if (emptySections.length) {
        emptySections.forEach(el => {
          el.classList.add('option-selector--empty');
          var labelPrefix = document.createElement('span');
          labelPrefix.innerText = theme.strings.products_product_pick_a + ' ';
          labelPrefix.className = 'label__prefix';
          el.querySelector('.label').prepend(labelPrefix);
        });

        theme.scrollToRevealElement(emptySections[0]);

        $formContainer.addClass('product-form--validation-started');
      }
      return false;

    } else if (!theme.OptionManager.getCurrentVariantData($formContainer).available) {
      // variant unavailable
      return false;

    } else {
      return true;
    }
  };

  theme.pauseAllMedia = function (params) {
    if (!params || params.videos) {
      document.querySelectorAll('.js-youtube').forEach(video => {
        video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
      });
      document.querySelectorAll('.js-vimeo').forEach(video => {
        video.contentWindow.postMessage('{"method":"pause"}', '*');
      });
      document.querySelectorAll('video').forEach(video => video.pause());
    }
    if (!params || params.models) {
      document.querySelectorAll('product-model').forEach(model => {
        if (model.modelViewerUI) model.modelViewerUI.pause();
      });
    }
  };

  theme.suffixIds = (container, prefix) => {
    var suffixCandidates = ['id', 'for', 'aria-describedby', 'aria-controls'];var _loop = function _loop(
    i) {
      container.querySelectorAll("[".concat(suffixCandidates[i], "]")).forEach(el => el.setAttribute(suffixCandidates[i], el.getAttribute(suffixCandidates[i]) + prefix));};for (var i = 0; i < suffixCandidates.length; i++) {_loop(i);
    }
  };

  // bg-set snippet in JS
  theme.lazyBGSetWidths = [180, 360, 540, 720, 900, 1080, 1296, 1512, 1728, 1950, 2100, 2260, 2450, 2700, 3000, 3350, 3750, 4100];
  theme.loadLazyBGSet = function (container) {
    $('[data-lazy-bgset-src]', container).each(function () {
      var srcset = '',
      masterSrc = $(this).data('lazy-bgset-src'),
      aspectRatio = $(this).data('lazy-bgset-aspect-ratio'),
      masterWidth = $(this).data('lazy-bgset-width'),
      masterHeight = Math.round(masterWidth / aspectRatio);

      for (var i = 0; i < theme.lazyBGSetWidths.length; i++) {
        var thisWidth = theme.lazyBGSetWidths[i];
        if (masterWidth >= thisWidth) {
          srcset += "".concat(theme.Shopify.formatImage(masterSrc, thisWidth + 'x'), " ").concat(thisWidth, "w ").concat(Math.round(thisWidth / aspectRatio), "h, ");
        }
      }
      srcset += "".concat(masterSrc, " ").concat(masterWidth, "w ").concat(masterHeight, "h");
      $(this).attr('data-bgset', srcset).removeClass('lazyload--manual').addClass('lazyload');
    });
  };



  /*=============== Components ===============*/
  theme.applyAjaxToProductForm = function ($formContainer) {
    $formContainer.find('form.product-purchase-form').each(function () {
      var $form = $(this);
      $form.on('submit', function (evt) {
        // Validate
        if (!theme.validateProductForm($formContainer)) {
          return false;
        }

        // Ajax-add
        if (theme.settings.cart_type === 'drawer' && $formContainer.is('[data-ajax-add-to-cart="true"]')) {
          evt.preventDefault();

          var shopifyAjaxAddURL = theme.routes.cart_add_url;

          //Disable add button
          $form.find('button[type="submit"]').attr('disabled', 'disabled').each(function () {
            $(this).data('previous-value', $(this).val());
          }).val(theme.strings.products_product_adding_to_cart);

          theme.removeAddedCartDrawer();

          //Add to cart
          var formData = new FormData($form[0]);
          formData.append('sections', 'cart-drawer');
          $.post(shopifyAjaxAddURL, new URLSearchParams(formData).toString(), theme.addedToCartHandler.bind($form), 'json').fail(function (data) {
            //Enable add button
            $form.find('button[type="submit"]').removeAttr('disabled').each(function () {
              $(this).val($(this).data('previous-value'));
            });

            //Not added, show message
            if (typeof data !== 'undefined' && typeof data.status !== 'undefined') {
              var jsonRes = $.parseJSON(data.responseText);
              theme.showQuickPopup(jsonRes.description, $form.find('button[type="submit"]:first'));
            } else {
              //Some unknown error? Disable ajax and add the old-fashioned way.
              $formContainer.attr('ajax-add-to-cart', 'false');
              $form.submit();
            }
          });
        }
      });
    });

    if (theme.settings.cart_type === 'drawer') {
      $(window).off('.ajaxAddScroll').on('scroll.ajaxAddScroll', function () {
        // Hide notifications on scroll
        theme.removeAddedCartDrawer();
      });
    }
  };

  theme.addedToCartHandler = function (response) {
    // Dispatch change event
    document.documentElement.dispatchEvent(
    new CustomEvent('theme:cartchanged', { bubbles: true, cancelable: false }));


    //Enable add button
    $(this).find('button[type="submit"]').removeAttr('disabled').each(function () {
      $btn = $(this);
      //Set to 'DONE', alter button style, wait a few secs, revert to normal
      $btn.val(theme.strings.products_product_added_to_cart).addClass('inverted');
      window.setTimeout(function () {
        $btn.removeClass('inverted').val($btn.data('previous-value'));
      }, 3000);
    });

    var $cartDrawerContainer = $(response.sections['cart-drawer']);
    var cartDrawer = $cartDrawerContainer.find('.cart-summary-overlay')[0];
    cartDrawer.classList.add('cart-summary-overlay--off-screen');

    // show only added item
    $cartDrawerContainer.find(".cart-summary-overlay__row-body:not([data-item-key=\"".concat(response.key, "\"])")).remove();

    cartDrawer.querySelector('.shop-more').addEventListener('click', function (evt) {
      evt.preventDefault();
      theme.removeAddedCartDrawer();
    });

    $cartDrawerContainer.prependTo('body');
    setTimeout(function () {
      cartDrawer.classList.remove('cart-summary-overlay--off-screen');
    }, 50);
  };

  theme.removeAddedCartDrawer = function () {
    document.querySelectorAll('.cart-summary-overlay').forEach(drawer => {
      drawer.classList.add('cart-summary-overlay--off-screen');
      var duration = parseFloat(getComputedStyle(drawer).transitionDuration) * 1000;
      setTimeout(() => $(drawer.parentElement).remove(), duration);
    });
  };

  theme.removeAjaxFromProductForm = function ($formContainer) {
    $formContainer.find('form.product-purchase-form').off('submit');
  };

  var CCFetchedContent = class extends HTMLElement {
    connectedCallback() {
      fetch(this.dataset.url).
      then(response => {
        if (!response.ok) {
          throw new Error("HTTP error! Status: ".concat(response.status));
        }
        return response.text();
      }).
      then(response => {
        var frag = document.createDocumentFragment(),
        fetchedContent = document.createElement('div');
        frag.appendChild(fetchedContent);
        fetchedContent.innerHTML = response;

        var replacementContent = fetchedContent.querySelector("[data-id=\"".concat(CSS.escape(this.dataset.id), "\"]"));
        if (replacementContent) {
          this.innerHTML = replacementContent.innerHTML;

          if (this.hasAttribute('contains-product-blocks')) {
            theme.ProductBlockManager.loadImages(this);
          }
        }
      });
    }};


  window.customElements.define('cc-fetched-content', CCFetchedContent);
  ;
  theme.LoadFilterer = function (section) {
    this.$container = section.$container;
    this.namespace = section.namespace;
    this.registerEventListener = section.registerEventListener;

    this.functions = {
      initFiltersEtc: function initFiltersEtc() {
        $('.filter-container', this.$container).addClass('filter-container--mobile-initialised');

        // append query vars onto sort urls (e.g. filters, vendor collection)
        if (location.href.indexOf('?') >= 0) {
          $('#sort-dropdown-options .link-dropdown__link', this.$container).each(function () {
            var queryTerms = location.href.split('?')[1].split('&');
            var newHref = $(this).attr('href');
            queryTerms.forEach(term => {
              if (term.indexOf('sort_by=') === -1) {
                newHref += '&' + term;
              }
            });
            $(this).attr('href', newHref);
          });
        }

        theme.ProductBlockManager.loadImages(this.$container);
      },

      switchGridLayout: function switchGridLayout(evt) {
        evt.preventDefault();
        if ($(evt.currentTarget).hasClass('layout-switch--one-column')) {
          this.$container.find('.product-list').removeClass('product-list--per-row-mob-2').addClass('product-list--per-row-mob-1');
        } else {
          this.$container.find('.product-list').removeClass('product-list--per-row-mob-1').addClass('product-list--per-row-mob-2');
        }
        $(evt.currentTarget).addClass('layout-switch--active').siblings().removeClass('layout-switch--active');
      },

      checkStickyScroll: function checkStickyScroll() {
        var utilityBarOffsetY = $('.utility-bar').offset().top;
        if ($(window).width() < 768 && this.previousScrollTop > window.scrollY && window.scrollY > utilityBarOffsetY) {
          $('body').addClass('utility-bar-sticky-mobile-copy-reveal');
        } else {
          $('body.utility-bar-sticky-mobile-copy-reveal').removeClass('utility-bar-sticky-mobile-copy-reveal');
        }
        this.previousScrollTop = window.scrollY;
      },

      ajaxLoadLink: function ajaxLoadLink(evt) {
        evt.preventDefault();
        this.functions.ajaxLoadUrl.call(this, $(evt.currentTarget).attr('href'));
      },

      ajaxLoadForm: function ajaxLoadForm(evt) {
        if (evt.type === 'submit') {
          evt.preventDefault();
        }
        var queryVals = [];
        evt.currentTarget.querySelectorAll('input, select').forEach(input => {
          if (
          (input.type !== 'checkbox' && input.type !== 'radio' || input.checked) && // is an active input value
          input.value !== '' // has a value
          ) {
              queryVals.push([input.name, encodeURIComponent(input.value)]);
            }
        });
        // new url
        var newUrl = location.pathname;
        queryVals.forEach(value => {
          newUrl += "&".concat(value[0], "=").concat(value[1]);
        });
        newUrl = newUrl.replace('&', '?');
        // load
        this.functions.ajaxLoadUrl.call(this, newUrl);
      },

      ajaxPopState: function ajaxPopState(event) {
        this.functions.ajaxLoadUrl.call(this, document.location.href, true);
      },

      ajaxLoadUrl: function ajaxLoadUrl(url, noPushState) {
        if (!noPushState) {
          // update url history
          var fullUrl = url;
          if (fullUrl.slice(0, 1) === '/') {
            fullUrl = window.location.protocol + '//' + window.location.host + fullUrl;
          }
          window.history.pushState({ path: fullUrl }, '', fullUrl);
        }

        // limit render to section, if possible (added after pushState)
        if (this.$container[0].dataset.filterSectionId) {
          url += (url.indexOf('?') >= 0 ? '&' : '?') + "section_id=".concat(this.$container[0].dataset.filterSectionId);
        }

        // start fetching URL
        var refreshContainerSelector = '[data-ajax-container]',
        $ajaxContainers = this.$container.find(refreshContainerSelector);

        // loading state
        $ajaxContainers.addClass('ajax-loading');

        // fetch content
        if (this.currentAjaxLoadUrlFetch) {
          this.currentAjaxLoadUrlFetch.abort();
        }
        this.currentAjaxLoadUrlFetch = $.get(url, function (data) {
          this.currentAjaxLoadUrlFetch = null;

          // save active element
          if (document.activeElement) {
            this.activeElementId = document.activeElement.id;
          }

          // unload content
          theme.ProductBlockManager.unloadImages(this.$container);

          // replace contents
          var $newAjaxContainers = $("<div>".concat(data, "</div>")).find(refreshContainerSelector);
          $newAjaxContainers.each(function (index) {
            $($ajaxContainers[index]).html($(this).html());
          });

          // init js
          this.functions.initFiltersEtc.call(this);

          // init theme components
          var $componentHaver = this.$container.closest('[data-components]');
          if ($componentHaver.length) {
            var components = $componentHaver.data('components').split(',');
            components.forEach(function (component) {
              $(document).trigger('cc:component:load', [component, $componentHaver[0]]);
            }.bind(this));
          }

          // remove loading state
          $ajaxContainers.removeClass('ajax-loading');

          // init scroll animations
          theme.initAnimateOnScroll();

          // restore active element
          if (this.activeElementId) {
            var el = document.getElementById(this.activeElementId);
            if (el) {
              el.focus();
            }
          }

          // scroll viewport (must be done after any page size changes)
          var scrollToY = $('[data-ajax-scroll-to]:first', this.$container).offset().top - $('.section-header').height();
          window.scrollTo({
            top: scrollToY,
            behavior: "smooth" });

        }.bind(this));
      } };


    // auto-select availability
    this.allowAutoApplyHideUnavailable = this.$container.find('.filters').data('auto-apply-hide-unavailable');
    if (this.allowAutoApplyHideUnavailable) {
      this.$container.on('change' + this.namespace, '.filter-group__checkbox, .cc-price-range__input', evt => {
        if (this.allowAutoApplyHideUnavailable) {
          if (evt.currentTarget.type === 'checkbox' && evt.currentTarget.checked || evt.currentTarget.type === 'text' && evt.currentTarget.value) {
            var toEnable = this.$container.find('[name="filter.v.availability"][value="1"]')[0];
            toEnable.checked = true;
            toEnable.dispatchEvent(
            new CustomEvent('change', { bubbles: true, cancelable: false }));

          }
        }
      });

      this.$container.on('change' + this.namespace, '.filter-group--availability .filter-toggle__input', evt => {
        if (evt.currentTarget.checked && evt.currentTarget.value == '1') {
          this.allowAutoApplyHideUnavailable = false;
        }
      });
    }

    // ajax filter & sort
    if (this.$container.data('ajax-filtering')) {
      // ajax load on link click
      this.$container.on('click' + this.namespace, '.link-dropdown__link, .filter-group__applied-item, .filter-group__clear-link, .pagination a', this.functions.ajaxLoadLink.bind(this));
      // ajax load form submission
      this.$container.on('change' + this.namespace + ' submit' + this.namespace, '#CollectionFilterForm', theme.debounce(this.functions.ajaxLoadForm.bind(this), 700));
      // handle back button
      this.registerEventListener(window, 'popstate', this.functions.ajaxPopState.bind(this));
    } else {
      this.$container.on('change' + this.namespace, '#CollectionFilterForm', function () {
        $(this).submit();
      });
    }

    // sort dropdown: open
    this.$container.on('click' + this.namespace, '.link-dropdown__button', theme.toggleLinkDropdownButton.bind(this));

    // sort dropdown: click anywhere else in page to close
    $(document).on('click' + this.namespace, function () {
      $('.link-dropdown__button[aria-expanded="true"]').trigger('click');
    });

    if (document.querySelector('.utility-bar')) {
      // duplicate utility bar for mobile
      var $utilBarClone = $('.utility-bar').clone().addClass('utility-bar--sticky-mobile-copy').removeAttr('data-ajax-container').insertAfter('.utility-bar');
      // ensure unique ids
      theme.suffixIds($utilBarClone[0], 'dupe');

      this.previousScrollTop = window.scrollY;
      $(window).on('throttled-scroll' + this.namespace, this.functions.checkStickyScroll.bind(this));

      // filter visibility
      this.$container.on('click' + this.namespace, '[data-toggle-filters]', function (evt) {
        var isNowVisible = $('.filter-container', this.$container).toggleClass('filter-container--show-filters-desktop filter-container--show-filters-mobile').hasClass('filter-container--show-filters-desktop');
        $('.toggle-btn[data-toggle-filters]', this.$container).toggleClass('toggle-btn--revealed-desktop', isNowVisible);
        // handle resized collection grid
        theme.ProductBlockManager.afterImagesResized();
        $('.slick-slider', this.$container).each(function () {
          $(this).slick('setPosition');
        });
        return false;
      }.bind(this));

      // layout switcher
      this.$container.on('click' + this.namespace, '.layout-switch', this.functions.switchGridLayout.bind(this));
    }

    // init things that may need re-initialising on ajax load
    this.functions.initFiltersEtc.call(this);

    this.destroy = function () {
      theme.ProductBlockManager.unloadImages(this.$container);
      theme.destroyProductGallery(this.$container);
      this.$container.off(this.namespace);
      $(window).off(this.namespace);
      $(document).off(this.namespace);
    }.bind(this);
  };

  theme.buildGalleryViewer = function (config) {
    // create viewer
    var $allContainer = $('<div class="gallery-viewer gallery-viewer--pre-reveal">'),
    $zoomContainer = $('<div class="gallery-viewer__zoom-container">').appendTo($allContainer),
    $thumbContainer = $('<div class="gallery-viewer__thumbs">').appendTo($allContainer),
    $controlsContainer = $('<div class="gallery-viewer__controls">').appendTo($allContainer),
    $close = $('<a class="gallery-viewer__button gallery-viewer__close" href="#">').html(config.close).appendTo($controlsContainer),
    $right = $('<a class="gallery-viewer__button gallery-viewer__prev" href="#">').html(config.prev).appendTo($controlsContainer),
    $left = $('<a class="gallery-viewer__button gallery-viewer__next" href="#">').html(config.next).appendTo($controlsContainer),
    $currentZoomImage = null,
    wheelZoomMultiplier = -0.001,
    pinchZoomMultiplier = 0.003,
    touchPanModifier = 1.0,
    currentTransform = {
      panX: 0,
      panY: 0,
      zoom: 1 };


    // add images
    for (var i = 0; i < config.images.length; i++) {
      var img = config.images[i];
      $('<a class="gallery-viewer__thumb" href="#">').data('zoom-url', img.zoomUrl).
      html(img.thumbTag).
      appendTo($thumbContainer);
    }

    if (config.images.length === 1) {
      $allContainer.addClass('gallery-viewer--single-image');
    }

    // helper function for panning an image
    var panZoomImageFromCoordinate = function panZoomImageFromCoordinate(inputX, inputY) {
      // do nothing if the image fits, pan if not
      var doPanX = $currentZoomImage.width() > $allContainer.width();
      var doPanY = $currentZoomImage.height() > $allContainer.height();
      if (doPanX || doPanY) {
        var midX = $allContainer.width() / 2;
        var midY = $allContainer.height() / 2;

        var offsetFromCentreX = inputX - midX,
        offsetFromCentreY = inputY - midY;

        // the offsetMultipler ensures it can only pan to the edge of the image, no further
        var finalOffsetX = 0;
        var finalOffsetY = 0;
        if (doPanX) {
          var offsetMultiplierX = ($currentZoomImage.width() - $allContainer.width()) / 2 / midX;
          finalOffsetX = Math.round(-offsetFromCentreX * offsetMultiplierX);
        }
        if (doPanY) {
          var offsetMultiplierY = ($currentZoomImage.height() - $allContainer.height()) / 2 / midY;
          finalOffsetY = Math.round(-offsetFromCentreY * offsetMultiplierY);
        }

        currentTransform.panX = finalOffsetX;
        currentTransform.panY = finalOffsetY;
        alterCurrentPanBy(0, 0); // sanitise
        updateImagePosition();
      }
    };

    var alterCurrentPanBy = function alterCurrentPanBy(x, y) {
      currentTransform.panX += x;
      // limit offset to keep most of image on screen
      var panXMax = ($currentZoomImage[0].naturalWidth * currentTransform.zoom - $allContainer.width()) / 2.0;
      panXMax = Math.max(panXMax, 0);
      currentTransform.panX = Math.min(currentTransform.panX, panXMax);
      currentTransform.panX = Math.max(currentTransform.panX, -panXMax);

      currentTransform.panY += y;
      var panYMax = ($currentZoomImage[0].naturalHeight * currentTransform.zoom - $allContainer.height()) / 2.0;
      panYMax = Math.max(panYMax, 0);
      currentTransform.panY = Math.min(currentTransform.panY, panYMax);
      currentTransform.panY = Math.max(currentTransform.panY, -panYMax);
      updateImagePosition();
    };

    var setCurrentTransform = function setCurrentTransform(panX, panY, zoom) {
      currentTransform.panX = panX;
      currentTransform.panY = panY;
      currentTransform.zoom = zoom;
      alterCurrentTransformZoomBy(0);
    };

    var alterCurrentTransformZoomBy = function alterCurrentTransformZoomBy(delta) {
      currentTransform.zoom += delta;
      // do not zoom out further than fit
      var maxZoomX = $allContainer.width() / $currentZoomImage[0].naturalWidth,
      maxZoomY = $allContainer.height() / $currentZoomImage[0].naturalHeight;
      currentTransform.zoom = Math.max(currentTransform.zoom, Math.min(maxZoomX, maxZoomY));

      // do not zoom in further than native size
      currentTransform.zoom = Math.min(currentTransform.zoom, 1.0);

      // reasses pan bounds
      alterCurrentPanBy(0, 0);
      updateImagePosition();
    };

    var updateImagePosition = function updateImagePosition() {
      $currentZoomImage.css(
      'transform', "translate3d(".concat(currentTransform.panX, "px, ").concat(currentTransform.panY, "px, 0) scale(").concat(currentTransform.zoom, ")"));

    };

    // set up events
    // event: select thumbnail - zoom it
    $allContainer.on('click.galleryViewer select.galleryViewer', '.gallery-viewer__thumb', function (evt) {
      evt.preventDefault();

      // set active
      $(this).addClass('gallery-viewer__thumb--active').
      siblings('.gallery-viewer__thumb--active').
      removeClass('gallery-viewer__thumb--active');

      // replace zoom image
      $currentZoomImage = $('<img class="gallery-viewer__zoom-image" alt="" style="visibility: hidden">');
      $currentZoomImage.on('load', function () {
        $(this).off('load');
        $(this).css({
          visibility: '',
          top: $allContainer.height() / 2 - $(this).height() / 2,
          left: $allContainer.width() / 2 - $(this).width() / 2 });

        setCurrentTransform(0, 0, 0); // centre, zoomed out
      }).attr('src', $(this).data('zoom-url'));

      $zoomContainer.html($currentZoomImage);
    });

    // event: pan
    var pinchTracking = {
      isTracking: false,
      lastPinchDistance: 0 };

    var touchTracking = {
      isTracking: false,
      lastTouchX: 0,
      lastTouchY: 0 };


    $allContainer.on('touchend.galleryViewer', function (evt) {
      pinchTracking.isTracking = false;
      touchTracking.isTracking = false;
    });

    $allContainer.on('mousemove.galleryViewer touchmove.galleryViewer', function (evt) {
      evt.preventDefault();
      if (evt.type === 'touchmove' && evt.touches.length > 0) {
        // pan
        var touch1 = evt.touches[0];
        if (!touchTracking.isTracking) {
          touchTracking.isTracking = true;
          touchTracking.lastTouchX = touch1.clientX;
          touchTracking.lastTouchY = touch1.clientY;
        } else {
          alterCurrentPanBy(
          (touch1.clientX - touchTracking.lastTouchX) * touchPanModifier,
          (touch1.clientY - touchTracking.lastTouchY) * touchPanModifier);

          touchTracking.lastTouchX = touch1.clientX;
          touchTracking.lastTouchY = touch1.clientY;
        }

        if (evt.touches.length === 2) {
          // pinch
          var touch2 = evt.touches[1],
          pinchDistance = Math.sqrt(Math.pow(touch1.clientX - touch2.clientX, 2) + Math.pow(touch1.clientY - touch2.clientY, 2));
          if (!pinchTracking.isTracking) {
            pinchTracking.lastPinchDistance = pinchDistance;
            pinchTracking.isTracking = true;
          } else {
            var pinchDelta = pinchDistance - pinchTracking.lastPinchDistance;
            alterCurrentTransformZoomBy(pinchDelta * pinchZoomMultiplier);
            pinchTracking.lastPinchDistance = pinchDistance;
          }
        } else {
          pinchTracking.isTracking = false;
        }
      } else {
        // mousemove
        panZoomImageFromCoordinate(evt.clientX, evt.clientY);
      }
    });

    // event: mousewheel
    $allContainer.on('wheel.galleryViewer', function (evt) {
      evt.preventDefault();
      if (evt.originalEvent.deltaY != 0) {
        alterCurrentTransformZoomBy(evt.originalEvent.deltaY * wheelZoomMultiplier);
      }
    });

    // event: prevent pan while swiping thumbnails
    $allContainer.on('touchmove.galleryViewer', '.gallery-viewer__thumbs', function (evt) {
      evt.stopPropagation();
    });

    // event: next thumbnail
    $allContainer.on('click.galleryViewer', '.gallery-viewer__next', function (evt) {
      evt.preventDefault();
      var $next = $thumbContainer.find('.gallery-viewer__thumb--active').next();
      if ($next.length === 0) {
        $next = $thumbContainer.find('.gallery-viewer__thumb:first');
      }
      $next.trigger('select');
    });

    // event: previous thumbnail
    $allContainer.on('click.galleryViewer', '.gallery-viewer__prev', function (evt) {
      evt.preventDefault();
      var $prev = $thumbContainer.find('.gallery-viewer__thumb--active').prev();
      if ($prev.length === 0) {
        $prev = $thumbContainer.find('.gallery-viewer__thumb:last');
      }
      $prev.trigger('select');
    });

    // event: close (button)
    $allContainer.on('click.galleryViewer', '.gallery-viewer__close', function (evt) {
      evt.preventDefault();
      theme.galleryViewerFunctions.close();
    });

    // event: close (esc key)
    document.addEventListener('keyup', theme.galleryViewerFunctions.onDocumentKeyup);

    // event: zoom
    $allContainer.on('click.galleryViewer', '.gallery-viewer__zoom-container', function (evt) {
      evt.preventDefault();
      if (currentTransform.zoom == 1.0) {
        currentTransform.zoom = 0;
        alterCurrentTransformZoomBy(0);
      } else {
        currentTransform.zoom = 1;
        alterCurrentTransformZoomBy(0);
        panZoomImageFromCoordinate(evt.clientX, evt.clientY);
      }
    });

    // initialise

    // - clear any remnants of failed previous closure
    $('html').removeClass('gallery-viewer-open');
    $('.gallery-viewer').remove();

    // - insert into page
    $('html').addClass('gallery-viewer-open');
    $allContainer.appendTo('body');

    // - select first thumbnail
    var currentIndex = 0;
    if (config.currentImage) {
      config.images.forEach((img, index) => {
        if (config.currentImage === img.zoomUrl) {
          currentIndex = index;
        }
      });
    }

    var $focusThumb = $thumbContainer.find('.gallery-viewer__thumb:eq(' + currentIndex + ')').trigger('select');

    if (config.images.length > 1) {
      $focusThumb.focus();
    } else {
      $close.focus();
    }

    // - reveal
    setTimeout(function () {
      $allContainer.removeClass('gallery-viewer--pre-reveal');
    }, 10);
  };

  theme.galleryViewerFunctions = {
    close: function close() {
      var $galleryViewer = $('.gallery-viewer');

      // destroy events
      $galleryViewer.off('.galleryViewer');
      document.removeEventListener('keyup', theme.galleryViewerFunctions.onDocumentKeyup);

      // begin exit transition
      $galleryViewer.addClass('gallery-viewer--transition-out');

      // remove after transition
      var transitionDelay = $galleryViewer.css('transition-duration');
      transitionDelay = transitionDelay.indexOf('ms') > -1 ? parseFloat(transitionDelay) : parseFloat(transitionDelay) * 1000;
      setTimeout(function () {
        $galleryViewer.remove();
        $('html').removeClass('gallery-viewer-open');
      }, transitionDelay);
    },

    onDocumentKeyup: function onDocumentKeyup(evt) {
      switch (evt.key) {
        case 'Escape':
          theme.galleryViewerFunctions.close();
          break;
        case 'ArrowLeft':
          $('.gallery-viewer__prev').trigger('click');
          break;
        case 'ArrowRight':
          $('.gallery-viewer__next').trigger('click');
          break;}

    } };


  theme.Navigation = {
    init: function init(options) {
      if (options.nav.length == 0) {
        return;
      }

      var $nav = options.nav,
      navHoverDelay = 250,
      $navLastOpenDropdown = $(),
      navOpenTimeoutId = -1;


      /// Mobile nav

      // create it
      var $mobileDrawer = $(options.mobileNavHtml);

      // add announcement bar items
      var $mobileDrawerFooter = $('<div class="mobile-navigation-drawer__footer">').appendTo($mobileDrawer);
      $mobileDrawerFooter.append($('.announcement-bar .inline-menu').clone().removeClass('desktop-only'));
      $mobileDrawerFooter.append($('.announcement-bar .header-disclosures').clone().removeClass('desktop-only'));
      $mobileDrawerFooter.append($('.announcement-bar .social-links').clone().removeClass('desktop-only'));

      // ensure ids are unique
      theme.suffixIds($mobileDrawer[0], 'MobileNav');

      // insert into page
      $mobileDrawer.insertAfter($('#shopify-section-header'));

      // event: open second tier
      $mobileDrawer.on('click', '.navigation__tier-1 > .navigation__item > .navigation__children-toggle', function (evt) {
        evt.preventDefault();

        // set text in header
        $(this).parent().
        addClass('navigation__item--open').
        closest('.mobile-navigation-drawer').
        addClass('mobile-navigation-drawer--child-open').
        find('.mobile-nav-title').
        text($(this).siblings('.navigation__link').text());

        // position under header
        $(this).siblings('.navigation__tier-2-container').css({
          top: Math.ceil($('.navigation__mobile-header:last').height() + 1) + 'px' });


        // scroll container
        this.closest('.mobile-navigation-drawer').scrollTo({ top: 0, left: 0, behavior: 'instant' }); // 'smooth' not working in iOS 15
      });

      if ($mobileDrawer.data('mobile-expand-with-entire-link')) {
        $mobileDrawer.on('click', '.navigation__item--with-children > .navigation__link', function (evt) {
          evt.preventDefault();
          $(this).siblings('.navigation__children-toggle').trigger('click');
        });
      }

      // event: close second tier
      $mobileDrawer.on('click', '.mobile-nav-back', function (evt) {
        evt.preventDefault();
        $(this).closest('.mobile-navigation-drawer').
        removeClass('mobile-navigation-drawer--child-open').
        find('.navigation__tier-1 > .navigation__item--open').
        removeClass('navigation__item--open');
      });

      // event: toggle third tier
      $mobileDrawer.on('click', '.navigation__tier-2 > .navigation__item > .navigation__children-toggle', function (evt) {
        evt.preventDefault();
        var doOpen = !$(this).parent().hasClass('navigation__item--open');
        if (doOpen) {
          $(this).parent().addClass('navigation__item--open');
          var $childContainer = $(this).siblings('.navigation__tier-3-container');
          $childContainer.css('height', $childContainer.children().outerHeight());
        } else {
          $(this).parent().removeClass('navigation__item--open');
          $(this).siblings('.navigation__tier-3-container').css('height', '');
        }
      });

      /// Desktop nav

      // reveal images
      $nav.find('.lazyload--manual').removeClass('lazyload--manual').addClass('lazyload');

      // hover events
      $nav.on('mouseenter mouseleave', '.navigation__tier-1 > .navigation__item--with-children', function (evt, data) {
        var $dropdownContainer = $(this);
        // delay on hover-out
        if (evt.type == 'mouseenter') {
          clearTimeout(navOpenTimeoutId);
          clearTimeout($dropdownContainer.data('navCloseTimeoutId'));
          var $openSiblings = $dropdownContainer.siblings('.navigation__item--show-children');

          // close all menus but last opened
          $openSiblings.not($navLastOpenDropdown).removeClass('navigation__item--show-children');
          $navLastOpenDropdown = $dropdownContainer;

          // show after a delay, based on first-open or not
          var timeoutDelay = $openSiblings.length == 0 ? 0 : navHoverDelay;

          // open it
          var newNavOpenTimeoutId = setTimeout(function () {
            $dropdownContainer.addClass('navigation__item--show-children').
            siblings('.navigation__item--show-children').
            removeClass('navigation__item--show-children');
            $dropdownContainer.closest('.section-header').addClass('section-header--nav-open');
          }, timeoutDelay);

          navOpenTimeoutId = newNavOpenTimeoutId;
          $dropdownContainer.data('navOpenTimeoutId', newNavOpenTimeoutId);
        } else {
          // cancel opening, close after delay, and clear transforms
          clearTimeout($dropdownContainer.data('navOpenTimeoutId'));
          $dropdownContainer.data('navCloseTimeoutId', setTimeout(function () {
            $dropdownContainer.removeClass('navigation__item--show-children');
            $dropdownContainer.closest('.section-header').removeClass('section-header--nav-open');
          }, navHoverDelay));
        }
        // a11y
        $dropdownContainer.children('[aria-expanded]').attr('aria-expanded', evt.type == 'mouseenter');
      });

      // touch events on desktop
      var touchHandler = function touchHandler(evt) {
        if ($(window).width() > 767) {
          if (evt.type == 'touchstart') {
            $(this).data('touchstartedAt', evt.timeStamp);
          } else if (evt.type == 'touchend') {
            // down & up in under a second - presume tap
            if (evt.timeStamp - $(this).data('touchstartedAt') < 1000) {
              $(this).data('touchOpenTriggeredAt', evt.timeStamp);
              if ($(this).parent().hasClass('navigation__item--show-children')) {
                // trigger close
                $(this).parent().trigger('mouseleave');
              } else {
                // trigger close on any open items
                $('.navigation:first .navigation__item--show-children').trigger('mouseleave');
                // trigger open
                $(this).parent().trigger('mouseenter');
              }
              // prevent fake click
              return false;
            }
          } else if (evt.type == 'click') {
            // if touch open was triggered very recently, prevent click event
            if ($(this).data('touchOpenTriggeredAt') && evt.timeStamp - $(this).data('touchOpenTriggeredAt') < 1000) {
              return false;
            }
          }
        }
      };
      $nav.on('touchstart touchend click', '.navigation__tier-1 > .navigation__item--with-children > .navigation__link', touchHandler);

      // hit return on dropdown toggle
      var keydownHandler = function keydownHandler(evt) {
        if (evt.which == 13) {
          var $parent = $(this).parent();
          $parent.trigger($parent.hasClass('navigation__item--show-children') ? 'mouseleave' : 'mouseenter');
          return false;
        }
      };
      $nav.on('keydown', '.navigation__tier-1 > .navigation__item--with-children > .navigation__children-toggle', keydownHandler);

      // proxy for desktop nav interaction events
      if (options.proxyTier1Nav) {
        // reposition small menu
        $(options.proxyTier1Nav).on('mouseenter touchstart', '.navigation__item--with-small-menu', function (evt) {
          var $dropdown = $($('.navigation__tier-1 > .navigation__item', $nav)[$(this).index()]).find('.navigation__tier-2-container');
          if (document.querySelector('html[dir=rtl]')) {
            $dropdown.css('right', $dropdown[0].offsetParent.clientWidth - ($(this).offset().left + this.clientWidth));
          } else {
            $dropdown.css('left', $(this).offset().left);
          }
        });

        // transfer all events to main menu
        $(options.proxyTier1Nav).on('mouseenter mouseleave', '.navigation__tier-1 > .navigation__item--with-children', function (evt) {
          $($('.navigation__tier-1 > .navigation__item', $nav)[$(this).index()]).trigger(evt.type);
        }).on('touchstart touchend click', '.navigation__tier-1 > .navigation__item--with-children > .navigation__link', function (evt) {
          var response = touchHandler.call(
          $($('.navigation__tier-1 > .navigation__item', $nav)[$(this).parent().index()]).children('.navigation__link')[0],
          evt);

          if (response === false) {
            return false;
          }
        }).on('keydown', '.navigation__tier-1 > .navigation__item--with-children > .navigation__children-toggle', function (evt) {
          if (evt.which == 13) {
            keydownHandler.call(
            $($('.navigation__tier-1 > .navigation__item', $nav)[$(this).parent().index()]).children('.navigation__children-toggle')[0],
            evt);

            return false;
          }
        });
      }

      // click #-link, open child nav
      $nav.on('click', '.navigation__link[href="#"][aria-haspopup="true"]', function () {
        $(this).siblings('.navigation__children-toggle').trigger('click');
        return false;
      });

      // transparent header hover
      $nav[0].addEventListener('mouseenter', theme.Navigation.onNavHover);
      $nav[0].addEventListener('mouseleave', theme.Navigation.onNavHover);
      if (options.proxyTier1Nav.length) {
        options.proxyTier1Nav[0].addEventListener('mouseenter', theme.Navigation.onNavHover);
        options.proxyTier1Nav[0].addEventListener('mouseleave', theme.Navigation.onNavHover);
      }
    },

    onNavHover: function onNavHover(evt) {
      $(evt.target).closest('.section-header').toggleClass('section-header--nav-hover', evt.type === 'mouseenter');
    },

    destroy: function destroy($nav, $proxyTier1Nav) {
      $nav.add($proxyTier1Nav).off('click mouseenter mouseleave touchstart touchend keydown');
      theme.ProductBlockManager.unloadImages($('.mobile-navigation-drawer .product-list'));
      $('.mobile-navigation-drawer').off('click').remove();
    } };


  // Process product block layout
  theme.ProductBlockManager = new function () {
    var _ = this;

    _.isDesktop = function () {
      return $(window).width() >= 768;
    };

    _.loadImages = function (container) {
      var container = container;
      if (typeof container === 'undefined') {
        container = $('body');
      }

      // lazy bg-set - faster in JS
      theme.loadLazyBGSet(container);

      if (_.isDesktop()) {
        // preload hover images after short delay
        setTimeout(() => {
          $('.product-block__image--show-on-hover.product-block__image--inactivated', container).each(function () {
            _.lazyloadImage($(this));
            lazySizes.loader.unveil($(this).find('.lazyload')[0]);
          });
        }, 250);
        // preload first carousel image after a delay
        setTimeout(() => {
          $('.product-block__image--show-on-hover + .product-block__image--inactivated', container).each(function () {
            _.lazyloadImage($(this));
          });
        }, 1000);
      }

      _.monitorImagePagination(container);
      _.monitorSwatchSelection(container);
      _.afterImagesResized(container);
    };

    _.unloadImages = function (container) {
      $(container).off('.productBlockManager');
    };

    // get image at index, safely wraps index
    _.getImageAt = function ($images, index) {
      // positive modulo, like it should be, JS does not do *maths* correctly
      return $images[(index % $images.length + $images.length) % $images.length];
    };

    _.lazyloadImage = function ($image, onLoadCB) {
      var $toLoad = $image.filter('.product-block__image--inactivated');
      if ($toLoad.length) {
        if (onLoadCB) {
          $toLoad.on('lazyloaded.themeBlockManager', evt => {
            if (evt.target === $toLoad.find('.lazyloaded')[0]) {
              onLoadCB();
            }
            $(this).off('lazyloaded.themeBlockManager');
          });
        }
        $toLoad.removeClass('product-block__image--inactivated');
      } else if (onLoadCB) {
        onLoadCB();
      }
    };

    _.incrementActiveImage = function ($images, increment) {
      var index = Math.max($images.filter('.product-block__image--active:first').index(), 0);
      _.setActiveImage($images, index + increment);
    };

    _.setActiveImage = function ($images, index) {
      var $newActive = $(_.getImageAt($images, index));

      _.lazyloadImage($newActive, () => {
        // set new active image visibility
        $newActive.addClass('product-block__image--active');
        $newActive.siblings().removeClass('product-block__image--active');
        // set new hover image
        var $hoverImage = $(_.getImageAt($images, index + 1)).addClass('product-block__image--show-on-hover');
        $hoverImage.siblings().removeClass('product-block__image--show-on-hover');
        _.lazyloadImage($hoverImage);
      });

      // dots
      var $dots = $images.closest('.image-cont').find('.product-block__image-dot');
      $dots.removeClass('product-block__image-dot--active').eq($newActive.index()).addClass('product-block__image-dot--active');
    };

    _.monitorImagePagination = function (container) {
      if ($('.image-cont--with-secondary-image', container).length) {
        // next/prev button selection
        $(container).on('click.productBlockManager', '.image-page-button', function (evt) {
          var $images = $(this).closest('.product-block').find('.product-block__image');
          _.incrementActiveImage($images, $(evt.currentTarget).hasClass('image-page-button--next') ? 1 : -1);
          // preload the rest
          $images.each(function () {
            _.lazyloadImage($(this));
          });
          return false;
        });

        // swipe (when not in a carousel)
        if ($('.image-cont--with-secondary-image:first', container).closest('.carousel, .product-list--scrollarea').length === 0) {
          // preload all images after swipe
          $(container).on('imageSwiped', '.product-block', function () {
            if ($('.product-block__image--inactivated', this).length) {
              setTimeout(function () {
                $(this).find('.product-block__image').each(function () {
                  _.lazyloadImage($(this));
                });
              }.bind(this), 500);
            }
          });

          $(container).on('touchstart.productBlockManager', '.image-cont--with-secondary-image', function (evt) {
            theme.productBlockTouchTracking = true;
            theme.productBlockTouchStartX = evt.touches[0].clientX;
            theme.productBlockTouchStartY = evt.touches[0].clientY;
            // preload next image on touchstart
            var nextImage = evt.currentTarget.querySelector('.product-block__image--active + .product-block__image--inactivated');
            if (nextImage) {
              _.lazyloadImage($(nextImage));
            }
          });

          $(container).on('touchmove.productBlockManager', '.image-cont--with-secondary-image', function (evt) {
            if (theme.productBlockTouchTracking) {
              if (Math.abs(evt.touches[0].clientY - theme.productBlockTouchStartY) < 30) {
                var deltaX = evt.touches[0].clientX - theme.productBlockTouchStartX;
                if (deltaX > 25) {
                  var $images = $(this).closest('.product-block').trigger('imageSwiped').find('.product-block__image');
                  _.incrementActiveImage($images, -1);
                  theme.productBlockTouchTracking = false;
                } else if (deltaX < -25) {
                  var $images = $(this).closest('.product-block').trigger('imageSwiped').find('.product-block__image');
                  _.incrementActiveImage($images, 1);
                  theme.productBlockTouchTracking = false;
                }
              }
            }
          });
          $(container).on('touchend.productBlockManager', '.image-cont--with-secondary-image', function (evt) {
            theme.productBlockTouchTracking = false;
          });
        }
      }
    };

    _.monitorSwatchSelection = function (container) {
      if ($('[data-media].product-block-options__item', container).length) {
        $(container).on('mouseenter.productBlockManager click.productBlockManager', '[data-media].product-block-options__item', function () {
          var $block = $(this).closest('.product-block');
          var $images = $block.find('.product-block__image');
          var index = $images.filter('[data-media-id="' + $(this).data('media') + '"].product-block__image').index();
          _.setActiveImage($images, index);
          // include in URL
          var optionName = $(this).closest('.product-block-options').data('option-name'),
          optionValue = $(this).data('option-item');
          $block[0].querySelectorAll('.product-link, .quickbuy-toggle').forEach(el => {
            var url = new URL(el.href);
            var params = new URLSearchParams(url.search);
            params.set(optionName, optionValue);
            el.href = "".concat(url.pathname, "?").concat(params);
            el.rel = 'nofollow';
          });
        });
      }
    };

    _.afterImagesResized = function (container) {
      var container = container;
      if (typeof container === 'undefined') {
        container = $('body');
      }

      _.alignProductBlockHeights(container);
    };

    _.alignProductBlockHeights = function (container) {
      var container = container;
      if (typeof container === 'undefined') {
        container = $('body');
      }

      // All product blocks must be the same height, for quick-buy alignment
      $('.collection-listing .product-list', container).each(function () {
        if ($(window).width() >= 768 || $(this).closest('.carousel').length > 0) {
          var tallest = 0;
          $(this).find('.product-block .block-inner .block-inner-inner').each(function () {
            if ($(this).height() > tallest) tallest = $(this).height();
          });
          $(this).find('.product-block .block-inner').css('min-height', tallest);
        } else {
          $(this).find('.product-block .block-inner').css('min-height', '');
        }
      });
    };
  }();

  // container must be an element higher up the tree than the gallery
  theme.initProductGallery = function (container) {
    var $gallery = $('.gallery', container);
    if ($gallery.hasClass('gallery-initialised')) {
      return;
    }

    $gallery.addClass('gallery-initialised');

    /// Variant grouping
    if ($gallery.data('variant-image-grouping') && $gallery.data('variant-image-grouping-option-index') !== '') {
      var productData = theme.OptionManager.getProductData($gallery.closest('.product-detail').find('.product-form')),
      groupingOptionIndex = $gallery.data('variant-image-grouping-option-index');
      // build map of grouping options and featured media
      var optionNameMediaMap = {};
      productData.media.forEach(media => {
        productData.variants.forEach(variant => {
          if (variant.featured_media && variant.featured_media.id == media.id) {
            if (!optionNameMediaMap[variant.options[groupingOptionIndex]]) {
              optionNameMediaMap[variant.options[groupingOptionIndex]] = media.id;
            }
          }
        });
      });
      // set option name on each image
      var currentMediaOptionName = '';
      $gallery.find('.slide').each(function (index, item) {
        for (var optionName in optionNameMediaMap) {
          if ($(item).data('media-id') == optionNameMediaMap[optionName]) {
            currentMediaOptionName = optionName;
          }
        }
        $(item).attr('data-variant-image-group', currentMediaOptionName);
      });
      currentMediaOptionName = '';
      $gallery.find('.thumbnail').each(function (index, item) {
        for (var optionName in optionNameMediaMap) {
          if ($(item).data('media-id') == optionNameMediaMap[optionName]) {
            currentMediaOptionName = optionName;
          }
        }
        $(item).attr('data-variant-image-group', currentMediaOptionName);
      });
    }

    /// Init main image slideshow
    var $slideshow = $('.product-slideshow', container);
    if ($slideshow.length) {
      var slickConfig = {
        autoplay: false,
        fade: false,
        infinite: false,
        useTransform: true,
        dots: false,
        arrows: false,
        waitForAnimate: false,
        appendArrows: $slideshow.siblings('.slideshow-controls').find('.slideshow-controls__arrows'),
        prevArrow: '<button type="button" class="slick-product-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
        nextArrow: '<button type="button" class="slick-product-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
        mobileFirst: true,
        rtl: document.querySelector('html[dir=rtl]') ? true : false,
        responsive: [
        {
          breakpoint: 768,
          settings: {
            fade: true,
            arrows: true } }] };





      $slideshow.on('init', function (evt, slick) {
        $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
      }).on('beforeChange', function (evt, slick, current, next) {
        var mediaId = $(slick.$slides[next]).data('media-id');
        $($(this).closest('.gallery').find('.thumbnails:not(.hidden) .thumbnail[data-media-id="' + mediaId + '"]')).trigger('selectFromSlick');
      });

      if ($slideshow.closest('.gallery--layout-carousel-beside, .gallery--layout-carousel-under').length) {
        // carousel layout - slideshow all the time
        $slideshow.slick(slickConfig);
      } else {
        // collage layout - slideshow on mobile only
        var enforceMobileSlideshow = function enforceMobileSlideshow() {
          if ($(window).width() < 768) {
            $slideshow.not('.slick-slider').each(function () {
              // remove desktop collage filter classes
              $(this).find('.slide--inactive-option').removeClass('slide--inactive-option');
              // init slideshow
              $(this).slick(slickConfig);
              // trigger variant select
              $(this).closest('.product-detail').find('.original-selector').trigger('change');
            });
          } else {
            $slideshow.filter('.slick-slider').each(function () {
              $(this).slick('slickUnfilter').slick('unslick');
              // trigger variant select
              $(this).closest('.product-detail').find('.original-selector').trigger('change');
            });
          }
        };
        enforceMobileSlideshow();
        $(window).on('debouncedresize.productGallery', enforceMobileSlideshow);
      }

      // media initialisation
      theme.ProductMedia.init($gallery, {
        onYoutubeInit: function onYoutubeInit(playerObj) {
          if ($slideshow.hasClass('slick-slider')) {
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
          }
        },
        onModelViewerInit: function onModelViewerInit(element) {
          if ($slideshow.hasClass('slick-slider')) {
            theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
          }
        },
        onVideoVisible: function onVideoVisible(e) {
          if ($(window).width() >= 768) {
            $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
          }
        },
        onModelViewerPlay: function onModelViewerPlay(e) {
          // prevent swiping
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
          // prevent left/right key control
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'accessibility', false);
        },
        onModelViewerPause: function onModelViewerPause(e) {
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'accessibility', true);
        } });


      // fix tabindex for first slide
      if ($slideshow.hasClass('slick-slider')) {
        theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
      }

      $slideshow.on('afterChange', function (evt, slick, current) {
        // reset playing media
        theme.pauseAllMedia();
        if ($(window).width() >= 768) {
          slick.slickSetOption('swipe', true);
        }
        // notify media of visibility
        $('.product-media', slick.$slides[current]).trigger('mediaVisible');
        // slideshow tab fix
        theme.productGallerySlideshowTabFix(slick.$slides, current);
      });
    }

    var $thumbnails = $('.thumbnails:not(.hidden)', container);
    if ($thumbnails.length) {
      var carouselVisibleItemCount = 6,
      isCarousel = false;

      /// Screen-width based initialisation of thumbnail carousels
      var assessCarousel = function assessCarousel() {
        if ($thumbnails.parent().css('display') == 'flex') {
          // thumbnail container is in column beside main image - destroy carousel
          if (isCarousel) {
            isCarousel = false;

            theme.beforeCarouselUnloadEventBlockFix($thumbnails);
            $thumbnails.removeClass('owl-carousel').
            data('owl.carousel').
            destroy();

            // trigger variant image grouping
            $gallery.closest('.product-detail').find('.original-selector').trigger('change');
          }
        } else {
          // thumbnails underneath - init carousel
          if (!isCarousel) {
            isCarousel = true;

            // fix for event propagation in nested owl carousels
            theme.beforeCarouselLoadEventBlockFix($thumbnails);

            // reset any image grouping modifications
            $thumbnails.find('.thumbnail').show();
            $gallery.find('.hidden-thumbnails').children().appendTo($thumbnails);

            $thumbnails.addClass('owl-carousel').on('initialized.owl.carousel', function () {
              $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
            }).owlCarousel({
              items: carouselVisibleItemCount,
              dots: false,
              margin: 7,
              rtl: document.querySelector('html[dir=rtl]') ? true : false });


            // trigger variant image grouping
            $gallery.closest('.product-detail').find('.original-selector').trigger('change');
          }
        }
      };

      $(window).on('debouncedresize.productGallery', assessCarousel);
      assessCarousel();
      $(container).data('assessCarouselCallback', assessCarousel);


      /// Thumbnail click - in carousel
      // Events:
      // click: click on a thumbnail
      // select: selection via variant image
      // selectFromSlick: change of main image
      //
      // 'selectFromSlick' is treated as the 'primary' driver of state change, select/click to just update the main image slideshow,
      // and an after-transition callback updates the thumbnail
      $('.gallery', container).on('click select selectFromSlick', '.thumbnails.owl-carousel .thumbnail', function (e) {
        e.preventDefault();
        var $carouselItem = $(this).parent();
        if (e.type != 'selectFromSlick') {
          // from click or variant image? change main image
          var mediaId = $(this).data('media-id');
          var _$slideshow = $(this).closest('.gallery').find('.slideshow.slick-slider');
          if (_$slideshow) {
            var index = _$slideshow.find('.slide[data-media-id="' + mediaId + '"]').index(); // current index including filters
            // same index? manual trigger of next event
            var slick = _$slideshow.slick('getSlick');
            if (slick.currentSlide === index) {
              // current slide active, manually trigger from-slick thumb selection (req. for index changes during filtering)
              $(this).trigger('selectFromSlick');
            } else {
              // change slide
              _$slideshow.slick('slickGoTo', index);
            }
          }
        } else {
          // change to active state comes from the main slideshow change event
          // show the highlight
          $(this).addClass('selected').parent().siblings().find('a').removeClass('selected');

          // adjust thumbnail carousel if not on-screen
          var shelfStart = $carouselItem.parent().children('.active:first').index();
          var shelfEnd = shelfStart + carouselVisibleItemCount - 1;
          var currentIndex = $carouselItem.index();

          if (currentIndex < shelfStart) {
            // selected is to left of shelf - move carousel right to show
            $carouselItem.closest('.owl-carousel').trigger('to.owl.carousel', currentIndex);
          } else if (currentIndex > shelfEnd) {
            // selected is to right of shelf - move carousel left to show
            $carouselItem.closest('.owl-carousel').trigger('to.owl.carousel', Math.max(0, currentIndex - carouselVisibleItemCount + 1));
          }
        }
      });

      /// Thumbnail click - beside
      // Uses same event structure as the events above ^
      $('.gallery', container).on('click select selectFromSlick', ' .thumbnails:not(.owl-carousel) .thumbnail', function (e) {
        e.preventDefault();
        if (e.type != 'selectFromSlick') {
          // from click or variant image? change main image
          var index = 0;
          var mediaId = $(this).data('media-id');
          $(this).parent().children(':visible').each(function (iter) {
            index = iter;
            if ($(this).data('media-id') == mediaId) {
              return false;
            }
          });
          // same index? manual trigger of next event
          var _$slideshow2 = $(this).closest('.gallery').find('.slideshow');
          var slick = _$slideshow2.slick('getSlick');
          if (slick.currentSlide === index) {
            // current slide active, manually trigger from-slick thumb selection (req. for index changes during filtering)
            $(this).trigger('selectFromSlick');
          } else {
            // change slide
            _$slideshow2.slick('slickGoTo', index);
          }
        } else {
          // change to active state comes from the main slideshow change event
          $(this).addClass('selected').siblings('.selected').removeClass('selected');
        }
      });
    }
  };

  theme.destroyProductGallery = function (container) {
    $(window).off('.productGallery');
    var $gallery = $('.gallery', container).off('click select selectFromSlick');
    theme.ProductMedia.destroy($gallery);
    $('.slick-slider', container).slick('unslick').off('init beforeChange afterChange');
    $('.owl-carousel', container).each(function () {
      theme.beforeCarouselUnloadEventBlockFix(this);
      $(this).data('owl.carousel').destroy();
    });
  };

  /* Product Media
   *
   * Load and destroy:
   * theme.ProductMedia.init(galleryContainer, {
   *   onModelViewerPlay: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
   *   },
   *   onModelViewerPause: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
   *   }
   * });
   *
   * theme.ProductMedia.destroy(galleryContainer);
   */
  theme.ProductMedia = new function () {
    var _ = this;

    _._setupShopifyXr = function () {
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', _._setupShopifyXr.bind(this));
        return;
      }

      window.ShopifyXR.addModels(JSON.parse($(this).html()));
      window.ShopifyXR.setupXRElements();
    };

    this.init = function (container, callbacks) {
      var callbacks = callbacks || {},
      _container = container;

      // set up video media elements with a controller
      $(container).find('.product-media--video').each(function (index) {
        var poster = this.querySelector('.product-media__poster');
        $('.product-media__video-play-btn', poster).on('click', function () {
          $(this).closest('.product-media--video').data('player').play();
        });

        var playerObj = { container: this, poster: poster };
        playerObj.play = function () {
          // pause anything else
          theme.pauseAllMedia();

          // hide poster
          this.poster.classList.add('product-media__poster--hide');
          $(this).closest('.slick-slider').slick('setPosition');

          // play
          this.container.querySelectorAll('.js-youtube').forEach(video => {
            video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          });
          this.container.querySelectorAll('.js-vimeo').forEach(video => {
            video.contentWindow.postMessage('{"method":"play"}', '*');
          });
          this.container.querySelectorAll('video').forEach(video => video.play());
        }.bind(playerObj);

        // instantiate videos
        var template = this.querySelector('.product-media__video-template');
        if (template) {
          this.insertAdjacentHTML('beforeend', template.innerHTML);
          this.removeChild(template);
          this.style.paddingBottom = 100 / this.querySelector('video, iframe').getAttribute('aspect-ratio') + '%';
        }

        $(this).data('player', playerObj).addClass('product-media--video-loaded');
      });

      // when any media appears
      $(container).on('mediaVisible', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // autoplay all media on larger screens
        if ($(window).width() >= 768) {
          $(this).data('player').play();
        }
        // update view-in-space
        if ($(this).hasClass('product-media--model')) {
          $('.view-in-space', _container).attr('data-shopify-model3d-id', $(this).data('model-id'));
        }
      });

      // necessary callbacks
      if (callbacks.onVideoVisible) {
        $(container).on('mediaVisible', '.product-media--video-loaded', callbacks.onVideoVisible);
      }

      $('model-viewer', container).each(function () {
        if (callbacks.onModelViewerPlay) {
          $(this).on('shopify_model_viewer_ui_toggle_play', callbacks.onModelViewerPlay);
        }
        if (callbacks.onModelViewerPause) {
          $(this).on('shopify_model_viewer_ui_toggle_pause', callbacks.onModelViewerPause);
        }
      });

      // set up a 3d model when it first appears
      $(container).on('mediaVisible mediaVisibleInitial', '.product-media--model:not(.product-media--model-loaded)', function (e) {
        var element = $(this).find('model-viewer')[0],
        autoplay = e.type != 'mediaVisibleInitial';
        // load viewer
        theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css');
        window.Shopify.loadFeatures([
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: function () {
            $(this).data('player', new Shopify.ModelViewerUI(element));
            // set class and re-trigger visible event now loaded
            $(this).addClass('product-media--model-loaded');
            if (callbacks.onModelViewerInit) {
              callbacks.onModelViewerInit(element);
            }
            if (autoplay) {
              $(this).trigger('mediaVisible');
            }
          }.bind(this) }]);


      });

      // load AR viewer
      if ($('.model-json', container).length) {
        window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: _._setupShopifyXr.bind($('.model-json', container)) }]);


      }

      // pause other media when a 3d model is launched in AR
      $(document).on('shopify_xr_launch', function () {
        theme.pauseAllMedia({ videos: true });
      });

      // 3d model in first place - start in paused mode
      setTimeout(function () {
        $('.product-slideshow.slick-slider .product-media:first', this).filter('.product-media--model').trigger('mediaVisibleInitial');
        $('.product-slideshow:not(.slick-slider) .product-media--model', this).trigger('mediaVisibleInitial');
      }.bind(container), 50);
    };

    this.destroy = function (container) {
      $(document).off('shopify_xr_launch');
      $(container).off('mediaVisible mediaVisibleInitial');
      $('.product-media--model-loaded', container).each(function () {
        $(this).data('player').destroy();
      });
      $('.product-media--video video', container).off('playing pause ended');
      $('model-viewer', container).off('shopify_model_viewer_ui_toggle_play shopify_model_viewer_ui_toggle_pause');
    };
  }();

  theme.productGallerySlideshowTabFix = function (slides, current) {
    // tabindex everything to prevent tabbing into hidden slides
    $(slides[current]).find('a, input, button, select, iframe, video, model-viewer, [tabindex]').each(function () {
      if (typeof $(this).data('theme-slideshow-original-tabindex') !== 'undefined') {
        if ($(this).data('theme-slideshow-original-tabindex') === false) {
          $(this).removeAttr('tabindex');
        } else {
          $(this).attr('tabindex', $(this).data('theme-slideshow-original-tabindex'));
        }
      } else {
        $(this).removeAttr('tabindex');
      }
    });
    $(slides).not(slides[current]).find('a, input, button, select, iframe, video, model-viewer, [tabindex]').each(function () {
      if (typeof $(this).data('theme-slideshow-original-tabindex') === 'undefined') {
        $(this).data('theme-slideshow-original-tabindex',
        typeof $(this).attr('tabindex') !== 'undefined' ?
        $(this).attr('tabindex') :
        false);

        $(this).attr('tabindex', '-1');
      }
    });
  };

  // Manage option dropdowns
  theme.productData = {};
  theme.OptionManager = new function () {
    var _ = this;

    _._getVariantOptionElement = function (variant, $container) {
      return $container.find('select[name="id"] option[value="' + (variant ? variant.id : '') + '"]');
    };

    _.selectors = {
      container: '.product-detail',
      gallery: '.gallery',
      priceArea: '.price-area',
      variantIdInputs: '[name="id"]',
      purchaseForm: '.product-purchase-form',
      primaryVariantIdInput: '.product-purchase-form [name="id"]',
      submitButton: '.product-purchase-form button[type="submit"]',
      multiOption: '.option-selectors',
      customOption: '.custom-option',
      installmentsFormSuffix: '-installments' };


    _.strings = {
      buttonDefault: theme.strings.products_product_add_to_cart,
      buttonNoStock: theme.strings.products_variant_no_stock,
      buttonNoVariant: theme.strings.products_variant_non_existent };


    _.getProductData = function ($form) {
      var productId = $form.data('product-id');
      var data = null;
      if (!theme.productData[productId]) {
        theme.productData[productId] = JSON.parse(document.getElementById('ProductJson-' + productId).innerHTML);
      }
      data = theme.productData[productId];
      if (!data) {
        console.log('Product data missing (id: ' + $form.data('product-id') + ')');
      }
      return data;
    };

    _.getVariantFromId = function ($productForm, id) {
      var variants = this.getProductData($productForm).variants;
      for (var i = 0; i < variants.length; i++) {
        if (variants[i].id == id) {
          return variants[i];
        }
      }
      return { available: false };
    };

    _.getCurrentVariantData = function ($productForm) {
      return _.getVariantFromId($productForm, $productForm.find(_.selectors.primaryVariantIdInput).val());
    };

    _.getBaseUnit = function (variant) {
      return variant.unit_price_measurement.reference_value === 1 ?
      variant.unit_price_measurement.reference_unit :
      variant.unit_price_measurement.reference_value +
      variant.unit_price_measurement.reference_unit;
    },

    _.addVariantUrlToHistory = function (variant) {
      if (variant) {
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({ path: newurl }, '', newurl);
      }
    };

    _.updateSku = function (variant, $container) {
      $container.find('.sku .sku__value').html(variant ? variant.sku : '');
      $container.find('.sku').toggleClass('sku--no-sku', !variant || !variant.sku);
    };

    _.updateBarcode = function (variant, $container) {
      $container.find('.barcode .barcode__value').html(variant ? variant.barcode : '');
      $container.find('.barcode').toggleClass('barcode--no-barcode', !variant || !variant.barcode);
    };

    _.updateTransferNotice = function (variant, $container) {
      var transferData = _._getVariantOptionElement(variant, $container).data('inventory-transfer');
      if (transferData) {
        $container.find('.product-inventory-transfer').removeClass('product-inventory-transfer--none').html(transferData);
      } else {
        $container.find('.product-inventory-transfer').addClass('product-inventory-transfer--none').empty();
      }
    };

    _.updateVariantDeterminedVisibilityAreas = function (variant, $container) {
      $container.find('.variant-visibility-area').each(function () {
        $(this).children(':not(script)').remove();
        if (variant) {
          $(this).append($(this).children('script[data-variant-id="' + variant.id + '"]').html());
        } else {
          $(this).append($(this).children('script[data-variant-id=""]').html());
        }
      });
    };

    _.updateBackorder = function (variant, $container) {
      var $backorder = $container.find('.backorder');
      if ($backorder.length) {
        if (variant && variant.available) {
          if (variant.inventory_management && _._getVariantOptionElement(variant, $container).data('stock') == 'out') {
            var productData = _.getProductData($backorder.closest('.product-form'));
            $backorder.find('.backorder__variant').text(productData.title + (variant.title.indexOf('Default') >= 0 ? '' : ' - ' + variant.title));
            $backorder.show();
          } else {
            $backorder.hide();
          }
        } else {
          $backorder.hide();
        }
      }
    };

    _._updateButtonText = function ($button, string, variant) {
      $button.each(function () {
        var newVal;
        newVal = _.strings['button' + string];
        if (newVal !== false) {
          if ($(this).is('input')) {
            $(this).val(newVal);
          } else {
            $(this).html(newVal);
          }
        }
      });
    };

    _.updateButtons = function (variant, $container) {
      var $button = $container.find(_.selectors.submitButton);

      if (variant) {
        $button.removeAttr('disabled');
        if (variant.available == true) {
          _._updateButtonText($button, 'Default', variant);
        } else {
          _._updateButtonText($button, 'NoStock', variant);
        }
      } else {
        if (theme.getEmptyOptionSelectors($container).length) {
          $button.removeAttr('disabled');
          _._updateButtonText($button, 'Default', variant);
        } else {
          $button.attr('disabled', 'disabled');
          _._updateButtonText($button, 'NoVariant', variant);
        }
      }
    };

    _.updateContainerStatusClasses = function (variant, $container) {
      $container.toggleClass('variant-status--not-selected', !variant);
      $container.toggleClass('variant-status--unavailable', variant && !variant.available);
      $container.toggleClass('variant-status--backorder', variant &&
      variant.available &&
      variant.inventory_management &&
      _._getVariantOptionElement(variant, $container).data('stock') == 'out');
      $container.toggleClass('variant-status--on-sale', variant &&
      variant.available &&
      variant.compare_at_price > variant.price);
    };

    _.initProductOptions = function ($productForm) {
      if ($productForm.hasClass('theme-init')) return;

      var productData = _.getProductData($productForm);
      $productForm.addClass('theme-init');

      // init option selectors
      $productForm.find(_.selectors.multiOption).on('change.themeProductOptions', function () {
        var selectedOptions = [];
        $(this).find('.option-selector').each(function () {
          if ($(this).data('selector-type') === 'listed') {
            selectedOptions.push($(this).find('.js-option:checked').val());
          } else {
            selectedOptions.push($(this).find('.js-option[aria-selected="true"]').data('value'));
          }
        });

        // find variant
        var variant = false;
        for (var i = 0; i < productData.variants.length; i++) {
          var v = productData.variants[i];
          var matchCount = 0;
          for (var j = 0; j < selectedOptions.length; j++) {
            if (v.options[j] == selectedOptions[j]) {
              matchCount++;
            }
          }
          if (matchCount == selectedOptions.length) {
            variant = v;
            break;
          }
        }

        // trigger change
        $productForm.find(_.selectors.variantIdInputs).val(variant.id);

        // a jQuery event may not be picked up by all listeners
        $productForm.find(_.selectors.variantIdInputs).each(function () {
          this.dispatchEvent(
          new CustomEvent('change', { bubbles: true, cancelable: false, detail: { variant: variant, selectedOptions: selectedOptions } }));

        });
      });

      // init custom options (mirror in purchase form for Buy Now button)
      $productForm.find(_.selectors.customOption).each(function () {
        var $input = $(this).find('input:first, textarea, select');
        $('<input type="hidden">').attr({
          name: $input.attr('name'),
          value: $input.val() }).
        appendTo($productForm.find(_.selectors.purchaseForm));
      }).on('change.themeProductOptions', function () {
        var $radios = $(this).find('input[type="radio"]'),
        $checkbox = $(this).find('input[type="checkbox"]');
        if ($radios.length) {
          // radio buttons
          $productForm.find(_.selectors.purchaseForm + ' input').filter(function () {
            return this.name === $radios[0].name;
          }).val($radios.filter(':checked').val()).trigger('change');
        } else if ($checkbox.length) {
          // checkbox
          var val = null;
          if ($checkbox.is(':checked')) {
            val = $checkbox.val();
          } else {
            val = $checkbox.siblings('[type="hidden"]').val();
          }
          $productForm.find(_.selectors.purchaseForm + ' input').filter(function () {
            return this.name === $checkbox[0].name;
          }).val(val).trigger('change');
        } else {
          // other inputs
          var $input = $(this).find('select, input, textarea');
          $productForm.find(_.selectors.purchaseForm + ' input').filter(function () {
            return this.name === $input.attr('name');
          }).val($input.val()).trigger('change');
        }
      });

      // init variant ids
      $productForm.find(_.selectors.primaryVariantIdInput).each(function () {
        // change state for original dropdown
        $(this).on('change.themeProductOptions firstrun.themeProductOptions', function (e) {
          if ($(this).is('input[type=radio]:not(:checked)')) {
            return; // handle radios - only update for checked
          }
          // If variant is passed in, use that. Even if 'false'. If nothing is passed, find from input value.
          var variant = e.detail ? e.detail.variant : null;
          if (!variant && variant !== false) {
            for (var i = 0; i < productData.variants.length; i++) {
              if (productData.variants[i].id == $(this).val()) {
                variant = productData.variants[i];
              }
            }
          }
          var $container = $(this).closest(_.selectors.container);

          // string overrides
          var $addToCart = $container.find(_.selectors.submitButton).filter('[data-add-to-cart-text]');
          if ($addToCart.length) {
            _.strings.buttonDefault = $addToCart.data('add-to-cart-text');
          }

          // update buttons
          _.updateButtons(variant, $container);

          // emit an event to broadcast the variant update
          $(window).trigger('cc-variant-updated', {
            variant: variant,
            product: productData });


          // variant images
          if (variant && variant.featured_media) {
            // variant passed
            $container.find(_.selectors.gallery).trigger('variantImageSelected', [variant, e.type === 'firstrun']);
          } else if (e.detail && e.detail.selectedOptions) {
            // if some options selected, find the first matching variant for image
            var matchesRequired = e.detail.selectedOptions.filter(o => o.length > 0).length;
            if (matchesRequired > 0) {
              for (var i = 0; i < productData.variants.length; i++) {
                var v = productData.variants[i];
                var matchCount = 0;
                for (var j = 0; j < e.detail.selectedOptions.length; j++) {
                  if (v.options[j] == e.detail.selectedOptions[j]) {
                    matchCount++;
                  }
                }
                if (matchCount == matchesRequired && v.featured_media) {
                  $container.find(_.selectors.gallery).trigger('variantImageSelected', [v, e.type === 'firstrun']);
                  break;
                }
              }
            }
          }

          // extra details
          _.updateBarcode(variant, $container);
          _.updateSku(variant, $container);
          _.updateTransferNotice(variant, $container);
          _.updateVariantDeterminedVisibilityAreas(variant, $container);
          _.updateBackorder(variant, $container);
          _.updateContainerStatusClasses(variant, $container);

          // variant urls
          if ($productForm.data('enable-history-state') && e.type == 'change') {
            _.addVariantUrlToHistory(variant);
          }

          // allow other things to hook on
          $productForm.trigger('variantChanged', [variant, productData]);
        });

        // first-run
        $(this).trigger('firstrun');
      });

      // ajax
      theme.applyAjaxToProductForm($productForm);

      // apply URL params
      var searchParams = new URLSearchParams(location.search);var _loop2 = function _loop2(
      key) {
        $productForm.find('.option-selector').filter(function () {
          return this.querySelector('.label').firstChild.textContent === key;
        }).each(function () {
          var value = searchParams.get(key);
          if (this.dataset.selectorType == 'dropdown') {
            this.querySelector('.cc-select').dispatchEvent(
            new CustomEvent('selectOption', { detail: { value: value } }));

          } else {
            this.querySelectorAll('.opt-label__text').forEach(el => {
              if (el.innerText == value) {
                var input = document.getElementById(el.parentElement.getAttribute('for'));
                if (input) {
                  input.checked = true;
                  input.dispatchEvent(
                  new CustomEvent('change', { bubbles: true, cancelable: false }));

                }
              }
            });
          }
        });};for (var key of searchParams.keys()) {_loop2(key);
      }
    };

    _.unloadProductOptions = function ($productForm) {
      $productForm.removeClass('theme-init').each(function () {
        $(this).trigger('unloading').off('.themeProductOptions');
        $(this).find(_.selectors.multiOption).off('.themeProductOptions');
        $(this).find(_.selectors.customOption).off('.themeProductOptions');
        theme.removeAjaxFromProductForm($productForm);
      });
    };
  }();

  theme.loadQuickbuy = function () {
    // utility function for quickbuy (closes all quickbuys in passed blocks, in a collection grid)
    function contractDetail($blocks, speed) {
      if ($blocks.length > 0) {
        $blocks.removeClass('expanded');
        $blocks.find('.quickbuy-container').stop().animate({ height: 0 }, speed, function () {
          $(this).find('.inner').empty();
        });
        $blocks.stop().each(function () {
          $(this).animate({ paddingBottom: 0 }, speed);
        });
      }
    }

    // handle components
    function loadComponents(componentContainer) {
      $(componentContainer).closest('[data-components]').each(function () {
        $(this).data('components').split(',').forEach(component => {
          $(document).trigger('cc:component:load', [component, componentContainer]);
        });
      });

      $(document).trigger('cc:component:load', ['custom-select', '.quickbuy-container']);
    }

    function unloadComponents(componentContainer) {
      $(componentContainer).find('.cc-accordion').off('.qbLoadComponents');
      $(componentContainer).closest('[data-components]').each(function () {
        $(this).data('components').split(',').forEach(component => {
          $(document).trigger('cc:component:unload', [component, componentContainer]);
        });
      });
    }

    var debouncedQuickbuyResizeTimeoutID = -1;
    function debouncedQuickbuyResize(qbInner) {
      clearTimeout(debouncedQuickbuyResizeTimeoutID);
      debouncedQuickbuyResizeTimeoutID = setTimeout(() => {
        var qbc = qbInner.closest('.quickbuy-container'),
        block = qbc.closest('.product-block');
        if (block) {
          // use padding in grid
          // also check expanded class in case it's mid close transition
          if (block.classList.contains('expanded')) {
            var targetHeight = $(qbInner).outerHeight(),
            expandedSiblings = [...block.parentNode.children].filter(child => {return child !== block && child.classList.contains('expanded');}),
            speed = expandedSiblings.length > 0 ? 0 : droppyDownAnimSpeed; // slide down instantly if a neighbour is expanded

            $(block).stop().animate({
              paddingBottom: targetHeight + 20 },
            speed); // extra for gap underneath
            $(qbc).stop().animate({ height: targetHeight }, speed);
          }
        } else {
          // use height in carousel
          $(qbc).stop().animate({
            height: $(qbInner).outerHeight() },
          droppyDownAnimSpeed);
        }
      }, 100);
    }

    var quickbuyResizeObserver = null;
    if ('ResizeObserver' in window) {
      quickbuyResizeObserver = new ResizeObserver(entries => {
        for (var entry of entries) {
          if (entry.contentBoxSize) {
            debouncedQuickbuyResize(entry.target);
          }
        }
      });
    } else {
      quickbuyResizeObserver = {
        disconnect: () => {},
        observer: () => {} };

    }

    // quick buy - managing slide-down quickbuy in both grids and carousels
    var droppyDownAnimSpeed = 500;
    $(document).on('click', '.product-list .product-block:not(.collection-block):not(.main-search-result) .quickbuy-toggle', function () {
      var pageWidth = $(window).width(),
      productUrl = $(this).attr('href');

      //Only show dropdown if screen is large enough for it to be useful
      if (pageWidth > 767) {
        // cancel current request if one exists
        if (theme.currentQuickbuyRequest) {
          theme.currentQuickbuyRequest.abort();
        }

        var $block = $(this).closest('.product-block'),
        $detailCont = null,
        $quickbuyCont = null,
        $slider = $(this).closest('.collection-slider'),
        $sliderRow = null;

        // do different things if it's inside a slideshow
        if ($slider.length > 0) {
          $sliderRow = $slider.closest('.collection-slider-row');
          // slider without detail
          if ($sliderRow.find('.quickbuy-container').length === 0) {
            return;
          }
          $quickbuyCont = $sliderRow.find('.quickbuy-container');
        } else {
          $quickbuyCont = $block.find('.quickbuy-container');
        }
        $detailCont = $quickbuyCont.find('.inner');

        // toggle active class on block
        if ($block.toggleClass('expanded').hasClass('expanded')) {
          // expanding
          if ($slider.length > 0) {
            // if another block is expanded, remove its expanded class
            var noneExpanded = $slider.find('.product-block.expanded').not($block).removeClass('expanded').length === 0;

            // if expanding from empty, set initial detail container height to 0
            if (noneExpanded) {
              $quickbuyCont.height(0);
            } else {
              // unload existing quickbuy
              $('.product-form', $quickbuyCont).trigger('unload-product-form');
              $('.gallery', $quickbuyCont).off(this.namespace);
              $('.slideshow', $quickbuyCont).slick('unslick');
              // unload components
              unloadComponents($quickbuyCont);
            }
          } else {
            // close expanded siblings
            var $expandedSiblings = $block.siblings('.expanded');

            $expandedSiblings.each(function () {
              contractDetail($(this), 0);

              // unload existing quickbuy
              $('.product-form', this).trigger('unload-product-form');
              theme.destroyProductGallery(this);
              // unload components
              unloadComponents(this);
            });
          }

          // monitor for contents changing size
          quickbuyResizeObserver.disconnect();
          quickbuyResizeObserver.observe($detailCont[0]);

          // add spinner
          $detailCont.html('<div class="loading-spinner"></div>');

          // load in content
          var url = $(this).attr('href');
          theme.currentQuickbuyRequest = $.get(url, function (response) {
            var $newDetail = $('<div>' + response + '</div>').find('.quickbuy-content');

            // convert to quickbuy content
            $newDetail.find('.more').attr('href', productUrl);
            $newDetail.find('.detail .title').wrapInner($('<a>').attr('href', productUrl));
            $newDetail.find('.show-gallery').removeClass('show-gallery').attr('href', productUrl);
            $newDetail.find('.not-in-quickbuy').remove();
            $newDetail.find('.only-in-quickbuy').removeClass('only-in-quickbuy');
            $newDetail.find('.sticky-content-container').removeClass('sticky-content-container');
            $newDetail.find('.store-availability-container').remove();
            $newDetail.find('[data-enable-history-state="true"]').attr('data-enable-history-state', 'false');
            $newDetail.find('.gallery .thumbnails').removeClass('mobile-only');
            ['gallery--layout-carousel-beside', 'gallery--layout-columns-1', 'gallery--layout-columns-2', 'gallery--layout-collage-1', 'gallery--layout-collage-2'].forEach(cl => {
              $newDetail.find('.' + cl).removeClass(cl).addClass('gallery--layout-carousel-under');
            });

            $detailCont.html($newDetail);

            // the order of these is important:
            theme.initProductGallery($quickbuyCont); // 1
            $quickbuyCont.find('.product-form').
            trigger('load-product-form'); // 2
            loadComponents($quickbuyCont); // 3
            theme.initAnimateOnScroll(); // 4
          }).always(function () {
            theme.currentQuickbuyRequest = false;
          });

          // enable close button
          $quickbuyCont.find('.close-detail').removeAttr('tabindex');

          // scroll to appropriate position
          // qb: top of quick buy
          // bl: top of product block
          var scrollMode = 'qb';
          var scrollOffset = -120;

          if ($('.section-header').css('position') == 'sticky') {
            scrollOffset -= $('.section-header').height();
          }

          if (scrollMode == 'qb') {
            $('html:not(:animated),body:not(:animated)').animate({ scrollTop: $quickbuyCont.offset().top + scrollOffset }, 500);
          } else {
            if ($slider.length > 0) {
              // simple for slider
              $('html:not(:animated),body:not(:animated)').animate({ scrollTop: $block.offset().top }, 500);
            } else {
              // need to use top of block when no quickbuys are visible
              saveCollectionPageData();
              var offsetTop = typeof $block.data('offsetTop') != 'undefined' ? $block.data('offsetTop') : $block.offset().top;
              $('html:not(:animated),body:not(:animated)').animate({ scrollTop: offsetTop + scrollOffset }, 500);
            }
          }
        } else {
          // close
          unloadComponents($quickbuyCont);
          if ($slider.length > 0) {
            // collapse detail container
            $quickbuyCont.stop().animate({ height: 0 }, droppyDownAnimSpeed, function () {
              // remove details
              $detailCont.empty();
            });
          } else {
            contractDetail($block, droppyDownAnimSpeed);
          }

          // scroll to top of closing block
          var scrollUpOffset = -140;
          $('html:not(:animated),body:not(:animated)').animate({ scrollTop: $block.offset().top + scrollUpOffset }, 500);

          // disable close button
          $quickbuyCont.find('.close-detail').attr('tabindex', '-1');
        }

        return false;
      }
    });

    //Close button event
    $(document).on('click', '.quickbuy-container .close-detail', function () {
      var $slider = $(this).closest('.collection-slider-row');
      if ($slider.length) {
        $slider.find('.product-block.expanded .quickbuy-toggle:first').trigger('click');
      } else {
        $(this).closest('.product-block').find('.quickbuy-toggle:first').trigger('click');
      }
      return false;
    });

    //You also need to know where to scroll to
    function saveCollectionPageData() {
      $('.collection-listing').each(function () {
        var $blocks = $(this).find('.product-block');
        if ($blocks.length <= 1) return true; // Skip for empty colls
        var row = 0;
        var currTop = 0;
        //Heights are fixed. Check two in case somebody has expanded one...
        var blockHeight = Math.min($blocks.first().outerHeight(), $($blocks[1]).outerHeight());
        var blockPageOffset = $blocks.first().offset().top;
        $blocks.each(function (index) {
          var currOffsetTop = $(this).offset().top;
          if (index == 0) {
            currTop = currOffsetTop;
          } else {
            if (currOffsetTop > currTop) {
              row++;
              currTop = currOffsetTop;
            }
          }
          $(this).data({
            offsetTop: blockPageOffset + row * blockHeight });

        });
      });
    }
  };

  $(function () {
    $(document).on('click', '.sharing a', function (e) {
      var $parent = $(this).parent();
      if ($parent.hasClass('twitter')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 575,
        height = 450,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Twitter', opts);

      } else if ($parent.hasClass('facebook')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 626,
        height = 256,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Facebook', opts);

      } else if ($parent.hasClass('pinterest')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 700,
        height = 550,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Pinterest', opts);

      } else if ($parent.hasClass('google')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 550,
        height = 450,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Google+', opts);

      }
    });
  });;


  /*================ Sections ================*/
  theme.AnnouncementBarSection = new function () {
    this.onSectionLoad = function (container) {
      this.container = container;
      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });

      this.announcements = container.querySelectorAll('.announcement');
      if (this.announcements.length > 1) {
        this.currentAnnouncement = 0;
        container.querySelector('.announcement-bar__middle').addEventListener('focusin', this.functions.pauseAnnouncements.bind(this));
        container.querySelector('.announcement-bar__middle').addEventListener('focusout', this.functions.playAnnouncements.bind(this));
        container.querySelector('.announcement-button--previous').addEventListener('click', this.functions.previousAnnouncement.bind(this));
        container.querySelector('.announcement-button--next').addEventListener('click', this.functions.nextAnnouncement.bind(this));
        this.observer = new IntersectionObserver(this.functions.handleIntersect.bind(this));
        this.observer.observe(this.container);
      }
    };

    this.functions = {
      handleIntersect: function handleIntersect(entries) {
        entries.forEach(entry => {
          if (entry.target == this.container) {
            if (entry.isIntersecting) {
              this.functions.playAnnouncements.call(this);
            } else {
              this.functions.pauseAnnouncements.call(this);
            }
          }
        });
      },

      playAnnouncements: function playAnnouncements() {
        this.announcementInterval = setInterval(() => {
          this.functions.setCurrentAnnouncement.call(this, this.currentAnnouncement + 1);
        }, 5000);
      },

      pauseAnnouncements: function pauseAnnouncements() {
        if (this.announcementInterval) {
          clearInterval(this.announcementInterval);
        }
      },

      setCurrentAnnouncement: function setCurrentAnnouncement(newIndex) {
        this.currentAnnouncement = newIndex % this.announcements.length;
        this.announcements.forEach((el, index) => {
          if (index !== this.currentAnnouncement) {
            el.classList.add('announcement--inactive');
          } else {
            el.classList.remove('announcement--inactive');
          }
        });
      },

      previousAnnouncement: function previousAnnouncement() {
        this.functions.setCurrentAnnouncement.call(this, this.currentAnnouncement - 1);
      },

      nextAnnouncement: function nextAnnouncement() {
        this.functions.setCurrentAnnouncement.call(this, this.currentAnnouncement + 1);
      } };


    this.onSectionUnload = function (container) {
      clearInterval(this.announcementInterval);

      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });

      if (this.observer) {
        this.observer.disconnect();
      }
    };

    this.onBlockSelect = function (block) {
      var index = Array.prototype.indexOf.call(block.parentElement.children, block);
      this.functions.pauseAnnouncements.call(this);
      this.functions.setCurrentAnnouncement.call(this, index);
    };

    this.onBlockDeselect = function (block) {
      this.functions.playAnnouncements.call(this);
    };
  }();

  theme.BlogTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);

      // filter dropdown
      this.$container.on('click' + this.namespace, '.link-dropdown__button', theme.toggleLinkDropdownButton.bind(this));

      // click anywhere else in page to close
      $(document).on('click' + this.namespace, function () {
        $('.link-dropdown__button[aria-expanded="true"]').trigger('click');
      });
    };

    this.onSectionUnload = function (container) {
      this.$container.off(this.namespace);
      $(document).off(this.namespace);
    };
  }();

  theme.CartTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      this.$container = $(container);

      // listen to cart changes
      $(document).on('theme:cartchanged.cartTemplateSection', this.functions.refreshCartDependentContent.bind(this));

      // terms and conditions checkbox
      if ($('#cartform input#terms', container).length > 0) {
        $(document).on('click.cartTemplateSection', '#cartform [name="checkout"], .additional-checkout-buttons input, a[href*="/checkout"]', function () {
          if ($('#cartform input#terms:checked').length == 0) {
            alert(theme.strings.cart_terms_confirmation);
            return false;
          }
        });
      }

      if ($(container).data('ajax-update')) {
        $(container).on('keyup.cartTemplateSection change.cartTemplateSection changeFromButton.cartTemplateSection', '.cart-item__quantity-input', function (evt) {
          if (this.replacingContent) {
            return;
          }
          if ($(evt.currentTarget).data('initial-value') && $(evt.currentTarget).data('initial-value') == $(evt.currentTarget).val()) {
            return;
          }
          if ($(evt.currentTarget).val().length == 0 || $(evt.currentTarget).val() == '0') {
            return;
          }
          if (!evt.currentTarget.reportValidity()) {
            return;
          }

          // focus on -/+ button or input, depending on source of event
          var toFocusId;
          if (evt.type === 'changeFromButton') {
            toFocusId = $(evt.data).attr('id');
          } else {
            toFocusId = $(evt.currentTarget).attr('id');
          }

          this.functions.updateCart.call(this,
          {
            line: $(evt.currentTarget).data('line'),
            quantity: $(evt.currentTarget).val() },
          function () {
            // after update, set focus
            $('#' + toFocusId).focus();
          });

        }.bind(this));

        $(container).on('click.cartTemplateSection', '.quantity-down, .quantity-up', function (evt) {
          var $input = $(this).closest('.quantity').find('input'),
          step = $input.attr('step') ? parseInt($input.attr('step')) : 1;
          if ($(this).hasClass('quantity-down')) {
            $input.val(parseInt($input.val()) - step).trigger('changeFromButton', { data: this });
          } else {
            $input.val(parseInt($input.val()) + step).trigger('changeFromButton', { data: this });
          }
          return false;
        });
      }

      theme.cartNoteMonitor.load($('.checkout-note [name="note"]', container));

      $(container).on('click.cartTemplateSection', 'button[data-toggle-shipping]', function () {
        $('#shipping-calculator').toggle();
        var alt = $(this).data('toggle-html');
        $(this).data('toggle-html', $(this).html());
        $(this).html(alt);
        return false;
      });
    };

    this.functions = {
      refreshCartDependentContent: function refreshCartDependentContent() {
        if (this.cartRefreshXhr) {
          this.cartRefreshXhr.abort();
        }
        // fetch new html for the page
        this.cartRefreshXhr = $.ajax({
          type: 'GET',
          url: theme.routes.cart_url,
          success: function (data) {
            var toReplace = ['.cart-item-list', '.checkout-subtotal-container__dynamic'];
            var $newDom = $('<div>' + data + '</div>');

            // remove any transitions
            $newDom.find('.fade-in').removeClass('fade-in');
            $newDom.find('[data-cc-animate]').removeAttr('data-cc-animate');

            for (var i = 0; i < toReplace.length; i++) {
              this.replacingContent = true; // to avoid triggering change events when focus is lifted before DOM replacement
              var $toReplace = this.$container.find(toReplace[i]),
              $replaceWith = $newDom.find(toReplace[i]);
              // preserve loaded images
              $replaceWith.find('.cart-item__image').each(function () {
                var $match = $toReplace.find('#' + this.id);
                if ($match.length) {
                  $(this).replaceWith($match.clone());
                }
              });
              $toReplace.replaceWith($replaceWith);
              this.replacingContent = false;
            }
          }.bind(this),
          error: function error(data) {
            if (data.statusText != 'abort') {
              console.log('Error refreshing page');
              console.log(data);
            }
          },
          complete: function () {
            this.cartRefreshXhr = null;
          }.bind(this) });

      },

      updateCart: function updateCart(params, successCallback) {
        if (this.cartXhr) {
          this.cartXhr.abort();
        }
        if (this.cartRefreshXhr) {
          this.cartRefreshXhr.abort();
        }
        this.cartXhr = $.ajax({
          type: 'POST',
          url: theme.routes.cart_change_url + '.js',
          data: params,
          dataType: 'json',
          success: function success() {
            document.documentElement.dispatchEvent(
            new CustomEvent('theme:cartchanged', { bubbles: true, cancelable: false }));

            successCallback();
          },
          error: function error(data) {
            if (data.statusText != 'abort') {
              console.log('Error processing update');
              console.log(data);
            }
          },
          complete: function () {
            this.cartXhr = null;
          }.bind(this) });

      } };


    this.onSectionUnload = function (container) {
      $(document).off('.cartTemplateSection');
      $(container).off('.cartTemplateSection');
      theme.cartNoteMonitor.unload($('.checkout-note [name="note"]', container));
    };
  }();

  theme.CollectionTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);

      this.filterer = new theme.LoadFilterer(this);

      // button subcollection link hide/reveal
      $(window).on('debouncedresize' + this.namespace, this.functions.truncateButtonSubcollections.bind(this));
      this.functions.truncateButtonSubcollections.call(this);

      // gallery subcollection carousel
      var $subcollectionGallery = $('.subcollection-links--gallery .gallery', container);
      $subcollectionGallery.on('init', function () {
        $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
      }).slick({
        autoplay: false,
        fade: false,
        infinite: false,
        swipeToSlide: true,
        slidesToShow: Math.min(4, $('.subcollection-links--gallery .gallery__item', container).length),
        slidesToScroll: 1,
        useTransform: true,
        arrows: true,
        dots: false,
        prevArrow: '<button type="button" class="image-page-button image-page-button--previous ltr-icon" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
        nextArrow: '<button type="button" class="image-page-button image-page-button--next ltr-icon" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
        rtl: document.querySelector('html[dir=rtl]') ? true : false,
        responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: Math.min(3, $('.subcollection-links--gallery .gallery__item', container).length) } },


        {
          breakpoint: 768,
          settings: $subcollectionGallery.data('mobile-item-count') == 'hide' ? 'unslick' : {
            slidesToShow: $subcollectionGallery.data('mobile-item-count') } }] });




    };

    this.onSectionUnload = function (container) {
      this.filterer.destroy();
      $('.subcollection-links__expander', this.$container).off('click');
      $('.slick-slider', container).slick('unslick').off('init');
      $(window).off(this.namespace);
    };

    this.functions = {
      truncateButtonSubcollections: function truncateButtonSubcollections() {
        var $subcollections = $('.subcollection-links--buttons', this.$container);
        if ($subcollections.css('display') == 'flex') {
          var limit = 4;
          var $btns = $subcollections.find('.btn');
          if ($btns.length > limit && $subcollections.find('.subcollection-links__expander').length === 0) {
            $btns.slice(limit - 1).hide();
            $('<a href="#" class="btn btn--tertiary subcollection-links__expander">').
            text(theme.strings.collections_general_see_all_subcollections).
            appendTo($subcollections).
            on('click', function (evt) {
              evt.preventDefault();
              $(this).siblings().show();
              $(this).remove();
            });
          }
        } else if ($subcollections.find('.subcollection-links__expander').length) {
          $subcollections.find('.subcollection-links__expander').siblings().show();
          $subcollections.find('.subcollection-links__expander').remove();
        }
      } };

  }();

  theme.CustomRowSection = new function () {
    this.onSectionLoad = function (container) {
      theme.VideoManager.onSectionLoad(container);
    };

    this.onSectionUnload = function (container) {
      theme.VideoManager.onSectionUnload(container);
    };
  }();

  theme.FeaturedCollectionSection = new function () {
    this.onSectionLoad = function (container) {
      var $carousels = theme.loadCarousels(container);
      // carousels load blocks after init
      if ($carousels.length === 0) {
        theme.ProductBlockManager.loadImages(container);
      }
    };

    this.onSectionUnload = function (container) {
      theme.ProductBlockManager.unloadImages(container);
      theme.unloadCarousels(container);
    };
  }();

  theme.FeaturedCollectionsSection = new function () {
    this.onSectionLoad = function (container) {
      var $carousels = theme.loadCarousels(container);
      // carousels load blocks after init
      if ($carousels.length === 0) {
        theme.ProductBlockManager.loadImages(container);
      }
    };

    this.onSectionUnload = function (container) {
      theme.ProductBlockManager.unloadImages(container);
      theme.unloadCarousels(container);
    };
  }();

  theme.FeaturedProductSection = new function () {
    this.onSectionLoad = function (container) {
      // init gallery (before product form - so it can respond to variant images)
      theme.initProductGallery(container);

      // init product form
      $('.product-form', container).trigger('load-product-form');

      theme.ProductBlockManager.loadImages(container);
    };

    this.onSectionUnload = function (container) {
      theme.ProductBlockManager.unloadImages(container);
      theme.destroyProductGallery(container);
      $('.product-form', container).trigger('unload-product-form');
      $('.slideshow', container).slick('unslick');
    };
  }();

  theme.FooterSection = new function () {
    this.onSectionLoad = function (container) {
      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });
    };

    this.onSectionUnload = function (container) {
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }();

  theme.GallerySection = new function () {
    this.onSectionLoad = function (container) {
      var $carouselGallery = $('.gallery--mobile-carousel', container);
      if ($carouselGallery.length) {
        var assessCarouselFunction = function assessCarouselFunction() {
          var isCarousel = $carouselGallery.hasClass('slick-slider'),
          shouldShowCarousel = $(window).width() < 768;

          if (!shouldShowCarousel) {
            $('.lazyload--manual', $carouselGallery).removeClass('lazyload--manual').addClass('lazyload');
          }

          if (isCarousel && !shouldShowCarousel) {
            // Destroy carousel

            // - unload slick
            $carouselGallery.slick('unslick').off('init');
            $carouselGallery.find('a, .gallery__item').removeAttr('tabindex').removeAttr('role');

            // - re-row items
            var rowLimit = $carouselGallery.data('grid');
            var $currentRow = null;
            $carouselGallery.find('.gallery__item').each(function (index) {
              if (index % rowLimit === 0) {
                $currentRow = $('<div class="gallery__row">').appendTo($carouselGallery);
              }
              $(this).appendTo($currentRow);
            });
          } else if (!isCarousel && shouldShowCarousel) {
            // Create carousel

            // - de-row items
            $carouselGallery.find('.gallery__item').appendTo($carouselGallery);
            $carouselGallery.find('.gallery__row').remove();

            // - init carousel
            $carouselGallery.on('init', function () {
              $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
            }).slick({
              autoplay: false,
              fade: false,
              infinite: true,
              useTransform: true,
              arrows: false,
              dots: true,
              customPaging: function customPaging(slider, i) {
                return "<button class=\"custom-dot\" type=\"button\" data-role=\"none\" role=\"button\" tabindex=\"0\">" + "<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"30px\" height=\"30px\" viewBox=\"0 0 30 30\" xml:space=\"preserve\">" + "<circle class=\"circle-one\" cx=\"15\" cy=\"15\" r=\"13\" />" + "<circle class=\"circle-two\" cx=\"15\" cy=\"15\" r=\"13\" />" + "</svg>" + "</button>";





              },
              rtl: document.querySelector('html[dir=rtl]') ? true : false });

          }
        };

        assessCarouselFunction();
        $(window).on('debouncedresize.themeSection' + container.id, assessCarouselFunction);
      }

      // Tidier typography
      $('.overlay-text__title, .overlay-text__rte', container).each(function () {
        theme.avoidUnecessaryOrphans(this);
      });
    };

    this.onSectionUnload = function (container) {
      $(window).off('.themeSection' + container.id);
      $('.slick-slider', container).each(function () {
        $(this).slick('unslick').off('init');
      });
    };

    this.onBlockSelect = function (block) {
      var blockSlideIndex = $(block).data('slick-index');
      $(block).closest('.slick-slider').each(function () {
        $(this).slick('slickGoTo', blockSlideIndex);
      });
    };
  }();

  theme.HeaderSection = new function () {
    this.onSectionLoad = function (container) {
      // block focus events targeted at the social icons
      $(container).on('focusin.headerSection focusout.headerSection', '.social-links', function (e) {
        return false;
      });

      // asses focus, and handle transitioning between child elements with a timeout
      var searchFocusOutTimeoutId = -1;
      $(container).on('focusin.headerSection focusout.headerSection', '.search-box', function (e) {
        if (e.type == 'focusin') {
          clearTimeout(searchFocusOutTimeoutId);
          $(this).closest('.search-box').addClass('focus');
        } else {
          clearTimeout(searchFocusOutTimeoutId);
          searchFocusOutTimeoutId = setTimeout(function () {
            $(this).closest('.search-box').removeClass('focus');
          }.bind(this), 200);
        }
      });

      // Toggle search
      $(container).on('click.headerSection', '.show-search-link, .main-search__close', function (e) {
        if ($('body').toggleClass('show-search').hasClass('show-search')) {
          setTimeout(function () {$('.main-search__input:first').focus();}, 500);
          $('.main-search__suggestions .lazyload--manual').removeClass('lazyload--manual').addClass('lazyload');
        } else {
          $('.show-search-link:first').focus();
        }
        return false;
      });

      // Close search on escape
      $(container).on('keyup.headerSection', '.main-search__input', function (e) {
        if (e.keyCode == 27) {
          $('.main-search__close').click();
        }
      });

      /// Live search
      var $liveSearchContainer = $('.main-search[data-live-search="true"]', container);
      if ($liveSearchContainer.length) {
        var searchTimeoutThrottle = 500,
        searchTimeoutID = -1,
        currReqObj = null,
        resultLimit = 8,
        showPrice = $liveSearchContainer.data('live-search-price'),
        showVendor = $liveSearchContainer.data('live-search-vendor'),
        includeMeta = $liveSearchContainer.data('live-search-meta'),
        perRowMob = $liveSearchContainer.data('per-row-mob');

        $(container).on('keyup.headerSection change.headerSection', '.main-search__input', function () {
          var $searchContainer = $('.main-search'),
          $resultsBox = $searchContainer.find('.main-search__results'),
          valueToSearch = $(this).val();

          //Only search if search string longer than 2, and it has changed
          if (valueToSearch.length > 2 && valueToSearch != $(this).data('oldval')) {
            //Reset previous value
            $(this).data('oldval', valueToSearch);

            // Kill outstanding ajax request
            if (currReqObj != null) {
              currReqObj.abort();
            }

            // Kill previous search
            clearTimeout(searchTimeoutID);

            // Create URL for full search results
            var $form = $(this).closest('form');
            var linkURL = $form.attr('action') + ($form.attr('action').indexOf('?') > -1 ? '&' : '?') + $form.serialize();

            //Show loading
            $searchContainer.removeClass('main-search--has-results main-search--results-on-multiple-lines main-search--no-results').addClass('main-search--loading');
            if ($('.main-search__results-spinner').length === 0) {
              $resultsBox.html('<div class="main-search__results-spinner"><div class="loading-spinner"></div></div>');
            }

            // Do next search (in X milliseconds)
            searchTimeoutID = setTimeout(function () {
              var ajaxUrl, ajaxData;
              if (theme.Shopify.features.predictiveSearch) {
                // use the API
                ajaxUrl = theme.routes.predictive_search_url;
                ajaxData = {
                  "q": valueToSearch,
                  "section_id": "predictive-search",
                  "resources": {
                    "type": $form.find('input[name="type"]').val(),
                    "limit": resultLimit,
                    "options": {
                      "unavailable_products": "last",
                      "fields": includeMeta ? "title,product_type,variants.title,vendor,tag,variants.sku" : "title,product_type,variants.title,vendor" } } };



              } else {
                // use the theme template fallback
                ajaxUrl = linkURL;
                ajaxData = {
                  "section_id": "main-search" };

              }
              //Ajax hit on search page
              currReqObj = $.ajax({
                url: ajaxUrl,
                data: ajaxData,
                dataType: 'html',
                success: function success(response) {
                  var $resultsList = null;
                  if (!theme.Shopify.features.predictiveSearch) {
                    $resultsList = $('<div>' + response + '</div>').find('[data-section-type="search-template"] .product-list');
                  } else {
                    $resultsList = $(response).find('.product-list');
                  }

                  // reset previous contents
                  currReqObj = null;
                  theme.ProductBlockManager.unloadImages($resultsBox);
                  $searchContainer.removeClass('main-search--has-results main-search--results-on-multiple-lines main-search--no-results');
                  $resultsBox.empty();

                  var $resultsProducts = $('<div class="main-search__results__products collection-listing"><div></div></div>');
                  var $resultsPages = $('<div class="main-search__results__pages">');

                  $resultsProducts.children()[0].className = $resultsList[0].className;

                  $resultsList.find('.product-block:not(.collection-block):not(.page-block)').slice(0, resultLimit).addClass('main-search-result').each(function () {
                    $(this).find('.btn.quickbuy-toggle').remove();
                    $(this).find('.quickbuy-toggle').removeClass('quickbuy-toggle');
                    if (!showPrice) {
                      $(this).find('.product-price').remove();
                    }
                    if (!showVendor) {
                      $(this).find('.vendor').remove();
                    }
                  }).appendTo($resultsProducts.children());

                  $resultsList.find('.product-block.page-block').each(function () {
                    var $item = $('<a class="main-search-result main-search-result--page">').attr('href', $(this).find('a:first').attr('href'));
                    $('<div class="main-search-result__text">').text($(this).find('.page-block__title').text()).appendTo($item);
                    $resultsPages.append($item);
                  });

                  $searchContainer.removeClass('main-search--loading');

                  var areProducts = $resultsProducts.find('.main-search-result:first').length > 0,
                  arePages = $resultsPages.find('.main-search-result:first').length > 0;
                  if (areProducts || arePages) {
                    // Numerous results
                    $searchContainer.addClass('main-search--has-results');
                    $searchContainer.toggleClass('main-search--results-on-multiple-lines', $resultsProducts.find('.product-block').length > 4);
                    if (areProducts) {
                      $resultsBox.append($resultsProducts);
                      theme.ProductBlockManager.loadImages($resultsProducts);
                    }
                    if (arePages) {
                      $('<h6 class="main-search-result__heading">').html(theme.strings.general_quick_search_pages).prependTo($resultsPages);
                      $resultsBox.append($resultsPages);
                    }
                    $('<a class="main-search__results-all-link button altcolour">').
                    attr('href', linkURL).
                    html(theme.strings.layout_live_search_see_all).
                    appendTo($resultsBox);

                    theme.initAnimateOnScroll();
                  } else {
                    // No results - show nothing
                    $searchContainer.addClass('main-search--no-results');
                    $('<div class="main-search__empty-message">').html(theme.strings.general_quick_search_no_results).appendTo($resultsBox);
                  }
                },
                error: function error(response) {
                  console.log('Error fetching results');
                } });

            }, searchTimeoutThrottle);
          } else if ($(this).val().length <= 2) {
            // Deleted text? Abandon search-in-progress
            $(this).data('oldval', valueToSearch);
            if (currReqObj != null) {
              currReqObj.abort();
            }
            clearTimeout(searchTimeoutID);

            // Clear results
            $searchContainer.removeClass('main-search--has-results main-search--results-on-multiple-lines main-search--loading');
            $resultsBox.empty();
          }
        });
      }

      // nav
      theme.Navigation.init({
        nav: $('.navigation--main', container),
        mobileNavHtml: $('.mobile-navigation-drawer-template', container).html(),
        proxyTier1Nav: $('.navigation--left', container) });


      if (theme.inlineNavigationCheck) {
        theme.inlineNavigationCheck();
        $(window).on('debouncedresize.headerSection', theme.inlineNavigationCheck);
      } else if (document.querySelector('#InlineNavigationCheckScript')) {
        // if just enabled in theme editor but not evaluated
        eval(document.querySelector('#InlineNavigationCheckScript').innerHTML);
      }

      // set anything that alters based on contents/viewport/scroll, etc
      this.section = document.querySelector('.section-header');
      this.transparentPageheader = document.querySelector('.pageheader--transparent-permitted');

      this.functions.setTransparency.call(this);
      this.functions.setSticky.call(this);
      this.functions.setHeaderHeightProperty.call(this);

      $(window).on('scroll.headerSection', this.functions.afterScroll.bind(this));
      $(window).on('debouncedresize.headerSection', this.functions.afterResize.bind(this));

      // account / localization (after mobile nav initialises)
      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });

      $('.mobile-navigation-drawer .disclosure').each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });

      // listen to cart changes
      $(document).on('theme:cartchanged.headerSection', function () {
        $.getJSON(location.origin + '?sections=header', function (data) {
          var cartSummarySelectors = ['#pageheader .logo-area__right__inner'];
          for (var i = 0; i < cartSummarySelectors.length; i++) {
            var $newCartObj = $('<div>' + data.header + '</div>').find(cartSummarySelectors[i]).first();
            var $currCart = $(cartSummarySelectors[i]);
            $currCart.html($newCartObj.html());
          }
        });
      });

      // init mobile nav again if it's open and this is a reload
      if (Shopify.designMode && $('body').hasClass('reveal-mobile-nav')) {
        theme.openMobileNav();
      }
    };

    this.onSectionUnload = function (container) {
      $(container).off('.headerSection');
      $(document).off('.headerSection');
      $(window).off('.headerSection');
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
      $('.mobile-navigation-drawer .disclosure').each(function () {
        $(this).data('disclosure').unload();
      });
      theme.Navigation.destroy($('.navigation', container), $('.navigation--left', container));
    };

    this.functions = {
      afterScroll: function afterScroll() {
        this.functions.setTransparency.call(this);
      },

      afterResize: function afterResize() {
        this.functions.setSticky.call(this);
        this.functions.setHeaderHeightProperty.call(this);
      },

      setTransparency: function setTransparency() {
        if (this.transparentPageheader) {
          var bar = document.querySelector('.section-announcement-bar'),
          scrollThreshold = bar ? bar.offsetTop + bar.clientHeight : 0;
          if (!this.isSticky || window.scrollY <= scrollThreshold) {
            this.transparentPageheader.classList.add('pageheader--transparent');
          } else {
            this.transparentPageheader.classList.remove('pageheader--transparent');
          }
        }
      },

      setSticky: function setSticky() {
        this.isSticky = getComputedStyle(this.section).position === 'sticky' || getComputedStyle(this.section).position === '-webkit-sticky';
      },

      setHeaderHeightProperty: function setHeaderHeightProperty() {
        var headerHeight = 0,
        stickyHeaderHeight = 0;
        if (this.section) {
          headerHeight = Math.ceil(this.section.clientHeight);
          if (this.isSticky) {
            stickyHeaderHeight = headerHeight;
          }
        }
        document.documentElement.style.setProperty('--theme-header-height', headerHeight + 'px');
        document.documentElement.style.setProperty('--theme-sticky-header-height', stickyHeaderHeight + 'px');
      } };

  }();

  theme.ImageWithTextOverlaySection = new function () {
    var _ = this;

    _.checkForHeaderHeightSubtraction = function () {
      $('.section-image-with-text-overlay .height--full-minus-header-height').each(function () {
        var height = $(window).height();
        // transparent header & top section? slightly different calculation
        if (document.querySelector('.pageheader--transparent-permitted') && !this.closest('.shopify-section').previousElementSibling) {
          document.querySelectorAll('.section-store-messages, .section-announcement-bar').forEach(el => {
            height -= el.clientHeight;
          });
        } else {
          height -= document.querySelector('.section-header').clientHeight;
        }
        $('.rimage-outer-wrapper, .placeholder-image', this).height(height);
      });
    };

    this.onSectionLoad = function (container) {
      $('.height--full', container).each(function () {
        if ($(this).closest('.section-image-with-text-overlay').index() == 0) {
          $(this).addClass('height--full-minus-header-height');
          _.checkForHeaderHeightSubtraction();
          $(window).off('debouncedresize.imageWithTextOverlaySection').on('debouncedresize.imageWithTextOverlaySection', _.checkForHeaderHeightSubtraction);
        }
      });

      // Tidier typography
      $('.overlay-text__title, .overlay-text__rte', container).each(function () {
        theme.avoidUnecessaryOrphans(this);
      });
    };

    this.onSectionUnload = function (container) {
      $(window).off('.imageWithTextOverlaySection');
    };
  }();

  theme.ListCollectionsTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      theme.ProductBlockManager.loadImages(container);
    };

    this.onSectionUnload = function (container) {
      theme.ProductBlockManager.unloadImages(container);
    };
  }();

  theme.ProductTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      /// Init store availability if applicable
      if ($('[data-store-availability-container]', container).length) {
        this.storeAvailability = new theme.StoreAvailability($('[data-store-availability-container]', container)[0]);
      }

      // init gallery (before product form - so it can respond to variant images)
      theme.initProductGallery(container);

      // init product form
      $('.product-form', container).trigger('load-product-form');

      theme.ProductBlockManager.loadImages(container);

      // click review rating under title
      $('.theme-product-reviews', container).on('click', 'a', function () {
        $('html,body').animate({
          scrollTop: $($(this).attr('href')).offset().top },
        1000);
        return false;
      });
    };

    this.onSectionUnload = function (container) {
      theme.ProductBlockManager.unloadImages(container);
      theme.destroyProductGallery(container);
      $('.product-form', container).trigger('unload-product-form');
      $('.theme-product-reviews', container).off('click');
      if (this.storeAvailability) {
        this.storeAvailability.onSectionUnload();
      }
    };
  }();

  theme.ScrollingBannerSection = new function () {
    this.onSectionLoad = function (target) {
      document.fonts.ready.then(() => target.querySelector('.marquee').classList.add('marquee--animate'));
      target.querySelectorAll('.lazyload').forEach(el => {lazySizes.loader.unveil(el);});
    };
  }();

  theme.SearchTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);

      this.filterer = new theme.LoadFilterer(this);
    };

    this.onSectionUnload = function () {
      this.filterer.destroy();
    };
  }();

  theme.SlideshowSection = new function () {
    var _ = this;

    _.checkForHeaderHeightSubtraction = function () {
      $('.section-slideshow .height--full-minus-header-height').each(function () {
        var height = $(window).height();
        // transparent header & top section? slightly different calculation
        if (document.querySelector('.pageheader--transparent-permitted') && !this.closest('.shopify-section').previousElementSibling) {
          document.querySelectorAll('.section-store-messages, .section-announcement-bar').forEach(el => {
            height -= el.clientHeight;
          });
        } else {
          height -= document.querySelector('.section-header').clientHeight;
        }
        $('.rimage-outer-wrapper, .placeholder-image', this).height(height);
      });
    };

    this.onSectionLoad = function (container) {
      $('.slideshow', container).each(function () {
        var slideshowSpeed = $(this).data('transition') === 'instant' ? 0 : 800;
        var autoplaySpeed = $(this).data('autoplay-speed') * 1000;

        if ($(this).find('.height--full').length && $(this).closest('.section-slideshow').index() == 0) {
          $(this).addClass('height--full-minus-header-height');
          _.checkForHeaderHeightSubtraction();
          $(window).off('debouncedresize.slideshowSection').on('debouncedresize.slideshowSection', _.checkForHeaderHeightSubtraction);
        }
        $(this).on('init', function () {
          $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
        }).slick({
          autoplay: $(this).data('autoplay'),
          fade: $(this).data('transition') !== 'slide',
          speed: slideshowSpeed,
          autoplaySpeed: autoplaySpeed,
          arrows: $(this).data('navigation') === 'arrows',
          dots: $(this).data('navigation') === 'dots',
          pauseOnHover: false,
          infinite: true,
          useTransform: true,
          prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
          nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
          customPaging: function customPaging(slider, i) {
            return "<button class=\"custom-dot\" type=\"button\" data-role=\"none\" role=\"button\" tabindex=\"0\">" + "<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"30px\" height=\"30px\" viewBox=\"0 0 30 30\" xml:space=\"preserve\">" + "<circle class=\"circle-one\" cx=\"15\" cy=\"15\" r=\"13\" />" + "<circle class=\"circle-two\" cx=\"15\" cy=\"15\" r=\"13\" style=\"animation-duration: ".concat(


            autoplaySpeed + slideshowSpeed, "ms\" />") + "</svg>" + "</button>";


          },
          rtl: document.querySelector('html[dir=rtl]') ? true : false,
          responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              dots: $(this).data('navigation') !== 'none' } }] }).



        on('beforeChange', function (event, slick, currentSlide) {
          if ($(this).data('transition') === 'slide_fade' || $(this).data('transition') === 'zoom') {
            var $outgoingSlide = $(slick.$slides.get(currentSlide));
            $outgoingSlide.addClass('slick--leaving');
          }
        }).on('afterChange', function (event, slick) {
          $(slick.$slides).filter('.slick--leaving').removeClass('slick--leaving');
        });
      });

      // Tidier typography
      $('.overlay-text__title, .overlay-text__rte', container).each(function () {
        theme.avoidUnecessaryOrphans(this);
      });
    };

    this.onSectionUnload = function (container) {
      $('.slick-slider', container).slick('unslick').off('init');
      $(window).off('.slideshowSection');
    };

    this.onBlockSelect = function (container) {
      $(container).closest('.slick-slider').
      slick('slickGoTo', $(container).data('slick-index')).
      slick('slickPause');
    };

    this.onBlockDeselect = function (container) {
      $(container).closest('.slick-slider').
      slick('slickPlay');
    };
  }();

  theme.TestimonialsSection = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$testimonialContainer = $('.testimonial-list', container);

      this.$testimonialContainer.find('.testimonial-list__inner').on('init', function () {
        $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
      }).slick({
        fade: this.$testimonialContainer.hasClass('testimonial-list--with-images'),
        slidesToShow: this.$testimonialContainer.hasClass('testimonial-list--without-images') ? 2 : 1,
        autoplay: this.$testimonialContainer.data('autoplay'),
        autoplaySpeed: this.$testimonialContainer.data('autoplay-speed'),
        dots: false,
        arrows: true,
        appendArrows: this.$testimonialContainer.find('.testimonial-list__controls'),
        prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
        nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
        rtl: document.querySelector('html[dir=rtl]') ? true : false,
        responsive: [
        {
          breakpoint: 768,
          settings: {
            fade: false,
            slidesToShow: 1 } }] });




    };

    this.onSectionUnload = function (container) {
      $('.slick-slider', container).each(function () {
        $(this).slick('unslick').off('init');
      });
    };

    this.onBlockSelect = function (block) {
      var blockSlideIndex = $(block).data('slick-index');
      $(block).closest('.slick-slider').each(function () {
        $(this).slick('slickGoTo', blockSlideIndex);
      });
    };
  }();



  // dom ready
  $(function ($) {
    var $ = $; // keep this ref local

    $(document).on('keyup.themeTabCheck', function (evt) {
      if (evt.keyCode === 9) {
        $('body').addClass('tab-used');
        $(document).off('keyup.themeTabCheck');
      }
    });

    /// Reusable function to expand/contract a div
    $(document).on('click', 'a[data-toggle-target]', function (e) {
      e.preventDefault();
      var $toggler = $(this),
      $target = $($(this).data('toggle-target')),
      $transCont = $target.find('.toggle-target-container'),
      doCollapse = !$target.hasClass('toggle-target--hidden');
      var transitionDuration = $target.css('transition-duration').indexOf('ms') >= 0 ? parseInt($target.css('transition-duration')) : parseFloat($target.css('transition-duration')) * 1000;
      if (!$target.hasClass('toggle-target--in-transition')) {
        if (doCollapse) {
          $toggler.addClass('toggle-target-toggler--is-hidden');
          $target.addClass('toggle-target--in-transition toggle-target--hiding').css({
            height: $transCont.outerHeight() + 'px',
            opacity: 1 });

          setTimeout(function () {
            $target.css({
              height: 0,
              opacity: 0 });

            setTimeout(function () {
              $target.addClass('toggle-target--hidden').removeClass('toggle-target--in-transition toggle-target--hiding');
              $target.css({
                height: '',
                opacity: '' });

            }, transitionDuration);
          }, 10);
        } else {
          $toggler.removeClass('toggle-target-toggler--is-hidden');
          $target.addClass('toggle-target--in-transition toggle-target--revealing').css({
            height: 0,
            opacity: 0,
            display: 'block' });

          setTimeout(function () {
            $target.css({
              height: $transCont.outerHeight() + 'px',
              opacity: 1 });

            setTimeout(function () {
              $target.removeClass('toggle-target--hidden toggle-target--in-transition toggle-target--revealing');
              $target.css({
                height: '',
                opacity: '',
                display: '' });

            }, transitionDuration);
          }, 10);
        }
      }
    });

    //Redirect dropdowns
    $(document).on('change', 'select.navdrop', function () {
      window.location = $(this).val();
    });

    /// Mobile nav
    $(document).on('click', '.mobile-nav-toggle', function (e) {
      e.preventDefault();
      if ($('body').hasClass('enable-mobile-nav-transition')) {
        // hide nav
        $('body').removeClass('reveal-mobile-nav reveal-mobile-nav--revealed');
        setTimeout(function () {
          $('body').removeClass('enable-mobile-nav-transition');
        }, 750);
      } else {
        // show nav
        theme.openMobileNav();
      }
    });

    theme.openMobileNav = function () {
      $('body').addClass('enable-mobile-nav-transition');
      setTimeout(function () {
        $('body').addClass('reveal-mobile-nav');

        // on reveal, set up internal transition values
        $('.mobile-navigation-drawer .disclosure').each(function () {
          var $list = $('.disclosure-list', this),
          listHeight = 0;
          $list.children().each(function () {
            listHeight += $(this).height();
          });
          $('.disclosure-list', this).css('height', listHeight + 'px');
        });

        // on reveal, lazy load images
        $('.mobile-navigation-drawer .lazyload--manual').removeClass('lazyload--manual').addClass('lazyload');

        // on reveal, load product carousel
        $('.mobile-navigation-drawer .product-list').each(function () {
          theme.ProductBlockManager.loadImages($(this));
        });

        // after reveal, add class
        var de = $('.mobile-navigation-drawer .navigation__tier-1 > .navigation__item > .navigation__link:first').css('transition-delay');
        var du = $('.mobile-navigation-drawer .navigation__tier-1 > .navigation__item > .navigation__link:first').css('transition-duration');
        var delayS = parseFloat(de.split(',')[0]) + parseFloat(du.split(',')[0]);
        setTimeout(function () {
          $('body').addClass('reveal-mobile-nav--revealed');
        }, delayS * 1000);
      }, 10);
    };

    /// General window shade
    $('<a href="#" class="page-shade" aria-label="' + theme.strings.general_navigation_menu_toggle_aria_label + '"></a>').on('click', function () {
      $('body').removeClass('reveal-mobile-nav show-search');
      setTimeout(function () {
        $('body').removeClass('enable-mobile-nav-transition');
      }, 750);
      return false;
    }).appendTo('body');


    if (theme.settings.quickbuy_style != 'off') {
      theme.loadQuickbuy();
    }

    /// Event for initialising options
    $(document).on('load-product-form', '.product-form', function (e) {
      if ($(this).data('product-id') === '') {
        return;
      }

      var $productFormContainer = $(this),
      $productDetail = $(this).closest('.product-detail');

      // events on variant change

      $(this).on('variantChanged', function (evt, variant, product) {
        // change variant status classes
        var $labelCont = $productDetail.find('.product-label-list');
        $labelCont.find('.product-label-container').remove();
        if (variant) {
          $labelCont.append($("#variant-label-".concat(product.id, "-").concat(variant.id)).html());
        } else {
          $labelCont.append($("#variant-label-".concat(product.id, "-none")).html());
        }

        // instate DPBs - requires a variant ID, and may be loaded in quick buy
        if (variant) {
          $productDetail.find('.dynamic-payment-button-template').each(function () {
            $(this).after($(this).html()).remove();

            if (Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }
          });
        }
      });

      // icon-style variant picker to show option beside label
      var $iconOptionContainers = $productDetail.find('.option-selector--swatch');
      if ($iconOptionContainers.length && $('body.swatch-style-icon_circle, body.swatch-style-icon_square').length) {
        $iconOptionContainers.find('.label').append('<span class="label__value">');
        $(this).on('variantChanged', function (evt, variant) {
          $iconOptionContainers.each(function () {
            var optionIndex = $(this).data('option-index');
            if (variant) {
              var optionValue = variant.options[optionIndex];
              $(this).find('.label__value').text(optionValue);
            } else {
              var selectedOption = this.querySelector('.opt-btn:checked');
              if (selectedOption) {
                $(this).find('.label__value').text(selectedOption.value);
              }
            }
          });
        });
      }

      // Add a disabled-state to options that have no valid variants, in a descending selection order
      var $availabilityDependentOptions = $productDetail.find('.option-selectors[data-disable-unavailable="true"]');
      if ($availabilityDependentOptions.length) {
        $(this).on('variantChanged', function (evt, variant) {var _this2 = this;
          var productData = theme.OptionManager.getProductData($(this));
          var optionStatusMap = [];
          var currentSelectedOptionValues = [];

          $('.option-selectors[data-disable-unavailable="true"] .option-selector', this).each(function (index) {
            var checkedInput = $(this).find('input:checked');
            var selectedOption = $(this).find('.cc-select__option[aria-selected="true"]');
            var value = checkedInput.length ? checkedInput.val() : selectedOption ? selectedOption.data('value') : null;
            currentSelectedOptionValues.push(value);
          });

          // build map of options
          for (var optionIndex = 0; optionIndex < productData.options.length; optionIndex++) {
            var optionName = productData.options[optionIndex];
            var values = {};
            for (var i = 0; i < productData.variants.length; i++) {
              var v = productData.variants[i];
              if (!values[v.options[optionIndex]]) {
                values[v.options[optionIndex]] = false;
              }
            }
            optionStatusMap.push({
              name: optionName,
              values: values });

          }

          // go through each option, assume previous option's values are locked in, if any further choices are possible show as available
          var _loop3 = function _loop3(_optionIndex) {
            var optionName = productData.options[_optionIndex];
            // for this option, find if any variants are available
            var fixedOptions = [];
            for (var _i2 = 0; _i2 < currentSelectedOptionValues.length && _i2 < _optionIndex; _i2++) {
              fixedOptions.push(currentSelectedOptionValues[_i2]);
            }

            // go through each option value
            Object.keys(optionStatusMap[_optionIndex].values).forEach(optionValue => {
              var fixedOptionsForValue = fixedOptions.map(x => x);
              fixedOptionsForValue.push(optionValue);

              // go through all variants
              var availableVariantExists = false;
              for (var _i3 = 0; _i3 < productData.variants.length; _i3++) {
                var _v = productData.variants[_i3];
                // does this variant comply with fixedOptionsForValue? (A blank value means it could be fine.)
                var variantComplies = true;
                for (var j = 0; j < fixedOptionsForValue.length; j++) {
                  if (fixedOptionsForValue[j] && fixedOptionsForValue[j] != _v.options[j]) {// note typeless compare - can encounter (16 == '16') here
                    variantComplies = false;
                  }
                }
                if (variantComplies && _v.available) {
                  availableVariantExists = true;
                }
              }
              optionStatusMap[_optionIndex].values[optionValue] = availableVariantExists;
            });};for (var _optionIndex = 0; _optionIndex < productData.options.length; _optionIndex++) {_loop3(_optionIndex);
          }

          for (var _i = 0; _i < optionStatusMap.length; _i++) {var _loop4 = function _loop4(
            optionValue) {
              $(".option-selector[data-selector-type=\"listed\"][data-option-index=\"".concat(_i, "\"] .opt-btn"), _this2).filter(function () {
                return this.value === optionValue;
              }).toggleClass('is-unavailable', !optionStatusMap[_i].values[optionValue]);
              $(".option-selector[data-selector-type=\"dropdown\"][data-option-index=\"".concat(_i, "\"] .cc-select__option"), _this2).filter(function () {
                return this.dataset.value === optionValue;
              }).toggleClass('is-unavailable', !optionStatusMap[_i].values[optionValue]);};for (var optionValue in optionStatusMap[_i].values) {_loop4(optionValue);
            }
          }
        });
      }

      // when option selector changes, update validation state, but only after first validation called
      $productFormContainer.on('change', '.option-selector', function () {
        if ($productFormContainer.hasClass('product-form--validation-started')) {
          theme.validateProductForm($productFormContainer);
        }
      });

      // initialise options
      theme.OptionManager.initProductOptions($(this));
    });

    $(document).on('unload-product-form', '.product-form', function () {
      $(this).off('variantChanged change');
      theme.OptionManager.unloadProductOptions($(this));
    });

    /// Galleries (inc. product page)

    // when variant changes, and the variant has an image
    $(document).on('variantImageSelected', '.gallery', function (e, data, isFirstRun) {
      var $gallery = $(this);
      var $galleryCollageContainer = $gallery.filter('.gallery--layout-columns-1, .gallery--layout-columns-2, .gallery--layout-collage-1, .gallery--layout-collage-2').find('.product-slideshow:not(.slick-slider)');
      var collageGroupedImagesChanged = false;
      var $slideshow = null;

      if ($gallery.attr('data-variant-image-grouping-option-index') !== '') {
        // when images are grouped, we use options instead of variants
        var pivotOptionIndex = $gallery.attr('data-variant-image-grouping-option-index');
        var selectedGroupOption = data.options[pivotOptionIndex];
        var $thumbnails = $gallery.find('.thumbnails');
        $slideshow = $gallery.find('.slideshow');

        // slideshow - filter
        if ($slideshow.hasClass('slick-slider')) {
          // is variant image visible?
          var currentIsVisible = !!$slideshow.find(".slide[data-media-id=\"".concat(data.featured_media.id, "\"]")).length;
          // filter (By option name: standard. By media id: when multiple variants have same media)
          $slideshow.slick('slickUnfilter').slick('slickFilter', ".slide[data-media-id=\"".concat(data.featured_media.id, "\"], [data-variant-image-group=\"").concat(selectedGroupOption.replace('"', '&quot;').replace(/<>/g, ''), "\"]"));
          // weird hack required for Slick
          $slideshow.find('.slide').css({ position: '', left: '', top: '', zIndex: '', opacity: '' });
          // jump to correct slide immediately after filtering
          if (!currentIsVisible) {
            $slideshow.slick('slickGoTo', 0, true); // reset - hack for a bug
            $slideshow.slick('slickGoTo', $slideshow.find(".slide[data-media-id=\"".concat(data.featured_media.id, "\"]")).data('slick-index'), true);
          }
        }

        // carousel - add/remove as required
        if ($thumbnails.hasClass('owl-carousel')) {
          var $hiddenThumbnails = $gallery.find('.hidden-thumbnails');
          if (!$hiddenThumbnails.length) {
            $hiddenThumbnails = $('<div class="hidden-thumbnails hidden">').insertAfter($thumbnails);
          }

          // move to hidden thumbnails container (and show() in case hide() called prior)
          $thumbnails.find('.thumbnail').show().each(function () {
            if ($(this).attr('data-variant-image-group') != selectedGroupOption && $(this).attr('data-media-id') != data.featured_media.id) {
              var index = $(this).parent().index();
              $(this).appendTo($hiddenThumbnails);
              $thumbnails.trigger('remove.owl.carousel', [index]);
            }
          });

          // add from hidden thumbnails container
          $hiddenThumbnails.find('.thumbnail').each(function () {
            if ($(this).attr('data-variant-image-group') == selectedGroupOption || $(this).attr('data-media-id') == data.featured_media.id) {
              $(this).show();
              $thumbnails.trigger('add.owl.carousel', [this]);
            }
          });
          $thumbnails.trigger('refresh.owl.carousel');
        } else {
          // show/hide elements
          $thumbnails.find('.thumbnail').each(function () {
            if ($(this).attr('data-variant-image-group') == selectedGroupOption || $(this).attr('data-media-id') == data.featured_media.id) {
              $(this).show();
            } else {
              $(this).hide();
            }
          });
        }

        // carousel - visibility by class & moving visible to top (for nth-child styling)
        if ($galleryCollageContainer.length) {
          $galleryCollageContainer.find('.slide').each(function () {
            if ($(this).attr('data-variant-image-group') == selectedGroupOption || $(this).attr('data-media-id') == data.featured_media.id) {
              if ($(this).hasClass('slide--inactive-option')) {
                collageGroupedImagesChanged = true;
              }
              $(this).removeClass('slide--inactive-option');
            } else {
              if (!$(this).hasClass('slide--inactive-option')) {
                collageGroupedImagesChanged = true;
              }
              $(this).addClass('slide--inactive-option');
            }
          });
          $galleryCollageContainer.find('.slide--inactive-option').appendTo($galleryCollageContainer);
        }
      }

      // select matching thumbnail
      $gallery.find('.thumbnails a[data-media-id="' + data.featured_media.id + '"]:first').trigger('select');

      // collage - highlight selected, if not first run
      if ($galleryCollageContainer.length) {
        var $active = $gallery.find('.slide[data-media-id="' + data.featured_media.id + '"]:first');
        if ($active.length) {
          if (isFirstRun && !collageGroupedImagesChanged) {
            // only scroll on first run, no visual highlight
            theme.scrollToRevealElement($active[0]);
          } else if (collageGroupedImagesChanged) {
            // assume first image is highlighted by the change
            $gallery.find('.slide--was-highlighted').removeClass('slide--was-highlighted');
            $active.addClass('slide--was-highlighted');
          } else if (!$active.hasClass('slide--was-highlighted')) {
            // reset
            clearTimeout(theme.variantImageFadeTimeout);
            $gallery.find('.slide--highlight-on').removeClass('slide--highlight-on');
            $gallery.find('.slide--highlight-off').removeClass('slide--highlight-off');
            $gallery.find('.slide--was-highlighted').removeClass('slide--was-highlighted');

            // highlight
            $active.addClass('slide--highlight-on slide--was-highlighted').siblings().addClass('slide--highlight-off');
            theme.variantImageFadeTimeout = setTimeout(function () {
              $gallery.find('.slide--highlight-on').removeClass('slide--highlight-on');
              $gallery.find('.slide--highlight-off').removeClass('slide--highlight-off');
            }, 1200);

            // scroll if needed
            theme.scrollToRevealElement($active[0]);
          }
        }
      }
    });

    // click main product image (launch gallery)
    $(document).on('click', '.product-detail .gallery .main-image a.show-gallery', function () {
      var images = [],
      $imgs = $(this).closest('.product-slideshow').find('.slide:not(.slide--inactive-option) .show-gallery'),
      clickedHref = $(this).attr('href');

      if ($imgs.length) {
        $imgs.each(function () {
          var $imgThumb = $(this).find('.rimage-outer-wrapper').clone();
          $imgThumb.find('.lazyloaded').removeClass('lazyloaded').addClass('lazyload').parent().addClass('lazyload--placeholder');
          images.push({
            thumbTag: $imgThumb,
            zoomUrl: $(this).attr('href') });

        });
      } else {
        var $img = $(this).find('.rimage-outer-wrapper').clone();
        $img.find('.lazyloaded').removeClass('lazyloaded').addClass('lazyload').parent().addClass('lazyload--placeholder');
        images.push({
          thumbTag: $img,
          zoomUrl: $(this).attr('href') });

      }

      theme.buildGalleryViewer({
        images: images,
        currentImage: clickedHref,
        prev: theme.icons.chevronLeft,
        next: theme.icons.chevronRight,
        close: theme.icons.close });


      return false;
    });

    // load any images that aren't inside a section
    var $nonSectionedProductLists = $('.product-list, .collection-listing').filter(function () {
      return $(this).closest('[data-section-type]').length == 0;
    });
    if ($nonSectionedProductLists.length) {
      theme.ProductBlockManager.loadImages($nonSectionedProductLists);
    }
    $(window).on('debouncedresize', function () {
      setTimeout(function () {
        theme.ProductBlockManager.afterImagesResized(); // empty param req
      }, 100); // after third party stuff
    });

    // forms don't all have correct label attributes
    $('#template label').each(function () {
      var $sibinputs = $(this).siblings('input:not([type="submit"]), textarea');
      if ($sibinputs.length == 1 && $sibinputs.attr('id').length > 0) {
        $(this).attr('for', $sibinputs.attr('id'));
      }
    });

    $(document).on('click', '.quantity-wrapper [data-quantity]', function () {
      var adj = $(this).data('quantity') == 'up' ? 1 : -1;
      var $qty = $(this).closest('.quantity-wrapper').find('[name=quantity]');
      if ($qty.attr('step')) {
        adj *= parseInt($qty.attr('step'));
      }
      $qty.val(Math.max(1, parseInt($qty.val()) + adj)).trigger('change');
      return false;
    });

    /// Responsive tables
    $('.responsive-table').on('click', '.responsive-table__cell-head', function () {
      if ($(window).width() < 768) {
        $(this).closest('tr').toggleClass('expanded');
        return false;
      }
    });

    // Enhance video sections for overlays
    if (typeof cc !== 'undefined' && cc.sections) {
      for (var sectionKey in cc.sections) {
        var ccSection = cc.sections[sectionKey];
        if (ccSection.name === 'video') {
          var t = ccSection.section.onSectionLoad;
          ccSection.section.onSectionLoad = function (container) {
            // Tidier typography
            $('.overlay-text__title, .overlay-text__rte', container).each(function () {
              theme.avoidUnecessaryOrphans(this);
            });
            t.call(this, container);
          };
        }
      }
    }

    /// Register all sections
    theme.Sections.init();
    theme.Sections.register('header', theme.HeaderSection, { deferredLoad: false });
    theme.Sections.register('announcement-bar', theme.AnnouncementBarSection, { deferredLoad: false });
    theme.Sections.register('footer', theme.FooterSection);
    theme.Sections.register('slideshow', theme.SlideshowSection);
    theme.Sections.register('gallery', theme.GallerySection);
    theme.Sections.register('testimonials', theme.TestimonialsSection);
    theme.Sections.register('image-with-text-overlay', theme.ImageWithTextOverlaySection);
    theme.Sections.register('featured-collection', theme.FeaturedCollectionSection);
    theme.Sections.register('featured-collections', theme.FeaturedCollectionsSection);
    theme.Sections.register('map', theme.MapSection);
    theme.Sections.register('background-video', theme.VideoManager, { deferredLoadViewportExcess: 800 });
    theme.Sections.register('custom-row', theme.CustomRowSection);
    theme.Sections.register('featured-product', theme.FeaturedProductSection);
    theme.Sections.register('scrolling-banner', theme.ScrollingBannerSection);
    theme.Sections.register('main-product', theme.ProductTemplateSection, { deferredLoad: false });
    theme.Sections.register('collection-template', theme.CollectionTemplateSection, { deferredLoad: false });
    theme.Sections.register('search-template', theme.SearchTemplateSection, { deferredLoad: false });
    theme.Sections.register('blog-template', theme.BlogTemplateSection, { deferredLoad: false });
    theme.Sections.register('cart-template', theme.CartTemplateSection, { deferredLoad: false });
    theme.Sections.register('list-collections-template', theme.ListCollectionsTemplateSection, { deferredLoad: false });
    theme.Sections.register('page-list-collections-template', theme.ListCollectionsTemplateSection, { deferredLoad: false });
    theme.Sections.register('contact', new function () {}());
  });


  //Register dynamically pulled in sections
  $(function ($) {
    if (cc.sections.length) {
      cc.sections.forEach(section => {
        try {
          var data = {};
          if (typeof section.deferredLoad !== 'undefined') {
            data.deferredLoad = section.deferredLoad;
          }
          if (typeof section.deferredLoadViewportExcess !== 'undefined') {
            data.deferredLoadViewportExcess = section.deferredLoadViewportExcess;
          }
          theme.Sections.register(section.name, section.section, data);
        } catch (err) {
          console.error("Unable to register section ".concat(section.name, "."), err);
        }
      });
    } else {
      console.warn('Barry: No common sections have been registered.');
    }
  });

})(theme.jQuery);  
/* Built with Barry v1.0.8 */