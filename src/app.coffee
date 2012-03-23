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

x_offset = 0
y_offset = 0
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
  $('#main').append("<canvas id=\"content-#{content_index[direction]}-#{direction}\" class=\"image_canvas\" height=\"#{rows * 150}px\" width=\"#{cols * 150}px\"></canvas>")
  $("#content-#{content_index[direction]}-#{direction}").
    css('position', 'absolute').
    css('top', y_offset).
    css('left', x_offset)
  $('#main').draggableXY()
  $('#main').bind("drag", (event, ui) ->
    if (is_loading)
      return

    should_create = false
    if (ui.offset.top < -75 - (rows * 150 * (content_index["down"] - 1)))
      direction = "down"
      should_create = true
      y_offset = (rows * 150 * (content_index["down"]))
    if (ui.offset.top > 75 + rows * 150 * (content_index["up"]))
      direction = "up"
      should_create = true
      y_offset = (rows * -150 * (content_index["up"] + 1))
    if (ui.offset.left > 75 + cols * 150 * (content_index["left"]))
      direction = "left"
      should_create = true
      x_offset = (cols * -150 * (content_index["left"] + 1)) 
    if (ui.offset.left < -75 - cols * 150 * (content_index["right"]))
      direction = "right"
      should_create = true
      x_offset = (cols * 150 * (content_index["right"] + 1)) 

    if should_create
      is_loading = true
      $(this).unbind(event)
      create_canvas()
  )
  context = document.getElementById("content-#{content_index[direction]}-#{direction}").getContext("2d")
  photos = data['photos']['photo']
  shuffle(photos)
  for i in [0..pairs.length-1]
    do(i) ->
      setTimeout( ->
        img = new Image()  
        pair = pairs[i]
        do (img, pair) ->
            img.onload = ->
                context.drawImage(img, pair.c * 150, pair.r * 150, 150, 150)
        photo = data['photos']['photo'][i]
        img.src = "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_q.jpg"
      , 10 * i)

  content_index[direction] += 1
  is_loading = false

create_canvas()

