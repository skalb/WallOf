tags = "espresso"
photos = []
pairs_to_fill = []
filled_pairs = {}

$('document').ready( ->
  $('#tag_input').change( ->
    tags = $(this).val()
    photos = []
    filled_pairs = {}
    $('.grid_image').fadeOut('slow', -> 
      $(this).remove()
    )
    set_pairs()
    load_images()
  )
)

@load_images = ->
  if photos.length > 0
    jsonFlickrApi()
  else
    $.get("http://api.flickr.com/services/rest/?format=json&sort=relevance&method=flickr.photos.search&tags=#{tags}&api_key=a40767668cb729440a94acc78cd1e54b&per_page=500")
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
last_right_offset = cols - 1

@set_pairs = ->
  pairs_to_fill = []
  for r in [0..rows-1]
    for c in [0..cols-1]
      pairs_to_fill .push({r: r, c: c})
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
      for r in [top_offset..last_top_offset-1]
        for c in [left_offset..right_offset]
          pairs_to_fill.push({r: r, c: c})
      last_top_position += 150
      last_top_offset = top_offset

    if (ui.offset.top < last_bottom_position)
      for r in [last_bottom_offset + 1..bottom_offset]
        for c in [left_offset..right_offset]
          pairs_to_fill.push({r: r, c: c})
      last_bottom_offset -= 150
      last_bottom_offset = bottom_offset

    if (ui.offset.left > last_left_position)
      for r in [top_offset..bottom_offset]
        for c in [left_offset..last_left_offset-1]
          pairs_to_fill.push({r: r, c: c})
      last_left_position += 150
      last_left_offset = left_offset

    if (ui.offset.left < last_right_position)
      for r in [top_offset..bottom_offset]
        for c in [last_right_offset + 1..right_offset]
          pairs_to_fill.push({r: r, c: c})
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
    img_src = "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_q.jpg"
    $('#main').append("<img id=\"row#{pair.r}col#{pair.c}\" class=\"grid_image\" src=\"#{img_src}\" style=\"display:none; position: absolute; top: #{pair.r * 150}px; left: #{pair.c * 150}px;\">")
    $("#row#{pair.r}col#{pair.c}").fadeIn(50 * i)

set_pairs()
load_images()

