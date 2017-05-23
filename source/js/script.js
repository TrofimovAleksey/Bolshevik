// Add new data
  var TRoom = function(str, floor, square, rooms){
    var str = str || "0";
    var floor = floor || "0";
    var square = square || "0";
    var rooms = rooms || "0";
    this.floor = parseInt(floor);
    this.square = parseFloat(square.replace(',','.'));
    this.rooms = parseInt(rooms);
    this.str = parseInt(str);   //stroenie
  };
  var TRooms = function(){
    this.rooms = [];
    document.rooms = this;
    this.floorMin = 1;
    this.floorMax = 7;
    this.roomMin = 1;
    this.roomMax = 4;
    this.squareMin = 29;
    this.squareMax = 100;
    this.loaded = 0;
    this.sortState = 0; //0-disabled
    this.sortAsc = false;
  };
  TRooms.prototype.sortBy = function(by){
    if(this.sortState==by) this.sortAsc = !this.sortAsc;
    else this.sortAsc = false;

    var by = by || 0;
    this.sortState = by;
    var result = [], rms = this.filter();
    switch (this.sortState){
      case 1: //str
        result = this.sort(rms, "str", this.sortAsc);
        break;
      case 2: //floor
        result = this.sort(rms, "floor", this.sortAsc);
        break;
      case 3: //rooms
        result = this.sort(rms, "rooms", this.sortAsc);
        break;
      case 4: //square
        result = this.sort(rms, "square", this.sortAsc);
        break;
    }
    this.table(result);
    return result;
  };
  TRooms.prototype.sort = function(arr, key, asc){
    var asc = asc || false;
    window['sort_key'] = key;
    window['sort_asc'] = asc;
    function func(row1, row2){
      var key = window['sort_key'], asc = window['sort_asc'];
      var a = parseFloat(row1[key]), b = parseFloat(row2[key]);
      if(asc) return b-a;
      return a-b;
    }
    arr.sort(func);
    return arr;
  };
  TRooms.prototype.addRoom = function(room){  //obj room
    this.rooms.push(room);
  };
  TRooms.prototype.filter = function(){
    var result = [];
    for(var i=0; i<this.rooms.length; i++){
      var room = this.rooms[i];
      if( (this.floorMin<=room.floor && room.floor<=this.floorMax) &&
        (this.roomMin<=room.rooms && room.rooms<=this.roomMax) &&
        (this.squareMin<=room.square && room.square<=this.squareMax)
      ){
        result.push(room);
      }
    }
    return result;
  };
  TRooms.prototype.table = function(rooms){
    var rooms = rooms || this.rooms;
    var table = document.getElementById('apartaments-result'), parent = table.parentNode;
    var tbody = document.getElementById('apartaments-result-tbody');
    tbody.innerHTML = "";
    for(var i=0; i<rooms.length; i++){
      var room = rooms[i],
        tr = document.createElement('tr'),
        td_str = document.createElement('td'), td_floor = document.createElement('td'),
        td_rooms = document.createElement('td'), td_square = document.createElement('td');
      td_str.innerHTML = room.str; td_floor.innerHTML = room.floor;
      td_rooms.innerHTML = room.rooms; td_square.innerHTML = room.square;
      // if(i>10 && parent.className.indexOf('active')<0) tr.style.display = 'none';
      tr.appendChild(td_str); tr.appendChild(td_floor); tr.appendChild(td_rooms); tr.appendChild(td_square);
      tbody.appendChild(tr);
    }
  };
  TRooms.prototype.onSliders = function(obj, type){
    if(type=='floor'){
      var val = obj.get('values');
      this.floorMin = parseInt(val[0]);
      this.floorMax = parseInt(val[1]);
    }
    if(type=='room'){
      var val = obj.get('values');
      this.roomMin = parseInt(val[0]);
      this.roomMax = parseInt(val[1]);
    }
    if(type=='square'){
      var val = obj.get('values');
      this.squareMin = parseFloat(val[0].replace(',','.'));
      this.squareMax = parseFloat(val[1].replace(',','.'));
    }
    var res = this.filter();
    this.table(res);
  };
  TRooms.prototype.check = function () {
    if(this.loaded>=2) this.table();
  }
  TRooms.prototype.init = function(){
    $.ajax({
      url: "xml1.xml",
      cache: false,
      success: load_rooms,
      dataType: 'text'
    });
    $.ajax({
      url: "xml2.xml",
      cache: false,
      success: load_rooms,
      dataType: 'text'
    });
    $.ajax({
      url: "xml3.xml",
      cache: false,
      success: load_rooms,
      dataType: 'text'
    });
  };
  function load_rooms(html){
    var xml = $.parseXML(html);
    var xmldataresponce = xml.childNodes[0],
        xmldataresult = xmldataresponce.childNodes[0],
        buildingapartments = xmldataresult.childNodes[0],
        addressbuild = buildingapartments.childNodes[0],
        apartments_main = buildingapartments.childNodes[1],
        apartments = apartments_main.childNodes,
        buildingid = buildingapartments.childNodes[2];
    for(var i=0; i<apartments.length; i++){
        var apartment = apartments[i];
        var node = null, rooms = '', squarecommon = '', floor = '', str = '';
        if(buildingid.firstChild.nodeValue=='a5da5e33-b9f4-e511-9d9d-00155d0c5a08') str = 28;
        if(buildingid.firstChild.nodeValue=='c5b82cd0-c3f4-e511-9d9d-00155d0c5a08') str = 35;
        if(buildingid.firstChild.nodeValue=='878e1fdf-bdf4-e511-9d9d-00155d0c5a08') str = 9;
        for(var j=0; j<apartment.childNodes.length; j++){
            var curNode = apartment.childNodes[j];
            if(typeof curNode == 'undefined') continue;
            if(curNode.nodeName=="a:rooms"){
                rooms = curNode.firstChild.nodeValue;
            }
            if(curNode.nodeName=="a:squareCommon"){
                squarecommon = curNode.firstChild.nodeValue;
            }
            if(curNode.nodeName=="a:floor"){
                floor = curNode.firstChild.nodeValue;
            }
        }
        document.rooms.addRoom(new TRoom(str, floor, squarecommon, rooms));
    }
    document.rooms.loaded++;
    document.rooms.check();
    sortingTable();
  };
  var rooms = new TRooms();
  rooms.init();
  var myScroll;
// ----------------------------------------------
// Enym script
  (function(){
    'use strict';
  var
  /** @const */ FormatOptions = [
    'decimals',
    'thousand',
    'mark',
    'prefix',
    'postfix',
    'encoder',
    'decoder',
    'negativeBefore',
    'negative',
    'edit',
    'undo'
  ];
  // General
    // Reverse a string
    function strReverse ( a ) {
      return a.split('').reverse().join('');
    }
    // Check if a string starts with a specified prefix.
    function strStartsWith ( input, match ) {
      return input.substring(0, match.length) === match;
    }
    // Check is a string ends in a specified postfix.
    function strEndsWith ( input, match ) {
      return input.slice(-1 * match.length) === match;
    }
    // Throw an error if formatting options are incompatible.
    function throwEqualError( F, a, b ) {
      if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
        throw new Error(a);
      }
    }
    // Check if a number is finite and not NaN
    function isValidNumber ( input ) {
      return typeof input === 'number' && isFinite( input );
    }
    // Provide rounding-accurate toFixed method.
    function toFixed ( value, decimals ) {
      var scale = Math.pow(10, decimals);
      return ( Math.round(value * scale) / scale).toFixed( decimals );
    }
  // Formatting
    // Accept a number as input, output formatted string.
    function formatTo ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {
      var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';
      // Apply user encoder to the input.
      // Expected outcome: number.
      if ( encoder ) {
        input = encoder(input);
      }
      // Stop if no valid number was provided, the number is infinite or NaN.
      if ( !isValidNumber(input) ) {
        return false;
      }
      // Rounding away decimals might cause a value of -0
      // when using very small ranges. Remove those cases.
      if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
        input = 0;
      }
      // Formatting is done on absolute numbers,
      // decorated by an optional negative symbol.
      if ( input < 0 ) {
        inputIsNegative = true;
        input = Math.abs(input);
      }
      // Reduce the number of decimals to the specified option.
      if ( decimals !== false ) {
        input = toFixed( input, decimals );
      }
      // Transform the number into a string, so it can be split.
      input = input.toString();
      // Break the number on the decimal separator.
      if ( input.indexOf('.') !== -1 ) {
        inputPieces = input.split('.');
        inputBase = inputPieces[0];
        if ( mark ) {
          inputDecimals = mark + inputPieces[1];
        }
      } else {
      // If it isn't split, the entire number will do.
        inputBase = input;
      }
      // Group numbers in sets of three.
      if ( thousand ) {
        inputBase = strReverse(inputBase).match(/.{1,3}/g);
        inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
      }
      // If the number is negative, prefix with negation symbol.
      if ( inputIsNegative && negativeBefore ) {
        output += negativeBefore;
      }
      // Prefix the number
      if ( prefix ) {
        output += prefix;
      }
      // Normal negative option comes after the prefix. Defaults to '-'.
      if ( inputIsNegative && negative ) {
        output += negative;
      }
      // Append the actual number.
      output += inputBase;
      output += inputDecimals;
      // Apply the postfix.
      if ( postfix ) {
        output += postfix;
      }
      // Run the output through a user-specified post-formatter.
      if ( edit ) {
        output = edit ( output, originalInput );
      }
      // All done.
      return output;
    }
    // Accept a sting as input, output decoded number.
    function formatFrom ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {
      var originalInput = input, inputIsNegative, output = '';
      // User defined pre-decoder. Result must be a non empty string.
      if ( undo ) {
        input = undo(input);
      }
      // Test the input. Can't be empty.
      if ( !input || typeof input !== 'string' ) {
        return false;
      }
      // If the string starts with the negativeBefore value: remove it.
      // Remember is was there, the number is negative.
      if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
        input = input.replace(negativeBefore, '');
        inputIsNegative = true;
      }
      // Repeat the same procedure for the prefix.
      if ( prefix && strStartsWith(input, prefix) ) {
        input = input.replace(prefix, '');
      }
      // And again for negative.
      if ( negative && strStartsWith(input, negative) ) {
        input = input.replace(negative, '');
        inputIsNegative = true;
      }
      // Remove the postfix.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
      if ( postfix && strEndsWith(input, postfix) ) {
        input = input.slice(0, -1 * postfix.length);
      }
      // Remove the thousand grouping.
      if ( thousand ) {
        input = input.split(thousand).join('');
      }
      // Set the decimal separator back to period.
      if ( mark ) {
        input = input.replace(mark, '.');
      }
      // Prepend the negative symbol.
      if ( inputIsNegative ) {
        output += '-';
      }
      // Add the number
      output += input;
      // Trim all non-numeric characters (allow '.' and '-');
      output = output.replace(/[^0-9\.\-.]/g, '');
      // The value contains no parse-able number.
      if ( output === '' ) {
        return false;
      }
      // Covert to number.
      output = Number(output);
      // Run the user-specified post-decoder.
      if ( decoder ) {
        output = decoder(output);
      }
      // Check is the output is valid, otherwise: return false.
      if ( !isValidNumber(output) ) {
        return false;
      }
      return output;
    }
  // Framework
    // Validate formatting options
    function validate ( inputOptions ) {
      var i, optionName, optionValue,
        filteredOptions = {};
      for ( i = 0; i < FormatOptions.length; i+=1 ) {
        optionName = FormatOptions[i];
        optionValue = inputOptions[optionName];
        if ( optionValue === undefined ) {
          // Only default if negativeBefore isn't set.
          if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
            filteredOptions[optionName] = '-';
          // Don't set a default for mark when 'thousand' is set.
          } else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
            filteredOptions[optionName] = '.';
          } else {
            filteredOptions[optionName] = false;
          }
        // Floating points in JS are stable up to 7 decimals.
        } else if ( optionName === 'decimals' ) {
          if ( optionValue >= 0 && optionValue < 8 ) {
            filteredOptions[optionName] = optionValue;
          } else {
            throw new Error(optionName);
          }
        // These options, when provided, must be functions.
        } else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
          if ( typeof optionValue === 'function' ) {
            filteredOptions[optionName] = optionValue;
          } else {
            throw new Error(optionName);
          }
        // Other options are strings.
        } else {
          if ( typeof optionValue === 'string' ) {
            filteredOptions[optionName] = optionValue;
          } else {
            throw new Error(optionName);
          }
        }
      }
      // Some values can't be extracted from a
      // string if certain combinations are present.
      throwEqualError(filteredOptions, 'mark', 'thousand');
      throwEqualError(filteredOptions, 'prefix', 'negative');
      throwEqualError(filteredOptions, 'prefix', 'negativeBefore');
      return filteredOptions;
    }
    // Pass all options as function arguments
    function passAll ( options, method, input ) {
      var i, args = [];
      // Add all options in order of FormatOptions
      for ( i = 0; i < FormatOptions.length; i+=1 ) {
        args.push(options[FormatOptions[i]]);
      }
      // Append the input, then call the method, presenting all
      // options as arguments.
      args.push(input);
      return method.apply('', args);
    }
    /** @constructor */
    function wNumb ( options ) {
      if ( !(this instanceof wNumb) ) {
        return new wNumb ( options );
      }
      if ( typeof options !== "object" ) {
        return;
      }
      options = validate(options);
      // Call 'formatTo' with proper arguments.
      this.to = function ( input ) {
        return passAll(options, formatTo, input);
      };
      // Call 'formatFrom' with proper arguments.
      this.from = function ( input ) {
        return passAll(options, formatFrom, input);
      };
    }
    /** @export */
    window.wNumb = wNumb;
  }());
// ----------------------------------------------
// Sorting function on table
  function sortingTable() {
    var flMin = +$("#floor-min").text(),
        flMax = +$("#floor-max").text(),
        rMin = +$("#room-min").text(),
        rMax = +$("#room-max").text(),
        sqMin = +$("#square-min").text(),
        sqMax = +$("#square-max").text();
    $(".apartments__tbody tr").each(function(){
      var floor = +$(this).find("td").eq(1).text(),
          room = +$(this).find("td").eq(2).text(),
          square = parseFloat($(this).find("td").eq(3).text());
      if (floor >= flMin && floor <= flMax && room >= rMin && room <= rMax && square >= sqMin && square <= sqMax) {
        $(this).addClass("show").fadeIn();
      } else {
        $(this).removeClass("show").fadeOut();
      }
    });
    fullTable();
  }
// Show hide some elements
  function fullTable(){
    var tableThHeight = $(".apartments__thead").outerHeight(),
        tableTdHeight = $(".apartments__tbody tr").outerHeight(),
        tableSpace = parseFloat($(".apartments__table").css("borderSpacing").substring($(".apartments__table").css("borderSpacing").lastIndexOf(" ") + 1)),
        tableTrHeight = tableTdHeight + tableSpace,
        blockHeight = $(".apartments__result").height(),
        trNumber = Math.floor((blockHeight - tableThHeight)/tableTrHeight);
        $(".apartments__scroll").height(trNumber*tableTrHeight).css("overflow", "hidden");
    if (!($(".apartments .iScrollVerticalScrollbar").length > 0)) {
      myScroll = new IScroll(".apartments__scroll", {
        mouseWheel: true,
        scrollbars: true
      });
    } else {
      myScroll.refresh();
    }
  }
$(document).ready(function(){
  // Инициализация карты
    if ($(window).width() <= 768) {
      var scale = 14,
          move = false;
    } else {
      var scale = 12,
          move = true;
    }
    ymaps.ready(init);
    function init () {
      var myMap = new ymaps.Map("map", {
        center: [55.781527,37.572830],
        zoom: scale,
        type: "yandex#hybrid",
        controls: []
      });
      if (move == false) {
        myMap.behaviors.disable("drag");
      }
      var myPlacemark = new ymaps.Placemark([55.781527,37.572830], {}, {
        preset: "islands#redIcon"
      });
      myMap.geoObjects.add(myPlacemark);
      $(window).on("resize", function(){
        myMap.container.fitToViewport();
      });
    }
  // Инициализация fullPage
    var fullPageCreated = false;
  // Смена названия блока, смена апартаментов
    function changeText() {
      var textBlock = $(".menu__list [href=#plan]");
      if ($(window).width() <= 767) {
        textBlock.text(textBlock.attr("data-text-mobile"));
        if (!$(".apartments .plan__table").length) {
          $(".apartments .sect-full").append($(".plan-block .plan__table"));
          $(".apartments .plan__table").wrap('<div class="plan__table-wrap"></div>')
        }
        $(".menu__item").on("click", munuItemCLick);

      } else {
        textBlock.text(textBlock.attr("data-text-desktop"));
        if (!$(".plan-block .plan__table").length) {
          $(".plan-block .plan__info").append($(".apartments .plan__table"));
          $(".plan__table-wrap").remove();
          $(".menu__list").css("display", "");
        }
        $("[data-place]").each(function(){
          $(this).attr("src", $(this).attr("data-place"));
        });
        $(".menu__item").off("click", munuItemCLick);
      }
    }
  // ----------------------------------------------
  // FullPage
    function reBuildFullPage() {
      if ($(window).width() <= 767) {
        if ($(".genplan").length == 0) {
          $(".about").after('<section class="gradient-reverse section full-block move-element genplan"></section>');
          if (fullPageCreated === true) {
            $.fn.fullpage.destroy("all");
            fullPageCreated = true;
            $("#fullpage").fullpage({
              menu: "#menu",
              anchors: ["top-slider", "about", "genplan", "place", "plan", "apartments", "contacts"],
              scrollOverflow: true
            });
          } else {
            fullPageCreated = true;
            $("#fullpage").fullpage({
              menu: "#menu",
              anchors: ["top-slider", "about", "genplan", "place", "plan", "apartments", "contacts"],
              scrollOverflow: true
            });
          }
        }
      } else {
        if ($(".genplan").length > 0) {
          $(".genplan").remove();
          if (fullPageCreated === true) {
            $.fn.fullpage.destroy("all");
            fullPageCreated = true;
            $("#fullpage").fullpage({
              menu: "#menu",
              anchors: ["top-slider", "about", "place", "plan", "apartments", "contacts"],
              normalScrollElements: ".map-wrap, .apartments__tbody"
            });
          }
        } else {
          if (fullPageCreated === false) {
            fullPageCreated = true;
            $("#fullpage").fullpage({
              menu: "#menu",
              anchors: ["top-slider", "about", "place", "plan", "apartments", "contacts"],
              normalScrollElements: ".map-wrap, .apartments__tbody"
            });
          }
        }
      }
    }
  // ----------------------------------------------
  // Вызов функицй
    changeText();
    reBuildFullPage();
  // ----------------------------------------------
  // Выпадение меню при клике на кнопку
    $(".menu__btn").on("click", function(){
      if ($(".menu__list").css("display") == "none") {
        $(".menu__list").slideDown(500);
        $(this).addClass("active");
        $.fn.fullpage.setAllowScrolling(false);
      } else if ($(".menu__list").css("display") == "block") {
        $(".menu__list").slideUp(500);
        $(this).removeClass("active");
        $.fn.fullpage.setAllowScrolling(true);
      }
    });
    function munuItemCLick() {
      $.fn.fullpage.setAllowScrolling(true);
      $(".menu__list").slideUp(500);
      $(".menu__btn").toggleClass("active");
    }
  // Инициализация слайдера в шапке
    var headerSlider = $(".header-slider").bxSlider({
      mode: "fade",
      pager: false,
      auto: true,
      speed: 1000,
      pause: 6000
    });
  // Инициализация слайдера в секциях планировок
    var planSlider = $(".plan__slider").bxSlider({
      pager: false,
      auto: true,
      speed: 1000,
      pause: 6000
    });
  // Всплытие окна заказа
    $(".btn, .plan__table td:last-child").on("click", function(e){
      e.preventDefault();
      $("#popup").fadeIn();
      $(".popup__close").on("click", function(e){
        e.preventDefault();
        $("#popup").fadeOut();
      });
    });
  // Закрытие всех всплывших окон
    $(window).keydown(function(e){
      if (e.which == "27") {
        if ($("#popup:visible, #slide__popup:visible, #popup__message:visible")) {
          $("#popup").fadeOut();
          $("#slide__popup").fadeOut();
          $("#popup__message").fadeOut();
        }
      }
    });
  // Показ большого изображения при клике на слайдер
    $(".plan__slider a").on("click", function(e){
      e.preventDefault();
      var thisLink = $(this).attr("href"),
          thisAlt = $(this).find("img").attr("alt"),
          numberImg = $(this).closest("li").prevAll("li:not(.bx-clone)").length + 1,
          allImg = $(this).closest("li").siblings("li:not(.bx-clone)").length + 1;
      $("#slide__popup img").attr({
        "src": thisLink,
        "alt": thisAlt
      });
      $("#slide__popup img").load(function(){
        $(".popup__info [data-number]").text(numberImg);
        $(".popup__info [data-all]").text(allImg);
        $("#slide__popup").fadeIn();
      });
      $(".slide__popup-close").on("click", function(e){
        e.preventDefault();
        $("#slide__popup").fadeOut();
      });
    });
  // Отработка клика на кнопку следующий в popup img
    $(".popup__arrow").on("click", function(){
      var numberImg = +$(".popup__info [data-number]").text(),
          allImg = +$(".popup__info [data-all]").text(),
          /*Next*/
          nextLink = $(".plan__slider li:not(.bx-clone)").eq(numberImg).find("a"),
          nextHref = nextLink.attr("href"),
          nextAlt = nextLink.find("img").attr("alt"),
          /*Prev*/
          prevLink = $(".plan__slider li:not(.bx-clone)").eq(numberImg-2).find("a"),
          prevHref = prevLink.attr("href"),
          prevAlt = prevLink.find("img").attr("alt");
      if ($(this).hasClass("popup__arrow--next")) {
        if (numberImg <= allImg) {
          $(".slide__popup-img img").attr({
            "src": nextHref,
            "alt": nextAlt
          });
          $("#slide__popup img").load(function(){
            $(".popup__info [data-number]").text(numberImg+1);
          });
        }
      } else if ($(this).hasClass("popup__arrow--prev")) {
        if (numberImg > 1) {
          $(".slide__popup-img img").attr({
            "src": prevHref,
            "alt": prevAlt
          });
          $("#slide__popup img").load(function(){
            $(".popup__info [data-number]").text(numberImg-1);
          });
        }
      }
    });
  // Отправка формы обратной связи
    $("#popup form").on("submit", function(e){
      e.preventDefault();
      var f = this,
          msg = "";
      msg = ("name=" + f.name.value + "&phone=" + f.phone.value + "&email=" + f.email.value + "&message=" + f.message.value);
      $.ajax({
        type: "POST",
        url: "reg.php",
        data: msg,
        success: function() {
          $("#popup").fadeOut();
          $("#popup__message .popup__wrap").empty();
          $("#popup__message .popup__wrap").append('<div class="popup__message"><p>Ваша заявка успешно отправлена.</p><p>В ближайшее время наш менеджер свяжется с Вами</p><a href="#" class="popup__message-close">Закрыть</a></div>');
          $("#popup__message").fadeIn();
          $(".popup__message-close").on("click", function(e){
            e.preventDefault();
            $("#popup__message").fadeOut();
          });
        },
        error: function() {
          $("#popup").fadeOut();
          $("#popup__message .popup__wrap").empty();
          $("#popup__message .popup__wrap").append('<div class="popup__message"><p>Извините данные не были переданы</p><a href="#" class="popup__message-close">Закрыть</a></div>');
          $("#popup__message").fadeIn();
          $(".popup__message-close").on("click", function(e){
            e.preventDefault();
            $("#popup__message").fadeOut();
          });
        }
      });
    });
  // Slider floor
    var floorSlider = document.getElementById("slider-floor"),
        floorMin = document.getElementById("floor-min"),
        floorMax = document.getElementById("floor-max");
      noUiSlider.create(floorSlider, {
        start: [ 1, 7 ],
        snap: true,
        connect: true,
        range: {
          'min': 1,
          '17%': 2,
          '34%': 3,
          '51%': 4,
          '68%': 5,
          '85%': 6,
          'max': 7
        },
        format: wNumb({
          decimals: 0
        })
      });
    floorSlider.noUiSlider.on('update', function ( values, handle ) {
      if ( handle ) {
        floorMax.innerHTML = values[handle];
      } else {
        floorMin.innerHTML = values[handle];
      }
      sortingTable();
    });
  // --------------------------------------------
  // Slider room
    var roomSlider = document.getElementById("slider-room"),
        roomMin = document.getElementById("room-min"),
        roomMax = document.getElementById("room-max");
    noUiSlider.create(roomSlider, {
      start: [ 1, 4 ],
      snap: true,
      connect: true,
      range: {
        'min': 1,
        '33%': 2,
        '66%': 3,
        'max': 4
      },
      format: wNumb({
        decimals: 0
      })
    });
    roomSlider.noUiSlider.on('update', function ( values, handle ) {
      if ( handle ) {
        roomMax.innerHTML = values[handle];
      } else {
        roomMin.innerHTML = values[handle];
      }
      sortingTable();
    });
  // --------------------------------------------
  // Slider square
    var squareSlider = document.getElementById('slider-square'),
        squareMin = document.getElementById('square-min'),
        squareMax = document.getElementById('square-max');
    noUiSlider.create(squareSlider, {
      start: [ 29, 100 ],
      snap: true,
      connect: true,
      range: {
        'min': 29,
        '1.4%': 30,
        '2.8%': 31,
        '3.2%': 32,
        '4.6%': 33,
        '6%': 34,
        '7.4%': 35,
        '8.8%': 36,
        '10.2%': 37,
        '11.6%': 38,
        '13%': 39,
        '14.4%': 40,
        '15.8%': 41,
        '17.2%': 42,
        '18.6%': 43,
        '20%': 44,
        '21.4%': 45,
        '22.8%': 46,
        '24.2%': 47,
        '25.6%': 48,
        '27%': 49,
        '28.4%': 50,
        '29.8%': 51,
        '31.2%': 52,
        '32.6%': 53,
        '34%': 54,
        '35.4%': 55,
        '36.8%': 56,
        '38.2%': 57,
        '39.6%': 58,
        '41%': 59,
        '41.4%': 60,
        '42.8%': 61,
        '44.2%': 62,
        '45.6%': 63,
        '47%': 64,
        '48.4%': 65,
        '49.8%': 66,
        '51.2%': 67,
        '52.6%': 68,
        '54%': 69,
        '55.4%': 70,
        '55.8%': 71,
        '57.2%': 72,
        '58.6%': 73,
        '60%': 74,
        '61.4%': 75,
        '62.8%': 76,
        '64.2%': 77,
        '65.6%': 78,
        '67%': 79,
        '68.4%': 80,
        '69.8%': 81,
        '71.2%': 83,
        '72.6%': 84,
        '74%': 85,
        '75.4%': 86,
        '76.8%': 87,
        '78.2%': 88,
        '79.6%': 89,
        '81%': 90,
        '82.4%': 91,
        '83.8%': 92,
        '85.2%': 93,
        '86.6%': 94,
        '88%': 95,
        '90%': 96,
        '92%': 97,
        '95%': 98,
        '98%': 99,
        'max': 100
      },
      format: wNumb({
        decimals: 0
      })
    });
    squareSlider.noUiSlider.on('update', function ( values, handle ) {
      if ( handle ) {
        squareMax.innerHTML = values[handle];
      } else {
        squareMin.innerHTML = values[handle];
      }
      sortingTable();
    });   
  $(window).on("resize", function(){
    changeText();
    reBuildFullPage();
    headerSlider.reloadSlider();
    planSlider.reloadSlider();
    sortingTable();
  });
});
