tags = "espresso"

content_index = {
  "up": 0,
  "down": 0,
  "left": 0,
  "right": 0
}

@create_canvas = ->
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

left_position = 0
top_position = 0
direction = "down"
is_loading = false

@get_pairs = ->
  pairs = []
  for r in [0..rows-1]
    for c in [0..cols-1]
      pairs.push({r: r, c: c})
  pairs

@jsonFlickrApi = (data) ->
  pairs = get_pairs()

  shuffle(pairs)
  # $('#main').append("<canvas id=\"content\" class=\"image_canvas\" height=\"#{rows * 150}px\" width=\"#{cols * 150}px\"></canvas>")
  # $("#content").
  #   css('position', 'absolute').
  #   css('top', top_position).
  #   css('left', left_position)
  $('#main').draggable()
  $('#main').bind("drag", (event, ui) ->
    if (is_loading)
      return

    should_create = false
    # if (ui.offset.top < -75 - (rows * 150 * (content_index["down"] - 1)))
    #   direction = "down"
    #   should_create = true
    #   top_position = (rows * 150 * (content_index["down"]))

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

    if should_create
      is_loading = true
      $(this).unbind(event)
      # create_canvas()
  )
  photos = data['photos']['photo']
  shuffle(photos)
  for i in [0..pairs.length-1]
    do(i) ->
      setTimeout( ->
        pair = pairs[i]
        photo = data['photos']['photo'][i]
        img_src = "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_q.jpg"
        img_tag = "<img src=\"#{img_src}\" style=\"position: absolute; top: #{pair.r * 150}px; left: #{pair.c * 150}px;\">"
        $('#main').append(img_tag)
      , 10 * i)

  content_index[direction] += 1
  is_loading = false

create_canvas()

