(function() {
  var cols, filled_pairs, is_loading, last_bottom_offset, last_bottom_position, last_left_offset, last_left_position, last_right_offset, last_right_position, last_top_offset, last_top_position, pairs_to_fill, rows, tags;

  tags = "espresso";

  filled_pairs = {};

  this.load_images = function() {
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

  last_left_position = 0;

  last_left_offset = 0;

  last_top_position = 0;

  last_top_offset = 0;

  last_bottom_position = 0;

  last_bottom_offset = rows - 1;

  last_right_position = 0;

  last_right_offset = cols - 1;

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

  pairs_to_fill = get_pairs();

  shuffle(pairs_to_fill);

  this.jsonFlickrApi = function(data) {
    var i, pair, photos, _fn, _ref;
    $('#main').draggable();
    $('#main').bind("dragstop", function(event, ui) {
      var bottom_offset, c, left_offset, r, right_offset, should_create, top_offset, _ref, _ref2, _ref3, _ref4;
      if (is_loading) return;
      should_create = false;
      pairs_to_fill = [];
      top_offset = -Math.ceil(ui.offset.top / 150);
      bottom_offset = top_offset + rows;
      left_offset = -Math.ceil(ui.offset.left / 150);
      right_offset = left_offset + cols;
      if (ui.offset.top > last_top_position) {
        should_create = true;
        for (r = top_offset, _ref = last_top_offset - 1; top_offset <= _ref ? r <= _ref : r >= _ref; top_offset <= _ref ? r++ : r--) {
          for (c = left_offset; left_offset <= right_offset ? c <= right_offset : c >= right_offset; left_offset <= right_offset ? c++ : c--) {
            pairs_to_fill.push({
              r: r,
              c: c
            });
          }
        }
        last_top_position += 150;
        last_top_offset = top_offset;
      }
      if (ui.offset.top < last_bottom_position) {
        should_create = true;
        for (r = _ref2 = last_bottom_offset + 1; _ref2 <= bottom_offset ? r <= bottom_offset : r >= bottom_offset; _ref2 <= bottom_offset ? r++ : r--) {
          for (c = left_offset; left_offset <= right_offset ? c <= right_offset : c >= right_offset; left_offset <= right_offset ? c++ : c--) {
            pairs_to_fill.push({
              r: r,
              c: c
            });
          }
        }
        last_bottom_offset -= 150;
        last_bottom_offset = bottom_offset;
      }
      if (ui.offset.left > last_left_position) {
        should_create = true;
        for (r = top_offset; top_offset <= bottom_offset ? r <= bottom_offset : r >= bottom_offset; top_offset <= bottom_offset ? r++ : r--) {
          for (c = left_offset, _ref3 = last_left_offset - 1; left_offset <= _ref3 ? c <= _ref3 : c >= _ref3; left_offset <= _ref3 ? c++ : c--) {
            pairs_to_fill.push({
              r: r,
              c: c
            });
          }
        }
        last_left_position += 150;
        last_left_offset = left_offset;
      }
      if (ui.offset.left < last_right_position) {
        should_create = true;
        for (r = top_offset; top_offset <= bottom_offset ? r <= bottom_offset : r >= bottom_offset; top_offset <= bottom_offset ? r++ : r--) {
          for (c = _ref4 = last_right_offset + 1; _ref4 <= right_offset ? c <= right_offset : c >= right_offset; _ref4 <= right_offset ? c++ : c--) {
            pairs_to_fill.push({
              r: r,
              c: c
            });
          }
        }
        last_right_offset -= 150;
        last_right_offset = right_offset;
      }
      shuffle(pairs_to_fill);
      if (should_create) {
        is_loading = true;
        $(this).unbind(event);
        return load_images();
      }
    });
    photos = data['photos']['photo'];
    shuffle(photos);
    _fn = function(pair, i) {
      return setTimeout(function() {
        var img_src, photo;
        photo = data['photos']['photo'][i];
        img_src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
        return $('#main').append("<img src=\"" + img_src + "\" style=\"position: absolute; top: " + (pair.r * 150) + "px; left: " + (pair.c * 150) + "px;\">");
      }, 10 * i);
    };
    for (i = 0, _ref = pairs_to_fill.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      pair = pairs_to_fill[i];
      if (!filled_pairs[pair.r]) {
        filled_pairs[pair.r] = {};
      } else {
        if (!filled_pairs[pair.r][pair.c]) {
          filled_pairs[pair.r][pair.c] = 1;
        } else {
          continue;
        }
      }
      _fn(pair, i);
    }
    return is_loading = false;
  };

  load_images();

}).call(this);
