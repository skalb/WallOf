tags = "espresso"

@load_images = ->
  $.get("http://api.flickr.com/services/rest/?format=json&sort=relevance&method=flickr.photos.search&tags=#{tags}&api_key=a40767668cb729440a94acc78cd1e54b")
  .error (jqXHR, textStatus, errorThrown) -> 
    $('body').append "AJAX Error: #{errorThrown}."

@shuffle = (a) ->
  n = a.length - 1
  while n > 0
    j = Math.floor(Math.random() * n)
    temp = a[j]
    a[j] = a[n]
    a[n] = temp
    n -= 1

rows = Math.ceil($(window).height() / 150)
cols = Math.ceil($(window).width() / 150)

last_left_position = 0
last_left_offset = 0

last_top_position = 0
last_top_offset = 0

last_bottom_position = 0
last_bottom_offset = rows - 1

last_right_position = 0
last_right_offset = 0

is_loading = false

@get_pairs = ->
  pairs = []
  for r in [0..rows-1]
    for c in [0..cols-1]
      pairs.push({r: r, c: c})
  pairs

pairs_to_fill = get_pairs()
shuffle(pairs_to_fill)

@jsonFlickrApi = (data) ->
  $('#main').draggable()
  $('#main').bind("dragstop", (event, ui) ->
    if (is_loading)
      return

    should_create = false
    pairs_to_fill = []
    if (ui.offset.top > last_top_position)
      should_create = true
      top_offset = -Math.ceil((ui.offset.top) / 150)
      for r in [top_offset..last_top_offset-1]
        for c in [last_left_offset..cols-1-last_left_offset]
          pairs_to_fill.push({r: r, c: c})
      last_top_position += 150
      last_top_offset = top_offset

    if (ui.offset.top < last_bottom_position)
      should_create = true
      bottom_offset = -Math.ceil((ui.offset.top) / 150) + rows 
      for r in [last_bottom_offset + 1..bottom_offset]
        for c in [last_left_offset..cols-1-last_left_offset]
          pairs_to_fill.push({r: r, c: c})
      last_bottom_offset -= 150
      last_bottom_offset = bottom_offset

    if (ui.offset.left > last_left_position)
      should_create = true
      left_offset = -Math.ceil((ui.offset.left) / 150)
      for r in [last_top_offset..rows-1-last_top_offset]
        for c in [left_offset..last_left_offset-1]
          pairs_to_fill.push({r: r, c: c})
      last_left_position += 150
      last_left_offset = left_offset

    # if (ui.offset.top > 75 + rows * 150 * (content_index["up"]))
    #   direction = "up"
    #   should_create = true
    #   top_position = (rows * -150 * (content_index["up"] + 1))
    # if (ui.offset.left > 75 + cols * 150 * (content_index["left"]))
    #   direction = "left"
    #   should_create = true
    #   left_position = (cols * -150 * (content_index["left"] + 1)) 
    # if (ui.offset.left < -75 - cols * 150 * (content_index["right"]))
    #   direction = "right"
    #   should_create = true
    #   left_position = (cols * 150 * (content_index["right"] + 1)) 

    shuffle(pairs_to_fill)

    if should_create
      is_loading = true
      $(this).unbind(event)
      load_images()
  )
  photos = data['photos']['photo']
  shuffle(photos)
  for i in [0..pairs_to_fill.length-1]
    do(i) ->
      setTimeout( ->
        pair = pairs_to_fill[i]
        photo = data['photos']['photo'][i]
        img_src = "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_q.jpg"
        $('#main').append("<img src=\"#{img_src}\" style=\"position: absolute; top: #{pair.r * 150}px; left: #{pair.c * 150}px;\">")
      , 10 * i)

  is_loading = false

load_images()

