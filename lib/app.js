(function() {
  var cols, content_index, direction, is_loading, rows, tags, x_offset, y_offset;

  tags = "espresso";

  content_index = {
    "up": 0,
    "down": 0,
    "left": 0,
    "right": 0
  };

  this.create_canvas = function() {
    return $.get("http://api.flickr.com/services/rest/?format=json&sort=relevance&method=flickr.photos.search&tags=" + tags + "&api_key=a40767668cb729440a94acc78cd1e54b").error(function(jqXHR, textStatus, errorThrown) {
      return $('body').append("AJAX Error: " + errorThrown + ".");
    });
  };

  this.shuffle = function(a) {
    var j, n, temp, _results;
    n = a.length - 1;
    _results = [];
    while (n > 0) {
      j = Math.floor(Math.random() * n);
      temp = a[j];
      a[j] = a[n];
      a[n] = temp;
      _results.push(n -= 1);
    }
    return _results;
  };

  rows = Math.ceil($(window).height() / 150);

  cols = Math.ceil($(window).width() / 150);

  x_offset = 0;

  y_offset = 0;

  direction = "down";

  is_loading = false;

  this.get_pairs = function() {
    var c, pairs, r, _ref, _ref2;
    pairs = [];
    for (r = 0, _ref = rows - 1; 0 <= _ref ? r <= _ref : r >= _ref; 0 <= _ref ? r++ : r--) {
      for (c = 0, _ref2 = cols - 1; 0 <= _ref2 ? c <= _ref2 : c >= _ref2; 0 <= _ref2 ? c++ : c--) {
        pairs.push({
          r: r,
          c: c
        });
      }
    }
    return pairs;
  };

  this.jsonFlickrApi = function(data) {
    var context, i, pairs, photos, _fn, _ref;
    pairs = get_pairs();
    shuffle(pairs);
    $('#main').append("<canvas id=\"content-" + content_index[direction] + "-" + direction + "\" class=\"image_canvas\" height=\"" + (rows * 150) + "px\" width=\"" + (cols * 150) + "px\"></canvas>");
    $("#content-" + content_index[direction] + "-" + direction).css('position', 'absolute').css('top', y_offset).css('left', x_offset);
    $('#main').draggableXY();
    $('#main').bind("drag", function(event, ui) {
      var should_create;
      if (is_loading) return;
      should_create = false;
      if (ui.offset.top < -75 - (rows * 150 * (content_index["down"] - 1))) {
        direction = "down";
        should_create = true;
        y_offset = rows * 150 * content_index["down"];
      }
      if (ui.offset.top > 75 + rows * 150 * content_index["up"]) {
        direction = "up";
        should_create = true;
        y_offset = rows * -150 * (content_index["up"] + 1);
      }
      if (ui.offset.left > 75 + cols * 150 * content_index["left"]) {
        direction = "left";
        should_create = true;
        x_offset = cols * -150 * (content_index["left"] + 1);
      }
      if (ui.offset.left < -75 - cols * 150 * content_index["right"]) {
        direction = "right";
        should_create = true;
        x_offset = cols * 150 * (content_index["right"] + 1);
      }
      if (should_create) {
        is_loading = true;
        $(this).unbind(event);
        return create_canvas();
      }
    });
    context = document.getElementById("content-" + content_index[direction] + "-" + direction).getContext("2d");
    photos = data['photos']['photo'];
    shuffle(photos);
    _fn = function(i) {
      return setTimeout(function() {
        var img, pair, photo;
        img = new Image();
        pair = pairs[i];
        (function(img, pair) {
          return img.onload = function() {
            return context.drawImage(img, pair.c * 150, pair.r * 150, 150, 150);
          };
        })(img, pair);
        photo = data['photos']['photo'][i];
        return img.src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
      }, 10 * i);
    };
    for (i = 0, _ref = pairs.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      _fn(i);
    }
    content_index[direction] += 1;
    return is_loading = false;
  };

  create_canvas();

}).call(this);
