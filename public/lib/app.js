(function() {
  var cols, filled_pairs, last_bottom_offset, last_bottom_position, last_left_offset, last_left_position, last_right_offset, last_right_position, last_top_offset, last_top_position, pairs_to_fill, photos, rows, tags;

  tags = "espresso";

  photos = [];

  pairs_to_fill = [];

  filled_pairs = {};

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

  this.reset_grid = function() {
    last_left_position = 0;
    last_left_offset = 0;
    last_top_position = 0;
    last_top_offset = 0;
    last_bottom_position = 0;
    last_bottom_offset = rows - 1;
    last_right_position = 0;
    return last_right_offset = cols - 1;
  };

  this.load_images = function() {
    if (photos.length > 0) {
      return jsonFlickrApi();
    } else {
      return $.get("http://api.flickr.com/services/rest/?format=json&sort=relevance&method=flickr.photos.search&tags=" + tags + "&api_key=a40767668cb729440a94acc78cd1e54b&per_page=500&safe_search=1").error(function(jqXHR, textStatus, errorThrown) {
        return $('body').append("AJAX Error: " + errorThrown + ".");
      });
    }
  };

  this.shuffle = function(a) {
    var j, n, temp, _ref, _results;
    _results = [];
    for (n = _ref = a.length - 1; _ref <= 0 ? n <= 0 : n >= 0; _ref <= 0 ? n++ : n--) {
      j = Math.floor(Math.random() * n);
      temp = a[j];
      a[j] = a[n];
      _results.push(a[n] = temp);
    }
    return _results;
  };

  this.set_pairs = function(row_start, row_end, col_start, col_end) {
    var c, r;
    pairs_to_fill = [];
    for (r = row_start; row_start <= row_end ? r <= row_end : r >= row_end; row_start <= row_end ? r++ : r--) {
      for (c = col_start; col_start <= col_end ? c <= col_end : c >= col_end; col_start <= col_end ? c++ : c--) {
        pairs_to_fill.push({
          r: r,
          c: c
        });
      }
    }
    return shuffle(pairs_to_fill);
  };

  this.jsonFlickrApi = function(data) {
    var i, image_style, img_id, img_src, pair, photo, _ref, _results;
    if (data) {
      photos = data['photos']['photo'];
      $('#main').css("top", "0px").css("left", "0px");
    }
    $('#main').draggable();
    $('#main').bind("dragstop", function(event, ui) {
      var bottom_offset, left_offset, right_offset, top_offset;
      pairs_to_fill = [];
      top_offset = -Math.ceil(ui.offset.top / 150);
      bottom_offset = top_offset + rows;
      left_offset = -Math.ceil(ui.offset.left / 150);
      right_offset = left_offset + cols;
      if (ui.offset.top > last_top_position) {
        set_pairs(top_offset, last_top_offset - 1, left_offset, right_offset);
        last_top_position += 150;
        last_top_offset = top_offset;
      }
      if (ui.offset.top < last_bottom_position) {
        set_pairs(last_bottom_offset + 1, bottom_offset, left_offset, right_offset);
        last_bottom_offset -= 150;
        last_bottom_offset = bottom_offset;
      }
      if (ui.offset.left > last_left_position) {
        set_pairs(top_offset, bottom_offset, left_offset, last_left_offset - 1);
        last_left_position += 150;
        last_left_offset = left_offset;
      }
      if (ui.offset.left < last_right_position) {
        set_pairs(top_offset, bottom_offset, last_right_offset + 1, right_offset);
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
      if (photo) {
        img_src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_q.jpg";
        img_id = "row" + pair.r + "col" + pair.c;
        image_style = "display:none; position: absolute; top: " + (pair.r * 150) + "px; left: " + (pair.c * 150) + "px;";
        $("#main").append("<img id=\"" + img_id + "\" class=\"grid_image\" src=\"" + img_src + "\" style=\"" + image_style + "\">");
        _results.push($("#" + img_id).fadeIn(50 * i));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  $('document').ready(function() {
    $('#tag_input').change(function() {
      tags = $(this).val();
      photos = [];
      filled_pairs = {};
      $('.grid_image').fadeOut('slow', function() {
        return $(this).remove();
      });
      set_pairs(0, rows - 1, 0, cols - 1);
      return load_images();
    });
    set_pairs(0, rows - 1, 0, cols - 1);
    return load_images();
  });

}).call(this);
