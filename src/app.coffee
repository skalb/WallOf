tags = "espresso"
photos = []
pairs_to_fill = []
filled_pairs = {}

rows = Math.ceil($(window).height() / 150)
cols = Math.ceil($(window).width() / 150)

last_left_position = 0
last_left_offset = 0

last_top_position = 0
last_top_offset = 0

last_bottom_position = 0
last_bottom_offset = rows - 1

last_right_position = 0
last_right_offset = cols - 1

@reset_grid = ->
  last_left_position = 0
  last_left_offset = 0

  last_top_position = 0
  last_top_offset = 0

  last_bottom_position = 0
  last_bottom_offset = rows - 1

  last_right_position = 0
  last_right_offset = cols - 1

@load_images = ->
  if photos.length > 0
    jsonFlickrApi()
  else
    $.get("http://api.flickr.com/services/rest/?format=json&sort=relevance&method=flickr.photos.search&tags=#{tags}&api_key=a40767668cb729440a94acc78cd1e54b&per_page=500&safe_search=1")
      .error (jqXHR, textStatus, errorThrown) -> 
        $('body').append "AJAX Error: #{errorThrown}."

@shuffle = (a) ->
  for n in [a.length - 1 .. 0]
    j = Math.floor(Math.random() * n)
    temp = a[j]
    a[j] = a[n]
    a[n] = temp

@set_pairs = (row_start, row_end, col_start, col_end) ->
  pairs_to_fill = []
  for r in [row_start..row_end]
    for c in [col_start..col_end]
      pairs_to_fill.push({r: r, c: c})
  shuffle(pairs_to_fill)

@jsonFlickrApi = (data) ->
  if (data)
    photos = data['photos']['photo']
    $('#main').css("top", "0px").css("left", "0px")

  $('#main').draggable()
  $('#main').bind("dragstop", (event, ui) ->
    pairs_to_fill = []

    top_offset = -Math.ceil((ui.offset.top) / 150)
    bottom_offset =  top_offset + rows 
    left_offset = -Math.ceil((ui.offset.left) / 150)
    right_offset = left_offset + cols 

    if (ui.offset.top > last_top_position)
      set_pairs(top_offset, last_top_offset - 1, left_offset, right_offset)
      last_top_position += 150
      last_top_offset = top_offset

    if (ui.offset.top < last_bottom_position)
      set_pairs(last_bottom_offset + 1, bottom_offset, left_offset, right_offset)
      last_bottom_offset -= 150
      last_bottom_offset = bottom_offset

    if (ui.offset.left > last_left_position)
      set_pairs(top_offset, bottom_offset, left_offset, last_left_offset - 1)
      last_left_position += 150
      last_left_offset = left_offset

    if (ui.offset.left < last_right_position)
      set_pairs(top_offset, bottom_offset, last_right_offset + 1, right_offset)
      last_right_offset -= 150
      last_right_offset = right_offset

    shuffle(pairs_to_fill)

    if pairs_to_fill.length > 0
      $(this).unbind(event)
      load_images()
  )
  shuffle(photos)
  for i in [0..pairs_to_fill.length-1]
    pair = pairs_to_fill[i]
    if (!filled_pairs[pair.r])
      filled_pairs[pair.r] = {}
    else
      if (!filled_pairs[pair.r][pair.c])
        filled_pairs[pair.r][pair.c] = 1
      else
        continue
    photo = photos[i]
    if photo
      img_src = "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_q.jpg"
      img_id = "row#{pair.r}col#{pair.c}"
      image_style = "display:none; position: absolute; top: #{pair.r * 150}px; left: #{pair.c * 150}px;"
      $("#main").append("<img id=\"#{img_id}\" class=\"grid_image\" src=\"#{img_src}\" style=\"#{image_style}\">")
      $("##{img_id}").fadeIn(50 * i)

$('document').ready( ->
  $('#tag_input').change( ->
    tags = $(this).val()
    photos = []
    filled_pairs = {}
    $('.grid_image').fadeOut('slow', -> 
      $(this).remove()
    )
    set_pairs(0, rows - 1, 0, cols - 1)
    load_images()
  )

  set_pairs(0, rows - 1, 0, cols - 1)
  load_images()
)

