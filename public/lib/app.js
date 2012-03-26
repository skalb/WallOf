(function() {
  var cols, filled_pairs, is_loading, last_bottom_offset, last_bottom_position, last_left_offset, last_left_position, last_right_offset, last_right_position, last_top_offset, last_top_position, pairs_to_fill, photos, rows, tags;

  tags = "espresso";

  photos = [];

  filled_pairs = {};

  $('document').ready(function() {
    return $('#tag_input').change(function() {
      tags = $(this).val();
      photos = [];
      filled_pairs = {};
      $('.grid_image').fadeOut('slow');
      return load_images();
    });
  });

  this.load_images = function() {
    if (photos.length > 0) {
      return jsonFlickrApi();
    } else {
      return $.get("http://api.flickr.com/services/rest/?format=json&sort=relevance&method=flickr.photos.search&tags=" + tags + "&api_key=a40767668cb729440a94acc78cd1e54b&per_page=500").error(function(jqXHR, textStatus, errorThrown) {
        return $('body').append("AJAX Error: " + errorThrown + ".");
      });
    }
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
    var i, img_src, pair, photo, _ref, _results;
    if (data) photos = data['photos']['photo'];
    $('#main').draggable();
    $('#main').bind("dragstop", function(event, ui) {
      var bottom_offset, c, left_offset, r, right_offset, top_offset, _ref, _ref2, _ref3, _ref4;
      pairs_to_fill = [];
      top_offset = -Math.ceil(ui.offset.top / 150);
      bottom_offset = top_offset + rows;
      left_offset = -Math.ceil(ui.offset.left / 150);
      right_offset = left_offset + cols;
      if (ui.offset.top > last_top_position) {
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
      if (pairs_to_fill.length > 0) {
        $(this).unbind(event);
        return load_images();
      }
    });
    shuffle(photos);
    _results = [];
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
      photo = photos[i];
      img_src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
      $('#main').append("<img id=\"row" + pair.r + "col" + pair.c + "\" class=\"grid_image\" src=\"" + img_src + "\" style=\"display:none; position: absolute; top: " + (pair.r * 150) + "px; left: " + (pair.c * 150) + "px;\">");
      _results.push($("#row" + pair.r + "col" + pair.c).fadeIn(50 * i));
    }
    return _results;
  };

  load_images();

}).call(this);
