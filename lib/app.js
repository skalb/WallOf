(function() {
  var cols, content_index, direction, is_loading, left_position, rows, tags, top_position;

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

  left_position = 0;

  top_position = 0;

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
    var i, pairs, photos, _fn, _ref;
    pairs = get_pairs();
    shuffle(pairs);
    $('#main').draggable();
    $('#main').bind("drag", function(event, ui) {
      var should_create;
      if (is_loading) return;
      should_create = false;
      if (should_create) {
        is_loading = true;
        return $(this).unbind(event);
      }
    });
    photos = data['photos']['photo'];
    shuffle(photos);
    _fn = function(i) {
      return setTimeout(function() {
        var img_src, img_tag, pair, photo;
        pair = pairs[i];
        photo = data['photos']['photo'][i];
        img_src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
        img_tag = "<img src=\"" + img_src + "\" style=\"position: absolute; top: " + (pair.r * 150) + "px; left: " + (pair.c * 150) + "px;\">";
        return $('#main').append(img_tag);
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
